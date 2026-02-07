import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard"
});

export const metadata: Metadata = {
  title: "SIMVEX",
  description:
    "교과서 그림만으로는 이해하기 어려운 복잡한 기계 구조, 이제 3D로 돌려보고 분해하며 배우세요."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable}  antialiased `}>
        <div className="relative">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
