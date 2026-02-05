import { Dispatch, SetStateAction } from "react";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
};

export default function MemoContent({ uiType, setUiType }: Props) {
  return <div>MemoContent</div>;
}
