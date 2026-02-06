
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
import { useState } from "react"
import clsx from "clsx"

export function ExplodeModal() {
  const [axis, setAxis] = useState("중앙")
  const axisGroup = ['중앙', 'X축', 'Y축', 'Z축']
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
              {axisGroup.map((ax, idx) => <Button onClick={() => setAxis(ax)} key={idx} variant="outline" className={clsx(axis === ax && 'bg-gray-100 font-semibold')}>{ax}</Button>)}
            </DialogDescription>
          </DialogHeader>
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            className="mx-auto w-full max-w-xs py-2"
          />
          <div className="flex justify-between w-full max-w-xs">
            <p>레벨</p>
            <div>
              <select className="w-10" >
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
    </Dialog>
  )
}
