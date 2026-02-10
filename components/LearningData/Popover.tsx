"use client";

import { useEffect, useRef, useState } from "react";

export default function Popover({
  trigger,
  children
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen((v) => !v)}>
        {trigger}
      </button>

      {open && (
        <div className="absolute -right-90 top-0 mt-2 w-92 rounded-xl border bg-white p-4 shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}
