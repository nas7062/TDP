import { deleteMemo } from "@/lib/api/memo";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
  contentType: RightPannelContentType;
  chatList?: ChatContent[];
  roomId?: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  sideContentType: RightPannelSideContentType;
  setSideContentType: Dispatch<SetStateAction<RightPannelSideContentType>>;
  memoList?: MemoContent[];
  memoIdx?: number | null;
  setMemoIdx: Dispatch<SetStateAction<number | null>>;
};

// 일단 더미데이터
const searchChatList: ChatContent[] = [
  {
    roomId: "1",
    createDate: "2026-02-05T13:06:12.107Z",
    messages: [
      { type: "REQUEST", message: "지금 하이라이트된 부품이 엔진 전체에서 정확히 어떤 역할을 해?" }
    ]
  }
];

const searchMemoList: MemoContent[] = [
  {
    idx: 1,
    memo: "2026-02-05T13:06:12.107Z"
  },
  {
    idx: 2,
    memo: "2026-02-05T13:06:12.107Z"
  }
];

// 사이드 버튼들 /  기록, 검색
export default function RightPannelSidebar({
  uiType,
  setUiType,
  sideContentType,
  setSideContentType,
  contentType, //UI 관련
  chatList,
  roomId,
  setRoomId,
  memoList,
  memoIdx,
  setMemoIdx //데이터 관련
}: Props) {
  const userIdx =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}")?.idx : "";
  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : 0;

  const onClickSideBarBtn = () => {
    setUiType(uiType === "full" ? "expanded" : "full");
    if (uiType == "full" && sideContentType === "search") {
      setSideContentType("history");
    }
  };

  const onClickAddBtn = () => {
    setUiType((prev) => (prev === "default" ? "expanded" : prev));
    // ai
    if (contentType === "AI 어시스턴스" && roomId !== "") {
      setRoomId("");
      document.getElementById("aiChatInput")?.focus();
    }
    // 메모
    if (contentType === "메모장" && memoIdx !== null) {
      setMemoIdx(null);
      document.getElementById("memoInput")?.focus();
    }
  };

  const onClickSearchBtn = () => {
    setSideContentType("search");
    setUiType((prev) => (prev !== "full" ? "full" : prev));
  };

  const onClickXBtn = () => {
    setSideContentType("history");
    // 검색어 다 지우기
  };

  const onClickMemoDeleteBtn = (memoIdx: number) => {
    deleteMemo({ userIdx: Number(userIdx), modelIdx: Number(modelIdx), memoIdx });
  };

  // TODO: 채팅 삭제 api 추가 및 연동 필요
  const onClickChatDeleteBtn = (roomId: string) => {
    // deleteChat({ userIdx: Number(userIdx), modelIdx: Number(modelIdx), roomId });
  };

  return (
    <div
      className={`${uiType === "full" ? "w-[176px]" : "w-[55px]"}  flex flex-col gap-[24px] transition-all duration-300 h-full bg-white border-r border-gray-200`}
    >
      <button role="button" onClick={onClickSideBarBtn} className="px-2">
        <Image src={"/icons/SideBar.svg"} alt="사이드바" width={24} height={24} />
      </button>
      <button role="button" onClick={onClickAddBtn} className="px-2">
        <Image
          src={`/icons/${contentType == "AI 어시스턴스" ? "+" : "Write"}.svg`}
          alt="새로운 글 작성"
          width={24}
          height={24}
        />
      </button>

      {sideContentType == "history" ? (
        <button role="button" onClick={onClickSearchBtn} className="px-2">
          <Image src={"/icons/Search.svg"} alt="검색" width={24} height={24} />
        </button>
      ) : (
        <div className="relative flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2 w-[160px]">
          <input
            id="searchInput"
            type="text"
            placeholder="검색하세요"
            className="text-blue-400 placeholder:text-gray-400 font-[16px] bg-transparent outline-none w-[114px]"
            autoFocus
          />
          <Image
            src={"/icons/X.svg"}
            className="text-gray-500  cursor-pointer"
            onClick={onClickXBtn}
            width={24}
            height={24}
            alt="삭제"
          />
        </div>
      )}

      {uiType == "full" && (
        <ul className="overflow-y-auto max-h-[calc(100vh-200px)] ">
          {contentType == "AI 어시스턴스" &&
            (sideContentType === "history" ? chatList : searchChatList)?.map((item) => (
              <li
                key={item.roomId}
                onClick={() => setRoomId(item.roomId)}
                className={`group cursor-pointer ${roomId === item.roomId ? "bg-gray-100" : ""} px-2.5 leading-[38px] mr-4 rounded-lg hover:bg-gray-50`}
              >
                <p className={`group-hover:max-w-[120px] max-w-[155px] truncate h-[38px] `}>
                  {item.messages?.[0]?.message}
                </p>
                <button
                  role="button"
                  className="absolute right-1.5 top-2 hidden group-hover:block"
                  onClick={() => onClickChatDeleteBtn(item.roomId)}
                >
                  <Image src={"/icons/Trash.svg"} alt="삭제" width={20} height={20} />
                </button>
              </li>
            ))}

          {contentType == "메모장" &&
            (sideContentType === "history" ? memoList : searchMemoList)?.map((item) => (
              <li
                key={item.idx}
                onClick={() => setMemoIdx(item.idx)}
                className={`group cursor-pointer ${memoIdx === item.idx ? "bg-gray-100" : ""} px-2.5 leading-[38px] mr-4 rounded-lg hover:bg-gray-50 relative`}
              >
                <p className={`group-hover:max-w-[120px] max-w-[155px] truncate h-[38px] `}>
                  {item.memo || "내용 없음"}
                </p>
                <button
                  role="button"
                  className="absolute right-1.5 top-2 hidden group-hover:block"
                  onClick={() => onClickMemoDeleteBtn(item.idx)}
                >
                  <Image src={"/icons/Trash.svg"} alt="삭제" width={20} height={20} />
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
