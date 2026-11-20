/**
 * Community exam library — 12 curated K–12 sample exams ready to edit,
 * shuffle into OMR bundles, and grade.
 */
import type { AnswerKeyQuestion } from './grading/rubric';

export type CommunityExam = {
  slug: string;
  title: string;
  subject: string;
  grade: number;
  author: string;
  authorColor: string;
  copies: number;
  questionCount: number;
  /** Header and first lines shown on paper preview cards. */
  preview: string[];
  /** Full sanitized exam HTML copied into the A4 editor. */
  content?: string;
  /** Companion HTML answer key sheet. */
  answerKeyContent?: string;
  /** Structured answer key contract for Release & Grading. */
  answerKeyQuestions?: AnswerKeyQuestion[];
};

const PALETTE = ['#2383e2', '#0f7b6c', '#d9730d', '#6940a5', '#c14c8a', '#b03a2e'];

type RawExam = Omit<CommunityExam, 'authorColor'>;

const RAW: RawExam[] = [
  {
    slug: 'de-thi-thu-tn-thpt-2025-mon-toan-12-4-phan-chuan-gdpt-2018-a1111111-1111-4111-8111-111111111101',
    title: 'Đề thi thử TN THPT 2025 môn Toán 12 (4 phần chuẩn GDPT 2018)',
    subject: 'toan',
    grade: 12,
    author: 'THPT Chu Văn An',
    copies: 148,
    questionCount: 10,
    preview: [
      'TRƯỜNG THPT CHU VĂN AN',
      'KỲ THI THỬ TỐT NGHIỆP THPT NĂM 2025',
      'Môn: Toán – Lớp 12 · Thời gian: 90 phút',
      'PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn',
      'Câu 1. Cho hàm số y = x³ − 3x + 2. Giá trị cực tiểu của hàm số bằng',
      'A. 0.   B. 4.   C. 1.   D. −1.',
      'PHẦN II. Câu trắc nghiệm đúng sai (Đ/S)',
      'PHẦN III. Trả lời ngắn · PHẦN IV. Tự luận',
    ],
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>SỞ GIÁO DỤC VÀ ĐÀO TẠO</b></p><p>TRƯỜNG THPT CHU VĂN AN</p></div><div class="doc-header-col"><p><b>ĐỀ THI THỬ TỐT NGHIỆP THPT 2025</b></p><p>Môn: Toán – Lớp 12 (90 phút)</p></div></div>
<h1>ĐỀ THI THỬ TỐT NGHIỆM THPT 2025 — MÔN TOÁN 12</h1>
<p style="text-align:center"><i>Theo cấu trúc 4 phần GDPT 2018 (10,0 điểm)</i></p>
<h3><b>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (2,0 điểm)</b></h3>
<p><b>Câu 1.</b> Cho hàm số $y = x^3 - 3x + 2$ có đồ thị như hình vẽ bên dưới. Giá trị cực tiểu của hàm số bằng</p>
<figure class="doc-figure" contenteditable="false"><svg viewBox="0 0 280 180" width="260" height="168" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="125" x2="265" y2="125" stroke="#18181b" stroke-width="1.4"/><line x1="120" y1="168" x2="120" y2="14" stroke="#18181b" stroke-width="1.4"/><text x="255" y="138" font-size="11" fill="#18181b">x</text><text x="126" y="22" font-size="11" fill="#18181b">y</text><text x="108" y="138" font-size="11" fill="#18181b">O</text><text x="155" y="138" font-size="11" fill="#18181b">1</text><text x="78" y="138" font-size="11" fill="#18181b">-1</text><text x="108" y="65" font-size="11" fill="#18181b">4</text><line x1="84" y1="62" x2="120" y2="62" stroke="#71717a" stroke-dasharray="3 3"/><line x1="84" y1="62" x2="84" y2="125" stroke="#71717a" stroke-dasharray="3 3"/><path d="M 48 164 C 66 95, 76 62, 84 62 C 98 62, 138 125, 158 125 C 174 125, 195 75, 212 18" fill="none" stroke="#2383e2" stroke-width="2.2"/><circle cx="84" cy="62" r="3" fill="#18181b"/><circle cx="158" cy="125" r="3" fill="#18181b"/></svg></figure>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $0$.</p></div><div class="doc-grid-cell"><p>B. $4$.</p></div><div class="doc-grid-cell"><p>C. $1$.</p></div><div class="doc-grid-cell"><p>D. $-1$.</p></div></div>
<p><b>Câu 2.</b> Tiệm cận ngang của đồ thị hàm số $y = \\dfrac{2x + 1}{x - 3}$ là đường thẳng</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $y = 2$.</p></div><div class="doc-grid-cell"><p>B. $x = 3$.</p></div><div class="doc-grid-cell"><p>C. $y = 3$.</p></div><div class="doc-grid-cell"><p>D. $y = -\\dfrac{1}{3}$.</p></div></div>
<p><b>Câu 3.</b> Nguyên hàm của hàm số $f(x) = 3x^2 + \\cos x$ là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $x^3 + \\sin x + C$.</p></div><div class="doc-grid-cell"><p>B. $x^3 - \\sin x + C$.</p></div><div class="doc-grid-cell"><p>C. $6x - \\sin x + C$.</p></div><div class="doc-grid-cell"><p>D. $3x^3 + \\sin x + C$.</p></div></div>
<p><b>Câu 4.</b> Trong không gian $Oxyz$, mặt phẳng $(P): 2x - y + 3z - 5 = 0$ có một vectơ pháp tuyến là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $\\vec{n} = (2; -1; 3)$.</p></div><div class="doc-grid-cell"><p>B. $\\vec{n} = (2; 1; 3)$.</p></div><div class="doc-grid-cell"><p>C. $\\vec{n} = (-1; 3; -5)$.</p></div><div class="doc-grid-cell"><p>D. $\\vec{n} = (2; -1; -5)$.</p></div></div>
<h3><b>PHẦN II. Câu trắc nghiệm đúng sai (2,0 điểm)</b></h3>
<p><b>Câu 1.</b> Cho hàm số $f(x) = \\ln(x^2 + 1) - x$ trên đoạn $[0; 2]$.</p>
<div class="doc-tf-list"><p>a) $f(0) = 0$.</p><p>b) Đạo hàm $f'(x) = \\dfrac{2x}{x^2 + 1} - 1$ với mọi $x \\in \\mathbb{R}$.</p><p>c) Phương trình $f'(x) = 0$ vô nghiệm trên $[0; 2]$.</p><p>d) Giá trị lớn nhất của $f(x)$ trên $[0; 2]$ bằng $0$.</p></div>
<p><b>Câu 2.</b> Trong không gian $Oxyz$, cho $A(1; 0; 2)$, $B(3; 2; 0)$ và mặt cầu $(S): (x-1)^2 + y^2 + (z-2)^2 = 9$.</p>
<div class="doc-tf-list"><p>a) Tâm của mặt cầu $(S)$ trùng với điểm $A$.</p><p>b) Bán kính của mặt cầu $(S)$ bằng $9$.</p><p>c) Độ dài đoạn thẳng $AB$ bằng $2\\sqrt{3}$.</p><p>d) Điểm $B$ nằm bên trong mặt cầu $(S)$.</p></div>
<h3><b>PHẦN III. Câu trắc nghiệm trả lời ngắn (2,0 điểm)</b></h3>
<p><b>Câu 1.</b> Tính trung bình cộng các nghiệm thực của phương trình $x^2 + 2x - 15 = 0$.</p>
<p><b>Câu 2.</b> Tính diện tích hình phẳng giới hạn bởi đồ thị $y = 3x^2$, trục hoành và hai đường thẳng $x = 0, x = 2$.</p>
<h3><b>PHẦN IV. Tự luận (4,0 điểm)</b></h3>
<p><b>Câu 1 (2,0 điểm).</b> Tìm các khoảng đơn điệu và cực trị của hàm số $y = -x^3 + 3x^2 + 1$.</p>
<p><b>Câu 2 (2,0 điểm).</b> Trong không gian $Oxyz$, viết phương trình mặt phẳng đi qua điểm $M(1; 2; -1)$ và vuông góc với đường thẳng $d: \\dfrac{x-1}{2} = \\dfrac{y+1}{-1} = \\dfrac{z}{3}$.</p>`,
    answerKeyContent: `<h1>ĐÁP ÁN &amp; HƯỚNG DẪN CHẤM — TOÁN 12 (THPT 2025)</h1>
<h3>PHẦN I. Trắc nghiệm nhiều lựa chọn (mỗi câu 0,5 điểm)</h3>
<p>Câu 1: A · Câu 2: A · Câu 3: A · Câu 4: A</p>
<h3>PHẦN II. Trắc nghiệm đúng sai (mỗi câu 1,0 điểm · quy tắc MOET 2025)</h3>
<p>Câu 1: a) Đúng, b) Đúng, c) Sai ($x=1$), d) Đúng → ĐĐSĐ</p>
<p>Câu 2: a) Đúng, b) Sai ($R=3$), c) Đúng ($AB=\\sqrt{4+4+4}=2\\sqrt{3}$), d) Sai ($AB = 2\\sqrt{3} &gt; 3$ nên $B$ nằm ngoài mặt cầu) → ĐSĐS</p>
<h3>PHẦN III. Trả lời ngắn (mỗi câu 1,0 điểm)</h3>
<p>Câu 1: $-1$ (Trung bình cộng hai nghiệm của $x^2+2x-15=0$ là $\\dfrac{-2}{2} = -1$).</p>
<p>Câu 2: $8$ ($\int_0^2 3x^2\\,dx = x^3\\Big|_0^2 = 8$).</p>
<h3>PHẦN IV. Tự luận (4,0 điểm)</h3>
<p>Câu 1 (2,0 điểm): $y' = -3x^2 + 6x = 0 \\Leftrightarrow x=0$ hoặc $x=2$ (1,0đ); đồng biến trên $(0;2)$, nghịch biến trên $(-\\infty;0)$ và $(2;+\\infty)$, $y_{CT}=1, y_{CD}=5$ (1,0đ).</p>
<p>Câu 2 (2,0 điểm): VTPT $\\vec{n}=(2;-1;3)$ (1,0đ); mặt phẳng $2(x-1)-(y-2)+3(z+1)=0 \\Leftrightarrow 2x-y+3z+3=0$ (1,0đ).</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '0,5', sectionNo: 1, displayNo: 1 },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '0,5', sectionNo: 1, displayNo: 2 },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '0,5', sectionNo: 1, displayNo: 3 },
      { label: 'Câu 4', type: 'mc', answer: 'A', points: '0,5', sectionNo: 1, displayNo: 4 },
      { label: 'Câu 1', type: 'tf', answer: 'ĐĐSĐ', points: '1,0', sectionNo: 2, displayNo: 1, scoringRule: 'moet-2025' },
      { label: 'Câu 2', type: 'tf', answer: 'ĐSĐS', points: '1,0', sectionNo: 2, displayNo: 2, scoringRule: 'moet-2025' },
      { label: 'Câu 1', type: 'short', answer: '-1', points: '1,0', sectionNo: 3, displayNo: 1 },
      { label: 'Câu 2', type: 'short', answer: '8', points: '1,0', sectionNo: 3, displayNo: 2 },
      {
        label: 'Câu 1',
        type: 'essay',
        answer: 'Đồng biến (0;2), CT=1 tại x=0, CĐ=5 tại x=2',
        points: '2,0',
        sectionNo: 4,
        displayNo: 1,
        steps: [
          { text: 'Tính đạo hàm y\' = -3x^2 + 6x và giải y\' = 0 được x = 0, x = 2', points: '1,0' },
          { text: 'Lập bảng biến thiên, kết luận khoảng đơn điệu và cực trị', points: '1,0' },
        ],
      },
      {
        label: 'Câu 2',
        type: 'essay',
        answer: '2x - y + 3z + 3 = 0',
        points: '2,0',
        sectionNo: 4,
        displayNo: 2,
        steps: [
          { text: 'Xác định vectơ pháp tuyến n = (2; -1; 3)', points: '1,0' },
          { text: 'Viết phương trình mặt phẳng qua M(1;2;-1): 2x - y + 3z + 3 = 0', points: '1,0' },
        ],
      },
    ],
  },
  {
    slug: 'de-on-tap-tuyen-sinh-lop-10-mon-toan-9-hinh-hoc-duong-tron-a1111111-1111-4111-8111-111111111102',
    title: 'Đề kiểm tra giữa kì II môn Toán 9 (Trắc nghiệm & Tự luận hình học)',
    subject: 'toan',
    grade: 9,
    author: 'THCS Nguyễn Du',
    copies: 96,
    questionCount: 6,
    preview: [
      'TRƯỜNG THCS NGUYỄN DU',
      'ĐỀ KIỂM TRA GIỮA HỌC KÌ II',
      'Môn: Toán – Lớp 9 · Thời gian: 90 phút',
      'PHẦN I. Trắc nghiệm (4,0 điểm)',
      'Câu 1. Phương trình x² − 5x + 6 = 0 có tổng hai nghiệm bằng',
      'PHẦN II. Tự luận (6,0 điểm)',
    ],
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THCS NGUYỄN DU</b></p><p>TỔ TOÁN – TIN</p></div><div class="doc-header-col"><p><b>KIỂM TRA GIỮA HỌC KÌ II</b></p><p>Môn: Toán – Lớp 9 (90 phút)</p></div></div>
<h1>ĐỀ KIỂM TRA GIỮA HỌC KÌ II — TOÁN 9</h1>
<h3><b>PHẦN I. Trắc nghiệm nhiều lựa chọn (4,0 điểm)</b></h3>
<p><b>Câu 1.</b> Phương trình $x^2 - 5x + 6 = 0$ có hai nghiệm là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $x = 2; x = 3$.</p></div><div class="doc-grid-cell"><p>B. $x = -2; x = -3$.</p></div><div class="doc-grid-cell"><p>C. $x = 1; x = 6$.</p></div><div class="doc-grid-cell"><p>D. $x = -1; x = 6$.</p></div></div>
<p><b>Câu 2.</b> Góc nội tiếp chắn nửa đường tròn có số đo bằng</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $90^\\circ$.</p></div><div class="doc-grid-cell"><p>B. $60^\\circ$.</p></div><div class="doc-grid-cell"><p>C. $120^\\circ$.</p></div><div class="doc-grid-cell"><p>D. $180^\\circ$.</p></div></div>
<p><b>Câu 3.</b> Đồ thị hàm số $y = 2x^2$ đi qua điểm nào sau đây?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $(1; 2)$.</p></div><div class="doc-grid-cell"><p>B. $(2; 4)$.</p></div><div class="doc-grid-cell"><p>C. $(-1; -2)$.</p></div><div class="doc-grid-cell"><p>D. $(0; 2)$.</p></div></div>
<p><b>Câu 4.</b> Hệ phương trình $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$ có nghiệm duy nhất là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $(3; 2)$.</p></div><div class="doc-grid-cell"><p>B. $(2; 3)$.</p></div><div class="doc-grid-cell"><p>C. $(4; 1)$.</p></div><div class="doc-grid-cell"><p>D. $(1; 4)$.</p></div></div>
<h3><b>PHẦN II. Tự luận (6,0 điểm)</b></h3>
<p><b>Câu 1 (3,0 điểm).</b> Giải bài toán bằng cách lập phương trình: Một mảnh đất hình chữ nhật có chu vi 34 m và diện tích 60 m². Tính chiều dài và chiều rộng mảnh đất.</p>
<p><b>Câu 2 (3,0 điểm).</b> Cho nửa đường tròn $(O)$ đường kính $BC$, điểm $A$ nằm trên nửa đường tròn (như hình vẽ). Chứng minh tam giác $ABC$ vuông tại $A$ và $AH^2 = HB \\cdot HC$ với $AH \\perp BC$.</p>
<figure class="doc-figure" contenteditable="false"><svg viewBox="0 0 240 130" width="220" height="120" xmlns="http://www.w3.org/2000/svg"><path d="M 30 105 A 90 90 0 0 1 210 105 Z" fill="none" stroke="#18181b" stroke-width="1.6"/><line x1="30" y1="105" x2="90" y2="20" stroke="#2383e2" stroke-width="1.5"/><line x1="210" y1="105" x2="90" y2="20" stroke="#2383e2" stroke-width="1.5"/><line x1="90" y1="20" x2="90" y2="105" stroke="#71717a" stroke-dasharray="3 3"/><text x="20" y="116" font-size="11">B</text><text x="116" y="118" font-size="11">O</text><text x="86" y="118" font-size="11">H</text><text x="212" y="116" font-size="11">C</text><text x="86" y="15" font-size="11">A</text></svg></figure>`,
    answerKeyContent: `<h1>ĐÁP ÁN — TOÁN 9</h1><p>PHẦN I (mỗi câu 1,0đ): 1-A, 2-A, 3-A, 4-A.</p><p>PHẦN II: Câu 1 (3,0đ): chiều dài 12 m, chiều rộng 5 m. Câu 2 (3,0đ): góc nội tiếp chắn nửa đường tròn và tam giác đồng dạng.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '1,0', sectionNo: 1, displayNo: 1 },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '1,0', sectionNo: 1, displayNo: 2 },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '1,0', sectionNo: 1, displayNo: 3 },
      { label: 'Câu 4', type: 'mc', answer: 'A', points: '1,0', sectionNo: 1, displayNo: 4 },
      { label: 'Câu 1', type: 'essay', answer: '12 m và 5 m', points: '3,0', sectionNo: 2, displayNo: 1, steps: [{ text: 'Lập phương trình x(17-x)=60', points: '1,5' }, { text: 'Giải ra chiều dài 12 m, chiều rộng 5 m', points: '1,5' }] },
      { label: 'Câu 2', type: 'essay', answer: 'Tam giác vuông và hệ thức lượng', points: '3,0', sectionNo: 2, displayNo: 2, steps: [{ text: 'Chứng minh góc BAC = 90 độ', points: '1,5' }, { text: 'Chứng minh hai tam giác đồng dạng suy ra AH^2 = HB.HC', points: '1,5' }] },
    ],
  },
  {
    slug: 'de-kiem-tra-cuoi-ky-i-ngu-van-12-doc-hieu-va-nghi-luan-a1111111-1111-4111-8111-111111111103',
    title: 'Đề kiểm tra cuối học kì I môn Ngữ văn 12 (Đọc hiểu & Nghị luận)',
    subject: 'ngu-van',
    grade: 12,
    author: 'THPT Lê Quý Đôn',
    copies: 74,
    questionCount: 5,
    preview: [
      'TRƯỜNG THPT LÊ QUÝ ĐÔN',
      'KIỂM TRA CUỐI HỌC KÌ I · MÔN: NGỮ VĂN 12',
      'Thời gian làm bài: 90 phút',
      'I. ĐỌC HIỂU (4,0 điểm)',
      'Đọc đoạn trích về giá trị của sự kiên trì trong học tập và trả lời các câu hỏi từ 1 đến 4.',
      'II. VIẾT (6,0 điểm)',
    ],
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THPT LÊ QUÝ ĐÔN</b></p><p>TỔ NGỮ VĂN</p></div><div class="doc-header-col"><p><b>KIỂM TRA CUỐI HỌC KÌ I</b></p><p>Môn: Ngữ văn – Lớp 12 (90 phút)</p></div></div>
<h1>ĐỀ KIỂM TRA CUỐI HỌC KÌ I — NGỮ VĂN 12</h1>
<h3><b>I. ĐỌC HIỂU (4,0 điểm)</b></h3>
<p>Đọc đoạn văn sau: <i>"Tri thức không đến từ sự vội vàng tích cóp trong một sớm một chiều, mà kết tinh từ những giờ phút lặng lẽ tự hỏi, tự nghiền ngẫm và kiên nhẫn sửa mình trước mỗi vấp váp."</i></p>
<p><b>Câu 1 (1,0 điểm).</b> Xác định phương thức biểu đạt chính của đoạn trích trên.</p>
<p><b>Câu 2 (1,0 điểm).</b> Theo tác giả, tri thức được kết tinh từ những yếu tố nào?</p>
<p><b>Câu 3 (2,0 điểm).</b> Anh/chị hiểu như thế nào về ý nghĩa của việc "kiên nhẫn sửa mình trước mỗi vấp váp"?</p>
<h3><b>II. LÀM VĂN (6,0 điểm)</b></h3>
<p><b>Câu 4 (2,0 điểm).</b> Viết đoạn văn nghị luận (khoảng 200 chữ) bàn về thái độ học tập chủ động của học sinh hiện nay.</p>
<p><b>Câu 5 (4,0 điểm).</b> Phân tích vẻ đẹp hình tượng người lính hoặc vẻ đẹp văn hoá dân tộc qua một tác phẩm thơ hiện đại Việt Nam đã học.</p>`,
    answerKeyContent: `<h1>HƯỚNG DẪN CHẤM — NGỮ VĂN 12</h1><p>Câu 1 (1,0đ): Nghị luận. Câu 2 (1,0đ): Tự hỏi, tự nghiền ngẫm và kiên nhẫn sửa mình. Câu 3 (2,0đ): Nêu đúng ý nghĩa rèn luyện bản thân. Câu 4 (2,0đ): Đoạn văn nghị luận xã hội. Câu 5 (4,0đ): Bài văn nghị luận văn học.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'essay', answer: 'Nghị luận', points: '1,0', steps: [{ text: 'Nêu đúng phương thức biểu đạt chính: Nghị luận', points: '1,0' }] },
      { label: 'Câu 2', type: 'essay', answer: 'Tự hỏi, tự nghiền ngẫm và kiên nhẫn sửa mình', points: '1,0', steps: [{ text: 'Trích đúng 3 yếu tố từ đoạn văn', points: '1,0' }] },
      { label: 'Câu 3', type: 'essay', answer: 'Biết nhận sai và rút kinh nghiệm bền bỉ', points: '2,0', steps: [{ text: 'Giải thích hợp lý, sâu sắc', points: '2,0' }] },
      { label: 'Câu 4', type: 'essay', answer: 'Đoạn văn ~200 chữ đúng chủ đề', points: '2,0', steps: [{ text: 'Đảm bảo hình thức và lập luận chặt chẽ', points: '2,0' }] },
      { label: 'Câu 5', type: 'essay', answer: 'Phân tích nội dung và nghệ thuật', points: '4,0', steps: [{ text: 'Mở bài, kết bài đúng hướng', points: '1,0' }, { text: 'Phân tích luận điểm và dẫn chứng', points: '3,0' }] },
    ],
  },
  {
    slug: 'de-kiem-tra-giua-ky-i-tieng-anh-12-reading-grammar-a1111111-1111-4111-8111-111111111104',
    title: 'Đề kiểm tra giữa học kì I môn Tiếng Anh 12 (Global Success)',
    subject: 'tieng-anh',
    grade: 12,
    author: 'THPT Trần Phú',
    copies: 112,
    questionCount: 10,
    preview: [
      'TRƯỜNG THPT TRẦN PHÚ',
      'MID-TERM TEST 1 · GRADE 12 · ENGLISH',
      'Time allowed: 45 minutes',
      'Choose the word whose underlined part differs from the other three in pronunciation.',
      'Question 1. A. worked  B. stopped  C. wanted  D. watched',
      'Reading comprehension & grammar multiple choice.',
    ],
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THPT TRẦN PHÚ</b></p><p>TỔ NGOẠI NGỮ</p></div><div class="doc-header-col"><p><b>MID-TERM TEST 1</b></p><p>Subject: English 12 (45 minutes)</p></div></div>
<h1>ĐỀ KIỂM TRA GIỮA KÌ I — TIẾNG ANH 12</h1>
<h3><b>PHẦN I. Trắc nghiệm nhiều lựa chọn (10,0 điểm)</b></h3>
<p><b>Câu 1.</b> Choose the word whose underlined part differs in pronunciation of <i>-ed</i>:</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. worked</p></div><div class="doc-grid-cell"><p>B. stopped</p></div><div class="doc-grid-cell"><p>C. wanted</p></div><div class="doc-grid-cell"><p>D. watched</p></div></div>
<p><b>Câu 2.</b> She ______ in Ha Noi since she graduated from university in 2018.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. has lived</p></div><div class="doc-grid-cell"><p>B. lived</p></div><div class="doc-grid-cell"><p>C. lives</p></div><div class="doc-grid-cell"><p>D. will live</p></div></div>
<p><b>Câu 3.</b> Green energy technologies help ______ carbon emissions globally.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. reduce</p></div><div class="doc-grid-cell"><p>B. increase</p></div><div class="doc-grid-cell"><p>C. waste</p></div><div class="doc-grid-cell"><p>D. ignore</p></div></div>
<p><b>Câu 4.</b> While they ______ the science project, the power suddenly went out.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. were presenting</p></div><div class="doc-grid-cell"><p>B. presented</p></div><div class="doc-grid-cell"><p>C. are presenting</p></div><div class="doc-grid-cell"><p>D. present</p></div></div>
<p><b>Câu 5.</b> The more renewable sources we use, ______ our air becomes.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. the cleaner</p></div><div class="doc-grid-cell"><p>B. cleaner</p></div><div class="doc-grid-cell"><p>C. the cleanest</p></div><div class="doc-grid-cell"><p>D. cleanly</p></div></div>
<p><b>Câu 6.</b> Closest in meaning to "<b>innovative</b>":</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. creative</p></div><div class="doc-grid-cell"><p>B. traditional</p></div><div class="doc-grid-cell"><p>C. careless</p></div><div class="doc-grid-cell"><p>D. silent</p></div></div>
<p><b>Câu 7.</b> Urbanisation brings both economic opportunities ______ infrastructure challenges.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. and</p></div><div class="doc-grid-cell"><p>B. nor</p></div><div class="doc-grid-cell"><p>C. or</p></div><div class="doc-grid-cell"><p>D. yet</p></div></div>
<p><b>Câu 8.</b> Students are encouraged to ______ cultural heritage in modern society.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. preserve</p></div><div class="doc-grid-cell"><p>B. destroy</p></div><div class="doc-grid-cell"><p>C. delay</p></div><div class="doc-grid-cell"><p>D. refuse</p></div></div>
<p><b>Câu 9.</b> Look ______ the unfamiliar idiom in the dictionary before translating.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. up</p></div><div class="doc-grid-cell"><p>B. into</p></div><div class="doc-grid-cell"><p>C. after</p></div><div class="doc-grid-cell"><p>D. away</p></div></div>
<p><b>Câu 10.</b> Choosing the right career requires ______ carefully about your strengths.</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. thinking</p></div><div class="doc-grid-cell"><p>B. to think</p></div><div class="doc-grid-cell"><p>C. thought</p></div><div class="doc-grid-cell"><p>D. thinks</p></div></div>`,
    answerKeyContent: `<h1>ANSWER KEY — ENGLISH 12</h1><p>1. C · 2. A · 3. A · 4. A · 5. A · 6. A · 7. A · 8. A · 9. A · 10. A (1,0 điểm/câu)</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'C', points: '1,0' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 4', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 5', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 6', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 7', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 8', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 9', type: 'mc', answer: 'A', points: '1,0' },
      { label: 'Câu 10', type: 'mc', answer: 'A', points: '1,0' },
    ],
  },
  {
    slug: 'de-kiem-tra-vat-li-12-vat-li-nhiet-va-khi-li-tuong-thpt-2025-a1111111-1111-4111-8111-111111111105',
    title: 'Đề kiểm tra Vật lí 12 — Vật lí nhiệt & Khí lí tưởng (4 phần THPT 2025)',
    subject: 'vat-li',
    grade: 12,
    author: 'THPT Chuyên Phan Bội Châu',
    copies: 63,
    questionCount: 6,
    preview: [
      'TRƯỜNG THPT CHUYÊN PHAN BỘI CHÂU',
      'ĐỀ KIỂM TRA CHƯƠNG I–II · VẬT LÍ 12',
      'Chủ đề: Vật lí nhiệt & Mô hình động học phân tử',
      'PHẦN I. Trắc nghiệm nhiều lựa chọn',
      'PHẦN II. Đúng/Sai · PHẦN III. Trả lời ngắn',
    ],
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THPT CHUYÊN PHAN BỘI CHÂU</b></p><p>TỔ VẬT LÍ</p></div><div class="doc-header-col"><p><b>KIỂM TRA CHỦ ĐỀ</b></p><p>Môn: Vật lí – Lớp 12 (45 phút)</p></div></div>
<h1>ĐỀ KIỂM TRA VẬT LÍ 12 — VẬT LÍ NHIỆT &amp; KHÍ LÍ TƯỞNG</h1>
<h3><b>PHẦN I. Trắc nghiệm nhiều lựa chọn (4,0 điểm)</b></h3>
<p><b>Câu 1.</b> Theo định luật I nhiệt động lực học $\\Delta U = A + Q$, quy ước $Q &gt; 0$ biểu thị</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Hệ nhận nhiệt lượng.</p></div><div class="doc-grid-cell"><p>B. Hệ truyền nhiệt lượng.</p></div><div class="doc-grid-cell"><p>C. Hệ sinh công.</p></div><div class="doc-grid-cell"><p>D. Nội năng không đổi.</p></div></div>
<p><b>Câu 2.</b> Nhiệt độ $27^\\circ\\text{C}$ ứng với nhiệt độ tuyệt đối nào trong thang Kelvin?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $300\\text{ K}$.</p></div><div class="doc-grid-cell"><p>B. $246\\text{ K}$.</p></div><div class="doc-grid-cell"><p>C. $273\\text{ K}$.</p></div><div class="doc-grid-cell"><p>D. $327\\text{ K}$.</p></div></div>
<h3><b>PHẦN II. Trắc nghiệm đúng sai (2,0 điểm)</b></h3>
<p><b>Câu 1.</b> Một lượng khí lí tưởng biến đổi đẳng nhiệt ở $300\\text{ K}$ từ thể tích $2\\text{ lít}$ xuống $1\\text{ lít}$.</p>
<div class="doc-tf-list"><p>a) Áp suất của khí tăng lên gấp đôi.</p><p>b) Động năng trung bình của phân tử khí tăng gấp đôi.</p><p>c) Khối lượng khí không đổi trong quá trình biến đổi.</p><p>d) Đồ thị đường đẳng nhiệt trong hệ $(p, V)$ là đường thẳng qua gốc toạ độ.</p></div>
<h3><b>PHẦN III. Trả lời ngắn (4,0 điểm)</b></h3>
<p><b>Câu 1.</b> Cần truyền nhiệt lượng bao nhiêu kJ để làm nóng $2\\text{ kg}$ nước tăng thêm $10^\\circ\\text{C}$, biết nhiệt dung riêng của nước là $4200\\text{ J/(kg}\\cdot\\text{K)}$?</p>
<p><b>Câu 2.</b> Nén đẳng nhiệt $6\\text{ lít}$ khí ở áp suất $1\\text{ atm}$ xuống còn $2\\text{ lít}$. Áp suất khí sau khi nén bằng bao nhiêu atm?</p>`,
    answerKeyContent: `<h1>ĐÁP ÁN — VẬT LÍ 12</h1><p>PHẦN I (2,0đ/câu): 1-A, 2-A. PHẦN II (2,0đ): Câu 1: ĐSĐS. PHẦN III (2,0đ/câu): Câu 1: 84; Câu 2: 3.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,0', sectionNo: 1, displayNo: 1 },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,0', sectionNo: 1, displayNo: 2 },
      { label: 'Câu 1', type: 'tf', answer: 'ĐSĐS', points: '2,0', sectionNo: 2, displayNo: 1 },
      { label: 'Câu 1', type: 'short', answer: '84', points: '2,0', sectionNo: 3, displayNo: 1 },
      { label: 'Câu 2', type: 'short', answer: '3', points: '2,0', sectionNo: 3, displayNo: 2 },
    ],
  },
  {
    slug: 'de-kiem-tra-hoa-hoc-11-can-bang-hoa-hoc-va-nitrogen-a1111111-1111-4111-8111-111111111106',
    title: 'Đề kiểm tra Hoá học 11 — Cân bằng hoá học & Nitrogen',
    subject: 'hoa-hoc',
    grade: 11,
    author: 'THPT Gia Định',
    copies: 51,
    questionCount: 5,
    preview: [
      'TRƯỜNG THPT GIA ĐỊNH',
      'ĐỀ KIỂM TRA GIỮA HỌC KÌ I · HOÁ HỌC 11',
      'Thời gian làm bài: 45 phút',
      'Câu 1. Dung dịch có pH = 3 biểu thị môi trường',
      'Câu 2. Số oxi hoá của nitrogen trong NH₃ là',
    ],
    content: `<h1>ĐỀ KIỂM TRA GIỮA KÌ I — HOÁ HỌC 11</h1>
<h3><b>PHẦN I. Trắc nghiệm (6,0 điểm)</b></h3>
<p><b>Câu 1.</b> Dung dịch có giá trị $\\text{pH} = 3$ ở $25^\\circ\\text{C}$ thuộc môi trường</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Acid.</p></div><div class="doc-grid-cell"><p>B. Base.</p></div><div class="doc-grid-cell"><p>C. Trung tính.</p></div><div class="doc-grid-cell"><p>D. Lưỡng tính.</p></div></div>
<p><b>Câu 2.</b> Số oxi hoá của nguyên tử N trong phân tử $\\text{NH}_3$ là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $-3$.</p></div><div class="doc-grid-cell"><p>B. $+3$.</p></div><div class="doc-grid-cell"><p>C. $+5$.</p></div><div class="doc-grid-cell"><p>D. $0$.</p></div></div>
<p><b>Câu 3.</b> Chất nào sau đây là chất điện li mạnh?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $\\text{NaCl}$.</p></div><div class="doc-grid-cell"><p>B. $\\text{CH}_3\\text{COOH}$.</p></div><div class="doc-grid-cell"><p>C. $\\text{C}_2\\text{H}_5\\text{OH}$.</p></div><div class="doc-grid-cell"><p>D. $\\text{H}_2\\text{O}$.</p></div></div>
<h3><b>PHẦN II. Tự luận (4,0 điểm)</b></h3>
<p><b>Câu 4 (4,0 điểm).</b> Tính $\\text{pH}$ của $100\\text{ ml}$ dung dịch $\\text{HCl}$ nồng độ $0{,}01\\text{ M}$ và nêu hiện tượng khi cho quỳ tím vào.</p>`,
    answerKeyContent: `<h1>ĐÁP ÁN — HOÁ HỌC 11</h1><p>1-A, 2-A, 3-A (2,0đ/câu). Câu 4 (4,0đ): pH = 2, quỳ tím hoá đỏ.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 4', type: 'essay', answer: 'pH = 2, quỳ tím hoá đỏ', points: '4,0', steps: [{ text: '[H+] = 0,01 M => pH = 2', points: '2,5' }, { text: 'Quỳ tím chuyển màu đỏ', points: '1,5' }] },
    ],
  },
  {
    slug: 'de-kiem-tra-sinh-hoc-12-co-che-di-truyen-phan-tu-a1111111-1111-4111-8111-111111111107',
    title: 'Đề kiểm tra Sinh học 12 — DNA, Phiên mã & Dịch mã',
    subject: 'sinh-hoc',
    grade: 12,
    author: 'THPT Nguyễn Thượng Hiền',
    copies: 42,
    questionCount: 4,
    preview: [
      'TRƯỜNG THPT NGUYỄN THƯỢNG HIỀN',
      'KIỂM TRA CHƯƠNG I · SINH HỌC 12',
      'Câu 1. Đơn phân cấu tạo nên DNA gồm các loại nucleotid nào?',
      'Câu 2. Bộ ba mở đầu dịch mã trên mRNA là',
    ],
    content: `<h1>ĐỀ KIỂM TRA SINH HỌC 12 — DI TRUYỀN PHÂN TỬ</h1>
<h3><b>PHẦN I. Trắc nghiệm (10,0 điểm)</b></h3>
<p><b>Câu 1.</b> Đơn phân cấu tạo nên phân tử DNA gồm 4 loại nucleotid là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. A, T, G, C.</p></div><div class="doc-grid-cell"><p>B. A, U, G, C.</p></div><div class="doc-grid-cell"><p>C. A, T, U, G.</p></div><div class="doc-grid-cell"><p>D. Amino acid.</p></div></div>
<p><b>Câu 2.</b> Bộ ba mở đầu quá trình dịch mã trên phân tử mRNA ở sinh vật nhân thực là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $5'\\text{-AUG-}3'$.</p></div><div class="doc-grid-cell"><p>B. $5'\\text{-UAA-}3'$.</p></div><div class="doc-grid-cell"><p>C. $5'\\text{-UAG-}3'$.</p></div><div class="doc-grid-cell"><p>D. $5'\\text{-UGA-}3'$.</p></div></div>
<p><b>Câu 3.</b> Enzyme chính thực hiện tổng hợp chuỗi polinucleotid mới khi tái bản DNA là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. DNA polymerase.</p></div><div class="doc-grid-cell"><p>B. RNA polymerase.</p></div><div class="doc-grid-cell"><p>C. Ligase.</p></div><div class="doc-grid-cell"><p>D. Amylase.</p></div></div>
<p><b>Câu 4.</b> Theo nguyên tắc bổ sung trong phân tử DNA mạch kép, liên kết giữa A và T là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2 liên kết hydrogen.</p></div><div class="doc-grid-cell"><p>B. 3 liên kết hydrogen.</p></div><div class="doc-grid-cell"><p>C. 1 liên kết hydrogen.</p></div><div class="doc-grid-cell"><p>D. 4 liên kết hydrogen.</p></div></div>`,
    answerKeyContent: `<h1>ĐÁP ÁN — SINH HỌC 12</h1><p>1-A, 2-A, 3-A, 4-A (mỗi câu 2,5 điểm).</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,5' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,5' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '2,5' },
      { label: 'Câu 4', type: 'mc', answer: 'A', points: '2,5' },
    ],
  },
  {
    slug: 'de-kiem-tra-khtn-8-phan-ung-hoa-hoc-va-khoi-luong-rieng-a1111111-1111-4111-8111-111111111108',
    title: 'Đề kiểm tra giữa kì I Khoa học tự nhiên 8',
    subject: 'khtn',
    grade: 8,
    author: 'THCS Cầu Giấy',
    copies: 58,
    questionCount: 4,
    preview: [
      'TRƯỜNG THCS CẦU GIẤY',
      'ĐỀ KIỂM TRA GIỮA KÌ I · KHTN 8',
      'Thời gian làm bài: 45 phút',
      'Câu 1. Định luật bảo toàn khối lượng được phát biểu như thế nào?',
    ],
    content: `<h1>ĐỀ KIỂM TRA GIỮA KÌ I — KHOA HỌC TỰ NHIÊN 8</h1>
<h3><b>PHẦN I. Trắc nghiệm (6,0 điểm)</b></h3>
<p><b>Câu 1.</b> Công thức tính khối lượng riêng của một vật đồng chất có khối lượng $m$ và thể tích $V$ là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $D = \\dfrac{m}{V}$.</p></div><div class="doc-grid-cell"><p>B. $D = m \\cdot V$.</p></div><div class="doc-grid-cell"><p>C. $D = \\dfrac{V}{m}$.</p></div><div class="doc-grid-cell"><p>D. $D = 10 \\cdot m$.</p></div></div>
<p><b>Câu 2.</b> Trong phản ứng hoá học, tổng khối lượng các chất sản phẩm như thế nào so với tổng khối lượng các chất tham gia?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Bằng nhau.</p></div><div class="doc-grid-cell"><p>B. Luôn lớn hơn.</p></div><div class="doc-grid-cell"><p>C. Luôn nhỏ hơn.</p></div><div class="doc-grid-cell"><p>D. Không so sánh được.</p></div></div>
<p><b>Câu 3.</b> Đơn vị của áp suất trong hệ SI là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $\\text{Pa}$ (N/m²).</p></div><div class="doc-grid-cell"><p>B. $\\text{N}$.</p></div><div class="doc-grid-cell"><p>C. $\\text{kg/m}^3$.</p></div><div class="doc-grid-cell"><p>D. $\\text{J}$.</p></div></div>
<h3><b>PHẦN II. Tự luận (4,0 điểm)</b></h3>
<p><b>Câu 4 (4,0 điểm).</b> Một khối nhôm có thể tích $200\\text{ cm}^3$ và khối lượng $540\\text{ g}$. Tính khối lượng riêng của nhôm theo $\\text{g/cm}^3$ và $\\text{kg/m}^3$.</p>`,
    answerKeyContent: `<h1>ĐÁP ÁN — KHTN 8</h1><p>1-A, 2-A, 3-A (2,0đ/câu). Câu 4 (4,0đ): D = 2,7 g/cm³ = 2700 kg/m³.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 4', type: 'essay', answer: '2,7 g/cm³ = 2700 kg/m³', points: '4,0', steps: [{ text: 'D = 540/200 = 2,7 g/cm³', points: '2,0' }, { text: 'Đổi đơn vị = 2700 kg/m³', points: '2,0' }] },
    ],
  },
  {
    slug: 'de-kiem-tra-lich-su-12-trat-tu-the-gioi-sau-1945-a1111111-1111-4111-8111-111111111109',
    title: 'Đề kiểm tra Lịch sử 12 — Trật tự thế giới sau 1945 & ASEAN',
    subject: 'lich-su',
    grade: 12,
    author: 'THPT Phan Đình Phùng',
    copies: 39,
    questionCount: 4,
    preview: [
      'TRƯỜNG THPT PHAN ĐÌNH PHÙNG',
      'ĐỀ KIỂM TRA CHỦ ĐỀ · LỊCH SỬ 12',
      'Câu 1. Hội nghị Ianta (2-1945) có sự tham dự của ba cường quốc nào?',
      'Câu 2. Việt Nam chính thức gia nhập ASEAN vào năm nào?',
    ],
    content: `<h1>ĐỀ KIỂM TRA LỊCH SỬ 12 — THẾ GIỚI SAU NĂM 1945</h1>
<h3><b>PHẦN I. Trắc nghiệm (10,0 điểm)</b></h3>
<p><b>Câu 1.</b> Hội nghị Ianta (tháng 2-1945) diễn ra với sự tham dự của nguyên thủ ba nước nào?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Liên Xô, Mỹ, Anh.</p></div><div class="doc-grid-cell"><p>B. Liên Xô, Pháp, Đức.</p></div><div class="doc-grid-cell"><p>C. Mỹ, Anh, Pháp.</p></div><div class="doc-grid-cell"><p>D. Liên Xô, Mỹ, Nhật.</p></div></div>
<p><b>Câu 2.</b> Việt Nam chính thức trở thành thành viên thứ 7 của tổ chức ASEAN vào tháng 7 năm nào?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. 1995.</p></div><div class="doc-grid-cell"><p>B. 1967.</p></div><div class="doc-grid-cell"><p>C. 1997.</p></div><div class="doc-grid-cell"><p>D. 2007.</p></div></div>
<p><b>Câu 3.</b> Sự kiện nào đánh dấu Trật tự hai cực Ianta chính thức sụp đổ hoàn toàn?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Liên Xô tan rã năm 1991.</p></div><div class="doc-grid-cell"><p>B. Bức tường Berlin sụp đổ năm 1989.</p></div><div class="doc-grid-cell"><p>C. Chiến tranh Triều Tiên kết thúc.</p></div><div class="doc-grid-cell"><p>D. Hiệp ước Bali được ký kết.</p></div></div>
<p><b>Câu 4.</b> Tổ chức Liên hợp quốc đặt mục tiêu hàng đầu là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Duy trì hoà bình và an ninh thế giới.</p></div><div class="doc-grid-cell"><p>B. Thành lập liên minh quân sự duy nhất.</p></div><div class="doc-grid-cell"><p>C. Thống nhất đồng tiền chung.</p></div><div class="doc-grid-cell"><p>D. Phân chia thuộc địa cũ.</p></div></div>`,
    answerKeyContent: `<h1>ĐÁP ÁN — LỊCH SỬ 12</h1><p>1-A, 2-A, 3-A, 4-A (mỗi câu 2,5 điểm).</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,5' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,5' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '2,5' },
      { label: 'Câu 4', type: 'mc', answer: 'A', points: '2,5' },
    ],
  },
  {
    slug: 'de-kiem-tra-dia-li-12-vi-tri-dia-li-va-tu-nhien-viet-nam-a1111111-1111-4111-8111-111111111110',
    title: 'Đề kiểm tra Địa lí 12 — Vị trí địa lí & Đặc điểm thiên nhiên Việt Nam',
    subject: 'dia-li',
    grade: 12,
    author: 'THPT Việt Đức',
    copies: 33,
    questionCount: 4,
    preview: [
      'TRƯỜNG THPT VIỆT ĐỨC',
      'ĐỀ KIỂM TRA GIỮA KÌ I · ĐỊA LÍ 12',
      'Câu 1. Nước ta nằm ở múi giờ thứ mấy theo giờ GMT?',
      'Câu 2. Khí hậu Việt Nam có tính chất cơ bản là',
    ],
    content: `<h1>ĐỀ KIỂM TRA ĐỊA LÍ 12 — TỰ NHIÊN VIỆT NAM</h1>
<h3><b>PHẦN I. Trắc nghiệm (6,0 điểm)</b></h3>
<p><b>Câu 1.</b> Phần đất liền Việt Nam nằm trong múi giờ thứ mấy theo hệ thống giờ GMT?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Múi giờ số 7.</p></div><div class="doc-grid-cell"><p>B. Múi giờ số 5.</p></div><div class="doc-grid-cell"><p>C. Múi giờ số 8.</p></div><div class="doc-grid-cell"><p>D. Múi giờ số 9.</p></div></div>
<p><b>Câu 2.</b> Gió mùa mùa hạ thổi vào miền Nam nước ta có hướng chủ yếu là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Tây Nam.</p></div><div class="doc-grid-cell"><p>B. Đông Bắc.</p></div><div class="doc-grid-cell"><p>C. Tây Bắc.</p></div><div class="doc-grid-cell"><p>D. Đông Nam.</p></div></div>
<p><b>Câu 3.</b> Thiên nhiên nước ta phân hoá theo chiều Bắc – Nam thể hiện rõ rệt nhất qua sự thay đổi của</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. Chế độ nhiệt.</p></div><div class="doc-grid-cell"><p>B. Độ cao địa hình.</p></div><div class="doc-grid-cell"><p>C. Chế độ thuỷ triều.</p></div><div class="doc-grid-cell"><p>D. Khối đá mẹ.</p></div></div>
<h3><b>PHẦN II. Tự luận (4,0 điểm)</b></h3>
<p><b>Câu 4 (4,0 điểm).</b> Trình bày những thuận lợi cơ bản của vị trí địa lí nước ta đối với phát triển kinh tế – xã hội.</p>`,
    answerKeyContent: `<h1>ĐÁP ÁN — ĐỊA LÍ 12</h1><p>1-A, 2-A, 3-A (2,0đ/câu). Câu 4 (4,0đ): Nằm ở ngã tư hàng hải quốc tế, thuận lợi giao thương và phát triển kinh tế biển.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 4', type: 'essay', answer: 'Giao thương quốc tế và kinh tế biển', points: '4,0', steps: [{ text: 'Thuận lợi về vị trí giao thông đường biển, hàng không', points: '2,0' }, { text: 'Thuận lợi hợp tác hội nhập ASEAN và phát triển kinh tế đa ngành', points: '2,0' }] },
    ],
  },
  {
    slug: 'de-kiem-tra-tin-hoc-10-bieu-dien-thong-tin-va-thuat-toan-a1111111-1111-4111-8111-111111111111',
    title: 'Đề kiểm tra Tin học 10 — Biểu diễn dữ liệu nhị phân & Python cơ bản',
    subject: 'tin-hoc',
    grade: 10,
    author: 'THPT Chuyên Hà Nội - Amsterdam',
    copies: 67,
    questionCount: 4,
    preview: [
      'TRƯỜNG THPT CHUYÊN HÀ NỘI - AMSTERDAM',
      'KIỂM TRA GIỮA KÌ I · TIN HỌC 10',
      'Câu 1. Số 13 trong hệ thập phân biểu diễn sang hệ nhị phân là',
      'Câu 2. Một byte tương ứng với bao nhiêu bit?',
    ],
    content: `<h1>ĐỀ KIỂM TRA TIN HỌC 10 — DỮ LIỆU &amp; LẬP TRÌNH PYTHON</h1>
<h3><b>PHẦN I. Trắc nghiệm (6,0 điểm)</b></h3>
<p><b>Câu 1.</b> Số nguyên $13$ trong hệ thập phân đổi sang hệ nhị phân là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. $1101$.</p></div><div class="doc-grid-cell"><p>B. $1011$.</p></div><div class="doc-grid-cell"><p>C. $1110$.</p></div><div class="doc-grid-cell"><p>D. $1001$.</p></div></div>
<p><b>Câu 2.</b> Một byte (B) gồm bao nhiêu bit?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. 8 bit.</p></div><div class="doc-grid-cell"><p>B. 4 bit.</p></div><div class="doc-grid-cell"><p>C. 16 bit.</p></div><div class="doc-grid-cell"><p>D. 1024 bit.</p></div></div>
<p><b>Câu 3.</b> Trong Python, câu lệnh nào dùng để đưa kết quả ra màn hình?</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. <code>print()</code></p></div><div class="doc-grid-cell"><p>B. <code>input()</code></p></div><div class="doc-grid-cell"><p>C. <code>len()</code></p></div><div class="doc-grid-cell"><p>D. <code>range()</code></p></div></div>
<h3><b>PHẦN II. Trả lời ngắn (4,0 điểm)</b></h3>
<p><b>Câu 4.</b> Giá trị của biểu thức <code>17 // 5 + 17 % 5</code> trong Python bằng bao nhiêu?</p>`,
    answerKeyContent: `<h1>ĐÁP ÁN — TIN HỌC 10</h1><p>1-A, 2-A, 3-A (2,0đ/câu). Câu 4: 5 (17//5 = 3, 17%5 = 2, tổng = 5).</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 2', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 3', type: 'mc', answer: 'A', points: '2,0' },
      { label: 'Câu 4', type: 'short', answer: '5', points: '4,0' },
    ],
  },
  {
    slug: 'de-kiem-tra-tieng-viet-5-cuoi-hoc-ki-i-doc-hieu-va-tap-lam-van-a1111111-1111-4111-8111-111111111112',
    title: 'Đề kiểm tra Tiếng Việt 5 — Cuối học kì I (Đọc hiểu & Tập làm văn)',
    subject: 'tieng-viet',
    grade: 5,
    author: 'Tiểu học Đoàn Thị Điểm',
    copies: 45,
    questionCount: 4,
    preview: [
      'TRƯỜNG TIỂU HỌC ĐOÀN THỊ ĐIỂM',
      'BÀI KIỂM TRA CUỐI HỌC KÌ I · TIẾNG VIỆT 5',
      'I. Đọc hiểu và Luyện từ và câu (4,0 điểm)',
      'II. Tập làm văn (6,0 điểm): Tả một buổi sáng ở quê hương em hoặc trường em.',
    ],
    content: `<h1>ĐỀ KIỂM TRA CUỐI HỌC KÌ I — TIẾNG VIỆT 5</h1>
<h3><b>I. Đọc hiểu và Luyện từ và câu (4,0 điểm)</b></h3>
<p><b>Câu 1 (2,0 điểm).</b> Tìm các đại từ xưng hô trong đoạn hội thoại sau và cho biết thái độ tình cảm của người nói: <i>"Cậu chờ tớ một lát nhé, tớ lấy quyển vở xong ngay."</i></p>
<p><b>Câu 2 (2,0 điểm).</b> Đặt một câu ghép có sử dụng cặp quan hệ từ biểu thị quan hệ nguyên nhân – kết quả.</p>
<h3><b>II. Tập làm văn (6,0 điểm)</b></h3>
<p><b>Câu 3 (6,0 điểm).</b> Em hãy viết một bài văn tả cảnh ngôi trường thân yêu của em vào một buổi sáng đẹp trời.</p>`,
    answerKeyContent: `<h1>HƯỚNG DẪN CHẤM — TIẾNG VIỆT 5</h1><p>Câu 1 (2,0đ): Đại từ "cậu", "tớ" thể hiện sự thân mật. Câu 2 (2,0đ): Ví dụ "Vì trời mưa to nên đường trơn trượt." Câu 3 (6,0đ): Đủ mở bài, thân bài, kết bài; dùng hình ảnh so sánh sinh động.</p>`,
    answerKeyQuestions: [
      { label: 'Câu 1', type: 'essay', answer: 'Đại từ cậu, tớ', points: '2,0', steps: [{ text: 'Tìm đúng đại từ xưng hô', points: '2,0' }] },
      { label: 'Câu 2', type: 'essay', answer: 'Câu ghép nguyên nhân - kết quả', points: '2,0', steps: [{ text: 'Đặt đúng cấu trúc câu ghép và cặp quan hệ từ', points: '2,0' }] },
      { label: 'Câu 3', type: 'essay', answer: 'Bài văn tả cảnh trường học', points: '6,0', steps: [{ text: 'Bố cục rõ ràng 3 phần', points: '2,0' }, { text: 'Miêu tả chi tiết sinh động, không sai chính tả', points: '4,0' }] },
    ],
  },
];

export const COMMUNITY_EXAMS: CommunityExam[] = RAW.map((exam, index) => ({
  ...exam,
  authorColor: PALETTE[index % PALETTE.length],
}));
