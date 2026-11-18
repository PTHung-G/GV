# HTTP contracts

All teacher routes require existing auth+origin checks, owner scoped SQL. Capture routes authorize teacher owner OR separate limited release grant.

- POST /api/exam-releases/preview {ReleaseInput}: validated preview build, no DB writes.
- POST /api/exam-releases {input:ReleaseInput,idempotencyKey:string}: atomic publish, replay same request returns existing result; key reused with different input409. Returns release detail sans QR secret separately? Detail includes authorized printable data, never public.
- GET /api/exam-releases?sourceExamId=: owner list summary.
- GET /api/exam-releases/:id: owner detail variants metadata, mapping, rubric, artifact URLs/HTML as authorized.
- GET /api/exam-releases/:id/print?kind=exam|key|sheet&code=...: stored artifact(s), teacher only.
- POST /api/exam-releases/:id/resolve {qr:string}: owner/release grant, verify v2 variant+sid+opaque token belongs this release; return sessionId, variantId,code, frozen template, no answers.
- POST /api/exam-releases/:id/pairings: teacher mints expiring one-use release capture code; claim route separate release cookie. Existing single session grants unchanged.
- Existing session submissions create/OMR/complete enforce published identity via authoritative variant token, not exam_code. AI worker does not queue for unresolved published sheet.

QR: JSON {v:2,sid:string,vid:string,t:string}. Token binds DB immutable variant which binds release/snapshot/rubric/template. Token is not authority to read data, session access still required. Wrong/missing token409/422 before score writes.
