"""Research-only reference and tree checks; no AI extraction/rendering test."""
import json
import hashlib
import itertools
from pathlib import Path

ROOT = Path.cwd().resolve()
BASE = ROOT / '.specify/assessments/topic-question-bank'
for path in [ROOT / '.specify', ROOT / '.specify/assessments', BASE]:
    assert not path.is_symlink() and path.resolve().is_relative_to(ROOT)

def safe(name):
    p = BASE / name
    assert not p.is_symlink() and p.resolve().is_relative_to(ROOT)
    return p

def load(name):
    return json.loads(safe(name).read_text())

corpus = load('round3-corpus.json')
questions = {q['id']: q for q in corpus['questions']}
report = {'scope': 'Structure and exact component-reference preservation, not extraction, rendering, or semantic gold.', 'runs': {}}
partitions = {}
for label in ['a', 'b']:
    data = load(f'round3-order-{label}.json')
    errors = []
    cumulative = set()
    stages = []
    previous = {}
    for index, stage in enumerate(data['stages']):
        expected_batch = corpus[f'order_{label}'][index]
        if stage['batch_ids'] != expected_batch:
            errors.append(f'batch order mismatch at {index}')
        cumulative.update(expected_batch)
        nodes = {n['id']: n for n in stage['nodes']}
        if len(nodes) != len(stage['nodes']):
            errors.append('duplicate node ID')
        roots = [n for n in nodes.values() if n['parent_id'] is None]
        if len(roots) != 1:
            errors.append('root count')
        for node in nodes.values():
            seen = set()
            current = node['id']
            while current is not None:
                if current in seen or current not in nodes:
                    errors.append('cycle or dangling parent')
                    break
                seen.add(current)
                current = nodes[current]['parent_id']
        assignments = {a['question_id']: a['node_id'] for a in stage['assignments']}
        if len(assignments) != len(stage['assignments']) or set(assignments) != cumulative:
            errors.append('question coverage/uniqueness')
        if not set(assignments.values()) <= set(nodes):
            errors.append('unknown assignment node')
        moved = [q for q, n in previous.items() if assignments.get(q) != n]
        stages.append({'nodes': len(nodes), 'questions': len(assignments), 'old_question_moves': moved})
        previous = assignments
    if len(data['stages']) != 2:
        errors.append('stage count')
    partitions[label] = previous
    units = data['retained_units']
    if len(units) != len(questions) or {u['question_id'] for u in units} != set(questions):
        errors.append('retained unit coverage')
    bundle_hashes = {}
    for unit in units:
        qid = unit['question_id']
        source = questions[qid]
        if sorted(unit['component_ids']) != sorted(source['required_components']):
            errors.append(f'{qid}: missing/extra component')
        for key in ['answer', 'rubric', 'points']:
            if unit.get(key, 'MISSING') != source[key]:
                errors.append(f'{qid}: invented/missing {key}')
        def bundle(ids):
            return json.dumps({c: corpus['components'][c] for c in sorted(ids)}, ensure_ascii=False, sort_keys=True).encode()
        expected = bundle(source['required_components'])
        actual = bundle(unit['component_ids'])
        if expected != actual:
            errors.append(f'{qid}: payload mismatch')
        bundle_hashes[qid] = hashlib.sha256(actual).hexdigest()
    if data['teacher_taxonomy_actions']:
        errors.append('teacher taxonomy actions requested')
    report['runs'][label] = {'errors': errors, 'stages': stages, 'retained_units': len(units), 'bundle_sha256': bundle_hashes, 'teacher_taxonomy_actions': data['teacher_taxonomy_actions']}

pairs = list(itertools.combinations(sorted(questions), 2))
changes = []
positive = {'a': 0, 'b': 0}
for x, y in pairs:
    a = partitions['a'][x] == partitions['a'][y]
    b = partitions['b'][x] == partitions['b'][y]
    positive['a'] += a
    positive['b'] += b
    if a != b:
        changes.append({'pair': [x, y], 'same_node_a': a, 'same_node_b': b})
report['comparison'] = {'pairs': len(pairs), 'same_node_pairs': positive, 'coassignment_disagreements': changes, 'warning': 'AI grouping comparison only. Most pairs can agree by being separate; this is not accuracy or semantic stability certification.'}
with safe('round3-validation.json').open('x') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print(json.dumps({k: v for k, v in report.items() if k != 'runs'}, ensure_ascii=False, indent=2))
for k, v in report['runs'].items():
    print(k, json.dumps({x: y for x, y in v.items() if x != 'bundle_sha256'}, ensure_ascii=False))
