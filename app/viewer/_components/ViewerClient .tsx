"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { PartListMock } from "@/constant";

import { fetchModelByIdx } from "@/lib/api/model";
import dynamic from "next/dynamic";

const ThreeView = dynamic(() => import("@/components/ThreeView/ThreeView"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">3D 로딩 중...</div>
});

const SelectBox = dynamic(() => import("@/components/SelectBox"), {
  ssr: false,
  loading: () => <div className="p-4">메뉴 로딩 중...</div>
});

const DetailBox = dynamic(() => import("@/components/DetailBox"), {
  ssr: false,
  loading: () => <div className="p-4">상세 로딩 중...</div>
});

const RightPannel = dynamic(() => import("@/components/RightPannel/RightPannel"), {
  ssr: false,
  loading: () => null
});

export default function ViewerClient() {
  const searchParams = useSearchParams();
  const [isMenu, setIsMenu] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [selectedPart, setSelectedPart] = useState<IModelParts | null>(null);
  const [model, setModel] = useState<IModelDetail | null>(null);
  const modelIdx = Number(searchParams.get("modelIdx"));
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
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
    if (!modelIdx || !user?.idx) return;
    setLoading(true);
    const fetchModel = async () => {
      try {
        const data = await fetchModelByIdx({ userIdx: Number(user?.idx), modelIdx });
        setModel(data);
      } catch (error) {
        setModel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, [modelIdx, user?.idx]);

  useEffect(() => {
    if (!selectedName) {
      setSelectedPart(null);
      setIsDetail(false);
      return;
    }

    const part = model?.items.find((p) => p.name === selectedName) ?? null;
    setSelectedPart(part);
    setIsDetail(!!part);
  }, [selectedName, model?.items]);
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
          {isMenu && (
            <SelectBox
              partList={PartListMock}
              setIsMenu={setIsMenu}
              setSelectedPart={setSelectedPart}
              setIsDetail={setIsDetail}
              model={model}
            />
          )}
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out overflow-hidden 
            ${isDetail ? "max-h-screen transform translate-y-5" : "max-h-0 transform translate-y-0"}`}
        >
          {selectedPart && isDetail && (
            <DetailBox selectedPart={selectedPart} setIsDetail={setIsDetail} isDetail={isDetail} />
          )}
        </div>
      </div>
      <div className="flex-1 ">
        <ThreeView
          setSelectedName={setSelectedName}
          selectedName={selectedName}
          user={user}
          modelIdx={modelIdx}
          model={model}
        />
      </div>
      <Suspense fallback={null}>
        <RightPannel />
      </Suspense>
    </div>
  );
}
