import { Dispatch, SetStateAction } from "react";
import ActionButton from "./ActionButton";
import ViewButton from "./ViewButton";

interface Props {
  moveCameraToView: (view: ViewPreset) => void;
  setIsMoveCamera: Dispatch<SetStateAction<boolean>>;
}

export default function ViewButtons({ moveCameraToView, setIsMoveCamera }: Props) {
  return (
    <div className="fixed bottom-25 left-[42.2%]  flex flex-col gap-1 z-50">
      <ViewButton
        icon="/icons/UpView.svg"
        label="위쪽 보기"
        onClick={() => {
          moveCameraToView("TOP");
          setIsMoveCamera(false);
        }}
      />
      <ViewButton
        icon="/icons/BottomView.svg"
        label="아래쪽 보기"
        onClick={() => {
          moveCameraToView("BOTTOM");
          setIsMoveCamera(false);
        }}
      />
      <ViewButton
        icon="/icons/LeftView.svg"
        label="왼쪽 보기"
        onClick={() => {
          moveCameraToView("LEFT");
          setIsMoveCamera(false);
        }}
      />
      <ViewButton
        icon="/icons/RightView.svg"
        label="오른쪽 보기"
        onClick={() => {
          moveCameraToView("RIGHT");
          setIsMoveCamera(false);
        }}
      />
      <ViewButton
        icon="/icons/FrontView.svg"
        label="앞쪽 보기"
        onClick={() => {
          moveCameraToView("FRONT");
          setIsMoveCamera(false);
        }}
      />
      <ViewButton
        icon="/icons/BackView.svg"
        label="뒤쪽 보기"
        onClick={() => {
          moveCameraToView("BACK");
          setIsMoveCamera(false);
        }}
      />
    </div>
  );
}
