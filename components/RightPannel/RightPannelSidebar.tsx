import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
  contentType: RightPannelContentType;
};

// 일단 더미데이터
const historyList = [
  { id: 1, name: "기록질문 이 길 다 면 얼마나 기냐1" },
  { id: 2, name: "기록2" },
  { id: 3, name: "기록3" },
  { id: 4, name: "기록4" },
  { id: 5, name: "기록5" },
  { id: 6, name: "기록6" }
];

const searchList = [
  { id: 1, name: "검색질문 이 길 다 면 얼마나 검색냐1" },
  { id: 2, name: "검색질문 이 길 다 면 얼마나 검색냐2" },
  { id: 3, name: "검색질문 이 길 다 면 얼마나 검색냐3" },
  { id: 4, name: "검색질문 이 길 다 면 얼마나 검색냐4" },
  { id: 5, name: "검색질문 이 길 다 면 얼마나 검색냐5" },
  { id: 6, name: "검색질문 이 길 다 면 얼마나 검색냐6" }
];

// 사이드 버튼들 /  기록, 검색
export default function RightPannelSidebar({ setUiType, uiType, contentType }: Props) {
  const [sideContent, setSideContent] = useState<RightPannelSideContentType>("history");

  const onClickSideBarBtn = () => {
    setUiType(uiType === "full" ? "expanded" : "full");

    if (uiType == "full" && sideContent === "search") {
      setSideContent("history");
    }
  };

  const onClickAddBtn = () => {
    setUiType((prev) => (prev === "default" ? "expanded" : prev));
    // ai면 새로운 컨텍스트 시작하기
    // 메모면 메모장 창 열기

    //  걍똑같나?
    if (uiType !== "default") {
      //  ai 어시스턴트 + 기존 컨텍스트가 있다면 (그거까지 저장하고.?) =>  새로운 컨텍스트 열기
      // 메모 + 쓰고있는 메모가 있다면 (그거까지 저장하고.?) => 새로운 메모 열기
    }
  };

  const onClickSearchBtn = () => {
    setSideContent((prev) => (prev === "search" ? "history" : "search"));
    setUiType((prev) => (prev === "default" ? "full" : prev));
  };

  return (
    <div
      className={`${uiType === "full" ? "w-1/2" : "w-[55px]"}  flex flex-col gap-[24px] transition-all duration-300 h-full bg-white border-r border-gray-200`}
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

      {sideContent == "history" ? (
        <button role="button" onClick={onClickSearchBtn} className="px-2">
          <Image src={"/icons/Search.svg"} alt="검색" width={24} height={24} />
        </button>
      ) : (
        <div className="relative flex items-center bg-gray-200 rounded-lg px-3 py-2 w-[160px] mr-4">
          <img src={"/icons/Search.svg"} className=" text-gray-500 mr-2" onClick={onClickSearchBtn} />
          <input
            id="searchInput"
            type="text"
            placeholder="검색하세요"
            className="text-blue-400 placeholder:text-gray-400 font-[16px] bg-transparent outline-none w-[104px] "
            autoFocus
          />
        </div>
      )}

      {uiType == "full" && (
        <ul className="overflow-y-auto max-h-[calc(100vh-200px)] px-2">
          {sideContent === "history"
            ? historyList?.map((item) => (
              <li key={item.id}>
                <p className="max-w-[155px] truncate mb-1">{item.name}</p>
              </li>
            ))
            : searchList?.map((item) => (
              <li key={item.id}>
                <p className="max-w-[155px] truncate mb-1">{item.name}</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
