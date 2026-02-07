"use client";

import { Canvas } from "@react-three/fiber";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";
import * as THREE from "three";
import { Model } from "./ModelLoader ";
import ActionButton from "../ActionButton";
import { ExplodeModal } from "../ExplodeModal";
import { useRouter } from "next/navigation";

interface Props {
  setSelectedName: Dispatch<SetStateAction<string | null>>;
  selectedName: string | null;
}

export default function ThreeView({ setSelectedName, selectedName }: Props) {
  const [modelPath] = useState("/models/Drone2.glb");
  const [explode, setExplode] = useState(0);
  const [level, setLevel] = useState(1);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalColors = useRef<Map<string, THREE.Color>>(new Map());
  const [resetKey, setResetKey] = useState(0);
  const [axis, setAxis] = useState<AxisType>("Center");

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<ThreeOrbitControls | null>(null);
  const router = useRouter();
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
    setSelectedName(null);
    setResetKey((k) => k + 1);
    resetCamera();
  };

  return (
    <div className="w-full h-full relative bg-gray-100">
      <Canvas
        camera={{ position: [2, 5, 5], fov: 35 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
          captureInitialCamera();
        }}
        onPointerMissed={() => setSelectedName(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} />
        <OrbitControls
          makeDefault
          ref={(c) => {
            controlsRef.current = c;
            captureInitialCamera();
          }}
        />
        <Model
          modelPath={modelPath}
          explode={explode}
          selectedName={selectedName}
          setSelectedName={setSelectedName}
          originalColors={originalColors}
          originalPositions={originalPositions}
          level={level}
          resetKey={resetKey}
          axis={axis}
        />
      </Canvas>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        <ActionButton icon="/icons/Home.svg" label="홈" onClick={() => router.push("/select")} />
        <ActionButton icon="/icons/See.svg" label="보기" />
        <ExplodeModal
          explode={explode}
          setExplode={setExplode}
          level={level}
          setLevel={setLevel}
          setAxis={setAxis}
          axis={axis}
        />
        <ActionButton icon="/icons/Reset.svg" label="초기화" onClick={onReset} />
      </div>
    </div>
  );
}
