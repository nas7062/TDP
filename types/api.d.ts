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
  selectedOptionContent: string;
  correctOptionIdx: number;
  correctOptionContent: string;
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
// quiz api
type QuizListRequest = {
  modelIdx: number;
  count?: number;
};
type QuizListResponse = {
  totalCount: number;
  contents: QuizContent[];
};
type QuizContent = {
  idx: number;
  quizContent: string;
  quizOptions: QuizOption[];
};
type QuizOption = {
  optionIdx: number;
  optionContent: string;
};
type QuizSubmitRequest = {
  userIdx: number;
  modelIdx: number;
  answers: QuizAnswer[];
};
type QuizAnswer = {
  quizIdx: number;
  answer: number; //optionIdx 보내기
};

type QuizSubmitResponse = {
  totalCount: number;
  correctCount: number;
  results: QuizResult[];
};
type QuizResult = {
  quizIdx: number;
  isCorrect: boolean;
  optionIdx: number; //제출한 답(보기)
  correctOptionIdx: number; //정답(보기) 식별자
  correctOptionContent: string; //정답(보기) 내용
  quizContent: string; //문제 내용,
  explanation: string; //해설
};
