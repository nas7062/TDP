export const dynamic = "force-dynamic";
export const revalidate = 0;

import { fetchCategory } from "@/lib/api/model";
import SelectClient from "./_components/SelectClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "모델 선택하기 | SIMVEX",
  description: "학습 목적에 맞는 3D 기계 모델을 선택하고 구조를 직관적으로 살펴봅니다."
};
export default async function SelectPage() {
  const category = await fetchCategory();
  return <SelectClient category={category} />;
}
