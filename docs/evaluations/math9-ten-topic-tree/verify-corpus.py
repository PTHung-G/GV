#!/usr/bin/env python3
"""Offline corpus verification only: no network, DB, application import or inference."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[3]
DOCS = Path(__file__).resolve().parent
sha = lambda data: hashlib.sha256(data).hexdigest()
manifest_path = DOCS / 'source-manifest.json'
manifest = json.loads(manifest_path.read_text())
for name, target in [('gold-freeze.sha256', 'independent-gold.md'), ('manifest-freeze.sha256', 'source-manifest.json')]:
    assert (DOCS / name).read_text().split()[0] == sha((DOCS / target).read_bytes()), target
assert len(manifest['sources']) == 10
assert len({s['sha256'] for s in manifest['sources']}) == 10
for s in manifest['sources']:
    for pathkey, hashkey in [('original_path', 'sha256'), ('extracted_path', 'extracted_sha256'), ('exam_only_path', 'exam_only_sha256'), ('source_page_path', 'source_page_sha256')]:
        assert sha((ROOT / s[pathkey]).read_bytes()) == s[hashkey], (s['id'], pathkey)
    text = (ROOT / s['extracted_path']).read_bytes().decode('utf-8')
    lines = re.findall(r'[^\n]*\n|[^\n]+$', text)
    start, end = s['raw_exam_line_range']
    expected = ''.join(lines[start-1:end]).encode('utf-8')
    actual = (ROOT / s['exam_only_path']).read_bytes()
    assert actual == expected, s['id']
    assert not re.search(r'HƯỚNG DẪN CHẤM|ĐÁP ÁN VÀ|MA TRẬN', actual.decode('utf-8')), s['id']
assert sum(s['printed_top_level_count'] for s in manifest['sources']) == 154
assert sum(s['preferred_retained_count'] for s in manifest['sources']) == 167
print('Verified 10 distinct PDFs, exact exam-only slices, source hashes and frozen gold/manifest; 154 printed / 167 preferred units; no inference.')
