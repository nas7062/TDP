"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Tab from "./Tab";
import { fetchCategoryInModel } from "@/lib/api/model";
import ModelCard from "@/components/ModelCard";

interface Props {
  category?: ICategory;
}

export default function SelectClient({ category }: Props) {
  //const [selectedTab, setSelectedTab] = useState<TabType>("기계공학");
  const [selectedTab, setSelectedTab] = useState(1);
  const [modelList, setModelList] = useState<ICategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (selectedTab == null) return;
    setLoading(true);
    const fetchModel = async () => {
      try {
        const data = await fetchCategoryInModel(selectedTab);
        setModelList(data.contents);
      } catch (error) {
        setModelList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, [selectedTab]);

  return (
    <div className="w-screen h-screen flex flex-col gap-10 mt-20 ">
      <div className="w-full">
        <h2 className="text-center font-semibold text-2xl">학습 기계 장비를 선택해주세요.</h2>
      </div>
      <div>
        <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} category={category} />
      </div>
      <div className="grid grid-cols-4 justify-center gap-4 mt-6 max-w-7xl w-full mx-auto">
        {/* {machineList[selectedTab].map((item, index) => (
          <ModelCard model={item} key={index} />
        ))} */}
        {modelList.map((item, index) => (
          <ModelCard model={item} key={index} />
        ))}
      </div>
    </div>
  );
}
