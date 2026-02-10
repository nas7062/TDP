export default function Pagination({
  page,
  totalCount,
  size,
  onChange,
  modelNameMap
}: {
  page: number; // 0-based
  totalCount: number;
  size: number;
  onChange: (p: number) => void;
  modelNameMap: { 1: string; 2: string; 3: string; 4: string };
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const current = page + 1;

  // 1~5 정도만 보여주는 간단형
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 10);

  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
      <button
        className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`px-2 py-1 rounded ${
            p === current ? "font-semibold text-blue-600" : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onChange(p - 1)}
        >
          {p}
        </button>
      ))}

      <button
        className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
      >
        ›
      </button>
    </div>
  );
}
