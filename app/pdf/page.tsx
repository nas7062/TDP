import { Suspense } from "react";
import PdfClient from "./_components/PdfClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PdfClient />
    </Suspense>
  );
}
