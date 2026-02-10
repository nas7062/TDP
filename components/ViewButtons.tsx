import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  moveCameraToView: (view: ViewPreset) => void;
  setIsMoveCamera: Dispatch<SetStateAction<boolean>>;
}

export default function ViewButtons({ moveCameraToView, setIsMoveCamera }: Props) {
  return (
    <Dialog modal={false} open>
      <DialogContent className="sm:max-w-xs flex flex-col gap-4 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.12)] left-[23%]  top-[unset] bottom-[-100px] w-[198px]">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-lg font-semibold text-gray-900">보기</DialogTitle>
        </DialogHeader>

        {/* 보기 옵션 리스트 */}
        <ul className="flex flex-col gap-3 pl-2">
          <li>
            <button
              type="button"
              onClick={() => {
                moveCameraToView("TOP");
                setIsMoveCamera(false);
              }}
              className="flex items-center gap-3 text-[16px] text-gray-700 hover:text-black"
            >
              <Image src="/icons/UpView.svg" alt="" width={24} height={24} />
              <span>위쪽 보기</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                moveCameraToView("BOTTOM");
                setIsMoveCamera(false);
              }}
              className="flex items-center gap-3 text-[16px] text-gray-700 hover:text-black"
            >
              <Image src="/icons/BottomView.svg" alt="" width={24} height={24} />
              <span>아래쪽 보기</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                moveCameraToView("RIGHT");
                setIsMoveCamera(false);
              }}
              className="flex items-center gap-3 text-[16px] text-gray-700 hover:text-black"
            >
              <Image src="/icons/RightView.svg" alt="" width={24} height={24} />
              <span>오른쪽 보기</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                moveCameraToView("LEFT");
                setIsMoveCamera(false);
              }}
              className="flex items-center gap-3 text-[16px] text-gray-700 hover:text-black"
            >
              <Image src="/icons/LeftView.svg" alt="" width={24} height={24} />
              <span>왼쪽 보기</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                moveCameraToView("FRONT");
                setIsMoveCamera(false);
              }}
              className="flex items-center gap-3 text-[16px] text-gray-700 hover:text-black"
            >
              <Image src="/icons/FrontView.svg" alt="" width={24} height={24} />
              <span>앞쪽 보기</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                moveCameraToView("BACK");
                setIsMoveCamera(false);
              }}
              className="flex items-center gap-3 text-[16px] text-gray-700 hover:text-black"
            >
              <Image src="/icons/BackView.svg" alt="" width={24} height={24} />
              <span>뒤쪽 보기</span>
            </button>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
