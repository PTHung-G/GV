import type { AnswerKeyQuestion, Rubric } from "../grading/rubric";
export type { AnswerKeyQuestion, Rubric } from "../grading/rubric";
export type RecipeId = "square-root" | "linear-equation" | "rational-addition";
export type ReleaseInput = {
  sourceExamId: string;
  title: string;
  content: string;
  answerKey: AnswerKeyQuestion[];
  sourceContentHash?: string;
  reviewed: boolean;
  codes: string[];
  seed: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  globalInstructionsReviewed?: boolean;
  groups?: Array<{ questionNos: number[]; pinned?: boolean }>;
  pinnedQuestionNos?: number[];
  pinnedOptionNos?: number[];
  recipes?: Array<{ questionNo: number; recipeId: RecipeId }>;
  classId?: string | null;
};
export type RecipeProvenance = {
  id: string;
  version: number;
  params: Record<string, number>;
  verified: boolean;
  explanation?: string;
};
export type BuiltVariant = {
  code: string;
  examHtml: string;
  answerKey: AnswerKeyQuestion[];
  rubric: Rubric;
  mapping: Array<{
    sourceNo: number;
    printedNo: number;
    optionOrder?: string[];
    recipe?: RecipeProvenance;
  }>;
};
export type ReleaseBuild = {
  algorithmVersion: 1;
  warnings: string[];
  variants: BuiltVariant[];
  questions: Array<{
    no: number;
    label: string;
    canShuffleOptions: boolean;
    warnings: string[];
  }>;
};
