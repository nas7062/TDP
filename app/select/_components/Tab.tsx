import { Dispatch, SetStateAction } from "react";

type Props = {
  //selectedTab: number;
  //setSelectedTab: Dispatch<SetStateAction<number>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<TabType>>;
  category: ICategory
};

export default function Tab({ selectedTab, setSelectedTab, category }: Props) {

  return (
    <div className="flex justify-center items-center">
      {/* <div className="flex bg-white border rounded-2xl overflow-hidden">
        {category.contents.map((cate) =>
          <button
            key={cate.idx}
            onClick={() => setSelectedTab(cate.idx)}
            className={`px-6 py-2 transition-colors duration-300 cursor-pointer rounded-2xl 
              ${selectedTab === cate.idx ? "bg-black text-white" : "bg-white text-black"}`}>
            {cate.name}
          </button>)}
      </div> */}
      <div className="flex bg-white  overflow-hidden border rounded-2xl ">
        {['기계공학', '생명공학', '의공학'].map((cate, idx) =>
          <button
            key={idx}
            onClick={() => setSelectedTab(cate)}
            className={`px-6 py-2 transition-colors duration-300  cursor-pointer  rounded-2xl
              ${selectedTab === cate ? "bg-black text-white" : "bg-white text-black"
              }`}
          >
            {cate}
          </button>)}

      </div>
    </div>
  );
}
