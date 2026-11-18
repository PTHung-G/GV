"""Safe opt-in PostgreSQL smoke check against an already disposable container.
Never reads DATABASE_URL. Usage: python3 scripts/check-exam-sync-db.py CONTAINER
"""
import concurrent.futures
import json
import pathlib
import subprocess
import sys

container = sys.argv[1]
if container != 'exam-sync-isolated-check':
    raise SystemExit('Refusing any container other than exam-sync-isolated-check')
inspection = json.loads(subprocess.run(['docker', 'inspect', container], text=True, capture_output=True, check=True).stdout)[0]
if (inspection['Config']['Image'] != 'postgres:16-alpine'
    or inspection['HostConfig']['NetworkMode'] != 'none'
    or '/var/lib/postgresql/data' not in inspection['HostConfig'].get('Tmpfs', {})
    or inspection.get('HostConfig', {}).get('Binds')):
    raise SystemExit('Refusing non-isolated or persistent container')
root = pathlib.Path(__file__).resolve().parents[1]

def sql(text):
    result = subprocess.run(['docker', 'exec', '-i', container, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-At'], input=text, text=True, capture_output=True, check=True)
    return result.stdout.strip()

for migration in sorted((root / 'db/migrations').glob('*.sql')):
    sql(migration.read_text())
    print('applied', migration.name)
# Re-applying new migrations must also be safe.
for name in ['0006_grading_integrity.sql', '0007_document_libraries.sql']:
    sql((root / 'db/migrations' / name).read_text())
owner = sql("insert into users(email,name) values('isolated@example.test','Isolated') returning id").splitlines()[0]
# Use the same optimistic UPDATE as the document endpoint; only one writer wins.
sql(f"insert into document_libraries(owner_id,revision,documents) values('{owner}',1,'[]')")
def compete(index):
    return sql(f"update document_libraries set documents = '[{{\"writer\":{index}}}]'::jsonb, revision=revision+1 where owner_id='{owner}' and revision=1 returning revision")
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    results = list(pool.map(compete, [1, 2]))
assert sum('UPDATE 1' in result for result in results) == 1, results
assert sql(f"select revision from document_libraries where owner_id='{owner}'") == '2'
assert sql("select count(*) from information_schema.columns where table_name='jobs' and column_name in ('input_revision','section_revision','lease_token')") == '3'
assert sql("select count(*) from pg_constraint where conrelid='audit_events'::regclass and contype='f' and confdeltype='n'") == '3'
# Exercise historical snapshot and deletion audit behavior with real foreign keys.
snapshot = sql(f"insert into exam_snapshots(owner_id,title,exam_html,source_exam_id) values('{owner}','Frozen','<p>original</p>','source') returning id").splitlines()[0]
rubric = sql(f"insert into rubric_revisions(snapshot_id,total_points,payload) values('{snapshot}',10,'{{}}') returning id").splitlines()[0]
session = sql(f"insert into grading_sessions(owner_id,snapshot_id,rubric_revision_id,title,mode) values('{owner}','{snapshot}','{rubric}','Test','mc-only') returning id").splitlines()[0]
submission = sql(f"insert into submissions(session_id) values('{session}') returning id").splitlines()[0]
sql(f"insert into audit_events(session_id,submission_id,actor_id,action,reason) values('{session}','{submission}','{owner}','test-retention','retain after delete')")
sql(f"update document_libraries set documents='[{{\"id\":\"source\",\"content\":\"edited\"}}]' where owner_id='{owner}'")
assert sql(f"select exam_html from exam_snapshots where id='{snapshot}'") == '<p>original</p>'
# Session row locking serializes a finalization with the worker's session-first fence.
# This tests the SQL protocol, not the TypeScript route/worker end-to-end.
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    finalize = pool.submit(sql, f"begin; select id from grading_sessions where id='{session}' for update; update grading_sessions set status='finalized' where id='{session}'; select pg_sleep(0.3); commit;")
    worker = pool.submit(sql, f"begin; select status from grading_sessions where id='{session}' for update; commit;")
    finalize.result()
    worker.result()  # Either ordering is legal; a subsequent fence must see finalization.
assert sql(f"begin; select status from grading_sessions where id='{session}' for update; commit;").splitlines()[1] == 'finalized'
sql(f"delete from grading_sessions where id='{session}'")
assert sql("select count(*) from audit_events where action='test-retention' and session_id is null and submission_id is null and reason='retain after delete'") == '1'
assert sql(f"select count(*) from exam_snapshots where id='{snapshot}'") == '1'
print('PASS: migrations, concurrent library CAS, immutable source copy, audit and snapshot retention after deletion')
