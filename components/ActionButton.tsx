import Image from "next/image";

interface Props {
  icon: string;
  label: string;
}

export default function ActionButton({ icon, label }: Props) {
  return (
    <div className="p-2 bg-gray-200 flex flex-col justify-center items-center rounded-lg w-24 cursor-pointer">
      <Image src={icon} alt="아이콘" width={30} height={30} />
      <p className="font-medium">{label}</p>
    </div>
  );
} 