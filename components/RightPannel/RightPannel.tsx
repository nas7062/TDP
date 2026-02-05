"use client";
import Image from "next/image";
import { useState } from "react";
import RightPannelSidebar from "./RightPannelSidebar";
import AIAssistantContent from "./AIAssistantContent";
import MemoContent from "./MemoContent";

const contentList: RightPannelContentType[] = ["AI 어시스턴스", "메모장"];

export default function RightPannel() {
  const [uiType, setUiType] = useState<RightPannelUIType>("default");
  const [contentType, setContentType] = useState<RightPannelContentType>("AI 어시스턴스");

  const onClickExpandBtn = () => {
    setUiType(uiType === "default" ? "expanded" : "default");
  };

  return (
    <div
      className={`fixed right-3 top-[84px] p-7 pl-4 bg-white rounded-lg shadow-lg flex transition-all duration-300 ${uiType === "default" ? "h-[176px]" : "h-[812px]"} max-h-[calc(100vh-120px)] ${uiType === "full" ? "w-[529px]" : "w-[392px]"}`}
    >
      {/* 왼쪽 사이드 영역 */}
      <RightPannelSidebar uiType={uiType} setUiType={setUiType} contentType={contentType} />

      {/* 오른쪽 메인 영역 */}
      <div className="ml-4 w-full flex flex-col min-h-0 flex-1">
        {/* 상단 영역 */}
        <div className="grid grid-cols-[1fr_24px]  h-8 items-center justify-between w-full">
          <ul
            role="tablist"
            className="grid grid-cols-2 items-center justify-center font-medium  text-[15px] "
          >
            {contentList.map((item: RightPannelContentType) => (
              <li
                key={item}
                role="tab"
                aria-selected={contentType === item}
                onClick={() => setContentType(item)}
                className={`${contentType === item ? " text-gray-700" : "bg-white text-gray-400"} cursor-pointer text-center`}
              >
                {item}
              </li>
            ))}
          </ul>
          <button
            role="button"
            onClick={onClickExpandBtn}
            className={`${uiType === "default" ? "rotate-180" : "rotate-0"} transition-all duration-300 h-[fit-content] `}
          >
            <Image src={"/icons/Up.svg"} alt="새로운 글 작성" width={24} height={24} />
          </button>
        </div>
        {/* 메인 컨텐츠 영역 */}

        {contentType === "AI 어시스턴스" && (
          <AIAssistantContent uiType={uiType} setUiType={setUiType} />
        )}
        {contentType === "메모장" && <MemoContent uiType={uiType} setUiType={setUiType} />}
      </div>
    </div>
  );
}
