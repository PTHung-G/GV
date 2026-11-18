# AI backend — how the original works, and what this clone reproduces

Recovered by reading the mirrored bundles in `source-mirror/js/`. Nothing here was
guessed: every claim below cites the chunk it came from.

## The original's pipeline

From `js/180c0fplvd4t3.js` (client call sites) and `js/2xwqx5gh-wuz4.js` (SSE reader):

```
POST /api/chat-exam/plan     plan first; may return clarify / confirm / reject
POST /api/chat-exam          generate, streamed as SSE
POST /api/chat-exam/verify   post-check the generated markup
POST /api/exam-image         OCR when the teacher uploads a photo
POST /api/exam-answer-key    answer key generated separately
GET|POST /api/memory/*       4 endpoints for long-term memory
POST /api/suggestions        starter prompts, with a reason per suggestion
```

Reported stages: `ocr` → `plan` → `chat` → `solve` → `verify` → `apply`.

## SSE protocol (their five events)

The client splits frames on a blank line, reads `event:`, joins repeated `data:`
lines and JSON-parses the payload:

| event | payload | client effect |
|---|---|---|
| `progress` | `{stage, message}` | updates the status line |
| `delta` | `{action, text}` | appends text — this is the typing effect |
| `reset` | `{message}` | clears what was streamed |
| `result` | object with `success` | resolves the promise |
| `error` | `{status, error, code, requestId}` | rejects |

Note `delta` carries an `action` — the streamed text is not anonymous.

## Result shape

Only two document actions exist:

```js
"replace" → { exam: { content } }   // replacing the whole exam
"append"  → { content }             // inserting additional content
```

Both are rejected when empty (`empty_generated_exam` / `empty_generated_content`).
The payload is **HTML for the A4 page**, not Markdown.

The planner enforces cross-checks before generation is allowed:

```js
// task_kind ui_action / direct_reply must not carry generation fields
if (decision === 'proceed' && operations.includes('chat') && !templatePrompt?.trim())
  throw Error('Bước lập kế hoạch không trả về lời nhắc nào.');
// clarify must supply questions, each with >= 2 options
```

## What this clone now has

| Piece | File |
|---|---|
| Shared contract + types | `lib/server/chat-exam-types.ts` |
| SSE writer (5 events) | `lib/server/sse.ts` |
| Model access + offline provider | `lib/server/model.ts` |
| Planner + validation | `lib/server/planner.ts` |
| `POST /api/chat-exam/plan` | `app/api/chat-exam/plan/route.ts` |
| `POST /api/chat-exam` (SSE) | `app/api/chat-exam/route.ts` |
| `POST /api/chat-exam/verify` | `app/api/chat-exam/verify/route.ts` |
| `POST /api/exam-image` (OCR) | `app/api/exam-image/route.ts` |
| Client reader (same parser) | `lib/chat-exam-client.ts` |
| Panel wiring | `components/editor/ai-panel.tsx` |

Reproduced: the 3-step pipeline, all five SSE events, `replace`/`append` actions,
HTML output, planner validation, request IDs, the reasoning level mapped to the
provider, HTML sanitising before it reaches the document.

**Not** reproduced: answer-key generation (`/api/exam-answer-key`), the four
memory endpoints, `requireApproval` UI actions, `editRanges`, and the
suggestions endpoint.

## Endpoints ported

| Route | Method | Shape |
| --- | --- | --- |
| `/api/chat-exam` (+ `/plan`, `/verify`) | POST | SSE stream, see above |
| `/api/exam-image` | POST | `{ images }` -> `{ content, warnings }` |
| `/api/exam-answer-key` | POST | `{ exam }` -> `{ codes: [{ code, questions: [{ label, answer }] }] }` |
| `/api/suggestions` | POST | `{ examTitle, questionCount, blockCount, hasAnswers }` -> `{ suggestions }` |
| `/api/memory` | GET / POST / DELETE | `{ memory }` / `{ item }` |
| `/api/memory/:id` | PATCH / DELETE | `{ item }`; delete is soft so it can be restored |
| `/api/memory/:id/restore` | POST | `{ item }` |
| `/api/memory/settings` | PATCH | `{ useMemory }` |
| `/api/memory/rebuild` | POST | dedupes the list |

Memory lives in `.data/memory.json` (gitignored) and is injected as a second
system message before every generation, so "lần sau dùng cm" actually sticks.
The UI is `/memory`, linked from the "Trí nhớ" badge in the assistant panel.

## Community library

`lib/community-exams.ts` now holds the 24 real exams scraped from
soandethi.com/exams (slug, title, paper lines, copy count, question count).
The live site shows "596 đề" but serves only the first 24 per request — there is
no page/offset parameter and the list is server-rendered, so 24 is as far as a
clone can honestly go.

## Turning on a real model

The backend runs offline by default — a deterministic provider fills in so the
pipeline is testable with no key. To route it to a real OpenAI-compatible API,
create `.env.local` (git-ignored, `chmod 600`):

```bash
AI_API_KEY=<your key>
AI_MODEL=<model id>
AI_BASE_URL=<provider base url, no trailing /chat/completions>
```

Both the chat pipeline and OCR read these; one provider serves both paths.

`lib/server/model.ts` calls `${AI_BASE_URL}/chat/completions`. Any provider that
speaks that shape (OpenAI, Groq, Together, a local llama.cpp server, …) works
without code changes. For a different protocol, edit `complete()` only.

**Never commit `.env.local`** — it is already covered by `.gitignore`.

## Verifying without a key

```bash
curl -s -X POST localhost:3100/api/chat-exam/plan \
  -H 'content-type: application/json' \
  -d '{"message":"Tạo đề thi Toán lớp 9 gồm 5 câu"}'

curl -sN -X POST localhost:3100/api/chat-exam \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"Tạo đề Toán lớp 9 gồm 3 câu"}],"contextSource":"none"}'
```

The e2e suite asserts the call order plan → generate → verify and that the
applied HTML contains no leftover `**`.

## Maths: LaTeX in, MathML out

The original stores LaTeX on a Tiptap `math` node and renders it with KaTeX
(js/12q7obohwerum.js):

```js
katex.renderToString(latex, {
  throwOnError: false,
  displayMode: !!node.attrs.display,
  output: 'mathml',
  strict: 'ignore',
})
// -> <span class="doc-math"> or <span class="doc-math doc-math-display">
```

The clone does the same, in `lib/math.ts`:

- `$...$` inline, `$$...$$` display — split by `splitMath()`, which respects
  `\$` escapes and nested braces.
- `renderMath()` calls KaTeX with exactly the options above.
- `renderMathInHtml()` walks **text nodes** (not a regex over `<...>`, which
  would corrupt `&gt;` / `&lt;` entities) and replaces each run with MathML.
- Each span keeps its source in `data-latex`, so saving converts back to
  `$...$` (`unmath()`) and the round-trip is lossless.

The CSS in `app/globals.css` is copied from the original's stylesheet
(`source-mirror/css/3t4_8ictlr0e0.css`):

```css
.doc-math-display { padding-block: max(0.15em, 0.5lh - 0.5em); display: block; }
.doc-math:not(.doc-math-display) { vertical-align: baseline; line-height: inherit; display: inline; }
.doc-math:not(.doc-math-display) .katex :is(.katex-base, .base):has(.mfrac, .mtable) { padding-block: 0.15em; }
```

That last rule is why a line containing a lone fraction no longer tears apart.

The generator prompt now **requires** LaTeX rather than forbidding it.

## Document layout

Three layout behaviours are ported from the original (source-mirror/js/1twhdx9v_bid8.js):

| Behaviour | Their function | Ours |
|---|---|---|
| Two-column exam header | `examHeader` node view + CSS | `.doc-header` / `.doc-header-col` in `app/globals.css` |
| Auto column count for options | `automaticChoices`, `measureChoiceGrid` | `lib/layout.ts` |
| A4 page breaks (screen) | `measureColumns` | `paginate()` in `editor-workspace.tsx` |
| A4 page breaks (paper) | `@page` + `.exam-paper` rules | print block in `app/globals.css` |
| Splitting text across pages | binary search in `measureColumns` | `lib/split-text.ts` |
| Formula editor | Tiptap math node view + MathLive | `components/editor/math-popover.tsx` |

**Option grids.** A `.doc-grid` whose cells each start with `A.`, `B.`, … is
measured with the grid forced to one max-content column, then the widest count
that fits every cell is chosen (cell width + 2px tolerance). The result is
written to `data-columns` and `grid-template-columns`, exactly as they do.

**Pagination.** The surface is a single continuous sheet. After painting, blocks
are walked with a running height; when the next block would cross the printable
area (971.34px = 297mm − 2×20mm) a spacer of the exact remainder is inserted
before it. Spacers carry `data-page-spacer`, are removed by `unmath()` before
saving, and are re-measured on every content or zoom change (two frames, so
fonts and KaTeX have settled).

**Splitting text across sheets.** A plain-text block that would cross the
boundary is binary-searched for the longest prefix that fits, then walked back
to the nearest whitespace (max 80 chars — the original's bound). The remainder
becomes a sibling marked `data-split-part="t"`. Blocks containing maths, links,
images, tables or grids are left whole and simply overflow, because slicing them
would corrupt inline structure.

On the next pass `unsplitText()` merges each tail back into its head first, so
repeated pagination never accumulates fragments and never loses characters. The
same merge runs inside `unmath()`, so saved documents always hold whole
paragraphs.

**Editing a formula.** Clicking a `span.doc-math` opens `MathPopover`: a MathLive
`math-field` (formula keyboard), an inline/display toggle, and delete. The saved
value is still `$...$` LaTeX. MathLive's fonts are copied to
`public/mathlive-fonts` and pointed at via `MathfieldElement.fontsDirectory` —
without that they resolve under `/_next/static/` and 404, which silently breaks
every formula.

**Printing.** `@page { size: A4; margin: 20mm 15mm 18mm 20mm }` and the print
block are copied from the original stylesheet. On paper the browser paginates on
its own, so:

- `[data-page-spacer]` is `display: none` — otherwise every screen spacer would
  emit a blank sheet.
- `.print-plain` / `.doc-sheet` collapse the on-screen wrapper (fixed width,
  shadow, zoom transform, centring padding) to plain flow.
- The sheet's own padding drops to `0`, because `@page` already supplies margins.
- The ruler and toolbar carry `.no-print`.
- `break-inside: avoid` on grids, headers, tables and display maths; `h1..h3`
  keep with what follows; `orphans`/`widows: 3` on paragraphs.

Verified by rendering with `page.pdf()` and counting `/Type /Page` markers.

**Header.** The generator prompt asks for the two-column header first; if the
model drops it, the route retries once with an explicit reminder.

## Honest limits

With `AI_API_KEY` unset the offline provider produces **fixed sample prose**
shaped by the prompt — it is not a language model. Only exists so the pipeline
is testable with no key.

With a real model configured, the content is genuinely generated. Verified: the
planner writes its own `templatePrompt`, the generator produces real questions,
and OCR reads Vietnamese text from an image with correct diacritics.
