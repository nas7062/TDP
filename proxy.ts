import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_COOKIE_NAME } from "@/constant";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 루트('/') 접근 시 로그인 쿠키가 있으면 /select로 리다이렉트
  if (pathname === "/") {
    const userCookie = request.cookies.get(USER_COOKIE_NAME);
    if (userCookie?.value) {
      return NextResponse.redirect(new URL("/select", request.url));
    }
  }

  // /viewer 접근 시 modelIdx 파라미터 없으면 /select로 리다이렉트 (0이어도 있으면 통과)
  if (pathname === "/viewer" || pathname === "/pdf") {
    const modelIdx = searchParams.get("modelIdx");
    if (modelIdx === null || modelIdx === "") {
      return NextResponse.redirect(new URL("/select", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/viewer"]
};
