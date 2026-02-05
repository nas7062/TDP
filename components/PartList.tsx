"use client";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface Props {
  partList: IPart[];
  setIsMenu: Dispatch<SetStateAction<boolean>>;
  setSelectedPart: Dispatch<SetStateAction<IPart | null>>;
  setIsDetail: Dispatch<SetStateAction<boolean>>;
}

export default function PartList({ partList, setIsMenu, setSelectedPart, setIsDetail }: Props) {
  const handleDetailClick = (part: IPart) => {
    setSelectedPart(part);
    setIsMenu(false);
    setIsDetail(true);
  };
  return (
    <div>
      <div className="flex flex-col gap-4">
        {partList.map((part, idx) => (
          <div className="flex justify-between items-center " key={idx}>
            <p className="text-[#A6A6A6]">{part.name}</p>
            <Image
              onClick={() => handleDetailClick(part)}
              className="text-white cursor-pointer"
              src={"/icons/Dropdown.svg"}
              alt="상세보기"
              width={20}
              height={20}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
