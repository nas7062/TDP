import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "나의 학습데이터 | SIMVEX",
  description: "내가 분석한 3D 모델과 학습 기록을 한눈에 확인하고 관리합니다."
};

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
