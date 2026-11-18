import json
from pathlib import Path

root = Path.cwd().resolve()
base = root / '.specify/assessments/topic-question-bank'
for p in [root/'.specify', root/'.specify/assessments', base]:
    assert not p.is_symlink() and p.resolve().is_relative_to(root)

def load(name):
    p = base/name
    assert not p.is_symlink() and p.resolve().is_relative_to(root)
    return json.loads(p.read_text())

corpus = load('sample-corpus.json')
result = {}
for i, name in enumerate(['experiment-stage1.json', 'experiment-stage2.json']):
    data = load(name)
    nodes, assignments = data['nodes'], data['assignments']
    by_id = {n['id']: n for n in nodes}
    errors = []
    if len(by_id) != len(nodes): errors.append('duplicate node IDs')
    roots = [n['id'] for n in nodes if n['parentId'] is None]
    if len(roots) != 1: errors.append('root count != 1')
    for n in nodes:
        seen = set()
        current = n['id']
        while current is not None:
            if current in seen:
                errors.append('cycle at '+current); break
            seen.add(current)
            if current not in by_id:
                errors.append('missing parent '+current); break
            current = by_id[current]['parentId']
    expected = {q['id'] for d in corpus[:i+1] for q in d['questions']}
    actual = [a['questionId'] for a in assignments]
    if set(actual) != expected: errors.append('question coverage mismatch')
    if len(set(actual)) != len(actual): errors.append('duplicate assignments')
    if any(a['nodeId'] not in by_id for a in assignments): errors.append('missing assigned node')
    children = {n['parentId'] for n in nodes if n['parentId'] is not None}
    result[name] = {'nodeCount':len(nodes),'rootCount':len(roots),'assignmentCount':len(assignments),'expectedQuestionCount':len(expected),'nonLeafAssignments':[a['questionId'] for a in assignments if a['nodeId'] in children],'errors':errors}
    if i == 0:
        old_nodes, old_assignments, old_children = by_id, {a['questionId']:a for a in assignments}, children
    else:
        result['changes'] = {'retainedOldNodeIds':sorted(set(old_nodes)&set(by_id)),'removedOldNodeIds':sorted(set(old_nodes)-set(by_id)),'oldLeavesNowParents':sorted(n for n in old_nodes if n not in old_children and n in children),'oldQuestionMoves':[{'questionId':a['questionId'],'from':old_assignments[a['questionId']]['nodeId'],'to':a['nodeId']} for a in assignments if a['questionId'] in old_assignments and a['nodeId']!=old_assignments[a['questionId']]['nodeId']]}
output = base/'experiment-validation.json'
assert not output.exists(), 'Refuse overwriting validation'
output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
assert all(not result[n]['errors'] for n in ['experiment-stage1.json','experiment-stage2.json'])
