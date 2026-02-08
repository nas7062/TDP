"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// TODO: 로그인 상태 확인 후 로그인 상태면 viewer 페이지로 이동 라우터 핸들러?

export default function Header() {
  const [user, setUser] = useState<IUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    setUser(user);
  }, []);

  return (
    <header className="h-16 relative flex items-center px-4 justify-between absolute top-0 left-0">
      <Link href="/">
        <h1 className="text-4xl  font-semibold cursor-pointer">
          <Image
            src="/images/Logo.png"
            alt="logo"
            width={77}
            height={24}
            className="w-[77px] h-auto"
          />
        </h1>
      </Link>
      {user?.userId && (
        <div className="flex gap-2 justify-center items-center">
          <p className="font-semibold">{user.userId}님</p>
          {pathname !== "/" && (
            <Link href="/">
              <Image src="/icons/Home.svg" alt="홈으로" width={24} height={24} />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
