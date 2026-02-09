"use client";

import Image from "next/image";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { randomUUID } from "@/lib/util/uuid";
import { useSearchParams } from "next/navigation";
import { sendChatStream } from "@/lib/api/sseAiChat";
import { TextSkeleton } from "@/components/ui/skeleton";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
  roomId?: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  selectedChat?: ChatContent;
  setChatList: Dispatch<SetStateAction<ChatContent[]>>;
};

const LINE_HEIGHT = 22;
const PADDING_Y = 18; // py-3
const MAX_LINES = 3;
const MIN_HEIGHT = LINE_HEIGHT + PADDING_Y; // 1줄
const MAX_HEIGHT = LINE_HEIGHT * MAX_LINES + PADDING_Y; // 3줄

export default function AIAssistantContent({
  uiType,
  setUiType,
  roomId,
  setRoomId,
  selectedChat,
  setChatList
}: Props) {
  const userIdx =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}")?.idx : "";

  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : 0;

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isShowSkeleton, setIsShowSkeleton] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // textarea 높이: 1줄 기본, 최대 3줄까지 자동 확장
  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const h = Math.min(Math.max(ta.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    ta.style.height = `${h}px`;
  };
  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  // 입력 시작 시 패널 확장
  useEffect(() => {
    if (uiType !== "default") return;
    if (inputValue.trim().length > 0) {
      setUiType("expanded");
    }
  }, [inputValue, uiType, setUiType]);

  // 새 메시지 추가 시 스크롤 맨 아래로 부드럽게 이동
  useEffect(() => {
    if (messagesContainerRef.current && uiType !== "default") {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, uiType]);

  // 메세지 목록에서 selectedChat 가져오기
  useEffect(() => {
    setMessages(selectedChat?.messages || []);
  }, [selectedChat]);

  // 메세지 보내기 (RoomId 맨처음에는 기본적으로 빈값인데, submit 시에 생성)
  const submitMessage = async () => {
    if (!inputValue.trim() || isFetching || isNaN(Number(userIdx))) return;

    const messageText = inputValue; // 줄바꿈 포함 원본 그대로

    const userMessage: ChatMessage = {
      type: "REQUEST",
      message: messageText
    };
    setIsFetching(true);
    setInputValue("");
    setMessages((prev) => [...prev, userMessage]);
    setIsShowSkeleton(true);

    try {
      const newRoomId = roomId ? roomId : randomUUID();
      const isNewChat = !roomId;

      // 새 채팅 시작 시 chatList에 추가 (처음에)
      if (isNewChat) {
        const newChat: ChatContent = {
          roomId: newRoomId,
          createDate: new Date().toISOString(),
          messages: [userMessage]
        };
        setChatList((prev) => [newChat, ...prev]);
      }

      // 스트리밍용 빈 응답 메시지 먼저 추가
      setMessages((prev) => [...prev, { type: "RESPONSE", message: "" }]);

      const roomIdRef = { current: newRoomId };
      const fullMessage = await sendChatStream(
        {
          userIdx: Number(userIdx),
          message: messageText,
          roomId: newRoomId,
          modelIdx
        },
        {
          onChunk(chunk) {
            setIsShowSkeleton(false);
            console.log("chunk in client - onChunk", chunk);
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.type === "RESPONSE") {
                next[next.length - 1] = { ...last, message: last.message + chunk };
              }
              return next;
            });
          },
          onRoomId(serverRoomId) {
            console.log("serverRoomId in client - onRoomId", serverRoomId);
            roomIdRef.current = serverRoomId;
            setRoomId(serverRoomId);
            if (isNewChat) {
              setChatList((prev) =>
                prev.map((c) => (c.roomId === newRoomId ? { ...c, roomId: serverRoomId } : c))
              );
            }
          }
        }
      );

      const assistantMessage: ChatMessage = {
        type: "RESPONSE",
        message: fullMessage
      };

      // 최종 메시지로 한 번 더 반영 (스트림 파싱 차이 보정)
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = assistantMessage;
        return next;
      });

      const effectiveRoomId = roomIdRef.current;
      if (!isNewChat) {
        setChatList((prev) =>
          prev.map((chat) =>
            chat.roomId === effectiveRoomId
              ? {
                  ...chat,
                  messages: [...chat.messages, userMessage, assistantMessage]
                }
              : chat
          )
        );
      } else {
        setChatList((prev) =>
          prev.map((chat) =>
            chat.roomId === effectiveRoomId
              ? {
                  ...chat,
                  messages: [...chat.messages, assistantMessage]
                }
              : chat
          )
        );
      }
    } catch {
      // 에러 시 사용자 메시지 유지 (필요하면 토스트 등 처리)
    } finally {
      setIsFetching(false);
      setIsShowSkeleton(false);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // 한글 입력 시 조합 중일 때는 Enter 키 처리 건너뛰기
      if (e.nativeEvent.isComposing) return;

      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <div
      className={`flex flex-col h-full min-h-0 ${uiType === "default" ? "justify-end" : "justify-start"}`}
    >
      {/* 채팅 메시지 영역 */}
      {uiType !== "default" && (
        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 ">
          {messages && messages.length > 0 ? (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.type === "REQUEST" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-[15px] font-medium leading-relaxed whitespace-pre-line ${
                      msg.type === "REQUEST"
                        ? "max-w-[85%] bg-gray-200 text-gray-800 rounded-tr-none"
                        : "max-w-[90%] bg-white text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              {isShowSkeleton && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2.5 w-[90%] bg-white text-gray-800">
                    <TextSkeleton lines={3} className="min-w-[120px]" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-[16px]">궁금한 점을 물어보세요.</p>
            </div>
          )}
        </div>
      )}

      {/* 입력 영역: 1줄 기본, 최대 3줄 후 내부 스크롤 */}
      <form className="flex-shrink-0 flex items-end justify-end gap-2 pt-3 ">
        <textarea
          id="aiChatInput"
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="무엇이 궁금하신가요?"
          rows={1}
          disabled={isFetching}
          className="flex-1 resize-none rounded-xl bg-gray-100 px-4 py-2 text-[15px] leading-6 placeholder:text-gray-400 outline-none overflow-y-auto min-h-[40px] max-h-[96px] disabled:opacity-60"
          style={{ height: MIN_HEIGHT }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isFetching}
          aria-label="전송"
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          {isFetching ? (
            <span className="text-white text-sm">...</span>
          ) : (
            <Image src="/icons/ChatSend.svg" alt="" width={40} height={40} />
          )}
        </button>
      </form>
    </div>
  );
}
