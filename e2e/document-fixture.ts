import { expect, type Page } from '@playwright/test';
import type { ExamDoc } from '../lib/docs-store';
function seedDoc(): ExamDoc {
  const now = new Date().toISOString();
  return {
    id: 'demo-de-giua-ky-toan-9',
    title: 'Đề kiểm tra giữa kì I môn Toán 9',
    subject: 'toan',
    grade: 9,
    createdAt: now,
    updatedAt: now,
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THCS NGUYỄN DU</b></p><p>TỔ KHOA HỌC TỰ NHIÊN</p></div><div class="doc-header-col"><p><b>KIỂM TRA GIỮA HỌC KÌ I</b></p><p>Môn: Toán – Lớp 9</p></div></div>
<h1>ĐỀ KIỂM TRA GIỮA HỌC KÌ I</h1>
<p style="text-align:center"><b>Môn: Toán – Lớp 9</b><br/>Thời gian làm bài: 90 phút (không kể thời gian phát đề)</p>
<h3>PHẦN I. TRẮC NGHIỆM (3,0 điểm)</h3>
<p><b>Câu 1.</b> Căn bậc hai số học của 81 là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. 9.</p></div><div class="doc-grid-cell"><p>B. −9.</p></div><div class="doc-grid-cell"><p>C. 81.</p></div><div class="doc-grid-cell"><p>D. ±9.</p></div></div>
<p><b>Câu 2.</b> Giá trị của biểu thức $\\sqrt{x-2}$ xác định khi</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. x ≥ 2.</p></div><div class="doc-grid-cell"><p>B. x &gt; 2.</p></div><div class="doc-grid-cell"><p>C. x ≤ 2.</p></div><div class="doc-grid-cell"><p>D. x &lt; 2.</p></div></div>
<h3>PHẦN II. TỰ LUẬN (7,0 điểm)</h3>
<p><b>Câu 3.</b> (2,0 điểm) Rút gọn biểu thức $A = \\dfrac{1}{\\sqrt{x}-1} - \\dfrac{1}{\\sqrt{x}+1}$ với $x \\ge 0,\\ x \\ne 1$.</p>
<p><b>Câu 4.</b> (2,0 điểm) Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 6 cm, AC = 8 cm. Tính BC, AH và diện tích tam giác ABC.</p>
<p><b>Câu 5.</b> (3,0 điểm) Cho đường tròn (O; R) và điểm A nằm ngoài đường tròn. Kẻ hai tiếp tuyến AB, AC tới (O). Chứng minh rằng AO là đường trung trực của BC.</p>`,
  };
}

/** The sample a first-time teacher can grade immediately: exam plus its key. */
const SAMPLE_EXAM_ID = 'mau-de-toan-9-20-cau';
const SAMPLE_KEY_ID = 'mau-de-toan-9-20-cau-dap-an';

function sampleExamDoc(): ExamDoc {
  const now = new Date().toISOString();
  return {
    id: SAMPLE_EXAM_ID,
    title: 'Đề kiểm tra 20 câu – Toán 9',
    subject: 'toan',
    grade: 9,
    createdAt: now,
    updatedAt: now,
    content:
      '<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THCS …</b></p><p>TỔ KHOA HỌC TỰ NHIÊN</p></div><div class="doc-header-col"><p><b>KIỂM TRA 20 CÂU</b></p><p>Môn: Toán – Lớp 9 · 30 phút</p></div></div>\n<h1>ĐỀ KIỂM TRA 20 CÂU – TOÁN 9</h1>\n<p style="text-align:center">Chọn một đáp án đúng cho mỗi câu. Mỗi câu 0,5 điểm.</p>\n<p><b>Câu 1.</b> Căn bậc hai số học của 16 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 4</p></div><div class="doc-grid-cell"><p>B. −4</p></div><div class="doc-grid-cell"><p>C. ±4</p></div><div class="doc-grid-cell"><p>D. 8</p></div></div>\n<p><b>Câu 2.</b> Điều kiện xác định của biểu thức √(x − 3) là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. x ≥ −3</p></div><div class="doc-grid-cell"><p>B. x ≥ 3</p></div><div class="doc-grid-cell"><p>C. x ≤ 3</p></div><div class="doc-grid-cell"><p>D. x ≠ 3</p></div></div>\n<p><b>Câu 3.</b> Rút gọn √50 được</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2√5</p></div><div class="doc-grid-cell"><p>B. 25√2</p></div><div class="doc-grid-cell"><p>C. 5√2</p></div><div class="doc-grid-cell"><p>D. 10√5</p></div></div>\n<p><b>Câu 4.</b> Hàm số y = (m − 2)x + 1 đồng biến trên ℝ khi</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. m < 2</p></div><div class="doc-grid-cell"><p>B. m = 2</p></div><div class="doc-grid-cell"><p>C. m ≤ 2</p></div><div class="doc-grid-cell"><p>D. m > 2</p></div></div>\n<p><b>Câu 5.</b> Nghiệm của hệ phương trình x + y = 5, x − y = 1 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. (3; 2)</p></div><div class="doc-grid-cell"><p>B. (2; 3)</p></div><div class="doc-grid-cell"><p>C. (4; 1)</p></div><div class="doc-grid-cell"><p>D. (1; 4)</p></div></div>\n<p><b>Câu 6.</b> Nghiệm của phương trình x² − 5x + 6 = 0 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 1 và 6</p></div><div class="doc-grid-cell"><p>B. 2 và 3</p></div><div class="doc-grid-cell"><p>C. −2 và −3</p></div><div class="doc-grid-cell"><p>D. −1 và −6</p></div></div>\n<p><b>Câu 7.</b> Tam giác ABC vuông tại A có AB = 3, AC = 4. Khi đó sin B bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 3/5</p></div><div class="doc-grid-cell"><p>B. 3/4</p></div><div class="doc-grid-cell"><p>C. 4/5</p></div><div class="doc-grid-cell"><p>D. 4/3</p></div></div>\n<p><b>Câu 8.</b> Đường tròn (O; 5 cm) có đường kính bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2,5 cm</p></div><div class="doc-grid-cell"><p>B. 5 cm</p></div><div class="doc-grid-cell"><p>C. 20 cm</p></div><div class="doc-grid-cell"><p>D. 10 cm</p></div></div>\n<p><b>Câu 9.</b> Giá trị của √((2 − √5)²) bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. √5 − 2</p></div><div class="doc-grid-cell"><p>B. 2 − √5</p></div><div class="doc-grid-cell"><p>C. √5 + 2</p></div><div class="doc-grid-cell"><p>D. 5 − 2</p></div></div>\n<p><b>Câu 10.</b> Rút gọn √12 − √27 + √3 được</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2√3</p></div><div class="doc-grid-cell"><p>B. 0</p></div><div class="doc-grid-cell"><p>C. −2√3</p></div><div class="doc-grid-cell"><p>D. 4√3</p></div></div>\n<p><b>Câu 11.</b> Hệ số góc của đường thẳng y = −2x + 3 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 3</p></div><div class="doc-grid-cell"><p>B. 2</p></div><div class="doc-grid-cell"><p>C. −2</p></div><div class="doc-grid-cell"><p>D. −3</p></div></div>\n<p><b>Câu 12.</b> Nghiệm của phương trình 2x − 6 = 0 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. x = −3</p></div><div class="doc-grid-cell"><p>B. x = 12</p></div><div class="doc-grid-cell"><p>C. x = 2</p></div><div class="doc-grid-cell"><p>D. x = 3</p></div></div>\n<p><b>Câu 13.</b> Giá trị của cos 30° là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. √3/2</p></div><div class="doc-grid-cell"><p>B. 1/2</p></div><div class="doc-grid-cell"><p>C. √2/2</p></div><div class="doc-grid-cell"><p>D. √3/3</p></div></div>\n<p><b>Câu 14.</b> Diện tích hình tròn bán kính 3 cm là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 3π cm²</p></div><div class="doc-grid-cell"><p>B. 9π cm²</p></div><div class="doc-grid-cell"><p>C. 6π cm²</p></div><div class="doc-grid-cell"><p>D. 12π cm²</p></div></div>\n<p><b>Câu 15.</b> Số nào dưới đây là nghiệm của phương trình x² = 9</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 9</p></div><div class="doc-grid-cell"><p>B. −9</p></div><div class="doc-grid-cell"><p>C. 3 và −3</p></div><div class="doc-grid-cell"><p>D. 81</p></div></div>\n<p><b>Câu 16.</b> √(x²) = 3 khi</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. x = 3</p></div><div class="doc-grid-cell"><p>B. x = −3</p></div><div class="doc-grid-cell"><p>C. x = ±9</p></div><div class="doc-grid-cell"><p>D. x = ±3</p></div></div>\n<p><b>Câu 17.</b> Cho đường tròn (O; R) và dây AB = R. Số đo góc AOB bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 60°</p></div><div class="doc-grid-cell"><p>B. 90°</p></div><div class="doc-grid-cell"><p>C. 120°</p></div><div class="doc-grid-cell"><p>D. 30°</p></div></div>\n<p><b>Câu 18.</b> Tiếp tuyến của một đường tròn vuông góc với bán kính tại</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. tâm</p></div><div class="doc-grid-cell"><p>B. tiếp điểm</p></div><div class="doc-grid-cell"><p>C. trung điểm của dây</p></div><div class="doc-grid-cell"><p>D. điểm bất kỳ</p></div></div>\n<p><b>Câu 19.</b> Giá trị của biểu thức (√7 − √3)(√7 + √3) là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 10</p></div><div class="doc-grid-cell"><p>B. 7 − 3√21</p></div><div class="doc-grid-cell"><p>C. 4</p></div><div class="doc-grid-cell"><p>D. 21</p></div></div>\n<p><b>Câu 20.</b> Hai đường tròn (O; 3 cm) và (O\'; 5 cm) tiếp xúc ngoài khi OO\' bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2 cm</p></div><div class="doc-grid-cell"><p>B. 3 cm</p></div><div class="doc-grid-cell"><p>C. 5 cm</p></div><div class="doc-grid-cell"><p>D. 8 cm</p></div></div>',
  };
}

function sampleKeyDoc(): ExamDoc {
  const now = new Date().toISOString();
  return {
    id: SAMPLE_KEY_ID,
    title: 'Đáp án – Đề kiểm tra 20 câu Toán 9',
    subject: 'toan',
    grade: 9,
    createdAt: now,
    updatedAt: now,
    kind: 'answer-key',
    parentId: SAMPLE_EXAM_ID,
    content:
      '<h1>HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM</h1>\n<p style="text-align:center">Đề kiểm tra 20 câu – Toán 9 · Tổng 10 điểm · Mỗi câu 0,5 điểm</p>\n<table><thead><tr><th>Câu</th><th>Đáp án</th><th>Điểm</th></tr></thead><tbody>\n<tr><td>1</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>2</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>3</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>4</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>5</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>6</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>7</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>8</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>9</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>10</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>11</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>12</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>13</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>14</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>15</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>16</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>17</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>18</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>19</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>20</td><td><b>D</b></td><td>0,5</td></tr>\n</tbody></table>',
  };
}


/** Explicit account fixtures: private libraries never auto-import guest examples. */
export async function seedAccountDocuments(page: Page) {
  const me = await (await page.request.get('/api/auth/me')).json();
  const current = await (await page.request.get('/api/documents')).json();
  const response = await page.request.put('/api/documents', { data: {
    ownerId: me.user.id, revision: current.revision,
    documents: [seedDoc(), sampleExamDoc(), sampleKeyDoc()],
  } });
  expect(response.ok(), await response.text()).toBe(true);
}
export async function signInWithDocuments(page: Page) {
  const response = await page.request.post('/api/auth/register', { data: {
    name: 'Fixture Teacher', email: `e2e-docs-${crypto.randomUUID()}@example.test`, password: 'TestFixture123!',
  } });
  expect(response.ok()).toBe(true);
  await seedAccountDocuments(page);
}
