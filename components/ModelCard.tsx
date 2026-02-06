import GoBtn from "./GoBtn";

export default function ModelCard({ model }) {
  return (
    <div >
      <img
        src={model.img}
        alt={model.name}
        className=" object-cover aspect-video rounded-lg shadow-lg"
      />
      <div className="flex justify-between items-center  h-14">
        <p className="text-lg font-medium">{model.name}</p>
        <GoBtn modelIdx={model.idx} />
      </div>
    </div>
  );
}