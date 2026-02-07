"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SelectBox from "@/components/SelectBox";
import { PartListMock } from "@/constant";
import DetailBox from "@/components/DetailBox";
import RightPannel from "@/components/RightPannel/RightPannel";
import ThreeView from "@/components/ThreeView/ThreeView";
import { fetchModelByIdx } from "@/lib/api/model";

export default function ViewerClient() {
  const searchParams = useSearchParams();
  const [isMenu, setIsMenu] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [selectedPart, setSelectedPart] = useState<IModelParts | null>(null);
  const [model, setModel] = useState<IModelDetail | null>(null);
  const modelIdx = Number(searchParams.get("modelIdx"));
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const hnadleMenuClose = () => {
    setIsMenu(!isMenu);
    setIsDetail(false);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    setUser(user);
  }, []);

  useEffect(() => {
    console.log(modelIdx, user?.idx);
    if (!modelIdx || !user?.idx) return;
    setLoading(true);
    const fetchModel = async () => {
      try {
        const data = await fetchModelByIdx({ userIdx: Number(user?.idx), modelIdx });
        setModel(data);
        console.log(data);
      } catch (error) {
        setModel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, [modelIdx, user?.idx]);

  return (
    <div className="flex w-screen h-screen px-2">
      <div className="absolute top-20 left-4 w-96 z-1">
        <div className="w-96 h-20 shadow-lg flex justify-between items-center px-7 bg-white rounded-lg">
          <p className="font-medium">{model?.name}</p>
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
            model={model}
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
