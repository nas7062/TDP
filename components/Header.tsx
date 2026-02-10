"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { HeaderMenu } from "./HeaderMenu";
import { Chip } from "./ui/chip";
import QuizButton from "./QuizButton/QuizButton";
import { usePathname } from "next/navigation";
import { fetchUserQuizMe } from "@/lib/api/quiz";
import { ChipLevel } from "@/constant";

export default function Header() {
  const [user, setUser] = useState<IUser | null>(null);
  const [grade, setGrade] = useState<ChipLevel | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setUser(null);
        return;
      }
      const parsed = JSON.parse(raw) as IUser | null;
      if (!parsed || !parsed.userId || !parsed.idx) {
        setUser(null);
        return;
      }
      setUser(parsed);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  // 사용자 등급 정보 불러오기
  useEffect(() => {
    if (!user?.idx) return;
    fetchUserQuizMe(user.idx).then((res) => {
      setGrade(res.currentGrade as ChipLevel);
    });
  }, [user]);

  return (
    <header
      className={`h-16 relative flex items-center px-4 justify-between absolute top-0 left-0  ${
        pathname === "/viewer" || pathname === "/pdf" ? "bg-[#FBFBFB] " : ""
      } `}
    >
      <div className="flex items-center gap-4 relative z-10">
        <Link href="/">
          <h1 className="text-4xl  font-semibold cursor-pointer">
            <Image
              src="/images/Logo.png"
              alt="logo"
              width={97}
              height={14}
              className="w-[97px] h-auto"
            />
          </h1>
        </Link>
        {user?.userId && (
          <div className="flex gap-2 justify-center items-center">
            <p className="font-semibold text-[10px]">{user.userId}님</p>
            <Chip grade={grade} />
          </div>
        )}
      </div>
      <Suspense fallback={null}>
        <div className="flex items-center gap-[20px] relative z-10">
          {pathname === "/viewer" && <QuizButton />}
          <HeaderMenu onLogout={() => setUser(null)} />
        </div>
      </Suspense>
    </header>
  );
}
