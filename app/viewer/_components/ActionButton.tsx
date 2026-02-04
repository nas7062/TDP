import Image from "next/image";

export default function ActionButton() {
  return (
    <div className="p-2 bg-gray-200 flex flex-col justify-center items-center rounded-lg">
      <Image src={"/icons/Zoom.svg"} alt="아이콘" width={30} height={30} />
      <p className="font-medium">확대/축소</p>
    </div>
  );
}
