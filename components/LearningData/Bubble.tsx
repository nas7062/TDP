export default function Bubble({
  title,
  value,
  size,
  className
}: {
  title: string;
  value: number;
  size: number;
  className: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
