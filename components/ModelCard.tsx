import Image from "next/image";
import GoBtn from "./GoBtn";
import { useRouter } from "next/navigation";

export default function ModelCard({ model }: { model: ICategoryItem }) {
  const router = useRouter();
  return (
    <div
      role="button"
      className="cursor-pointer"
      tabIndex={0}
      onClick={() => router.push(`/viewer?modelIdx=${model.idx}`)}
    >
      <Image
        src={model.image}
        alt={model.name}
        className=" object-cover aspect-video rounded-lg shadow-lg"
        width={500}
        height={160}
      />
      <div className="flex justify-between items-center  h-14">
        <p className="text-lg font-medium">{model.name}</p>
        <GoBtn modelIdx={model.idx} />
      </div>
    </div>
  );
}
