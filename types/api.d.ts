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
  messages: ChatMessage[];
};

type ChatMessage = {
  type: "REQUEST" | "RESPONSE";
  message: string;
  createDate?: string;
};
