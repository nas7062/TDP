"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
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

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  //최초 카메라 상태 저장
  const initialCamPos = useRef<THREE.Vector3 | null>(null);
  const initialCamQuat = useRef<THREE.Quaternion | null>(null);
  const initialTarget = useRef<THREE.Vector3 | null>(null);

  const captureInitialCamera = () => {
    const cam = cameraRef.current;
    const ctrls = controlsRef.current;
    if (!cam || !ctrls) return;

    if (!initialCamPos.current) {
      initialCamPos.current = cam.position.clone();
      initialCamQuat.current = cam.quaternion.clone();
      initialTarget.current = ctrls.target.clone();
    }
  };

  const resetCamera = () => {
    const cam = cameraRef.current;
    const ctrls = controlsRef.current;
    if (!cam || !ctrls) return;

    if (!initialCamPos.current || !initialCamQuat.current || !initialTarget.current) {
      captureInitialCamera();
      return;
    }

    cam.position.copy(initialCamPos.current);
    cam.quaternion.copy(initialCamQuat.current);
    cam.updateProjectionMatrix();

    ctrls.target.copy(initialTarget.current);
    ctrls.update();
  };

  const onReset = () => {
    setExplode(0);
    setSelectedUuid(null);
    setResetKey((k) => k + 1);
    resetCamera();
  };
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [2, 5, 5], fov: 35 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
          captureInitialCamera();
        }}
        onPointerMissed={() => setSelectedUuid(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} />
        <OrbitControls makeDefault
          ref={(c) => {
            controlsRef.current = c as unknown as OrbitControlsImpl;
            captureInitialCamera();
          }} />
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
