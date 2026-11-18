# Idea Research: Cây topic tự mở rộng — pilot nội bộ Toán 9

- **Slug**: topic-question-bank
- **Created**: 2026-11-13T09:28:39+07:00
- **Updated**: 2026-11-13 — bổ sung vòng 3 theo xác nhận lúc 22:41:08+07:00; các mô tả một lần chạy/Toán 9 bên dưới thuộc vòng 1, không phải phạm vi sản phẩm hiện tại.
- **Evidence confidence (overall)**: low
- **Method**: một phép thử AI Harness độc lập theo hai đợt, kiểm tra cấu trúc bằng chương trình và rà nội dung bởi agent chính. Không chạy model của ứng dụng, không đo người dùng thực và không triển khai tính năng. [source: research-protocol.md; experiment-stage2.json:256–268] (confidence: high; cited)
- **Scope correction**: nghiên cứu cũ dùng từ graph; người dùng sau đó chốt cây một cha, không chu trình, tự mở nhánh và tự phân loại lại, không giao quản trị topic cho giáo viên. Bản này thay bản nghiên cứu trước theo xác nhận trực tiếp. [source: hội thoại; problem.md:48–61; concept.md:37–46] (confidence: high; cited)

## Users & Demand

- Người dùng muốn tận dụng câu đã chốt và không muốn tính năng hỗ trợ tạo thêm việc phân loại. Đây là ý định trực tiếp của một người dùng, không phải hành vi đã quan sát hoặc số liệu thị trường. [source: hội thoại; problem.md:10–24] (confidence: high với ý định; cited)
- Người dùng đã cho phép dùng hai đề mẫu Toán 9 đóng gói cho vòng nghiên cứu này. Không suy rộng xác nhận đó thành phạm vi hỗ trợ mọi môn hay quyền truy cập đề riêng. [source: câu trả lời research-scope và overwrite-research trong hội thoại] (confidence: high; cited)
- Chưa có baseline thời gian, quan sát giáo viên duyệt/lưu/thay hoặc khảo sát nhiều người. Mục tiêu 0 thao tác quản trị là yêu cầu, chưa phải kết quả UX. [source: problem.md:33–42; research-protocol.md] (confidence: high; cited)

## Prior Art

- Hệ thống hiện có kho đề theo tài khoản, tài liệu HTML và liên kết đề–đáp án. Đó là nền tảng sẵn có, không chứng minh kho câu hỏi tự tổ chức đã được xây hoặc kiểm tra phân quyền. [source: db/migrations/0007_document_libraries.sql:1–9; lib/docs-store.tsx:18–41; nghiên cứu nội bộ vòng trước] (confidence: high; cited)
- Không nghiên cứu đối thủ hay thư viện bên ngoài trong vòng này; không có kết luận lợi thế cạnh tranh. [source: research-protocol.md, phạm vi thực hiện] (confidence: high; cited)

## Experiment & Observations

### Phương pháp và nguồn

- Trích 5 câu từ seedDoc rồi 20 câu từ sampleExamDoc, giữ HTML/LaTeX trong corpus. Chia theo nhãn Câu có sẵn bằng mã cục bộ; đây KHÔNG phải thử AI tách một đề bất kỳ. Lần trích đầu lỗi biến SAMPLE_EXAM_ID chưa định nghĩa trước khi ghi; đã bổ sung binding và trích thành công 5+20. [source: lib/docs-store.tsx:58–96; sample-corpus.json; research-protocol.md; log công cụ] (confidence: high; cited)
- Subagent được yêu cầu đọc riêng đợt A và lưu kết quả trước khi đọc đợt B. Không cung cấp taxonomy trước; có cung cấp quy tắc cây, cho phép câu ở cha và 6 cặp cần xét. Vì vậy đây là kiểm tra có hướng dẫn, KHÔNG phải tìm ứng viên mù hoặc đánh giá khả năng tự phát hiện mọi cặp thay. [source: giao việc subagent trong hội thoại; experiment-stage2.json:257,267; research-protocol.md] (confidence: high về quy trình được yêu cầu và báo cáo; cited)
- Chỉ một lần chạy Harness AI. Không kiểm tra lại nhiều seed/thứ tự đề, không chuyên gia độc lập chấm nhãn, không đo giá model hoặc độ trễ production. [source: research-protocol.md; experiment-stage2.json:268] (confidence: high; cited)

### Kiểm tra cấu trúc có thể tái chạy

| Kiểm tra | Đợt A: 5 câu | Đợt A+B: 25 câu |
|---|---:|---:|
| Tổng node, gồm gốc | 4 | 10 |
| Số gốc | 1 | 1 |
| Câu có đúng một assignment | 5/5 | 25/25 |
| Lỗi ID, tham chiếu cha/node, chu trình và độ phủ trong validator | 0 | 0 |
| Câu ở node có con | 0 | 7 |

Nguồn: experiment-validation.json; validate-experiment.py, chạy thành công (không có lỗi được báo, exit thành công). (confidence: high về cấu trúc của hai JSON này; cited). Không diễn giải thành độ chính xác học thuật 100% hoặc khả năng xử lý mọi dữ liệu.

- Giữ đủ 4 ID cũ; radicals và right-triangles từ lá thành cha. A1 chuyển vào nhánh ý nghĩa/tính chất căn, A3 vào nhánh biến đổi; A2 và A4 giữ ở cha. Nút tiếp tuyến được đưa dưới nút đường tròn mới, giữ ID và câu A5. [source: experiment-validation.json, changes; experiment-stage2.json:259–262] (confidence: high về thay đổi quan sát; cited)
- 7 câu giữ ở node không lá gồm A2, A4, B2, B8, B14, B17, B20. A4 là câu tổng hợp tính cạnh/đường cao/diện tích, không bị ép vào nhánh lượng giác mới. [source: experiment-validation.json; experiment-stage2.json:80–85,152–157,200–205,224–253] (confidence: high về gán thực tế; medium về hợp lý học thuật; cited)
- AI không yêu cầu giáo viên giải quyết phân loại trong hai đầu ra. Điều này chỉ chứng minh phép thử không xuất yêu cầu đó; chưa chứng minh một giao diện thực tế không phát sinh công việc. [source: experiment-stage1.json; experiment-stage2.json; protocol] (confidence: high về đầu ra; cited)

### Đối chứng gợi ý thay

| Cặp đã chỉ định | Kết quả AI | Rà nội dung nội bộ |
|---|---|---|
| A1 → B1 | compatible có điều kiện | Cùng nhận biết căn bậc hai số học; điểm A1 chưa rõ nên chưa đủ để tự thay bảo toàn điểm. |
| A2 → B2 | compatible có điều kiện | Cùng tìm điều kiện căn của x trừ hằng số; điểm A2 chưa rõ. |
| A3 → B3 | reject | Tự luận rút gọn phân thức chứa biến 2 điểm khác MC rút căn số 0,5 điểm. |
| A4 → B7 | reject | Tính nhiều đại lượng khác chọn giá trị sin, khác dạng và điểm. |
| A5 → B18 | reject | Chứng minh trung trực khác nhận biết tiếp tuyến vuông góc bán kính, khác dạng và điểm. |
| B15 → B16 | uncertain | Cùng tập nghiệm nhưng thao tác kiến thức khác; B15 có cách hỏi số ít và đáp án ghép hai nghiệm. |

Nguồn: sample-corpus.json; experiment-stage2.json:270–305; tiêu chí đối chứng ghi trong research-protocol.md trước khi nhận kết quả. (confidence: medium; cited). Đây là rà bởi AI/agent, không phải xác nhận chuyên gia độc lập. Không tính accuracy trên 6 cặp hoặc tỷ lệ tìm được ứng viên toàn kho; cặp đã được chỉ định và không có gold set độc lập.

- Hai cặp được xem là ứng viên sơ bộ, ba bị từ chối và một bất định. Không cặp nào được kiểm chứng tự thay trọn vẹn gồm đáp án, điểm và bố cục. [source: experiment-stage2.json:270–305; phạm vi protocol] (confidence: high về số lượng đầu ra; cited)

## Market & Context

- Lựa chọn hiện tại là tìm/soạn và tự kiểm tra câu theo từng lần, theo nhu cầu đã phát biểu; chưa có quan sát đo chi phí này. [source: problem.md:44–46] (confidence: low về mức chi phí; cited)
- Việc giữ câu ở mức cha có thể giảm ép nhãn sai và việc sửa phân loại; thử nghiệm cho thấy biểu diễn này khả dụng trên mẫu nhưng chưa chứng minh giảm thời gian sử dụng. [source: kết quả gán A2/A4; ASSUMPTION về lợi ích] (confidence: medium về biểu diễn; low về lợi ích)

## Data & Constraints

- Corpus gồm 25 câu mẫu, 5 ở đợt A (2 MC, 3 tự luận/chứng minh) và 20 MC ở B. Không có hình nhúng, đoạn đọc dùng chung hoặc nội dung mơ hồ do OCR. Mẫu không đại diện cho mọi kiểu đề. [source: sample-corpus.json] (confidence: high; cited)
- B có quy định chung mỗi câu 0,5 điểm. A1/A2 không ghi điểm riêng; AI giữ null thay vì tự chia tổng điểm phần. Chưa thử đồng bộ barem hoặc thay câu trong editor. [source: sample-corpus.json:6–18,34; experiment-stage2.json:56–69,266; protocol] (confidence: high; cited)
- AI chỉ trả tham chiếu câu và nhãn/thuộc tính, không biên tập HTML. Vì vậy không mất câu trong assignment, nhưng chưa chứng minh khâu trích xuất, lưu file ảnh, render LaTeX hoặc thay nội dung nguyên vẹn. [source: experiment-stage2.json:265; sample-corpus.json; validator] (confidence: high; cited)
- Không truy cập database riêng hoặc dùng API key, không gọi endpoint bên ngoài, không sửa production. Chi phí production chưa biết; không quy đổi thời gian toàn phiên nghiên cứu thành độ trễ tính năng. [source: protocol và phạm vi thao tác vòng này] (confidence: high về phạm vi; cited)

## Evidence Against the Idea

- Các câu chung một node vẫn khác kỹ năng/dạng/điểm: A3/B3 và A5/B18 là phản ví dụ cụ thể cho việc thay chỉ theo topic. [source: corpus; experiment-stage2.json:284–299] (confidence: high với khác biệt nội dung; cited)
- Hai cặp thuận lợi nhất vẫn thiếu điểm câu nguồn; không thể khẳng định tính năng đổi an toàn từ nhãn topic. [source: experiment-stage2.json:270–281] (confidence: high; cited)
- Mức phân nhánh còn mang tính phán đoán: AI giữ A2/B2 tại cha dù đã có hai câu cùng kỹ năng, còn mở nhánh lượng giác với B7/B13. Không có chính sách chất lượng/gold set để kết luận lựa chọn này tối ưu hoặc ổn định khi đổi thứ tự thêm dữ liệu. [source: experiment-stage2.json:69,109,260; ASSUMPTION về biến động cần thử] (confidence: medium)
- Một lần tạo JSON hợp lệ không chứng minh an toàn đồng thời, ổn định qua nhiều lần mở nhánh hoặc tự phục hồi lỗi. [source: protocol chỉ một pass; ASSUMPTION về yêu cầu vận hành chưa thử] (confidence: high về giới hạn, low về lỗi thực tế)
- Kho nhỏ chưa được chứng minh đủ ứng viên và chưa đo việc duyệt nội dung có tiết kiệm công. Mục tiêu không tạo thêm việc vẫn là giả thuyết hiệu quả. [source: problem.md:33–42; phép thử không có người dùng] (confidence: high; cited)

## Gaps & Open Questions

- [NEEDS CLARIFICATION: Thao tác chốt/đồng ý lưu, sửa sau chốt và phạm vi đáp án/barem của pilot. Không mở lại câu hỏi ai quản trị cây: hệ thống tự làm đã chốt.]
- [NEEDS CLARIFICATION: Ngưỡng chất lượng, độ trễ, chi phí và tiêu chí tương đương được chấp nhận; chưa có mục tiêu số được chủ sản phẩm đồng ý.]
- [NEEDS CLARIFICATION: Tập đối chứng độc lập và lặp lại trên nhiều thứ tự đợt nhập; chưa kiểm tra model cấu hình trong ứng dụng.]
- [NEEDS CLARIFICATION: Phạm vi câu có hình/dữ kiện chung, câu lỗi/mơ hồ và missing barem; mẫu lần này không bao phủ.]
- [NEEDS CLARIFICATION: Baseline tìm/thay và quan sát luồng không tạo thao tác quản trị; chưa có usability test.]

## Sources

Tất cả là nguồn hội thoại hoặc tệp nội bộ; không có web fetch/search nên không có nhánh URL allowlist cần áp dụng. Không đọc secrets hoặc đề riêng. Các đường dẫn dưới tính từ gốc dự án.

- Hội thoại: xác nhận dùng mẫu Toán 9 và ghi đè nghiên cứu; chốt cây tự tổ chức trước đó.
- `.specify/assessments/topic-question-bank/problem.md` — yêu cầu, không phải kết quả đo.
- `.specify/assessments/topic-question-bank/concept.md` — hướng B, không phải triển khai.
- `.specify/assessments/topic-question-bank/research-protocol.md` — phương pháp/đối chứng.
- `.specify/assessments/topic-question-bank/sample-corpus.json` — corpus 5+20.
- `.specify/assessments/topic-question-bank/experiment-stage1.json` — đầu ra đợt A.
- `.specify/assessments/topic-question-bank/experiment-stage2.json` — đầu ra A+B và 6 cặp.
- `.specify/assessments/topic-question-bank/experiment-validation.json` — kết quả kiểm tra cấu trúc.
- `.specify/assessments/topic-question-bank/validate-experiment.py` — chương trình kiểm tra, không mã production.
- `lib/docs-store.tsx:18–41,58–112` — nguồn mẫu và liên kết đáp án.
- `db/migrations/0007_document_libraries.sql:1–9` — nền tảng kho đề theo tài khoản từ rà nội bộ trước.

## Round 2 — tìm ứng viên không chỉ định cặp trước

### Phạm vi và tín hiệu người dùng mới

- Người dùng xác nhận chốt và lưu có duyệt nội dung; sửa đề sau đó không tự ghi đè câu đã lưu, chỉ cập nhật khi xác nhận lại. Đây là lựa chọn trải nghiệm, không phải quan sát hành vi thực. [source: câu trả lời save-semantics trong hội thoại; round2-protocol.md] (confidence: high; cited)
- Người dùng giữ 25 câu Toán 9 cho nghiên cứu và giao nhóm phát triển đề xuất tiêu chí trước; chưa duyệt ngưỡng chất lượng/chi phí/độ trễ. Không tự suy thành phạm vi phát hành. [source: next-study-scope, research-acceptance trong hội thoại; round2-protocol.md] (confidence: high; cited)

### Phương pháp và kết quả

- Ghi protocol trước đầu ra; hai agent độc lập chỉ đọc corpus, không xem cây, cặp cũ hoặc kết quả của nhau. Một agent tìm tối đa ba ứng viên cho từng câu; agent còn lại xét toàn bộ 300 cặp không thứ tự. Đây là rà độc lập giữa agent, KHÔNG phải gold set chuyên gia độc lập hoặc thử model ứng dụng. [source: round2-protocol.md; giao việc và báo cáo hai subagent; round2-retrieval.json, method; round2-reference.json, limitations] (confidence: high về quy trình; cited)
- Tiêu chí đề xuất: cùng mục tiêu/kỹ năng và nhiệm vụ, hình thức trả lời, điểm đã biết, phụ thuộc, lỗi nhìn thấy, đáp án có sẵn; thiếu dữ kiện thì giữ unknown. Phân biệt ứng viên sư phạm với thay trọn vẹn. Đây chưa phải ngưỡng nghiệm thu đã được người dùng duyệt. [source: round2-protocol.md] (confidence: high; cited)

| Quan sát | Kết quả |
|---|---:|
| Câu nguồn được xét | 25/25 |
| Liên kết ứng viên có hướng | 21 |
| Cặp ứng viên phân biệt, bỏ hướng | 11 |
| Câu nguồn có ít nhất một ứng viên | 15 |
| Câu nguồn không có ứng viên | 10 |
| Cặp được agent tham chiếu xét | 300/300 |
| Cặp tham chiếu plausible_conditional / reject | 2 / 298 |
| Liên kết truy hồi được tham chiếu xem là plausible_conditional / reject | 4 / 17 |
| Thay trọn vẹn đã xác minh | 0 |

Nguồn: round2-retrieval.json; round2-reference.json; round2-comparison.json. Kiểm tra bằng chương trình xác nhận đủ ID nguồn, không ứng viên tự trỏ/ID ngoài corpus, không lặp trong mỗi danh sách, đủ 300 cặp phân biệt; lỗi kiểm tra: []. (confidence: high về số lượng/cấu trúc; cited). Không tính accuracy hay recall từ bảng này: nhãn tham chiếu cũng là phán đoán AI.

- Hai cặp cùng được nhận diện là A1/B1 và A2/B2, tương ứng 4 liên kết hai chiều. Điểm A1/A2 còn thiếu và corpus không cung cấp đáp án/barem đã xác minh; không tuyên bố có thể thay an toàn. [source: round2-comparison.json; sample-corpus.json:6–18,34–42] (confidence: medium về phù hợp sư phạm; high về thiếu dữ kiện; cited)
- Bất đồng đáng chú ý: truy hồi đưa A4→B7 vì cùng tính trong tam giác vuông, dù nguồn hỏi cả BC, AH và diện tích còn đích hỏi sin B. Đây là đối chiếu nội dung cho thấy gợi ý theo kỹ năng thành phần không bao phủ toàn mục tiêu nguồn. A3↔B19 cũng chỉ chia sẻ phép biến đổi liên hợp, khác tự luận/MC và điểm. [source: round2-comparison.json; sample-corpus.json:17–22,61–62,109–110] (confidence: high về khác biệt nội dung; cited)
- Các cặp B3/B10, B7/B13 và B9/B16 cho thấy ranh giới “cùng kỹ năng” còn chưa thống nhất: có kỹ năng chung nhưng khác số bước hoặc nhiệm vụ. Không coi 17 liên kết bị tham chiếu từ chối là 17 lỗi học thuật đã được chuyên gia xác nhận. [source: round2-comparison.json] (confidence: medium; cited)

### Evidence Against — bổ sung

- Tìm tự do tạo nhiều gợi ý chỉ phù hợp một phần; nhãn conditional có thể che khoảng cách nhiệm vụ nếu được trình bày như câu thay tương đương. Vòng này thấy 17/21 liên kết có bất đồng với agent tham chiếu, nhưng chưa có chuẩn độc lập để phân xử tất cả. [source: round2-retrieval.json, method.status_semantics/retrieval_policy; round2-comparison.json] (confidence: high về bất đồng; medium về rủi ro diễn giải; cited)
- Với cách xét chặt của agent tham chiếu, kho 25 câu chỉ có hai cặp ứng viên còn điều kiện; kho nhỏ có thể không đủ lựa chọn hữu ích. Đây là giới hạn quan sát trên corpus này, không suy rộng thành mọi kho đều thiếu câu. [source: round2-reference.json, summary/reviews] (confidence: medium; cited)

### Giới hạn và phần còn thiếu sau vòng 2

- Vòng 2 bổ sung tìm ứng viên không chỉ định cặp; KHÔNG bổ sung lặp cây nhiều thứ tự, AI tách đề, model ứng dụng, chi phí/độ trễ production, thay nội dung/đáp án trọn vẹn hay quan sát giáo viên. Không dùng thời gian chờ agent làm latency tính năng. [source: round2-protocol.md; phạm vi và đầu ra hai agent] (confidence: high; cited)
- Chưa có chuyên gia độc lập hoặc đáp án chuẩn trong corpus; hai agent có thể mắc lỗi tương quan. Không gọi đầu ra tham chiếu là gold set đã nghiệm thu. [source: round2-reference.json, limitations; round2-protocol.md] (confidence: high; cited)
- Điểm chốt/lưu/sửa đã có câu trả lời; không tiếp tục hỏi lại như một blocker chưa được người dùng quyết định. Ngưỡng chấp nhận, phạm vi phát hành, xử lý phụ thuộc/thiếu barem, baseline và mức tiết kiệm vẫn mở. [source: câu trả lời mới; problem.md, Open Questions] (confidence: high; cited)
- Đề xuất tiêu chí để xem xét tiếp: chấm riêng độ phủ nhiệm vụ, hình thức/điểm, dữ kiện–đáp án, khả năng từ chối khi thiếu căn cứ; báo số trường hợp đủ/thiếu ở từng trục, không gộp thành một nhãn tự tin. Đây là đề xuất phương pháp đo, không phải thiết kế sản phẩm hay ngưỡng đã duyệt. [ASSUMPTION: cách đo này làm rõ bất đồng tốt hơn một nhãn duy nhất] (confidence: low; assumption)

### Sources — vòng 2

- [Protocol](round2-protocol.md), [truy hồi](round2-retrieval.json), [tham chiếu AI](round2-reference.json), [đối chiếu và kiểm tra](round2-comparison.json), [corpus](sample-corpus.json); xác nhận trực tiếp của người dùng trong hội thoại. Không có URL ngoài, API ứng dụng, bí mật hoặc dữ liệu đề riêng được sử dụng trong vòng này. [source: phạm vi giao việc và báo cáo công cụ] (confidence: high; cited)

## Round 3 — tổ chức đa lĩnh vực và giữ các thành phần nguồn

### Users & Demand / thay đổi phạm vi

- Người dùng chọn B: kho riêng, AI tự tổ chức cây, không giới hạn lĩnh vực; thiếu đáp án/barem/điểm vẫn lưu; hoãn toàn bộ tìm/đổi câu. Đây là quyết định sản phẩm, không phải bằng chứng hành vi hoặc chất lượng AI. [source: hội thoại xác nhận phương án B; problem.md; concept.md] (confidence: high; cited)
- Người dùng cho phép cập nhật nghiên cứu và dùng mẫu tổng hợp; không dùng đề riêng hoặc gọi API ứng dụng trả phí. [source: xác nhận trong hội thoại; round3-protocol.md] (confidence: high; cited)

### Phương pháp / Prior Art

- Ghi protocol trước kết quả. Corpus mới có 16 câu tự tạo, 23 thành phần nguồn; nội dung liên quan đại số, chuyển động, hóa học, sinh học, nguồn tư liệu/lịch sử, ngôn ngữ, thuật toán, phần trăm/kinh tế và đo lường. Có câu tổng hợp Q13/Q15, đoạn P1 dùng chung, hình SVG/dữ kiện Q14, công thức và các ý phụ. Tất cả đáp án/barem/điểm là null. Không phải mẫu đề thực hoặc mẫu đại diện mọi lĩnh vực. [source: round3-protocol.md; round3-corpus.json] (confidence: high; cited)
- Hai agent độc lập đọc protocol/corpus, không đọc kết quả của nhau. A xét Q01–Q08 rồi thêm Q09–Q16; B đảo hai đợt. Agent dùng cây tự tạo của đợt đầu để lập snapshot cộng dồn, không được cấp taxonomy. **Cả hai đọc chung file chứa đủ 16 câu ngay từ đầu: không phải thí nghiệm che giấu nội dung tương lai hoặc nhập tăng dần được khóa cơ học.** Khác biệt giữa hai lần còn trộn ảnh hưởng thứ tự với khác biệt agent, không suy quan hệ nhân quả. [source: round3-order-a.json, method/limitations; round3-order-b.json, method/limitations; báo cáo hai agent] (confidence: high về quy trình được báo cáo; cited)
- Đây là thử nghiệm Harness, không phải thử hệ thống sản phẩm hay model ứng dụng. Không bổ sung nghiên cứu đối thủ/thị trường. [source: round3-protocol.md; báo cáo agent] (confidence: high; cited)

### Kết quả cấu trúc và đối chiếu

| Kiểm tra | Thứ tự A | Thứ tự B |
|---|---:|---:|
| Số node sau đợt đầu → cuối | 12 → 15 | 10 → 15 |
| Câu có một assignment sau đợt đầu → cuối | 8/8 → 16/16 | 8/8 → 16/16 |
| Câu cũ đổi node khi thêm đợt hai | Q02 | Q15 |
| Lỗi trong validator | 0 | 0 |
| Đơn vị giữ nội dung đủ component theo fixture | 16/16 | 16/16 |
| Yêu cầu giáo viên quản trị phân loại trong đầu ra | 0 | 0 |

Nguồn: round3-validation.json, sinh bằng round3-validate.py, exit code 0. Validator kiểm tra một gốc, tham chiếu cha, chu trình, độ phủ/duy nhất của câu, component bắt buộc, giá trị null và payload nguồn lắp từ tham chiếu. (confidence: high về các đầu ra này; cited). Không suy thành 100% độ đúng phân loại hoặc bảo toàn nội dung trong sản phẩm.

- Trong 120 cặp không thứ tự, hai đầu ra cuối đều có 4 cặp cùng node; không có bất đồng cùng-node. Phần lớn cặp cùng được tách riêng, nên không dùng 120/120 để tuyên bố accuracy hoặc độ ổn định ngữ nghĩa. Quan hệ cha, cách đặt nhãn và vị trí câu tổng hợp vẫn khác. [source: round3-validation.json, comparison; hai output] (confidence: high về đếm; cited)
- A chuyển Q02 vào nhánh tốc độ cùng Q10; Q15 tổng hợp thuật toán/phần trăm ở gốc. B chuyển Q15 từ gốc sang cha chung thuật toán/phần trăm, dưới đó Q07/Q08 ở hai nhánh riêng. Cả hai giữ Q13 phân tích tư liệu/ngôn ngữ ở cha. Đây là ví dụ không ép câu tổng hợp vào lá, nhưng tính hữu ích của những cha rộng chưa được người dùng/chuyên gia đánh giá. [source: round3-order-a.json; round3-order-b.json; báo cáo agent] (confidence: high về vị trí; low về hữu ích; cited)

### Giữ nội dung — kết quả và giới hạn chính xác

- Cả hai output giữ đủ các ID component khai báo cho 16/16 câu, gồm P1 cho Q05/Q06/Q13 và hình F1, F1-data, các ý a/b cho Q14; đáp án/barem/điểm vẫn null. Lắp nội dung trực tiếp từ component nguồn cho hash trùng nguồn ở 16/16 đơn vị mỗi đầu ra. [source: round3-corpus.json; round3-validation.json, runs.*.bundle_sha256] (confidence: high; cited)
- **Đây là giữ tham chiếu/lắp nguồn xác định, không phải phép thử AI trích xuất nguyên vẹn.** Corpus đã khai báo required_components; agent chỉ cần chọn/giữ các ID. Không kiểm chứng AI tự nhận diện phụ thuộc, tách đề thô, hình render đúng, lưu file thật hoặc nội dung SVG hiển thị đúng trong editor. Hash trùng không thể chứng minh những điều đó. [source: round3-protocol.md; round3-validate.py; limitations hai output] (confidence: high; cited)

### Evidence Against the Idea — vòng 3

- Cùng dữ liệu nhưng Q15 ở gốc trong A và dưới cha riêng trong B; tên/độ rộng topic là phán đoán AI, không có gold độc lập. Thống nhất cùng-node không loại bỏ khác biệt trải nghiệm duyệt. [source: hai output; round3-validation.json] (confidence: high về khác biệt; medium về rủi ro; cited)
- Nhìn trước toàn bộ corpus làm yếu bằng chứng nhập tăng dần; không thể kết luận agent xử lý tốt các câu thật sự chưa từng thấy. [source: limitations/báo cáo hai agent] (confidence: high; cited)
- Fixture có sẵn ID và phụ thuộc khiến phép thử bảo toàn thuận lợi hơn việc trích từ đề thật. Chưa có bằng chứng trực tiếp cho rủi ro tách thiếu ngữ cảnh — một khoảng trống quan trọng, không được che bằng hash. [source: round3-corpus.json; round3-protocol.md] (confidence: high; cited)
- Nhiều node so với 16 câu và cha rộng có thể làm duyệt rườm rà; chưa có dữ liệu hành vi để xác nhận hoặc bác bỏ. [ASSUMPTION: độ phân mảnh có thể giảm tiện ích] (confidence: low; assumption)

### Market & Context / Data & Constraints

- Vòng này không đo baseline lưu/tìm lại, thị trường, chi phí hay latency production; không lấy thời gian Harness thay thế. Không truy cập database riêng, secrets hoặc sửa sản phẩm. [source: phạm vi protocol; công cụ thực thi và báo cáo agent] (confidence: high; cited)
- Đầu ra không yêu cầu thao tác phân loại chỉ là thuộc tính thử nghiệm, không chứng minh UX sản phẩm đạt 0 thao tác. Hai agent không phải hai chuyên gia độc lập, có thể mắc lỗi tương quan. [source: output/limitations; ASSUMPTION về tương quan lỗi] (confidence: high về giới hạn phép thử, low về mức tương quan; cited/assumption)

### Gaps & Open Questions — cập nhật sau vòng 3

- [NEEDS CLARIFICATION: Kiểm tra đầu vào thô có dữ kiện chung/hình/công thức để đo AI tự nhận diện phụ thuộc và bảo toàn, không cấp sẵn required_components. Vòng 3 mới kiểm tra giữ tham chiếu nguồn.]
- [NEEDS CLARIFICATION: Mức hữu ích/ổn định khi có nội dung thực sự chưa thấy, thêm nhiều đợt và đổi thứ tự trong điều kiện tách riêng ảnh hưởng agent. Hai snapshot trên corpus đã nhìn trước không đủ kết luận.]
- [NEEDS CLARIFICATION: Phạm vi định dạng đầu tiên, model ứng dụng, baseline lưu/tìm lại, chi phí và giới hạn vận hành; nhóm phát triển đề xuất theo ủy quyền người dùng, không hỏi lại phạm vi lĩnh vực/thiếu barem/hoãn đổi câu.]
- Quyền riêng tư, không ghi đè bản đã giữ và lưu bền chưa được thử ở vòng nghiên cứu này; phải kiểm chứng ở luồng sản phẩm. [source: round3-protocol.md; limitations hai output] (confidence: high; cited)

### Sources — vòng 3

- [Protocol](round3-protocol.md), [corpus tổng hợp](round3-corpus.json), [thứ tự A](round3-order-a.json), [thứ tự B](round3-order-b.json), [validator](round3-validate.py), [kết quả kiểm tra](round3-validation.json); quyết định trực tiếp và báo cáo agent trong hội thoại. Không fetch URL hoặc nguồn bên ngoài. [source: log thao tác vòng 3] (confidence: high; cited)

## Round 4 — đầu vào thô và đợt thêm chưa được nhìn trước

- Theo ủy quyền tự chủ mới nhất, dùng HTML tự tạo, không dùng đề riêng/API trả phí. Agent A chỉ đọc batch A; batch B được tạo **sau khi A kết thúc**. Agent B độc lập đọc nguồn A, snapshot A và nguồn B. Vì vậy loại được nhìn trước B ở bước A, nhưng vẫn chưa tách ảnh hưởng khác agent và chưa là thử nghiệm sản phẩm. [source: round4-protocol.md; log tạo file và hoàn thành agent] (confidence: high; cited)
- A trích 6 câu từ HTML thô bằng khoảng ký tự nguồn; tự giữ blockquote dùng chung cho A1/A2. B thêm 4 câu, giữ figure/SVG/caption và các ý của B1; tái sử dụng nhánh phương trình cho B2, mở nhánh hình học và thuật toán. Không cung cấp required_components hay taxonomy. [source: round4-stage-a.json; round4-stage-b.json; round4-batch-a.html; round4-batch-b.html] (confidence: high về đầu ra; cited)
- Validator độc lập cho 0 lỗi ở cả hai stage, 6→10 câu đủ thân câu nguyên văn, P1 chung/figure và null metadata; không có thay đổi nội dung 6 câu cũ; cây một gốc/không chu trình/tham chiếu hợp lệ. [source: round4-validate.py; round4-validation.json; exit code 0] (confidence: high về phép kiểm fixture; cited)
- Evidence Against: rất ít dữ liệu, câu đánh số rõ, HTML sạch, không có câu rải nhiều đoạn hoặc bảng phức tạp. Tree A có 11 node cho 6 câu; B có 16 node cho 10 câu: chưa biết mức phân mảnh có hữu ích. Không có đánh giá giáo viên/gold độc lập; agent B không di chuyển câu cũ nên phép thử không chứng minh tái phân loại cũ thành công. [source: hai batch; hai snapshot; ASSUMPTION về hữu ích] (confidence: high về số liệu, low về hữu ích; cited/assumption)
- Kết quả bổ sung bằng chứng hẹp rằng có thể nhận phụ thuộc từ nguồn thô và mở rộng cây khi chưa biết dữ liệu tương lai. Chưa kiểm chứng HTML editor thật, sanitation/rendering, sản phẩm lưu bền/cách ly tài khoản, latency/cost hoặc model ứng dụng. Các rủi ro đó giữ nguyên để nghiệm thu, không chuyển thành kết quả đã đạt. [source: round4-protocol.md; round4-validation.json] (confidence: medium về khả thi hẹp; high về giới hạn; cited)
- Overall confidence giữ low cho hiệu quả sản phẩm; bằng chứng khả thi biểu diễn/trích phụ thuộc trên fixture là medium, không đại diện mọi lĩnh vực/định dạng. [source: vòng 1/3/4; giới hạn trên] (confidence: medium; cited)

Sources vòng 4: [protocol](round4-protocol.md), [nguồn A](round4-batch-a.html), [snapshot A](round4-stage-a.json), [nguồn B](round4-batch-b.html), [snapshot B](round4-stage-b.json), [validator](round4-validate.py), [validation](round4-validation.json). Không truy cập URL ngoài. (confidence: high; cited)

## Next Step

`/speckit-assess-define slug=topic-question-bank`

Phạm vi problem/concept đã cập nhật, không cần hỏi lại lựa chọn sản phẩm; chỉ cập nhật giới hạn bằng chứng khi được phép. Có thể dùng kết quả này làm đầu vào đánh giá lại, nhưng nghiên cứu không sửa verdict hoặc tự cho phép triển khai. Tổng thể evidence confidence giữ low: có thêm bằng chứng đa lĩnh vực về biểu diễn và giữ tham chiếu, chưa có trích xuất đầu vào thô hoặc kiểm chứng sản phẩm.
