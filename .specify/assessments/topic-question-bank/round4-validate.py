import json,re
from pathlib import Path
root=Path.cwd().resolve(); base=root/'.specify/assessments/topic-question-bank'
for p in [root/'.specify',root/'.specify/assessments',base]:
 assert not p.is_symlink() and p.resolve().is_relative_to(root)
def read(n):
 p=base/n; assert not p.is_symlink() and p.resolve().is_relative_to(root)
 return p.read_text()
def check(data,sources,expected):
 errors=[]; nodes={n['id']:n for n in data['nodes']}
 if len(nodes)!=len(data['nodes']): errors.append('duplicate node')
 if sum(n['parent_id'] is None for n in nodes.values())!=1: errors.append('root count')
 for n in nodes:
  seen=set(); c=n
  while c is not None:
   if c in seen or c not in nodes: errors.append('cycle/dangling parent'); break
   seen.add(c); c=nodes[c]['parent_id']
 qs={q['id']:q for q in data['questions']}
 if set(qs)!=set(expected) or len(qs)!=len(data['questions']): errors.append('coverage')
 fragments={}
 for qid,q in qs.items():
  source=sources[qid[0]]
  spans=q['html_ranges']; parts=[]
  for span in spans:
   a,b=span['start'],span['end']
   if not (0<=a<b<=len(source)): errors.append(qid+': range'); continue
   parts.append(source[a:b])
  content=''.join(parts); fragments[qid]=content
  number=int(qid[1:])
  match=re.search(r'<p><strong>Câu '+str(number)+r'\.</strong>.*?</p>',source,re.S)
  if not match or match.group() not in content: errors.append(qid+': incomplete body')
  if qid in ['A1','A2']:
   passage=re.search(r'<blockquote>.*?</blockquote>',source,re.S).group()
   if passage not in content: errors.append(qid+': missing shared passage')
  if qid=='B1':
   figure=re.search(r'<svg.*?</svg>',source,re.S).group()
   if figure not in content: errors.append('B1: missing figure')
  if q['topic_id'] not in nodes: errors.append(qid+': unknown node')
  for key in ['answer','rubric','points']:
   if q.get(key,'missing') is not None: errors.append(qid+': invented metadata')
 return errors,fragments
A=read('round4-batch-a.html'); B=read('round4-batch-b.html')
a=json.loads(read('round4-stage-a.json')); b=json.loads(read('round4-stage-b.json'))
ea,fa=check(a,{'A':A},['A'+str(i) for i in range(1,7)])
eb,fb=check(b,{'A':A,'B':B},['A'+str(i) for i in range(1,7)]+['B'+str(i) for i in range(1,5)])
changed=[q for q in fa if fa[q]!=fb.get(q)]
report={'stage_a_errors':ea,'stage_b_errors':eb,'old_content_changed':changed,'stage_a_questions':len(fa),'stage_b_questions':len(fb),'limitations':['exact substrings and predefined source-check assertions, not human semantic gold','no rendering, production storage, privacy or app-provider benchmark']}
p=base/'round4-validation.json'; assert not p.is_symlink() and p.resolve().is_relative_to(root)
with p.open('x') as f: json.dump(report,f,ensure_ascii=False,indent=2)
print(json.dumps(report,ensure_ascii=False,indent=2))
