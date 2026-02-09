"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-100">
      <h1 className="text-xl font-semibold text-gray-800">일시적인 오류가 발생했습니다</h1>
      <button
        onClick={reset}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
      >
        다시 시도
      </button>
    </div>
  );
}
