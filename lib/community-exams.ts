/**
 * Community exam library — real records.
 *
 * Scraped from https://www.soandethi.com/exams on 2026-10-30. Slugs, titles and
 * the paper previews are the originals; `copies` and `questionCount` come from
 * the site's own list payload.
 *
 * The live site reports 596 published exams but only serves the first 24 (no
 * pagination parameter exists and the list is rendered on the server), so 24 is
 * the real ceiling for a clone. Author accounts are not in that payload, so the
 * card shows the school printed on the paper itself.
 */
export type CommunityExam = {
  slug: string;
  title: string;
  subject: string;
  grade: number;
  author: string;
  authorColor: string;
  copies: number;
  questionCount: number;
  /** Header and first lines of the original paper. */
  preview: string[];
};

const A = ['#3358f4', '#0f7b6c', '#d9730d', '#6940a5', '#c14c8a', '#b03a2e'];

const RAW: Array<Omit<CommunityExam, 'authorColor' | 'author'>> = [
  {
    slug: "quiz-luat-moi-truong-dot-1-cau-1-20-e1816b1f-adac-4a1f-ba7b-c5adb2f59312",
    title: "Quiz Luật Môi trường – Đợt 1 (Câu 1–20)",
    subject: "luat-moi-truong",
    grade: 0,
    copies: 0,
    questionCount: 17,
    preview: [
      "TRƯỜNG ĐẠI HỌC …",
      "KHOA LUẬT",
      "Đề ôn tập",
      "BÀI QUIZ ÔN TẬP CUỐI KỲ – ĐỢT 1 (CÂU 1–20)",
      "Năm học 2026 – 2027",
      "Học phần: Luật Môi trường",
      "Thời gian làm bài: 30 phút",
      "PHẦN I. CÂU HỎI TRẮC NGHIỆM (10,0 điểm)",
      "Mỗi câu có bốn phương án, chỉ chọn một phương án đúng. Câu hỏi căn cứ vào Luật Bảo vệ môi trường 2020 và các văn bản pháp luật hiện hành đến thời điểm ra đề."
    ],
  },
  {
    slug: "4-5-on1-4d210c29-3565-4cdf-b52f-dc43fd0c1d4f",
    title: "當代4-5.on1",
    subject: "tieng-trung",
    grade: 0,
    copies: 1,
    questionCount: 40,
    preview: [
      "根據下列語篇內容，從 A、B、C、D 四個選項中選出正確答案",
      "在現代社會中，不少剛走出校園的求職者對未來的職業生涯充滿憧憬，卻往往忽略了自我能力的（1）限制。面對激烈的競爭，如果只是一味（2）眼紅他人的成就，而不願腳踏實地累積經驗，終究難以在職場中立足。專家指出，求職者應當（3）正視自己的優缺點，努力提升專業技能與團隊合作精神。唯有透過持續不斷的（4）磨練，才能在關鍵時刻展現自身價值，獲得上司與同事的肯定。",
      "Câu 1. 文中的「限制」意思是：",
      "A. 規定與界線",
      "B. 缺點與錯誤",
      "C. 自由與權益",
      "D. 興趣與愛好",
      "Câu 2. 文中的「眼紅」意思是：",
      "A. 眼睛疼痛"
    ],
  },
  {
    slug: "4-5-ontap3-65abecb9-855b-43e5-842e-9d0f5ad72308",
    title: "當代4-5.ontap3",
    subject: "tieng-trung",
    grade: 0,
    copies: 0,
    questionCount: 40,
    preview: [
      "根據下列語篇內容，從 A、B、C、D 四個選項中選出正確答案",
      "面對日益嚴重的極端氣候與環境破壞，綠色能源的開發已成為全球不可忽視的（1）＿＿。為了減少溫室氣體的排放，許多國家紛紛投入大量資金發展風力與太陽能發電。專家指出，單純依靠傳統石化燃料的時代已經過去，尋找乾淨且可再生的（2）＿＿方案是當前的當務之急。",
      "然而，能源轉型的過程並非一帆風順。在推動大型綠能工程時，往往會（3）＿＿生態環境保護與經濟效益之間的衝突。例如，部分地區因興建發電設備而對當地鳥類與海洋（4）＿＿的棲息地造成干擾，甚至引發周邊居民的不滿與抗議。這說明了任何政策的制定都不能（5）＿＿，必須全面評估各方利益。",
      "面對這些挑戰，政府與相關企業必須展現足夠的智慧與（6）＿＿，積極與公眾溝通，化解社會疑慮。唯有透過科學的規劃與持續的技術創新，才能有效（7）＿＿環境風險，並在保障民生供電穩定的同時，達到減碳的長期（8）＿＿。保護地球環境是全人類的共同責任，任何人都不應該（9）＿＿。只要大家齊心協力，我們終能找到一條人與自然和諧共存的（10）＿＿。",
      "Câu 1.",
      "A. 潮流",
      "B. 趨勢",
      "C. 局面",
      "D. 風氣"
    ],
  },
  {
    slug: "de-giua-hoc-ki-i-sinh-hoc-12-ket-noi-tri-thuc-bai-1-9-muc-do-kho-26fe90ea-c173-46db-8ad8-8d6875911aae",
    title: "Đề giữa học kì I Sinh học 12 – Kết nối tri thức – Bài 1–9 – Mức độ khó",
    subject: "sinh-hoc",
    grade: 12,
    copies: 3,
    questionCount: 28,
    preview: [
      "SỞ GD&ĐT …",
      "TRƯỜNG THPT …",
      "Đề tham khảo",
      "ĐỀ KIỂM TRA GIỮA HỌC KỲ I",
      "NĂM HỌC 2026 – 2027",
      "Môn: Sinh học – Lớp 12",
      "Thời gian làm bài: 50 phút, không kể thời gian phát đề",
      "Chương trình GDPT 2018 – Sách Kết nối tri thức với cuộc sống.",
      "Phạm vi: Bài 1 đến Bài 9. Đề gồm 3 phần; tổng điểm: 10,0."
    ],
  },
  {
    slug: "de-thi-olympic-toan-sinh-vien-toan-quoc-mon-giai-tich-bang-a-b03aae35-2fc7-481f-aa50-3ba888f84737",
    title: "Đề thi Olympic Toán sinh viên toàn quốc - Môn Giải tích (Bảng A)",
    subject: "toan",
    grade: 0,
    copies: 0,
    questionCount: 5,
    preview: [
      "HỘI TOÁN HỌC VIỆT NAM",
      "BAN TỔ CHỨC OLYMPIC",
      "Đề chính thức",
      "KỲ THI OLYMPIC TOÁN HỌC SINH VIÊN TOÀN QUỐC",
      "Môn thi: GIẢI TÍCH – BẢNG A",
      "Thời gian làm bài: 180 phút (không kể thời gian phát đề)",
      "Câu 1 (4,0 điểm).",
      "Cho dãy số thực (x",
      "n"
    ],
  },
  {
    slug: "chuyen-de-toan-10-phan-tich-vecto-va-tinh-do-dai-bbd6d5d2-dd63-4da8-973c-4bce7c7ff81e",
    title: "Chuyên đề Toán 10: Phân tích vectơ và tính độ dài",
    subject: "toan",
    grade: 10,
    copies: 1,
    questionCount: 10,
    preview: [
      "CHUYÊN ĐỀ TOÁN 10",
      "VECTƠ VÀ HỆ THỨC LƯỢNG",
      "Bài tập tự luận",
      "PHIẾU BÀI TẬP TỰ LUẬN",
      "Chủ đề: Phân tích vectơ và tính độ dài",
      "Môn: Toán – Lớp 10",
      "CÁC BÀI TẬP TỰ LUẬN",
      "Bài 1. Cho tam giác ABC có AB=3, AC=6 và BC=3",
      "3"
    ],
  },
  {
    slug: "de-kiem-tra-giua-hoc-ki-i-mon-toan-lop-4-nam-hoc-2026-2027-410685f7-349d-42f2-9d77-4cec6cdceca3",
    title: "Đề kiểm tra Giữa học kì I môn Toán lớp 4 năm học 2026 - 2027",
    subject: "toan",
    grade: 4,
    copies: 10,
    questionCount: 13,
    preview: [
      "UBND XÃ/PHƯỜNG …",
      "TRƯỜNG TIỂU HỌC …",
      "Đề chính thức",
      "ĐỀ KIỂM TRA GIỮA HỌC KỲ I",
      "NĂM HỌC 2026 – 2027",
      "Môn: Toán – Lớp 4",
      "Thời gian làm bài: 40 phút (không kể thời gian phát đề)",
      "PHẦN I. TRẮC NGHIỆM (5,0 điểm)",
      "Khoanh tròn vào chữ cái đặt trước câu trả lời đúng (từ Câu 1 đến Câu 7) và điền số/chữ thích hợp vào chỗ chấm (từ Câu 8 đến Câu 10):"
    ],
  },
  {
    slug: "de-thi-moi-46facf74-9107-4b25-88d4-51dd0f866229",
    title: "Đề thi mới",
    subject: "toan",
    grade: 0,
    copies: 1,
    questionCount: 6,
    preview: [
      "KỲ THI CHỌN ĐỘI TUYỂN OLYMPIC",
      "BỒI DƯỠNG NĂNG KHIẾU TOÁN HỌC",
      "Đề tham khảo",
      "ĐỀ THI OLYMPIC TOÁN HỌC QUỐC TẾ (IMO)",
      "Năm học 2026 – 2027",
      "Thời gian làm bài: 270 phút mỗi ngày (không kể thời gian phát đề)",
      "NGÀY THI THỨ NHẤT",
      "Thời gian làm bài: 270 phút",
      "Bài 1 (7,0 điểm)."
    ],
  },
  {
    slug: "de-kiem-tra-giua-hoc-ki-i-vat-li-11-chuong-i-dao-dong-9559cb1e-6c7c-4761-8690-0b7613bfc7a8",
    title: "Đề kiểm tra giữa học kì I Vật lí 11 – Chương I: Dao động",
    subject: "vat-li",
    grade: 11,
    copies: 2,
    questionCount: 19,
    preview: [
      "SỞ GIÁO DỤC VÀ ĐÀO TẠO …",
      "TRƯỜNG THPT …",
      "Đề tham khảo",
      "ĐỀ KIỂM TRA GIỮA HỌC KÌ I",
      "NĂM HỌC 2026 – 2027",
      "Môn: Vật lí – Lớp 11",
      "Thời gian làm bài: 45 phút, không kể thời gian phát đề",
      "Phạm vi kiểm tra: Hết Chương I – Dao động. Học sinh được sử dụng máy tính cầm tay.",
      "PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN (3,0 điểm)"
    ],
  },
  {
    slug: "toan-9-de-chuyen-tang-cuong-4-kem-loi-giai-chi-tiet-dc352599-4b46-4742-b4f7-f4ee8dfa31b4",
    title: "Toán 9 - Đề chuyên (Tăng cường 4) kèm Lời giải chi tiết",
    subject: "toan",
    grade: 9,
    copies: 6,
    questionCount: 22,
    preview: [
      "TRƯỜNG THCS …",
      "Tài liệu ôn tập",
      "ĐỀ CHUYÊN (TĂNG CƯỜNG 4) – LỜI GIẢI CHI TIẾT",
      "Môn: Toán – Lớp 9",
      "Năm học 2026 – 2027",
      "PHẦN I. TRẮC NGHIỆM (20 câu – 5,0 điểm)",
      "Câu 1. Với x>0,y>0,2x",
      "",
      "=y, rút gọn biểu thức B="
    ],
  },
  {
    slug: "4-5-ontap2-b50e0824-7307-4e7c-9dc5-5499aeb4ff9c",
    title: "當代4-5.ontap2",
    subject: "tieng-trung",
    grade: 0,
    copies: 1,
    questionCount: 40,
    preview: [
      "根據下列各題或語篇內容，從 A、B、C、D 四個選項中選出正確答案",
      "第 1 題至第 8 題：閱讀短文，從各題選項中選出最適當的詞語填入空格。",
      "面對全球暖化日益嚴重，發展乾淨能源已經成為世界各國的（1）＿＿之急。傳統的火力發電雖然能提供穩定的電量，但燃燒煤炭所產生的二氧化碳（2）＿＿極高，對大氣環境造成嚴重的傷害。相較之下，風力、水力以及太陽能等綠色能源，由於不產生污染物質，因此被普遍（3）＿＿解決氣候變遷問題的重要替代方案。",
      "然而，這些新能源並非完全沒有缺點。以風力和太陽能為例，其發電量往往（4）＿＿天氣與自然條件的限制，在氣候不佳時，發電效率可能大幅（5）＿＿。此外，核能發電雖然碳排放量極低，但大眾對於輻射外洩或爆炸事故的（6）＿＿始終存在，這使得核電廠的興建常常引發激烈的社會爭議。專家指出，解決能源危機不能（7）＿＿，政府必須綜合考量經濟效益、環境保護與民生需求，才能規劃出最為合理且具體的（8）＿＿。",
      "Câu 1.",
      "A. 迫切",
      "B. 暫時",
      "C. 勉強",
      "D. 刻意"
    ],
  },
  {
    slug: "bo-2-de-thi-tot-nghiep-thpt-mon-lich-su-12-bai-1-4-kem-dap-an-59b4b6dc-cffd-4939-8a5a-527e19ac4adc",
    title: "BỘ 2 ĐỀ THI TỐT NGHIỆP THPT MÔN LỊCH SỬ 12 (BÀI 1 - 4) KÈM ĐÁP ÁN",
    subject: "lich-su",
    grade: 12,
    copies: 4,
    questionCount: 40,
    preview: [
      "SỞ GIÁO DỤC VÀ ĐÀO TẠO …",
      "TRƯỜNG THPT …",
      "Đề thi thử",
      "KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2027",
      "Bài thi: LỊCH SỬ",
      "Thời gian làm bài: 50 phút, không kể thời gian phát đề",
      "Họ và tên thí sinh: ................................................................",
      "Số báo danh: ............................................................",
      "Mã đề: 101"
    ],
  },
  {
    slug: "de-luyen-tap-chuyen-de-phuong-trinh-trang-thai-cua-khi-li-tuong-vat-li-10-1c552a58-1902-4482-a16c-efe4aa08b1c9",
    title: "Đề luyện tập chuyên đề Phương trình trạng thái của khí lí tưởng – Vật lí 10",
    subject: "vat-li",
    grade: 10,
    copies: 1,
    questionCount: 35,
    preview: [
      "SỞ GIÁO DỤC VÀ ĐÀO TẠO …",
      "TRƯỜNG THPT …",
      "Đề tham khảo",
      "ĐỀ LUYỆN TẬP CHUYÊN ĐỀ VẬT LÍ 10",
      "Chuyên đề: Phương trình trạng thái của khí lí tưởng",
      "Thời gian làm bài: 60 phút (không kể thời gian phát đề)",
      "Cho hằng số khí R=8,31 J/(mol.K); 1 atm =1,0⋅10",
      "5",
      "Pa; khối lượng mol của không khí là 29 g/mol."
    ],
  },
  {
    slug: "bo-2-de-kiem-tra-giua-hoc-ki-i-mon-toan-12-cau-truc-moi-kha-gioi-10237618-b8f2-40c1-8fa8-ecac382fa60a",
    title: "Bộ 2 đề kiểm tra Giữa học kì I môn Toán 12 (Cấu trúc mới - Khá Giỏi)",
    subject: "toan",
    grade: 12,
    copies: 0,
    questionCount: 40,
    preview: [
      "SỞ GIÁO DỤC VÀ ĐÀO TẠO …",
      "TRƯỜNG THPT …",
      "Đề chính thức",
      "ĐỀ KIỂM TRA GIỮA HỌC KỲ I – ĐỀ SỐ 01",
      "NĂM HỌC 2026 – 2027",
      "Môn: Toán – Lớp 12",
      "Thời gian làm bài: 90 phút (không kể thời gian phát đề)",
      "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (3,0 điểm)",
      "Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi thí sinh chỉ chọn một phương án."
    ],
  },
  {
    slug: "bo-3-de-kiem-tra-giua-hoc-ky-i-lich-su-11-nam-hoc-2026-2027-2b2c0273-7ff3-472e-97c1-38f79d3ed902",
    title: "Bộ 3 đề kiểm tra Giữa học kỳ I Lịch sử 11 (Năm học 2026 - 2027)",
    subject: "lich-su",
    grade: 11,
    copies: 2,
    questionCount: 40,
    preview: [
      "SỞ GD&ĐT …",
      "TRƯỜNG THPT …",
      "Đề chính thức",
      "ĐỀ KIỂM TRA GIỮA HỌC KỲ I – ĐỀ SỐ 1",
      "Năm học: 2026 – 2027",
      "Môn: Lịch sử – Lớp 11",
      "Thời gian làm bài: 45 phút (không kể thời gian phát đề)",
      "PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 điểm)",
      "Thí sinh trả lời từ Câu 1 đến Câu 12. Mỗi câu hỏi chỉ chọn một phương án đúng nhất."
    ],
  },
  {
    slug: "cau-hoi-trac-nghiem-lich-su-12-su-xoi-mon-trat-tu-hai-cuc-ianta-muc-van-dung-19f5d414-e4e8-4796-b80b-45d612a10b36",
    title: "Câu hỏi trắc nghiệm Lịch sử 12 – Sự xói mòn Trật tự hai cực Ianta (mức vận dụng)",
    subject: "lich-su",
    grade: 12,
    copies: 1,
    questionCount: 6,
    preview: [
      "Lịch sử",
      "Lớp 12",
      "22. Nguyễn Linh Giang",
      "0"
    ],
  },
  {
    slug: "bai-toan-van-dung-cao-tap-hop-toan-10-caa57db6-691c-44bc-8930-c0c3244cbc10",
    title: "Bài toán Vận dụng cao Tập hợp – Toán 10",
    subject: "toan",
    grade: 10,
    copies: 0,
    questionCount: 1,
    preview: [
      "Toán",
      "Lớp 10",
      "Ngọc Lâm Nguyễn",
      "0"
    ],
  },
  {
    slug: "bo-4-de-kiem-tra-giua-hoc-ky-i-mon-giao-duc-dia-phuong-9-bai-1-va-bai-2-c27996a0-262e-4139-9ea4-541971a36036",
    title: "Bộ 4 đề kiểm tra giữa học kỳ I môn Giáo dục địa phương 9 (Bài 1 và Bài 2)",
    subject: "lich-su",
    grade: 9,
    copies: 0,
    questionCount: 40,
    preview: [
      "Lịch sử",
      "Lớp 9",
      "Luyến Kim",
      "0"
    ],
  },
  {
    slug: "bai-tap-ve-nha-toan-8-tam-giac-hinh-thang-va-hinh-binh-hanh-5f2f2dea-1e0a-401c-b716-82541e59dbd4",
    title: "Bài tập về nhà Toán 8 – Tam giác, Hình thang và Hình bình hành",
    subject: "toan",
    grade: 8,
    copies: 0,
    questionCount: 21,
    preview: [
      "Toán",
      "Lớp 8",
      "DHai Nguyen",
      "0"
    ],
  },
  {
    slug: "bai-tap-chuyen-de-hoa-hoc-12-ester-va-lipid-68-cau-ly-thuyet-trong-tam-d1969390-16b7-4784-bdf2-f18ce1580610",
    title: "BÀI TẬP CHUYÊN ĐỀ HÓA HỌC 12 – ESTER VÀ LIPID (68 CÂU LÝ THUYẾT TRỌNG TÂM)",
    subject: "hoa-hoc",
    grade: 12,
    copies: 0,
    questionCount: 40,
    preview: [
      "Hoá học",
      "Lớp 12",
      "Hải Đăng Phan",
      "0"
    ],
  },
  {
    slug: "de-thi-hsg-giai-toan-tren-mtct-mon-toan-12-nang-cao-10-chu-de-chuyen-sau-446b5b23-52c6-4a7d-ab6e-9be9fdc69088",
    title: "Đề thi HSG Giải toán trên MTCT môn Toán 12 nâng cao (10 chủ đề chuyên sâu)",
    subject: "khac",
    grade: 0,
    copies: 0,
    questionCount: 0,
    preview: [
      "Toán",
      "Lớp 12",
      "châu pha trương",
      "0"
    ],
  },
  {
    slug: "de-kiem-tra-hoc-ky-ii-mon-toan-9-d59cbf2f-a26a-465f-8355-305f4e4a2b9c",
    title: "Đề kiểm tra học kỳ II môn Toán 9",
    subject: "khac",
    grade: 0,
    copies: 0,
    questionCount: 0,
    preview: [
      "Toán",
      "Lớp 9",
      "ttatinaedu huyen",
      "0"
    ],
  },
  {
    slug: "bo-02-de-kiem-tra-giua-hoc-ky-i-tieng-anh-12-kem-dap-an-va-loi-giai-chi-tiet-a2356ed0-3642-4456-a038-1489d160420c",
    title: "Bộ 02 Đề Kiểm Tra Giữa Học Kỳ I Tiếng Anh 12 (Kèm Đáp Án và Lời Giải Chi Tiết)",
    subject: "khac",
    grade: 0,
    copies: 0,
    questionCount: 0,
    preview: [
      "Tiếng Anh",
      "Lớp 12",
      "Thảo Nguyễn",
      "4"
    ],
  },
  {
    slug: "bo-2-de-thi-thu-giua-hoc-ki-i-mon-tieng-anh-8-nam-hoc-2026-2027-ea99a283-eced-4ef9-8bca-74946b48c62a",
    title: "Bộ 2 đề thi thử Giữa học kì I môn Tiếng Anh 8 (Năm học 2026 – 2027)",
    subject: "khac",
    grade: 0,
    copies: 0,
    questionCount: 0,
    preview: [
      "Tiếng Anh",
      "Lớp 8",
      "Ngọc Lan Nguyễn Thị",
      "10"
    ],
  },
];

export const COMMUNITY_EXAMS: CommunityExam[] = RAW.map((e, i) => ({
  ...e,
  author: (e.preview.find((l) => /^(UBND|SỞ|TRƯỜNG|PHÒNG|HỘI)/i.test(l)) ?? 'Cộng đồng').slice(0, 40),
  authorColor: A[i % A.length],
}));
