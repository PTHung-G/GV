# Intake — structured question flow

- Slug: structured-question-flow
- Origin: direct user request, 2026-11-16 Asia/Bangkok; follow-up to topic-question-bank.
- User: “oke bạn sửa đi rồi sau đó tải thử các bộ đề toán lớp 9 trên mạng rồi tách thành các câu hỏi và test hệ thống cây xem nó có phân chia được đúng không”.
- Context: user questions duplicate extraction when AI generation already returns JSON. Current audited contract wraps a whole HTML document, not question objects. User accepted proposed direction: retain individual question structure throughout generation/editing and snapshot directly; reserve extraction for imported/legacy sources.
- Requested outcomes: remove redundant AI extraction on structured generated exams without losing current edits; download actual public grade9 math exams, extract their questions and assess topic-tree semantic correctness, not merely acyclicity.
- Existing product constraints carried forward: owner-private bank; immutable confirmed snapshots; missing answers/rubric/points permitted without invention; tree with no cycles; teacher approves content rather than manages taxonomy; replacement/equivalence out of scope.
- Authorization: implement and test; prior standing autonomous delivery/deployment authorization. No clarification required to begin read-only research. Benchmark corpus sources, limits and ambiguous/composite classifications must be disclosed.
