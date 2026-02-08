import { USER_COOKIE_NAME } from "@/constant";

/** 로그인 성공 시 localStorage + 쿠키 동기화 (Proxy에서 쿠키로 리다이렉트 판단) */
export function setUserAuth(userInfo: { userId: string; idx: number }) {
  const value = JSON.stringify(userInfo);
  localStorage.setItem("user", value);
  document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}

/** 로그아웃 시 localStorage + 쿠키에서 user 제거 */
export function clearUserAuth() {
  localStorage.removeItem("user");
  document.cookie = `${USER_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
