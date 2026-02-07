"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    setUser(user);
  }, []);

  return (
    <header className="h-16 relative flex items-center px-4 justify-between  bg-linear-to-r from-blue-50 via-blue-100 to-blue-50 ">
      <Link href="/">
        <h1 className="text-4xl  font-semibold cursor-pointer">SIMVEX</h1>
      </Link>
      {user?.userId && (
        <div className="flex gap-2 justify-center items-center">
          <p className="font-semibold">{user.userId}</p>
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        </div>
      )}
    </header>
  );
}
