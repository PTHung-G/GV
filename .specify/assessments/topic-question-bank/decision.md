# Decision: Lưu và tự tổ chức kho câu hỏi đa lĩnh vực

- **Slug**: topic-question-bank
- **Decided**: 2026-11-13, sau vòng 3/4 và ủy quyền cập nhật hồ sơ xuyên suốt
- **Verdict**: go
- **Artifacts reviewed**: [problem.md](problem.md), [concept.md](concept.md), [research.md](research.md), quyết định needs-clarification trước đây và xác nhận trực tiếp của người dùng; intake chưa có.

## Scorecard

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | adequate | Nhu cầu trực tiếp cụ thể, phạm vi rõ: giữ/tìm lại mà không quản trị taxonomy; chưa đo hành vi. |
| Evidence strength | adequate | Đủ để đặc tả lát cắt nội dung HTML trong ứng dụng: vòng 3 có 16 câu đa lĩnh vực, hai thứ tự đủ assignment/cấu trúc; vòng 4 trích từ HTML thô 6→10 câu với đợt B chưa tồn tại ở bước A, tự giữ đoạn chung/hình/ý phụ, validator không lỗi và không đổi nguồn cũ. Không suy thành bằng chứng chất lượng toàn sản phẩm hoặc mọi lĩnh vực. |
| Value vs. inaction | adequate | Kho mức câu giải quyết nhu cầu chưa được kho đề giải quyết; chưa có ROI hoặc baseline định lượng. |
| Feasibility / appetite | adequate | Có mẫu biểu diễn và trích nguồn nhỏ qua nhiều lĩnh vực và đợt thêm; B giới hạn nguồn đầu tiên ở HTML trong ứng dụng, không OCR/đổi câu. Chi phí và độ rộng kho phải giới hạn/đo trong delivery, chưa phải ước lượng hoàn thành. |
| Strategic fit | strong | Khớp trực tiếp hướng soạn đề và kho riêng do chủ sản phẩm chốt. |
| Risk posture | adequate | Giữ nguồn nguyên vẹn, không bắt thành công AI trước khi giữ nội dung, trạng thái thất bại trung thực, duyệt nội dung không phải taxonomy, không ghi đè và cách ly tài khoản là điều kiện nghiệm thu bắt buộc. Hiệu lực ở sản phẩm chưa chứng minh: không phát hành với lỗi toàn vẹn hoặc phân quyền. |

## Verdict & Rationale

**go để đặc tả và triển khai lát cắt B có giới hạn**, không phải xác nhận sản phẩm đã đạt. Gate trước yêu cầu bằng chứng đa lĩnh vực, hai thứ tự và phụ thuộc nội dung: vòng 3 đáp ứng cấu trúc/đối chiếu thứ tự nhưng nhìn trước corpus; vòng 4 bổ sung nguồn thô và đợt mới thực sự chưa nhìn trước. Đủ bằng chứng sơ bộ cho bước đặc tả, không cần sản phẩm hoàn chỉnh để qua discovery. Research overall confidence vẫn low đối với hiệu quả sản phẩm: adequate ở gate này là mức đủ để đầu tư lát cắt kiểm chứng, không nâng accuracy hoặc khẳng định mọi lĩnh vực.

Bất lợi cần giữ: corpus nhỏ/sạch, agent thay đổi giữa đợt, không human gold, cây nhiều node so với số câu; không có benchmark provider, UX, lưu bền hoặc quyền riêng tư. Những khoảng trống này phải thành điều kiện kiểm thử/giới hạn phát hành, không được viết thành thành công. Không quay lại yêu cầu người dùng chọn môn, bổ sung barem hoặc quản trị cây.

## If go — Handoff to `/speckit-specify`

- **Problem**: giáo viên giữ và tìm lại nội dung đã chấp nhận, nguyên vẹn/riêng tư, không tăng công phân loại.
- **Chosen approach**: B — cây riêng tự tổ chức đa lĩnh vực, một gốc/một cha/không cycle; câu một vị trí, composite ở cha/gốc, AI xem cây và câu liên quan rồi mở nhánh/chuyển câu cũ khi cần.
- **In scope**: chốt đề và xác nhận chọn nội dung giữ; nguồn HTML trong ứng dụng; giữ nguồn/phụ thuộc/formula/hình/ý phụ; thiếu answer/rubric/points vẫn lưu; duyệt/tìm nội dung kho; trạng thái AI thật và phục hồi; giữ phiên bản không ghi đè; dữ liệu theo tài khoản.
- **Out of scope**: tìm câu tương đương/đổi câu, OCR/audio/video, taxonomy thủ công, sinh barem, kho cộng đồng, cross-links/multiple parents.
- **Success metrics**: đủ nguồn và phụ thuộc sau lưu/tải lại; zero cycles/dangling/duplicate assignments; zero required taxonomy actions; account isolation; no silent overwrite; AI failure không mất nội dung; bounded requests/reprocessing và đo thời gian/giới hạn thực tế; không hứa 10/60 giây.
- **Carried-forward open questions**: HTML phức tạp không tách chắc chắn phải giữ nguồn và báo chưa hoàn tất; xác định giới hạn kích thước/lần xử lý và retry từ kiểm thử; đo baseline và UX thật khi có người dùng; không coi giới hạn định dạng là giới hạn lĩnh vực.
- **Release conditions**: test nguồn thô dùng chung/đa ý/SVG/LaTeX, lưu bền và phiên bản; hai tài khoản/unauthenticated; lỗi provider/cycle/invalid output; nhập tăng dần và chuyển câu cũ; UI base path `/soandethi`; build/typecheck/regression và kiểm tra URL deploy thật. Không phát hành nếu thiếu điều kiện cốt lõi.

## Next Step

`/speckit-specify` với handoff trên. Quyền triển khai/deploy do yêu cầu trực tiếp mới nhất; go không mở quyền xóa dữ liệu thật hoặc tiết lộ bí mật.
