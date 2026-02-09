// ai assistant api
type ChatRequest = {
  userIdx: number;
  message: string;
  roomId: string;
  modelIdx: number;
};
type ChatResponse = {
  message: string;
};

type ChatListRequest = {
  userIdx: number;
  modelIdx: number;
};
type ChatListResponse = {
  totalCount: number;
  contents: ChatContent[];
};

type ChatContent = {
  roomId: string;
  createDate: string;
  snippet?: string;
  messages: ChatMessage[];
};

type ChatMessage = {
  type: "REQUEST" | "RESPONSE";
  message: string;
  createDate?: string;
};
type ChatDeleteRequest = {
  roomId: string;
};
type ChatSearchRequest = {
  userIdx: number;
  modelIdx: number;
  keyword: string;
};

// memo api
type MemoListRequest = {
  userIdx: number;
  modelIdx: number;
};
type MemoListResponse = {
  totalCount: number;
  contents: MemoContent[];
};

type MemoRequest = {
  userIdx: number;
  modelIdx: number;
  memo: string;
};
type MemoResponse = {
  idx: number;
};

type MemoUpdateRequest = {
  userIdx: number;
  modelIdx: number;
  memoIdx: number;
  memo: string;
};
type MemoDeleteRequest = {
  userIdx: number;
  modelIdx: number;
  memoIdx: number;
};

type MemoSearchRequest = {
  userIdx: number;
  modelIdx: number;
  keyword: string;
};
type MemoSearchResponse = {
  totalCount: number;
  contents: MemoContent[];
};

// quiz
export type QuizHistoryOption = {
  optionIdx: number;
  optionContent: string;
};

export type QuizHistoryItem = {
  modelIdx: number;
  quizIdx: number;
  quizContent: string;
  quizOptions: QuizHistoryOption[];
  selectedOptionIdx: number;
  correctOptionIdx: number;
  explanation: string;
  isCorrect: boolean;
  createdAt: string;
};

export type QuizHistoryResponse = {
  totalCount: number;
  contents: QuizHistoryItem[];
};

// user/me
type ModelStat = {
  modelIdx: number;
  solved: number;
  correct: number;
  wrong: number;
};

type UserQuizMeResponse = {
  currentGrade: string;
  nextGrade: string;
  problemsToNextGrade: number;
  totalSolved: number;
  totalCorrect: number;
  totalWrong: number;
  modelStats: ModelStat[];
};
