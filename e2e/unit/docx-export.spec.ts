import { expect, test } from '@playwright/test';
import { inflateRawSync } from 'node:zlib';
import { exportDocxBuffer } from '../../lib/docx-export';
import { cleanPastedHtml } from '../../lib/editor-paste';
import { compactHtmlForAi } from '../../lib/html-sanitize';
import { healStructuredDom, materializeGeneration } from '../../lib/structured-exam';

function readDocxEntries(buf: Uint8Array): Map<string, string> {
  const view = Buffer.from(buf);
  const files = new Map<string, string>();
  let offset = 0;
  while (offset + 30 <= view.length) {
    if (view.readUInt32LE(offset) !== 0x04034b50) break;
    const method = view.readUInt16LE(offset + 8);
    const compSize = view.readUInt32LE(offset + 18);
    const nameLen = view.readUInt16LE(offset + 26);
    const extraLen = view.readUInt16LE(offset + 28);
    const name = view.subarray(offset + 30, offset + 30 + nameLen).toString('utf8');
    const dataStart = offset + 30 + nameLen + extraLen;
    const payload = view.subarray(dataStart, dataStart + compSize);
    if (name.endsWith('.xml') || name.endsWith('.rels')) {
      const xml = method === 8 ? inflateRawSync(payload).toString('utf8') : payload.toString('utf8');
      files.set(name, xml);
    }
    offset = dataStart + compSize;
  }
  return files;
}

test('exportDocxBuffer generates valid OpenXML A4 document with OMML math, tables and SVG figure', async () => {
  const html = [
    '<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THCS CHU VĂN AN</b></p><p>TỔ TOÁN</p></div><div class="doc-header-col"><p><b>KIỂM TRA GIỮA KÌ I</b></p><p>Môn: Toán 9</p></div></div>',
    '<h1>ĐỀ KIỂM TRA GIỮA KÌ I</h1>',
    '<p><b>Câu 1.</b> Giải phương trình $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$ trên $\\mathbb{R}$.</p>',
    '<div class="doc-grid" data-columns="4"><div class="doc-grid-cell"><p>A. $x=1$</p></div><div class="doc-grid-cell"><p>B. $x=2$</p></div><div class="doc-grid-cell"><p>C. $x=3$</p></div><div class="doc-grid-cell"><p>D. $x=4$</p></div></div>',
    '<figure class="doc-figure" data-figure=\'{"kind":"triangle-right","params":{"ab":6,"ac":8}}\'><svg viewBox="0 0 100 80"><line x1="10" y1="10" x2="90" y2="70" stroke="#111"/></svg><figcaption>Hình 1</figcaption></figure>',
    '<table><tbody><tr><th>Câu</th><th>Điểm</th></tr><tr><td>Câu 1</td><td>2,0</td></tr></tbody></table>',
  ].join('');

  const bytes = await exportDocxBuffer({ title: 'Đề Toán 9', html });
  // ZIP signature "PK\x03\x04"
  expect(bytes[0]).toBe(0x50);
  expect(bytes[1]).toBe(0x4b);
  expect(bytes[2]).toBe(0x03);
  expect(bytes[3]).toBe(0x04);
  expect(bytes.byteLength).toBeGreaterThan(2000);

  const entries = readDocxEntries(bytes);
  const docXml = entries.get('word/document.xml') ?? '';
  expect(docXml).toContain('TRƯỜNG THCS CHU VĂN AN');
  expect(docXml).toContain('KIỂM TRA GIỮA KÌ I');
  expect(docXml).toContain('<m:oMath');
  expect(docXml).toContain('Hình 1');
});

test('cleanPastedHtml strips Word XML garbage while keeping semantic formatting and explicit tbody', () => {
  const dirtyWord = `<!--StartFragment--><!--[if gte mso 9]><xml><w:WordDocument/></xml><![endif]--><p class="MsoNormal" style="mso-margin-top-alt:auto;text-align:center"><o:p></o:p><span style="mso-bidi-font-size:12pt"><b>Câu 1.</b> Tìm $x^2=9$.</span></p><table><tr><td>A</td><td>B</td></tr></table><!--EndFragment-->`;
  const clean = cleanPastedHtml(dirtyWord, 'Câu 1. Tìm x^2=9.');
  expect(clean).not.toContain('MsoNormal');
  expect(clean).not.toContain('mso-margin');
  expect(clean).not.toContain('<xml');
  expect(clean).toContain('<b>Câu 1.</b>');
  expect(clean).toContain('<tbody>');
  expect(clean).toContain('text-align:center');
});

test('compactHtmlForAi compresses inline SVG figures without losing figure spec', () => {
  const bigSvg = '<path d="' + 'M0 0L10 10'.repeat(100) + '"/>';
  const input = `<p>Câu 1</p><figure class="doc-figure" data-figure='{"kind":"parabola","params":{"a":1,"b":0,"c":0}}'><svg viewBox="0 0 100 100">${bigSvg}</svg><figcaption>Hình</figcaption></figure>`;
  const compacted = compactHtmlForAi(input);
  expect(compacted.length).toBeLessThan(250);
  expect(compacted).toContain('data-figure-spec=');
  expect(compacted).not.toContain(bigSvg);
});

test('healStructuredDom mints fresh block IDs when Enter duplicates a data-sdt-block attribute', () => {
  const init = materializeGeneration(
    {
      blocks: [
        { key: 'b1', html: '<p><b>Câu 1.</b> Đoạn đầu.</p>' },
        { key: 'b2', html: '<p><b>Câu 2.</b> Câu tiếp.</p>' },
      ],
      questions: [
        { key: 'q1', label: 'Câu 1', bodyKeys: ['b1'], contextKeys: [] },
        { key: 'q2', label: 'Câu 2', bodyKeys: ['b2'], contextKeys: [] },
      ],
    },
    (() => {
      let i = 0;
      return () => `id-${++i}`;
    })(),
  );

  // Simulate browser pressing Enter inside first <p>, duplicating data-sdt-block="id-1"
  const fakeNodes = [
    { id: 'id-1' as string | null, spacer: false, splitTail: false },
    { id: 'id-1' as string | null, spacer: false, splitTail: false },
    { id: 'id-2' as string | null, spacer: false, splitTail: false },
  ];
  const fakeRoot = {
    children: fakeNodes.map((n) => ({
      getAttribute(attr: string) {
        if (attr === 'data-sdt-block') return n.id;
        if (attr === 'data-split-part') return n.splitTail ? 't' : null;
        return null;
      },
      setAttribute(attr: string, val: string) {
        if (attr === 'data-sdt-block') n.id = val;
      },
      hasAttribute(attr: string) {
        return attr === 'data-page-spacer' ? n.spacer : false;
      },
    })),
  };

  let seq = 10;
  const healed = healStructuredDom(
    fakeRoot,
    init.structure,
    () =>
      fakeNodes
        .map((n, idx) => `<p data-sdt-block="${n.id}">Block ${idx}</p>`)
        .join('\n'),
    () => `id-${++seq}`,
  );

  expect(healed).toBeDefined();
  expect(healed!.blocks.map((b) => b.id)).toEqual(['id-1', 'id-11', 'id-2']);
  expect(healed!.questions[0].bodyBlockIds).toEqual(['id-1', 'id-11']);
  expect(healed!.questions[1].bodyBlockIds).toEqual(['id-2']);
});
