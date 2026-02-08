import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
  xl: "size-10 border-[4px]"
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="로딩 중"
      className={cn(
        "inline-block rounded-full  border-current border-t-transparent animate-spin text-blue-500",
        sizeClasses[size],
        className
      )}
    />
  );
}
