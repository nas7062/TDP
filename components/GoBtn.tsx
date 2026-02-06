"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GoBtn({ modelIdx }: { modelIdx: number }) {
  const router = useRouter();
  return <button
    onClick={() => router.push(`/viewer?modelIdx=${modelIdx}`)}
    className="cursor-pointer shadow-lg"
    aria-label="바로가기"
  >
    <Image src={"/icons/goIcon.png"} alt="바로가기" width={40} height={40} />
  </button>
}