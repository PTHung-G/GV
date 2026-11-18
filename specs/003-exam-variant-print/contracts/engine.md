# Shared engine contract (v1)

Implement under lib/exam-release/types.ts + engine.ts + recipes.ts (no server imports in these).

`ReleaseInput`: {sourceExamId:string,title:string,content:string,answerKey:AnswerKeyQuestion[],sourceContentHash?:string,reviewed:boolean,codes:string[],seed:string,shuffleQuestions:boolean,shuffleOptions:boolean,groups?:Array<{questionNos:number[],pinned?:boolean}>,pinnedQuestionNos?:number[],pinnedOptionNos?:number[],recipes?:Array<{questionNo:number,recipeId:'square-root'|'linear-equation'|'rational-addition'}>}.

`buildReleaseVariants(input:ReleaseInput):ReleaseBuild` pure synchronous server/browser shared; throws actionable Error on invalid/unsupported. No unsafe HTML injection; content source retained through passive rendering sanitizer separately.

`ReleaseBuild`: {algorithmVersion:1,warnings:string[],variants:BuiltVariant[],questions:Array<{no:number,label:string,canShuffleOptions:boolean,warnings:string[]}>}.

`BuiltVariant`: {code:string,examHtml:string,answerKey:AnswerKeyQuestion[],rubric:Rubric,mapping:Array<{sourceNo:number,printedNo:number,optionOrder?:string[],recipe?:{id:string,version:number,params:Record<string,number>,verified:boolean}}>}.

OptionOrder lists original option letters in new A-D order. AnswerKey question field uses printed number string. Existing types imported from lib/ai/types (confirm actual path). Render key server-side with existing renderAnswerKeyHtml. Engine must normalizeRubric(rubricFromAnswerKey) with no invented points. Groups consecutive numbers, no overlap; internal order preserved, section isolation required. No shuffle based solely on outline regex; parse AST safely and reject ambiguous boundaries/content. Exactly A-D structurally separate choices only. Dependent options pinned. Numeric recipe replacement explicit full question replacement, only MC mapped question; exact verification, no eval. Print mã code outside engine in publication header.

If signatures need adjustment, coordinate with parent BEFORE change; extend only optional fields compatibly.
