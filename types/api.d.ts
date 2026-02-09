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
type MemoContent = {
  idx: number;
  memo: string;
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
