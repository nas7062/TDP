import { Dispatch, SetStateAction } from "react";

type Props = {
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<TabType>>;
};

export default function Tab({ selectedTab, setSelectedTab }: Props) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex bg-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setSelectedTab("기계공학")}
          className={`px-6 py-2 transition-colors duration-300 border cursor-pointer border-gray-500 rounded-l-2xl ${
            selectedTab === "기계공학" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          기계공학
        </button>
        <button
          onClick={() => setSelectedTab("생명공학")}
          className={`px-6 py-2 transition-colors duration-300 border-t border-b  cursor-pointer border-b-gray-500 border-t-gray-500  ${
            selectedTab === "생명공학" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          생명공학
        </button>
        <button
          onClick={() => setSelectedTab("의공학")}
          className={`px-6 py-2 transition-colors duration-300 border border-gray-500   cursor-pointer rounded-r-2xl ${
            selectedTab === "의공학" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          의공학
        </button>
      </div>
    </div>
  );
}
