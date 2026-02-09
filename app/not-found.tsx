import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
            404
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">페이지를 찾을 수 없습니다</h1>
            <p className="mt-2 text-gray-600 leading-relaxed">
              요청하신 주소가 존재하지 않거나 이동되었습니다. 아래 버튼으로 홈으로 이동하세요.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium"
              >
                홈으로 이동하기
              </Link>
            </div>

            <div className="mt-8 border-t pt-4 text-xs text-gray-500">
              문제가 계속되면 주소를 확인하거나, 잠시 후 다시 시도하세요.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
