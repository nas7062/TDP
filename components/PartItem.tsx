import Image from "next/image";

interface Props {
  part: IModelParts;
  onClick: (part: IModelParts) => void;
}

export default function PartItem({ part, onClick }: Props) {
  return (
    <div className="flex justify-between items-center ">
      <p className="text-[#A6A6A6]">{part.name}</p>
      <Image
        onClick={() => onClick(part)}
        className="text-white cursor-pointer"
        src={"/icons/Dropdown.svg"}
        alt="상세보기"
        width={20}
        height={20}
      />
    </div>
  );
}
