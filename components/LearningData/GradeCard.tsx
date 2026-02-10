import { CHIP_LEVEL_CONFIG, FALLBACK_GRADES } from "@/constant";
import { Grade } from "./Grade";
import { StepProgressBar } from "./StepProgressBar";
import Popover from "./Popover";
import Image from "next/image";
import { UserQuizMeResponse } from "@/types/api";

export default function GradeCard({ data }: { data: UserQuizMeResponse }) {
  console.log(data);
  return (
    <div className="bg-gray-100 w-4xl mx-auto p-4 rounded-lg flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold">등급 달성률</p>

        <Popover
          trigger={
            <Image
              src="/icons/Info.svg"
              alt="등급안내 아이콘"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          }
        >
          <Grade
            grades={FALLBACK_GRADES}
            currentGrade={data.currentGrade}
            CHIP_LEVEL_CONFIG={CHIP_LEVEL_CONFIG}
          />
        </Popover>
      </div>

      <p className="text-center">
        {data.problemsToNextGrade > 0
          ? `${data.problemsToNextGrade}문제 남았어요. 힘내보세요!`
          : "다음 등급 조건을 달성했습니다."}
      </p>

      <StepProgressBar
        steps={[
          "입문 지망생",
          "테크니션",
          "매커닉",
          "전문 기술자",
          "수석 설계자",
          "마스터 엔지니어"
        ]}
        solvedCount={data.totalSolved}
      />
    </div>
  );
}
