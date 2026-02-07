import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface Props {
  selectedPart: IModelParts;
  isDetail: boolean;
  setIsDetail: Dispatch<SetStateAction<boolean>>;
}

export default function DetailBox({ selectedPart, isDetail, setIsDetail }: Props) {
  return (
    <div className="w-96 flex flex-col gap-3   mt-4 p-7 bg-white rounded-md shadow-lg font-medium text-gray-700">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{selectedPart.name}</h3>
        <Image
          className="cursor-pointer"
          src={`/icons/${isDetail ? "Up" : "Down"}.svg`}
          alt="아이콘"
          width={20}
          height={20}
          onClick={() => setIsDetail(!isDetail)}
        />
      </div>
      <div>
        <Image
          src={selectedPart.image}
          alt={selectedPart.name}
          width={380}
          height={200}
          className="aspect-video"
        />
      </div>
      <div className="flex gap-4 items-center">
        <p>부품 명칭</p>
        <p>{selectedPart.name}</p>
      </div>
      {selectedPart.statusInfo && (
        <div className="flex gap-4 items-center">
          <p>상태 정보</p>
          <p>{selectedPart.statusInfo}</p>
        </div>
      )}
      <hr className="text-gray-300 " />
      <div>
        <p>핵심 설명</p>
        <p>{selectedPart.description}</p>
      </div>
    </div>
  );
}
