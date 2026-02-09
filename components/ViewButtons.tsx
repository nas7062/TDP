import { Dispatch, SetStateAction } from "react";
import ActionButton from "./ActionButton";

interface Props {
  moveCameraToView: (view: ViewPreset) => void;
  setIsMoveCamera: Dispatch<SetStateAction<boolean>>;
}

export default function ViewButtons({ moveCameraToView, setIsMoveCamera }: Props) {
  return (
    <div className="fixed bottom-6 left-1/11  flex  gap-2 z-50">
      <ActionButton
        icon="/icons/UpView.svg"
        label="위쪽 보기"
        onClick={() => {
          moveCameraToView("TOP");
          setIsMoveCamera(false);
        }}
      />
      <ActionButton
        icon="/icons/BottomView.svg"
        label="아래쪽 보기"
        onClick={() => {
          moveCameraToView("BOTTOM");
          setIsMoveCamera(false);
        }}
      />
      <ActionButton
        icon="/icons/LeftView.svg"
        label="왼쪽 보기"
        onClick={() => {
          moveCameraToView("LEFT");
          setIsMoveCamera(false);
        }}
      />
      <ActionButton
        icon="/icons/RightView.svg"
        label="오른쪽 보기"
        onClick={() => {
          moveCameraToView("RIGHT");
          setIsMoveCamera(false);
        }}
      />
      <ActionButton
        icon="/icons/FrontView.svg"
        label="앞쪽 보기"
        onClick={() => {
          moveCameraToView("FRONT");
          setIsMoveCamera(false);
        }}
      />
      <ActionButton
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
