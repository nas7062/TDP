"use client";

import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchModelByIdx } from "@/lib/api/model";

export type QuizModalStartContentProps = {
  onLaterClick?: () => void;
  onGoToQuizClick?: () => void;
};

export default function QuizModalStartContent({
  onLaterClick,
  onGoToQuizClick
}: QuizModalStartContentProps) {
  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : 0;
  const [equipmentName, setEquipmentName] = useState<string>("");

  useEffect(() => {
    if (!modelIdx) return;

    const user =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}") : null;
    if (!user?.idx) return;

    const loadModel = async () => {
      const model = await fetchModelByIdx({ userIdx: Number(user.idx), modelIdx });
      setEquipmentName(model.name);
    };

    loadModel();
  }, [modelIdx]);

  return (
    <div className="py-10 flex flex-col justify-center items-center gap-6 font-medium">
      <DialogHeader className="gap-4 text-center">
        <DialogTitle className="text-xl  text-center">학습을 끝내시겠습니까?</DialogTitle>
        {equipmentName && (
          <div className="flex flex-col gap-1.5 text-center text-foreground">
            <p>학습 기계 장비 : {equipmentName}</p>
          </div>
        )}
      </DialogHeader>
      <DialogFooter className="flex-row justify-center gap-3 ">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="min-w-[120px] bg-gray-200 text-gray-800 hover:bg-gray-300"
          onClick={onLaterClick}
        >
          다음에 하기
        </Button>
        <Button
          type="button"
          size="lg"
          className="min-w-[180px] bg-[#4BAEFE] text-white hover:bg-[#4BAEFE] "
          onClick={onGoToQuizClick}
        >
          AI가 생성한 퀴즈 풀러가기
        </Button>
      </DialogFooter>
    </div>
  );
}
