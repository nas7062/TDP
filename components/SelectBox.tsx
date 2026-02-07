import PartList from "./PartList";
import { Dispatch, SetStateAction } from "react";

interface Props {
  partList: IPart[];
  setIsMenu: Dispatch<SetStateAction<boolean>>;
  setSelectedPart: Dispatch<SetStateAction<IModelParts | null>>;
  setIsDetail: Dispatch<SetStateAction<boolean>>;
  model: IModelDetail | null;
}

export default function SelectBox({
  partList,
  setIsMenu,
  setSelectedPart,
  setIsDetail,
  model
}: Props) {
  return (
    <div className="w-96 bg-[#4D4D4D] rounded-xl h-88 p-6">
      <PartList
        partList={partList}
        setIsMenu={setIsMenu}
        setSelectedPart={setSelectedPart}
        setIsDetail={setIsDetail}
        model={model}
      />
    </div>
  );
}
