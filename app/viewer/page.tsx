import { Suspense } from "react";
import ViewerClient from "./_components/ViewerClient ";

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen" />}>
      <ViewerClient />
    </Suspense>
  );
}
