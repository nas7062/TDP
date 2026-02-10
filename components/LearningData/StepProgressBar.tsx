interface Props {
  steps: string[];
  solvedCount: number;
  leftLabel?: string;
  rightLabel?: string;
}

export function StepProgressBar({ steps, solvedCount, leftLabel, rightLabel }: Props) {
  const STEP_SIZE = 16;

  const stepIndex = Math.floor(solvedCount / STEP_SIZE);
  const clampedStep = Math.min(stepIndex, steps.length - 1);

  const stepProgress = solvedCount % STEP_SIZE;
  const percent = (stepProgress / STEP_SIZE) * 100;

  return (
    <div className="w-full p-6">
      {/* 프로그레스 바 */}
      <div className="h-3 w-full rounded-full bg-white   overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 라벨 */}
      <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
        <span className="font-medium text-blue-400">{leftLabel ?? steps[clampedStep]}</span>
        <span>{rightLabel ?? steps[clampedStep + 1] ?? ""}</span>
      </div>
    </div>
  );
}
