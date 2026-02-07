"use client";
import { Dispatch, SetStateAction } from "react";
import PartItem from "./PartItem";

interface Props {
  partList: IPart[];
  setIsMenu: Dispatch<SetStateAction<boolean>>;
  setSelectedPart: Dispatch<SetStateAction<IModelParts | null>>;
  setIsDetail: Dispatch<SetStateAction<boolean>>;
  model: IModelDetail | null;
}

export default function PartList({
  partList,
  setIsMenu,
  setSelectedPart,
  setIsDetail,
  model
}: Props) {
  const handleDetailClick = (part: IModelParts) => {
    setSelectedPart(part);
    setIsMenu(false);
    setIsDetail(true);
  };

  if (!model) return;
  const item = {
    idx: model?.idx,
    name: model?.name,
    image: model?.image,
    description: model?.description
  };
  return (
    <div>
      <div className="flex flex-col gap-4">
        <PartItem onClick={handleDetailClick} part={item} key={item.idx} />
        {model?.items.map((item) => (
          <PartItem onClick={handleDetailClick} part={item} key={item.idx} />
        ))}
      </div>
    </div>
  );
}
