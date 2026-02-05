"use client";

import Image from "next/image";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
};

const LINE_HEIGHT = 24;
const PADDING_Y = 24; // py-3
const MAX_LINES = 3;
const MIN_HEIGHT = LINE_HEIGHT + PADDING_Y; // 1줄
const MAX_HEIGHT = LINE_HEIGHT * MAX_LINES + PADDING_Y; // 3줄

// 더미 메시지
const dummyMessages: { role: "user" | "assistant"; text: string }[] = [
  {
    role: "user",
    text: "지금 하이라이트된 부품이 엔진 전체에서 정확히 어떤 역할을 해?"
  },
  {
    role: "assistant",
    text: "터빈 블레이드는 고온·고압 가스의 에너지를 회전 동력으로 바꾸는 핵심 부품입니다. [View: 연소실-터빈 연결부]로 시점을 전환해 드릴게요. 보시면 연소실에서 나온 팽창 가스가 이 날개들을 밀어내며 샤프트를 돌리게 됩니다."
  }
];

export default function AIAssistantContent({ uiType, setUiType }: Props) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    // TODO: 메시지 전송 로직
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-4">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        {dummyMessages?.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-white border border-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역: 1줄 기본, 최대 3줄 후 내부 스크롤 */}
      <div className="flex-shrink-0 flex items-end gap-2 pt-3 pb-1 ">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="무엇이 궁금하신가요?"
          rows={1}
          className="flex-1 resize-none rounded-xl bg-gray-100 px-4 py-3 text-[15px] leading-6 placeholder:text-gray-400 outline-none overflow-y-auto min-h-[48px] max-h-[96px]"
          style={{ height: MIN_HEIGHT }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="전송"
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <Image src="/icons/ChatSend.svg" alt="" width={40} height={40} />
        </button>
      </div>
    </div>
  );
}
