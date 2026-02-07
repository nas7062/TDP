import Image from "next/image";
import GoBtn from "./GoBtn";

export default function ModelCard({ model }: { model: ICategoryItem }) {
  return (
    <div >
      <Image
        src={model.image}
        alt={model.name}
        className=" object-cover aspect-video rounded-lg shadow-lg"
        width={350}
        height={160}
      />
      <div className="flex justify-between items-center  h-14">
        <p className="text-lg font-medium">{model.name}</p>
        <GoBtn modelIdx={model.idx} />
      </div>
    </div>
  );
}