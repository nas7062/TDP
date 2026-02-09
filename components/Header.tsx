"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { HeaderMenu } from "./HeaderMenu";
import { Chip } from "./ui/chip";

export default function Header() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    setUser(user);
  }, []);

  return (
    <header className="h-16 relative flex items-center px-4 justify-between absolute top-0 left-0 z-10">
      <div className="flex items-center gap-4">
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
            <p className="font-semibold text-[10px]">{user.userId}님</p>
            <Chip />
            {/* <Chip level={user?.level} /> */}
          </div>
        )}
      </div>
      <Suspense fallback={null}>
        <HeaderMenu onLogout={() => setUser(null)} />
      </Suspense>
    </header>
  );
}
