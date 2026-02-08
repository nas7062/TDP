import { cn } from "@/lib/utils";
import { CHIP_LEVEL_CONFIG, type ChipLevel } from "@/constant";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  level?: ChipLevel;
}

export function Chip({ level = 1, className, ...props }: ChipProps) {
  const config = CHIP_LEVEL_CONFIG[level];
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-2 py-1  text-[10px] font-semibold",
        config.className,
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  );
}
