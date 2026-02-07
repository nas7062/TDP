export const dynamic = "force-dynamic";
export const revalidate = 0;

import { fetchCategory } from "@/lib/api/model";
import SelectClient from "./_components/SelectClient";

export default async function SelectPage() {
  const category = await fetchCategory();
  return <SelectClient category={category} />;
}
