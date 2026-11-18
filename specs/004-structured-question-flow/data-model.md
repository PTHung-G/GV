# Data model

`StructuredExam = {version:1, blocks:{id:string}[], questions:{id,label,bodyBlockIds:string[],contextBlockIds:string[]}[]}`. IDs safe opaque document-local IDs, unique across block/question groups; bounded by source/bank limits. Every body nonempty, disjoint, every reference exists, no body/context overlap for same question. Block set order matches current source. Unreferenced known blocks are explicitly retained document chrome, not shared context.

Generation intermediate `{blocks:[{key,html}],questions:[{key,label,bodyKeys,contextKeys}]}`. Keys model-local; server validates schema and top-level block shape, mints IDs and anchors, returns HTML + structure. Figures embedded before final validation.

ExamDoc adds optional `structure`; chat payload adds optional same. Optional absent means legacy HTML. HTML and structure saved together. On live reconciliation failure remove structure, retaining exact current content and visible fallback reason at save. Valid edits update current ranges rather than stored generated HTML.

BankSource adds optional `structure` provenance and `extractionMode:'native'|'ai'` (or equivalent explicit indicator); native candidate IDs derive from question IDs. Immutable rawHtml/blocks remain authority. No per-question answer inference. Source identity payload hash includes structure; validated direct review gets previewVersion and attempts0. Confirmation and organization unchanged.
