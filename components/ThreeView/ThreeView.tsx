"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Model } from "./ModelLoader ";
import ActionButton from "../ActionButton";

export default function ThreeView() {
  const [modelPath] = useState("/models/Engine2.glb");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [explode, setExplode] = useState(0);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalColors = useRef<Map<string, THREE.Color>>(new Map());
  const [resetKey, setResetKey] = useState(0);

  const onReset = () => {
    setExplode(0);
    setSelectedUuid(null);
    setResetKey((k) => k + 1);
  };
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [2, 5, 5], fov: 35 }}
        onPointerMissed={() => setSelectedUuid(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} />
        <OrbitControls makeDefault />
        <Model
          modelPath={modelPath}
          explode={explode}
          selectedUuid={selectedUuid}
          setSelectedUuid={setSelectedUuid}
          originalColors={originalColors}
          originalPositions={originalPositions}
          resetKey={resetKey}
        />
      </Canvas>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={explode}
        onChange={(e) => setExplode(Number(e.target.value))}
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
        }}
      />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        <ActionButton icon="/icons/Home.svg" label="홈" />
        <ActionButton icon="/icons/See.svg" label="보기" />
        <ActionButton icon="/icons/Explode.svg" label="분해" />
        <ActionButton icon="/icons/Reset.svg" label="초기화" onClick={onReset} />
      </div>
    </div>
  );
}
