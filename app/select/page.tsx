"use client"
import Image from "next/image";
import Tab from "./_components/Tab";
import { useState } from "react";

const machineList = {
  "기계공학": [
    { name: "로봇 팔", img: "/images/Arm.png" },
    { name: "드론", img: "/images/Drone.png" },
    { name: "V4 Engine", img: "/images/Engine.png" },
    { name: "Leaf Spring", img: "/images/Spring.png" },
    { name: "Robot Gripper", img: "/images/Gripper.png" },
    { name: "Machine Vice", img: "/images/Vice.png" },
    { name: "Suspension", img: "/images/Suspension.png" },
  ],
  "생명공학": [
    { name: "생명공학1", img: "/images/Vice.png" },
  ],
  "의공학": [
    { name: "의공학1", img: "/images/Suspension.png" },
  ],
};

export type TabType = "기계공학" | "생명공학" | "의공학"


export default function SelectPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("기계공학");

  return (
    <div className="w-screen h-screen flex flex-col gap-20 ">
      <div className="w-full">
        <h2 className="text-center font-semibold text-2xl">학습 기계 장비를 선택해주세요.</h2>
      </div>

      {/* Tab 컴포넌트에 상태와 상태 변경 함수 전달 */}
      <div>
        <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>

      {/* 탭에 맞는 아이템 리스트 표시 */}
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
