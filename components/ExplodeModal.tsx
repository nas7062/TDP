
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ActionButton from "./ActionButton"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Dispatch, SetStateAction } from "react"
import clsx from "clsx"
import { AXIS_OPTIONS } from "@/constant"

interface Props {
  explode: number;
  setExplode: Dispatch<SetStateAction<number>>;
  level: number;
  setLevel: Dispatch<SetStateAction<number>>;
  axis: AxisType;
  setAxis: Dispatch<SetStateAction<AxisType>>;
}

export function ExplodeModal({ explode, setExplode, level, setLevel, setAxis, axis }: Props) {
  return (
    <Dialog modal={false}>
      <form>
        <DialogTrigger asChild>
          <ActionButton icon="/icons/Explode.svg" label="분해" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm flex flex-col gap-4  " onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>분해</DialogTitle>
            <DialogDescription className="grid grid-cols-4 gap-2">
              {AXIS_OPTIONS.map((ax, idx) => <Button type="button" onClick={() => setAxis(ax.value)}
                key={idx} variant="outline" className={clsx(axis === ax.value && 'bg-gray-100 font-semibold')}>{ax.label}</Button>)}
            </DialogDescription>
          </DialogHeader>
          <Slider
            value={[explode]}
            onValueChange={(v) => setExplode(v[0])}
            max={1}
            step={0.1}
            className="mx-auto w-full max-w-xs py-2"
          />
          <div className="flex justify-between w-full max-w-xs">
            <p>레벨</p>
            <div>
              <select className="w-10" value={String(level)}
                onChange={(e) => setLevel(Number(e.target.value))}  >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog >
  )
}
