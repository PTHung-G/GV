#!/usr/bin/env python3
"""Read-only structural summaries of retained public-corpus outputs; no semantic labels."""
import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('run', type=Path)
args = parser.parse_args()
run = args.run.resolve()
base = (Path.cwd() / 'docs/evaluations/math9-ten-topic-tree').resolve()
if not run.is_relative_to(base) or not run.is_dir():
    parser.error('Expected existing evidence run inside ten-paper evaluation directory')

def load(path):
    return json.loads(path.read_text())['bank']

def summarize(bank):
    nodes = {n['id']: n for n in bank['nodes']}
    counts = {nid: 0 for nid in nodes}
    for q in bank['questions']:
        counts[q['topicId']] += 1
    def branch(nid, seen=()):
        if nid in seen:
            raise ValueError('Cycle in retained output')
        n = nodes[nid]
        children = sorted((x for x in nodes if nodes[x]['parentId'] == nid), key=lambda x: nodes[x]['label'])
        descendants = [branch(c, (*seen, nid)) for c in children]
        return {'id': nid, 'label': n['label'], 'directQuestions': counts[nid], 'totalQuestions': counts[nid] + sum(c['totalQuestions'] for c in descendants), 'children': descendants}
    roots = [n for n in nodes if nodes[n]['parentId'] is None]
    if roots != ['root']:
        raise ValueError('Invalid roots')
    tree = branch('root')
    if tree['totalQuestions'] != len(bank['questions']):
        raise ValueError('Unreachable nodes/questions')
    return tree

def changes(before, after):
    a = {n['id']: n for n in before['nodes']}
    b = {n['id']: n for n in after['nodes']}
    qa = {q['id']: q for q in before['questions']}
    qb = {q['id']: q for q in after['questions']}
    return {'addedNodes': [b[n] for n in b.keys() - a.keys()], 'removedNodes': [a[n] for n in a.keys() - b.keys()], 'changedNodes': [{'before': a[n], 'after': b[n]} for n in a.keys() & b.keys() if a[n] != b[n]], 'reassignedOldQuestions': [{'id': q, 'label': qb[q]['label'], 'from': qa[q]['topicId'], 'to': qb[q]['topicId']} for q in qa.keys() & qb.keys() if qa[q]['topicId'] != qb[q]['topicId']]}

final = load(run / 'final-bank.json')
tree = summarize(final)
lines = ['# Actual AI-generated topic tree', '', 'Counts are direct / subtree totals. Structural counts are not semantic correctness scores.', '', '```text']
def render(n, prefix='', last=True, root=False):
    lines.append(prefix + ('' if root else '└── ' if last else '├── ') + f"{n['label']} ({n['directQuestions']} / {n['totalQuestions']})")
    child_prefix = prefix + ('' if root else '    ' if last else '│   ')
    for i, child in enumerate(n['children']):
        render(child, child_prefix, i == len(n['children']) - 1)
render(tree, root=True)
lines.extend(['```', ''])
outputs = {'actual-tree.md': '\n'.join(lines), 'tree-summary.json': json.dumps(tree, ensure_ascii=False, indent=2) + '\n'}
before = run / 'before-self-review-bank.json'
if before.exists():
    outputs['self-review-changes.json'] = json.dumps(changes(load(before), final), ensure_ascii=False, indent=2) + '\n'
for name, text in outputs.items():
    target = run / name
    if target.exists():
        raise FileExistsError(f'Refusing to overwrite retained summary: {target}')
    target.write_text(text)
print(json.dumps({'questions': len(final['questions']), 'nodes': len(final['nodes']), 'sources': len(final['sources']), 'generated': list(outputs)}, ensure_ascii=False))
