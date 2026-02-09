import { NextRequest } from "next/server";

/** 허용할 이미지 호스트 (CORS 이슈 회피용 프록시) */
const ALLOWED_HOSTS = [
  "tdp-bucket-1.s3.ap-northeast-2.amazonaws.com",
  "tdp-bucket-1.s3.amazonaws.com"
];

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && ALLOWED_HOSTS.some((h) => u.hostname === h);
  } catch {
    return false;
  }
}

/** GET ?url=... : 외부 이미지를 서버에서 가져와 그대로 반환 (CORS 회피) */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isAllowedUrl(url)) {
    return new Response("Invalid or disallowed URL", { status: 400 });
  }

  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) {
      return new Response("Upstream image failed", { status: res.status });
    }
    const contentType = res.headers.get("content-type") || "image/png";
    const blob = await res.arrayBuffer();
    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (e) {
    console.error("image-proxy fetch error:", e);
    return new Response("Proxy fetch failed", { status: 502 });
  }
}
