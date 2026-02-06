"use client";

import { useState } from "react";
import ThreeViewer from "@/components/ThreeViewer";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SelectBox from "@/components/SelectBox";
import { PartListMock } from "@/constant";
import DetailBox from "@/components/DetailBox";
import RightPannel from "@/components/RightPannel/RightPannel";
import ThreeView from "@/components/ThreeView/ThreeView";

export default function ViewerPage() {
  const searchParams = useSearchParams();
  const idx = searchParams.get("modelIdx");
  const [isMenu, setIsMenu] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [selectedPart, setSelectedPart] = useState<IPart | null>(null);


  const hnadleMenuClose = () => {
    setIsMenu(!isMenu);
    setIsDetail(false);
  };
  return (
    <div className="flex w-screen h-screen px-2">
      <div className="absolute top-20 left-4 w-96 z-1">
        <div className="w-96 h-20 shadow-lg flex justify-between items-center px-7 bg-white rounded-lg">
          <p className="font-medium">{idx}</p>
          <Image
            className="cursor-pointer"
            onClick={hnadleMenuClose}
            src={`/icons/${isMenu ? "Up" : "Down"}.svg`}
            alt="아이콘"
            width={20}
            height={20}
          />
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out overflow-hidden 
            ${isMenu ? "max-h-screen transform translate-y-5" : "max-h-0 transform translate-y-0"}`}
        >
          <SelectBox
            partList={PartListMock}
            setIsMenu={setIsMenu}
            setSelectedPart={setSelectedPart}
            setIsDetail={setIsDetail}
          />
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out overflow-hidden 
            ${isDetail ? "max-h-screen transform translate-y-5" : "max-h-0 transform translate-y-0"}`}
        >
          {selectedPart && (
            <DetailBox selectedPart={selectedPart} setIsDetail={setIsDetail} isDetail={isDetail} />
          )}
        </div>
      </div>
      <div className="flex-1 ">
        <ThreeView />
      </div>
      <RightPannel />
    </div>
  );
}
