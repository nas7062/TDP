import { cn } from "@/lib/utils";

type TextSkeletonProps = {
  className?: string;
  lines?: number;
};

/**
 * 채팅 응답 로딩용 텍스트 스켈레톤. 여러 줄의 막대가 흐르는 애니메이션으로 표시.
 */
export function TextSkeleton({ className, lines = 3 }: TextSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-gray-200 animate-pulse"
          style={{
            width: i === lines - 1 && lines > 1 ? "60%" : "100%"
          }}
        />
      ))}
    </div>
  );
}
