import type { StructuredExam } from '../structured-exam';

export const BANK_LIMITS = { sourceChars: 2_000_000, questions: 2000, sources: 200, nodes: 200, depth: 12, labelChars: 100, contextQuestions: 200, processMs: 90_000 } as const;
export type BankNode = { id: string; label: string; parentId: string | null };
export type SourceBlock = { start: number; end: number; html: string; text: string };
export type BankCandidate = { id: string; label: string; bodyBlockIds: number[]; contextBlockIds: number[] };
export type WorkState = 'pending' | 'processing' | 'review' | 'complete' | 'failed';
export type BankSource = {
 id: string; operationKey: string; payloadHash?: string; docId: string; title: string; rawHtml: string; hash: string;
 blocks: SourceBlock[]; createdAt: string; status: WorkState; error?: string;
 candidates: BankCandidate[]; previewVersion: string; confirmedIds: string[];
 lease?: { token: string; until: number }; attempts: number;
 extractionMode?: 'native' | 'ai'; structure?: StructuredExam;
 answerKey: { content: string; questions: unknown[] } | null;
};
export type BankQuestion = {
 id: string; sourceId: string; candidateId: string; label: string;
 bodyBlockIds: number[]; contextBlockIds: number[]; topicId: string; createdAt: string;
 answer: null; rubric: null; points: null; organized?: boolean;
};
export type BankState = {
 nodes: BankNode[]; sources: BankSource[]; questions: BankQuestion[];
 organization: { status: 'pending'|'processing'|'complete'|'failed'; error?: string; lease?: {token:string;until:number}; attempts: number };
};
export type BankEnvelope = { ownerId: string; revision: number; bank: BankState };
export const emptyBank = (): BankState => ({ nodes: [{id:'root',label:'Kho câu hỏi',parentId:null}], sources:[],questions:[],organization:{status:'complete',attempts:0} });
