import Image from "next/image";

export default function GoBtn({ modelIdx }: { modelIdx: number }) {
  return (
    <button className="cursor-pointer shadow-lg" aria-label="바로가기">
      <Image src={"/icons/GoIcon.svg"} alt="바로가기" width={40} height={40} />
    </button>
  );
}
