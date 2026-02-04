"use client"
import Image from "next/image";
import Tab from "./_components/Tab";
import { useState } from "react";
import { machineList } from "@/constant";
import { TabType } from "@/types";


export default function SelectPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("기계공학");

  return (
    <div className="w-screen h-screen flex flex-col gap-20 ">
      <div className="w-full">
        <h2 className="text-center font-semibold text-2xl">학습 기계 장비를 선택해주세요.</h2>
      </div>
      <div>
        <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div className="grid grid-cols-4 justify-center gap-4 mt-6 max-w-7xl w-full mx-auto">
        {machineList[selectedTab].map((item, index) => (
          <div key={index} >
            <img src={item.img} alt={item.name} className=" object-cover aspect-video rounded-lg shadow-lg" />
            <div className="flex justify-between items-center  h-14">
              <p className="text-lg font-medium">{item.name}</p>
              <button className="cursor-pointer shadow-lg" aria-label="바로가기"><Image src={'/icons/goIcon.png'} alt="바로가기" width={40} height={40} /></button>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}
