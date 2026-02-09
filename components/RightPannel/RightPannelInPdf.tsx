"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import RightPannelSidebar from "./RightPannelSidebar";
import AIAssistantContent from "./AIAssistantContent";
import MemoContent from "./MemoContent";
import { getChatList } from "@/lib/api/aiAssistant";
import { useSearchParams } from "next/navigation";
import { getMemoList } from "@/lib/api/memo";

const contentList: RightPannelContentType[] = ["AI 어시스턴스", "메모장"];

export default function RightPannelInPdf() {
  const userIdx =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}")?.idx : "";

  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : 0;

  const [uiType, setUiType] = useState<RightPannelUIType>("full");
  const [contentType, setContentType] = useState<RightPannelContentType>("AI 어시스턴스");
  const [sideContentType, setSideContentType] = useState<RightPannelSideContentType>("history");

  const [chatList, setChatList] = useState<ChatContent[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const selectedChat = useMemo(
    () => chatList.find((chat) => chat.roomId === roomId),
    [chatList, roomId]
  );
  const [memoList, setMemoList] = useState<MemoContent[]>([]);
  const [memoIdx, setMemoIdx] = useState<number | null>(null);
  const selectedMemo = useMemo(
    () => memoList.find((memo) => memo.idx === memoIdx),
    [memoList, memoIdx]
  );

  useEffect(() => {
    let cancelled = false;
    async function fetchChatList() {
      try {
        if (isNaN(Number(userIdx))) return;
        const res = await getChatList({ userIdx: Number(userIdx), modelIdx });
        if (!cancelled && res?.contents) setChatList(res.contents);
      } catch {}
    }

    async function fetchMemoList() {
      try {
        if (isNaN(Number(userIdx))) return;
        const res = await getMemoList({ userIdx: Number(userIdx), modelIdx });
        if (!cancelled && res?.contents) setMemoList(res.contents);
      } catch {}
    }

    if (contentType === "AI 어시스턴스") fetchChatList();
    if (contentType === "메모장") fetchMemoList();
    return () => {
      cancelled = true;
    };
  }, [modelIdx, contentType]);

  return (
    <div
      className={`relative p-7 pl-4 bg-white rounded-lg shadow-lg flex  duration-300 h-[680px] ${uiType === "full" ? "w-[529px]" : "w-[392px]"}  `}
    >
      {/* 왼쪽 사이드 영역 */}
      <Suspense fallback={null}>
        <RightPannelSidebar
          uiType={uiType}
          setUiType={setUiType}
          contentType={contentType}
          sideContentType={sideContentType}
          setSideContentType={setSideContentType}
          chatList={chatList}
          setChatList={setChatList}
          roomId={roomId}
          setRoomId={setRoomId}
          memoList={memoList}
          setMemoList={setMemoList}
          memoIdx={memoIdx}
          setMemoIdx={setMemoIdx}
          isPdfPage={true}
        />
      </Suspense>

      {/* 오른쪽 메인 영역 */}
      <div className="ml-4 w-full flex flex-col justify-between min-h-0 flex-1">
        {/* 상단 영역 */}
        <div className="grid grid-cols-[1fr_24px]  h-8 items-center justify-between w-full mb-2">
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
        </div>
        {/* 메인 컨텐츠 영역 */}

        {contentType === "AI 어시스턴스" && (
          <Suspense fallback={null}>
            <AIAssistantContent
              uiType={uiType}
              setUiType={setUiType}
              roomId={roomId}
              setRoomId={setRoomId}
              selectedChat={selectedChat}
              setChatList={setChatList}
            />
          </Suspense>
        )}
        {contentType === "메모장" && (
          <Suspense fallback={null}>
            <MemoContent
              uiType={uiType}
              setUiType={setUiType}
              memoIdx={memoIdx}
              setMemoIdx={setMemoIdx}
              selectedMemo={selectedMemo}
              setMemoList={setMemoList}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
