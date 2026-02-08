"use client";

import { Canvas } from "@react-three/fiber";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";
import * as THREE from "three";
import { Model } from "./ModelLoader";
import ActionButton from "../ActionButton";
import { ExplodeModal } from "../ExplodeModal";
import { useRouter } from "next/navigation";

interface Props {
  setSelectedName: Dispatch<SetStateAction<string | null>>;
  selectedName: string | null;
  user: IUser | null;
  modelIdx: number;
}

export default function ThreeView({ setSelectedName, selectedName, user, modelIdx }: Props) {
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
    requestAnimationFrame(() => postSnapshot());
  };

  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({ explode, level, axis, selectedName });
  useEffect(() => {
    stateRef.current = { explode, level, axis, selectedName };
  }, [explode, level, axis, selectedName]);

  const buildSnapshot = useCallback((): ViewerState | null => {
    const cam = cameraRef.current;
    const ctrls = controlsRef.current;
    if (!cam || !ctrls) return null;

    const s = stateRef.current;

    return {
      modelPath,
      explode: s.explode,
      level: s.level,
      axis: s.axis,
      selectedName: s.selectedName,
      camera: {
        position: [cam.position.x, cam.position.y, cam.position.z],
        quaternion: [cam.quaternion.x, cam.quaternion.y, cam.quaternion.z, cam.quaternion.w],
        fov: cam.fov,
        zoom: cam.zoom
      },
      controls: {
        target: [ctrls.target.x, ctrls.target.y, ctrls.target.z]
      },
      updatedAt: new Date().toISOString()
    };
  }, [modelPath]);

  const postSnapshot = useCallback(async () => {
    const snap = buildSnapshot();
    if (!snap || !user || !modelIdx) return;

    const payload = {
      model: modelIdx,
      meta: snap
    };

    try {
      const res = await fetch(`/proxy/user/${user.userId}/model-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error("API 실패", res.status);
      }
    } catch (e) {
      console.error("네트워크 오류", e);
    }
  }, [buildSnapshot, user, modelIdx]);

  // 캔버스에서 발생한 모든 클릭 저장
  const onAnyCanvasClick = useCallback(() => {
    requestAnimationFrame(() => {
      postSnapshot();
    });
  }, [postSnapshot]);

  // gl.domElement에만 이벤트 걸기 + cleanup
  const attachCanvasListeners = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.addEventListener("click", onAnyCanvasClick, { passive: true });
    },
    [onAnyCanvasClick]
  );

  const detachCanvasListeners = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.removeEventListener("click", onAnyCanvasClick);
    },
    [onAnyCanvasClick]
  );

  useEffect(() => {
    const canvas = canvasElRef.current;
    if (!canvas) return;

    attachCanvasListeners(canvas);
    return () => detachCanvasListeners(canvas);
  }, [attachCanvasListeners, detachCanvasListeners]);

  return (
    <div className="w-full h-full relative bg-gray-100">
      <Canvas
        camera={{ position: [2, 5, 5], fov: 35 }}
        onCreated={({ camera, gl }) => {
          canvasElRef.current = gl.domElement;
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
        <Suspense fallback={null}>
          <Model
            modelPath={modelPath}
            selectedName={selectedName}
            setSelectedName={(name) => {
              setSelectedName(name);
              requestAnimationFrame(() => postSnapshot());
            }}
            originalColors={originalColors}
            originalPositions={originalPositions}
            explode={explode}
            level={level}
            axis={axis}
            resetKey={resetKey}
          />
        </Suspense>
      </Canvas>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        <ActionButton icon="/icons/Home.svg" label="홈" onClick={() => router.push("/select")} />
        <ActionButton icon="/icons/See.svg" label="보기" />
        <ExplodeModal
          explode={explode}
          setExplode={(v) => {
            setExplode(v);
            requestAnimationFrame(() => postSnapshot());
          }}
          level={level}
          setLevel={(v) => {
            setLevel(v);
            requestAnimationFrame(() => postSnapshot());
          }}
          setAxis={(v) => {
            setAxis(v);
            requestAnimationFrame(() => postSnapshot());
          }}
          axis={axis}
        />
        <ActionButton icon="/icons/Reset.svg" label="초기화" onClick={onReset} />
      </div>
    </div>
  );
}
