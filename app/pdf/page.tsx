import { Suspense } from "react";
import PdfClient from "./_components/PdfClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 내보내기 | SIMVEX",
  description: "3D 모델 분석 결과와 학습 내용을 PDF로 내보냅니다."
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PdfClient />
    </Suspense>
  );
}
