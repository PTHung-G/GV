# Bug Assessment: Đồng bộ soạn đề – thư viện – chấm bài

- **Slug**: exam-grading-sync (đã hỏi và được người dùng chấp thuận)
- **Created**: 2026-11-12T10:40:24+00:00
- **Source**: pasted text — yêu cầu trực tiếp trong hội thoại
- **Verdict**: valid
- **Severity**: high
- **Phạm vi**: chỉ đọc mã nguồn, chạy test và tái hiện parser trong bộ nhớ; chưa sửa nguồn, chưa triển khai, chưa thao tác chấm trên dữ liệu thật.

## Report (verbatim or summarized)

> “xem lại phần chấm điểm đang có vấn đề gì chưa đồng nhất được giữa soạn đề - thư viện - chấm bài. Có những gì chưa đồng bộ”
>
> “check xem có gì chưa đồng bộ, có gì chưa thuận tiện cho người dùng, và có gì đang thừa thãi về mặt cả UI và backend nha”.

## Symptom

Ba mô-đun chưa dùng cùng một hợp đồng dữ liệu đề–đáp án–barem có phiên bản. Có lỗi làm mất đáp án/ý chấm, giữ nhầm barem sau đổi đề, và các trạng thái duyệt/chốt không đảm bảo dữ liệu đã đầy đủ hoặc bất biến. Ngoài ra, đề lưu trình duyệt không đồng bộ theo tài khoản như đợt chấm; thao tác thư viện chưa quản lý đề và barem như một bộ.

Mong đợi: barem đã xác nhận đi xuyên suốt hành trình mà không cần AI đoán lại; mỗi kết quả truy được về đúng phiên bản đề, barem và ảnh đầu vào; lịch sử đã chốt không đổi âm thầm.

## Method and verification

- Đọc các đường mã editor, local document store, thư viện cá nhân/cộng đồng, wizard, API, rubric, submission, worker, vision, SQL và đối chiếu [tài liệu chấm bài](</home/dsh/trangchugiaovien/docs/cham-bai.md>).
- Chạy `pnpm exec playwright test e2e/unit/answer-key-html.spec.ts e2e/unit/scores.spec.ts --workers=2`: **17/17 passed**, exit code 0. Đây là test logic parser/điểm hiện có, không phải xác nhận toàn bộ hành trình.
- Transpile parser TypeScript trong bộ nhớ, không ghi source: bảng ngang đúng cấu trúc editor với 1=A, 2=B → `[]`; hàng tự luận → `[]`; bảng dọc có điểm nguyên `2` → câu có đáp án nhưng không có points.
- Các phát hiện backend còn lại dựa trên đường thực thi mã nguồn, **chưa tái hiện API trên DB thật**. Các nhận định responsive dựa trên breakpoint trong mã, **chưa kiểm tra trình duyệt/điện thoại**.
- Hai rà soát độc lập: backend và UI/thư viện; đã đối chiếu các phát hiện vào báo cáo này.

## Findings and Suspected Code Paths

Quy ước: **P1/high** sửa trước khi tin cậy điểm chính thức; **P2/medium** sửa kế tiếp; **P3/low** giản lược và vệ sinh. Mỗi mục nêu riêng lỗi, giới hạn hoặc nhận định UX, không coi mọi tính năng chưa có là bug.

### A. Không đồng bộ và nguy cơ chấm sai

**A1 — P1/high, đã tái hiện: bảng đáp án do editor tạo không nhập được vào grading.**

Editor xuất bảng ngang “Câu | 1 | 2” / “Đáp án | A | B”; parser yêu cầu số câu và chữ đáp án nằm cùng hàng. Fallback không ghép được các ô `<p>`. Wizard vẫn đi tiếp khi kết quả rỗng. Barem đã có buộc phải nhập/tạo lại, có thể khác bản giáo viên đã lưu. Bộ đề mẫu dùng bảng dọc nên che khuất lỗi ở hành trình demo.

Bằng chứng: [editor:311–362](</home/dsh/trangchugiaovien/components/editor/editor-workspace.tsx#L311-L362>), [parser:49–79](</home/dsh/trangchugiaovien/lib/grading/answer-key-html.ts#L49-L79>), [wizard:232–237](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L232-L237>), [key mẫu:100–105](</home/dsh/trangchugiaovien/lib/docs-store.tsx#L100-L105>).

**A2 — P1/high, đã tái hiện mất tự luận: barem tự luận không được chuyển sang.**

Editor có bảng `data-rubric`, nhưng parser chỉ lấy A–D và không đọc ý chấm. Với key hỗn hợp có bảng MC dọc đọc được, wizard nhận phần MC như toàn bộ danh sách, không báo mất phần tự luận; chế độ chấm suy ra từ danh sách đó có thể thành MC-only. Với key editor hiện tại, bảng ngang còn làm mất cả MC như A1.

Bằng chứng: [editor:365–428](</home/dsh/trangchugiaovien/components/editor/editor-workspace.tsx#L365-L428>), [parser:9–11](</home/dsh/trangchugiaovien/lib/grading/answer-key-html.ts#L9-L11>), [wizard:171–173](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L171-L173>), [wizard:232–237](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L232-L237>).

**A3 — P1/high, mã nguồn: thay nguồn/nội dung đề có thể giữ barem của đề cũ.**

`pickExam` xóa questions, nhưng chuyển mine/external và sửa đề ngoài thì không. `goToRubric` không xóa questions nếu đề mới không có key/không parse được. Submit ghép draft hiện tại với questions còn giữ. Chuỗi tái hiện suy ra: nạp barem A → quay lại → đổi sang đề ngoài B → tiếp tục → questions vẫn của A. Cần ràng buộc barem với fingerprint/revision nguồn, không chỉ reset theo một nút chọn đề.

Bằng chứng: [wizard:221–237](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L221-L237>), [đổi nguồn:404–415](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L404-L415>), [submit:313–329](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L313-L329>).

**A4 — P1/high, mã nguồn: đề, barem và ảnh không có cơ chế mất hiệu lực theo phiên bản.**

Sửa câu hỏi/đáp án lựa chọn chỉ cập nhật HTML đề; key chỉ nối qua parentId, không có hash/revision để báo cũ. Sửa/tạo barem trong wizard không cập nhật bộ barem tái sử dụng ở thư viện. Điều đó không có nghĩa phải tự động ghi đè hai chiều: cần phân biệt “bản nguồn”, “bản nháp” và “bản dùng riêng cho đợt”, có thao tác xuất bản lại rõ ràng.

Bằng chứng: [model tài liệu:15–35](</home/dsh/trangchugiaovien/lib/docs-store.tsx#L15-L35>), [save editor:208](</home/dsh/trangchugiaovien/components/editor/editor-workspace.tsx#L208>), [wizard:138–156](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L138-L156>), [tạo barem cục bộ:240–254](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L240-L254>).

**A5 — P1/high, mã nguồn: tài liệu không tách theo tài khoản, không đồng bộ thiết bị.**

Tất cả đề/key dùng một localStorage key cố định, load một lần, không reset theo user. Khác tài khoản cùng trình duyệt thấy cùng kho cục bộ; cùng tài khoản ở thiết bị khác không có đề nhưng vẫn có các đợt chấm server. Quota error bị bỏ qua, trong khi editor báo “Đã lưu vào tài khoản”. Đây vừa là lệch persistence/ownership vừa là phản hồi lưu không đáng tin.

Bằng chứng: [store:47–49](</home/dsh/trangchugiaovien/lib/docs-store.tsx#L47-L49>), [store:115–141](</home/dsh/trangchugiaovien/lib/docs-store.tsx#L115-L141>), [sessions theo owner:120–154](</home/dsh/trangchugiaovien/lib/grading/sessions.ts#L120-L154>), [nhãn đã lưu:547–551](</home/dsh/trangchugiaovien/components/editor/editor-workspace.tsx#L547-L551>).

**A6 — P1/high, mã nguồn: confirm/finalize chưa đảm bảo đủ dữ liệu.**

PATCH confirm đặt các phần áp dụng và submission thành confirmed mà không kiểm tra đủ trang, danh tính, job hay đủ ý/điểm. Finalize chỉ đếm submission status. Vì vậy có đường chốt bài chưa đủ điểm hoặc MC chưa đọc bị hiểu như bỏ trắng. Cần validation backend tập trung, không chỉ sửa nút trên UI.

Bằng chứng: [confirm:205–221](</home/dsh/trangchugiaovien/app/api/grading/submissions/[id]/route.ts#L205-L221>), [tính điểm:169–212](</home/dsh/trangchugiaovien/lib/grading/scores.ts#L169-L212>), [finalize:23–37](</home/dsh/trangchugiaovien/app/api/grading/sessions/[id]/finalize/route.ts#L23-L37>).

**A7 — P1/high, mã nguồn: “Đã chốt” chưa khóa thay đổi.**

Finalize chỉ đổi status; quyền teacher không kiểm tra trạng thái đợt. Các đường sửa điểm/đáp án, regrade, xóa bài, thêm trang và worker chưa có hàng rào chung chống ghi sau chốt. Điểm xuất trước/sau chốt có thể khác; job đang chạy có thể commit sau chốt. Cần mở lại có audit và khóa/kiểm tra revision tại commit, tránh race.

Bằng chứng: [finalize:40–53](</home/dsh/trangchugiaovien/app/api/grading/sessions/[id]/finalize/route.ts#L40-L53>), [access:53–58](</home/dsh/trangchugiaovien/lib/grading/access.ts#L53-L58>), [regrade:224–246](</home/dsh/trangchugiaovien/app/api/grading/submissions/[id]/route.ts#L224-L246>), [worker context:47–52](</home/dsh/trangchugiaovien/lib/grading/grade.ts#L47-L52>).

**A8 — P1/high, mã nguồn: bổ sung trang không vô hiệu điểm cũ; hoàn tất lại không tạo job mới.**

AddPage chỉ tăng page_count; complete chỉ đổi draft sang processing. Job dùng idempotency key cố định và on-conflict-do-nothing, kể cả job cũ đã succeeded. Chuỗi suy ra: chấm 1 trang → bổ sung trang 2 → Xong bài → điểm vẫn theo trang cũ. Cần input revision và regrade/invalidation tường minh.

Bằng chứng: [add/complete:337–364](</home/dsh/trangchugiaovien/lib/grading/submissions.ts#L337-L364>), [enqueue:51–57](</home/dsh/trangchugiaovien/app/api/grading/submissions/[id]/complete/route.ts#L51-L57>).

**A9 — P1/high, mã nguồn: ngữ cảnh chấm thiếu đề và bị giới hạn 4 trang không cảnh báo.**

Chấm tự luận nhận rubric và ảnh bài, không nhận exam_html dù snapshot có lưu. Barem ngắn có thể không đủ giả thiết/hình. Riêng loadPages giới hạn 4 trang; phần bài ở trang 5 trở đi không đến model. Hai lỗi cần sửa độc lập: gửi đúng ngữ cảnh đề/câu/hình và không âm thầm cắt trang.

Bằng chứng: [context/pages:25–75](</home/dsh/trangchugiaovien/lib/grading/grade.ts#L25-L75>), [vision payload:227–237](</home/dsh/trangchugiaovien/lib/grading/vision.ts#L227-L237>).

**A10 — P2/medium, tái hiện một phần: điểm MC được suy đoán thay vì lấy từ thang điểm đề.**

API AI yêu cầu không trả points cho MC; wizard mặc định 0,5/câu. Parser bỏ ô điểm nguyên không có chữ đ. Wizard không gửi expectedTotal dù backend hỗ trợ. Ví dụ 40 câu có thể thành tổng 20 nếu giáo viên bỏ sót chỉnh sửa; không khẳng định mọi đề phải có tổng 10. Cần cấu hình tổng mong muốn/điểm mỗi câu và xác nhận rõ, không tự áp một chuẩn duy nhất.

Bằng chứng: [AI contract:26–28](</home/dsh/trangchugiaovien/app/api/exam-answer-key/route.ts#L26-L28>), [wizard adapter:48–83](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L48-L83>), [parser points:27–36](</home/dsh/trangchugiaovien/lib/grading/answer-key-html.ts#L27-L36>), [create:227](</home/dsh/trangchugiaovien/lib/grading/sessions.ts#L227>).

**A11 — P2/medium, mã nguồn: AI tạo key có thể nhận thiếu đề mà không báo.**

Input bị slice 12.000 ký tự, output giới hạn 4.000 token; parse thất bại có thể trả 200 với questions rỗng. Cần báo truncation, kiểm tra độ phủ câu và xử lý lỗi có cấu trúc; không coi HTTP 200 là key đầy đủ. Route này chưa requireUser dù dùng tài nguyên AI — cần rà soát auth/quota trước mở public.

Bằng chứng: [route:63–89](</home/dsh/trangchugiaovien/app/api/exam-answer-key/route.ts#L63-L89>), [parse:99–151](</home/dsh/trangchugiaovien/app/api/exam-answer-key/route.ts#L99-L151>).

**A12 — P2/medium, mã nguồn: job thất bại và UI không cùng trạng thái.**

Worker hết retry chỉ cập nhật jobs, không đánh failed ở phần/bài. SSE workspace chỉ refetch danh sách khi số submissions hoặc confirmed đổi, không khi processing→needs-review/failed hay điểm đổi. EssayTab tải review theo session.id, không tự theo cập nhật submissions. Có thể thấy số tiến độ mới nhưng dòng bài/điểm vẫn cũ cho đến khi refresh/chuyển tab.

Bằng chứng: [worker:77–108](</home/dsh/trangchugiaovien/lib/server/jobs.ts#L77-L108>), [SSE:101–110](</home/dsh/trangchugiaovien/components/grading/workspace.tsx#L101-L110>), [essay load:54–69](</home/dsh/trangchugiaovien/components/grading/essay-tab.tsx#L54-L69>).

### B. Thư viện và trải nghiệm chưa liền mạch

**B1 — P2/medium: thư viện cộng đồng sao chép bản xem trước như đề hoàn chỉnh.**

Model chỉ có preview; Sao về trình soạn dùng preview, không có toàn đề/key. Nội dung có chữ là wizard cho chọn. Có nguy cơ AI tạo barem từ phần đầu đề. In/tải ở trang cộng đồng thực chất window.print của trang xem trước. Cần ghi rõ “bản xem trước”, chặn coi là ready-to-grade hoặc bổ sung nội dung đầy đủ.

Bằng chứng: [model:13–24](</home/dsh/trangchugiaovien/lib/community-exams.ts#L13-L24>), [copy:25–34](</home/dsh/trangchugiaovien/components/exams/exam-detail.tsx#L25-L34>), [print:94–98](</home/dsh/trangchugiaovien/components/exams/exam-detail.tsx#L94-L98>), [wizard filter:131–135](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L131-L135>).

**B2 — P2/medium: sao chép/xóa không quản lý bộ đề–key.** Duplicate chỉ sao exam, không sao key; remove chỉ xóa một ID, để key mồ côi mà thư viện lại ẩn key. Cần duplicate theo aggregate, xóa có chính sách cho con, không ảnh hưởng snapshot lịch sử.

Bằng chứng: [store:166–179](</home/dsh/trangchugiaovien/lib/docs-store.tsx#L166-L179>), [ẩn key:23–25](</home/dsh/trangchugiaovien/components/my-exams.tsx#L23-L25>).

**B3 — P2/medium, UX + dữ liệu: không có nối ngữ cảnh đề ↔ các đợt chấm.** Thư viện thiếu “Chấm đề này”, trạng thái key đầy đủ/cũ và danh sách lớp đã dùng. Detail grading có snapshot/rubric ID nhưng không trả sourceExamId hay HTML snapshot để xem lại. Cần mở được bản đã dùng và cảnh báo khác nguồn; không tự sửa điểm lịch sử.

Bằng chứng: [library actions:183–211](</home/dsh/trangchugiaovien/components/my-exams.tsx#L183-L211>), [library details:274–279](</home/dsh/trangchugiaovien/components/my-exams.tsx#L274-L279>), [getSession:142–168](</home/dsh/trangchugiaovien/lib/grading/sessions.ts#L142-L168>).

**B4 — P2/medium: metadata môn/khối và nội dung có thể lệch.** Tài liệu mới mặc định toan/khối null, save và AI sửa nội dung không sửa metadata. Grading sao lại metadata cũ. Cần trường môn/khối chỉnh được, gợi ý AI phải được xác nhận.

Bằng chứng: [default:143–154](</home/dsh/trangchugiaovien/lib/docs-store.tsx#L143-L154>), [AI apply:745–768](</home/dsh/trangchugiaovien/components/editor/editor-workspace.tsx#L745-L768>), [wizard:149–155](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L149-L155>).

**B5 — P2/medium: có backend lớp lưu sẵn nhưng wizard chưa dùng.** UI nhập tên/dán danh sách, không gọi classes API. Backend tìm lớp theo tên không phân biệt năm học/môn/khối, dùng roster live khiến sĩ số đợt cũ có thể đổi. Cần classId rõ ràng, chọn lớp cũ và quyết định snapshot roster theo đợt.

Bằng chứng: [API lớp:13–23](</home/dsh/trangchugiaovien/app/api/classes/route.ts#L13-L23>), [upsert:180–217](</home/dsh/trangchugiaovien/lib/grading/sessions.ts#L180-L217>), [wizard input:318–329](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L318-L329>).

**B6 — P2/medium, responsive theo mã: Chi tiết có thể bấm nhưng không thấy.** Library nút Chi tiết hiện từ sm, shell aside chỉ hiện từ lg. Khoảng 640–1023px nút đổi selection nhưng panel ẩn; dưới sm thiếu đường tương đương. Cần drawer/sheet mobile, kiểm tra thao tác thực tế sau sửa.

Bằng chứng: [library:152–165](</home/dsh/trangchugiaovien/components/my-exams.tsx#L152-L165>), [shell:168–215](</home/dsh/trangchugiaovien/components/shell/app-shell.tsx#L168-L215>).

### C. Phần dư thừa/cần giản lược — không phải tất cả đều nên xóa

**C1 — P3/low, UI:** thư viện có hai tầng tiêu đề “Thư viện đề” / “Đề thi của tôi”; cùng khái niệm lại gọi Đáp án, Barem, Thang điểm ở ba nơi. Nên thống nhất “Đáp án & barem”, giữ một tiêu đề chính và status ngắn thay lời gợi ý lặp. [Library:61–70](</home/dsh/trangchugiaovien/components/my-exams.tsx#L61-L70>).

**C2 — P3/low, UI:** tab Đề & thang điểm luôn hiện tổng MC và tự luận dù phần không áp dụng; khu xóa đợt đặt trong panel rubric. Nên ẩn phần không dùng và tách thao tác nguy hiểm khỏi nội dung chuyên môn. [Settings:49–65](</home/dsh/trangchugiaovien/components/grading/settings-tab.tsx#L49-L65>), [Settings:111–123](</home/dsh/trangchugiaovien/components/grading/settings-tab.tsx#L111-L123>).

**C3 — P3/low, backend maintenance:** có nhiều kiểu/adapter cho answer key, editable questions, rubric và các bản client/server SessionDetail. `rubricFromAnswerKey` có logic chia điểm dự phòng nhưng wizard dùng `toEditable` riêng; sửa một chỗ dễ lệch chỗ khác. Nên dùng hợp đồng schema/version và adapter duy nhất; chỉ xóa helper/endpoint sau kiểm tra mọi consumer. [Adapter thư viện:240–306](</home/dsh/trangchugiaovien/lib/grading/rubric.ts#L240-L306>), [adapter wizard:23–83](</home/dsh/trangchugiaovien/components/grading/new-session-wizard.tsx#L23-L83>).

**C4 — P3/low, backend data:** xóa session không xóa snapshot/revision tạo riêng cho nó, dẫn tới dữ liệu không còn đường truy cập. Đây là dư dữ liệu/retention không rõ, không phải mất dữ liệu. Cần GC hoặc retention có chủ đích, xử lý FK và audit trước khi xóa. [DELETE:52–60](</home/dsh/trangchugiaovien/app/api/grading/sessions/[id]/route.ts#L52-L60>), [mỗi lần tạo snapshot:236–258](</home/dsh/trangchugiaovien/lib/grading/sessions.ts#L236-L258>).

**C5 — P3/low, validation backend:** chưa cấm hai ý tự luận trùng step.key trong cùng câu. DB unique criterion_key có thể làm ghi đè rồi tính lại cùng dòng hai lần. Wizard thường sinh s1/s2 nên chưa chứng minh lỗi qua UI thông thường; thêm kiểm tra schema vẫn cần thiết. [Normalize:168–181](</home/dsh/trangchugiaovien/lib/grading/rubric.ts#L168-L181>), [schema constraint:137](</home/dsh/trangchugiaovien/db/migrations/0003_grading.sql#L137>).

**Không nên xóa:** snapshot đề, key HTML và rubric JSON không tự động là ba bản thừa: HTML phục vụ hiển thị/in; JSON là hợp đồng chấm; snapshot giữ lịch sử. Vấn đề là thiếu nguồn chuẩn, liên kết phiên bản, khả năng xem lại và vòng đời dữ liệu. Cũng không nên gộp mất hai luồng duyệt MC/tự luận vì nghiệp vụ khác nhau; workspace hiện đã ẩn tab không áp dụng.

## Reproduction

### Đã chạy an toàn, không ghi dữ liệu ứng dụng

1. Transpile [parser](</home/dsh/trangchugiaovien/lib/grading/answer-key-html.ts>) bằng TypeScript transpileModule trong Node.
2. Gọi parseAnswerKeyHtml với `<table data-answer-grid><tr><td><p><b>Câu</b></p></td><td><p><b>1</b></p></td><td><p><b>2</b></p></td></tr><tr><td><p><b>Đáp án</b></p></td><td><p>A</p></td><td><p>B</p></td></tr></table>`.
3. Thực tế `[]`; mong đợi 2 câu A/B.
4. Gọi với hàng tự luận có nhãn Câu 1, lời giải và 2,0 điểm: thực tế `[]`; không có đường chuyển essay steps.
5. Chạy 17 test hiện có: đều pass; vì chưa test round-trip đầu ra thật của editor và độ phủ mixed/essay.

### Cần integration/API trên DB thử nghiệm

- Chuỗi đổi đề A→B của A3.
- Confirm submission thiếu dữ liệu rồi finalize; sửa/regrade sau finalized, kể cả job đang chạy.
- Nộp thêm trang sau job succeeded, gọi complete và so revision/điểm.
- Nộp 5+ trang có lời giải cuối ở trang 5, kiểm tra tất cả trang thực sự đến model.
- Hai user cùng trình duyệt và một user hai thiết bị; không dùng dữ liệu thật nhạy cảm.

## Root Cause Hypothesis

**Confidence: high** cho sai hợp đồng parser và state wizard; **high theo đường mã, chưa API reproduction** cho các lỗ hổng vòng đời chấm. Tính năng được ghép từ editor HTML/localStorage và grading JSON/PostgreSQL, thiếu aggregate/version chuẩn và state machine chung. Do đó mỗi màn có khái niệm “đã có”, “đã lưu”, “đã duyệt”, “đã chốt” riêng; demo/parser unit test chưa bắt được sai khác biên giữa các mô-đun.

## Proposed Remediation

**Preferred — làm theo các lô có kiểm thử, không sửa toàn bộ giao diện trước:**

1. **An toàn điểm:** tập trung validation confirm/finalize; chặn mọi ghi sau chốt; mở lại có audit; transaction/lock/revision cho race với worker; invalidation khi đổi ảnh, job key theo input revision; xử lý failed đúng phần.
2. **Hợp đồng đề–key–rubric:** structured rubric có version, sourceExamRevision/hash, trạng thái draft/confirmed/stale; editor và wizard dùng chung. Trước khi migration hoàn tất, hỗ trợ parser bảng ngang + essay có cấu trúc, báo rõ không đủ/cắt dữ liệu. Không tự đoán rubric thiếu và không tự chia điểm để hợp thức hóa mà không báo giáo viên.
3. **Persistence và quyền sở hữu:** chuyển tài liệu/key sang server theo owner; nhập dữ liệu local có xác nhận tài khoản, idempotent và backup; pair-aware duplicate/delete; giữ snapshot lịch sử bất biến.
4. **Liền mạch UI:** Chấm đề này, chọn sẵn examId/revision; xem snapshot nguồn và các lớp đã chấm; chỉ báo ready/stale/incomplete đáng tin; chọn classId/lớp lưu sẵn; metadata chỉnh được; drawer mobile.
5. **Dọn gọn:** thống nhất thuật ngữ và adapter/types; bỏ khối không áp dụng; hoàn thiện GC/retention. Không xóa snapshot chỉ vì dữ liệu giống đề nguồn.

**Files likely to change:** các đường mã đã liên kết trong từng finding; bổ sung migration tài liệu, revision/input version và retention sau khi chốt thiết kế. Không có patch trong lần assessment này.

**Tests to add or update:**

- Editor-generated horizontal MC/essay/mixed → lưu → wizard → createSession round-trip: giữ số câu, đáp án, điểm, ý chấm.
- Điểm nguyên/thập phân dấu phẩy, tổng tùy cấu hình, nhãn câu/mã đề trùng; reject step.key trùng.
- Đổi nguồn, sửa đề/ảnh trong lúc AI đang trả, quay lại wizard: không nhận barem của revision cũ.
- Kiểm tra key stale sau sửa đề, duplicate/remove aggregate, account/device isolation, lỗi lưu/quota.
- Confirm thiếu trang/danh tính/ý/đang processing; finalize thường/ngoại lệ; worker commit racing finalize; sửa sau chốt/reopen audit.
- Bổ sung trang và complete/regrade idempotent theo revision; 5+ trang; model nhận đúng ngữ cảnh câu/đề.
- Job failure → section/submission → SSE → review/table/stats/CSV đồng nhất.
- Preview-only community không quảng bá hoàn chỉnh; saved class selection và roster snapshot; mobile 375/768/1024px.

## Risks & Considerations

- Migration localStorage có nguy cơ gán nhầm đề của người dùng cũ trong trình duyệt dùng chung: không tự nhận owner âm thầm.
- Barem cũ phải đánh dấu legacy/needs-review, không sửa âm thầm điểm lịch sử.
- Không mặc định mọi kỳ thi /10; cần thang điểm và quy đổi được xác nhận rõ.
- Khóa dữ liệu đã chốt phải bao phủ mọi đường ghi, không chỉ UI; xử lý job đang chạy cần optimistic version/transaction.
- Gửi đủ trang và đề/hình tăng token/chi phí; batching có kiểm tra độ phủ, không cắt âm thầm.
- Thêm auth/quota cho API AI có thể cần cập nhật test/luồng khách; không kết luận khai thác chi phí thực tế vì chưa thử.
- Chưa kiểm chứng hình thức trên trình duyệt/live, chất lượng nhận dạng ảnh thật hay độ chính xác AI; không đưa ra cam kết độ chính xác.

## Open Questions

- [NEEDS CLARIFICATION: Có hỗ trợ nhiều mã đề, đúng/sai, trả lời ngắn ngoài A–D trong đợt này không? Hiện hợp đồng MC là A–D.]
- [NEEDS CLARIFICATION: Sửa barem trong grading là bản dùng riêng hay có nút xuất bản lại cho đề nguồn? Đề xuất mặc định dùng riêng, xuất bản lại có xác nhận.]
- [NEEDS CLARIFICATION: Quy tắc mở lại đợt đã chốt, chốt ngoại lệ và thời hạn retention/xóa dữ liệu là gì?]
- [NEEDS CLARIFICATION: Lớp cần phân biệt năm học, môn, khối thế nào; roster của đợt là snapshot hay live?]
