import Image from "next/image";

interface Props {
  icon: string;
  label: string;
  onClick?: () => void;
}

export default function ViewButton({ icon, label, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex gap-0.5 items-center z-50 rounded-lg bg-white shadow border border-gray-200 px-1 py-1 cursor-pointer text-sm font-medium hover:bg-gray-50"
    >
      <Image src={icon} alt="아이콘" width={30} height={30} />
      <p className="font-medium">{label}</p>
    </div>
  );
}
