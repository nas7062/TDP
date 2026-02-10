import { Suspense } from "react";
import ViewerClient from "./_components/ViewerClient ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "모델 학습하기 | SIMVEX",
  description: "학습 목적에 맞는 3D 기계 모델을 선택하고 구조를 직관적으로 살펴봅니다."
};

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen" />}>
      <ViewerClient />
    </Suspense>
  );
}
