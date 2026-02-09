"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearUserAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MENU_BOTTOM_ITEMS, MENU_TOP_ITEMS } from "@/constant";

export interface HeaderMenuProps {
  onLogout?: () => void;
}

export function HeaderMenu({ onLogout }: HeaderMenuProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const searchParams = useSearchParams();
  const modelIdx = parseInt(searchParams.get("modelIdx") ?? "");

  const topItems = isHome
    ? MENU_TOP_ITEMS.filter((item) => item.label !== "PDF 내보내기")
    : [...MENU_TOP_ITEMS];
  const bottomItems = isHome
    ? MENU_BOTTOM_ITEMS.filter((item) => item.label !== "홈화면")
    : [...MENU_BOTTOM_ITEMS];

  const handleTopItemClick = (item: (typeof MENU_TOP_ITEMS)[number]) => {
    if ("href" in item && item.href) {
      setPopupOpen(false);
      router.push(`${item.href}${item.href === "/pdf" ? `?modelIdx=${modelIdx}` : ""}`);
    } else {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

  const handleLogout = () => {
    clearUserAuth();
    onLogout?.();
    setPopupOpen(false);
    setLogoutModalOpen(false);
    router.push("/");
  };

  useEffect(() => {
    if (!popupOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("button[data-menu-trigger]")
      ) {
        setPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupOpen]);

  return (
    <>
      <div className="relative" ref={popupRef}>
        <button
          type="button"
          data-menu-trigger
          onClick={() => setPopupOpen((prev) => !prev)}
          className="p-1 rounded hover:bg-black/5"
        >
          <Image src="/icons/Menu.svg" alt="메뉴" width={24} height={24} />
        </button>

        {popupOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl p-8 w-[max-content]">
            <div className="flex gap-2">
              {topItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-50 w-[120px] h-[90px]"
                  onClick={() => handleTopItemClick(item)}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={28}
                    height={28}
                    className="opacity-90"
                  />
                  <span className="text-[14px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col pt-4 gap-0.5">
              {bottomItems.map((item) =>
                "isLogout" in item && item.isLogout ? (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-black w-full text-left"
                    onClick={() => {
                      setPopupOpen(false);
                      setLogoutModalOpen(true);
                    }}
                  >
                    <Image src={item.icon} alt="" width={24} height={24} className="opacity-90" />
                    <span className="text-[16px] font-medium text-gray-700">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={"href" in item ? item.href : "/"}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-black"
                    onClick={() => setPopupOpen(false)}
                  >
                    <Image src={item.icon} alt="" width={24} height={24} className="opacity-90" />
                    <span className="text-[16px] font-medium text-gray-700">{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent
          showCloseButton={false}
          showOverlay={true}
          className="left-1/2 top-1/2 min-w-[280px] -translate-x-1/2 -translate-y-1/2 text-center shadow-2xl"
        >
          <DialogTitle className="text-base font-medium text-black">
            로그아웃 하시겠습니까?
          </DialogTitle>
          <DialogFooter className="mt-6 flex justify-center sm:justify-center">
            <Button
              type="button"
              onClick={handleLogout}
              className="w-full bg-gray-800 text-white hover:bg-gray-700"
            >
              로그아웃
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toastVisible && (
        <div
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium shadow-lg animate-in fade-in duration-200"
          role="status"
          aria-live="polite"
        >
          열심히 만들고 있어요! 곧 오픈됩니다 🚧
        </div>
      )}
    </>
  );
}
