"use client";

import { Canvas, invalidate } from "@react-three/fiber";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
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
import { MODEL_PATH_BY_IDX, parseSnapshot } from "@/constant";
import { CameraApplier } from "./CameraApplier";
import { SpatialGrid } from "./SpatialGrid";
import ViewButtons from "../ViewButtons";

interface Props {
  setSelectedName: Dispatch<SetStateAction<string | null>>;
  selectedName: string | null;
  user: IUser | null;
  modelIdx: number;
  model: IModelDetail | null;
}
function getModelPath(modelIdx: number) {
  return MODEL_PATH_BY_IDX[modelIdx] ?? "/models/Engine5.glb";
}

export default function ThreeView({ setSelectedName, selectedName, user, modelIdx, model }: Props) {
  const modelPath = useMemo(() => getModelPath(modelIdx), [modelIdx]);
  const [isMoveCamera, setIsMoveCamera] = useState(false);
  // 모델 분해 상태
  const [explode, setExplode] = useState(0);
  const [level, setLevel] = useState(1);
  const [axis, setAxis] = useState<AxisType>("Center");

  //원본 기준 데이터
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalColors = useRef<Map<string, THREE.Color>>(new Map());

  //모델 준비 타이밍 제어
  const [modelReady, setModelReady] = useState(false);
  const [readyVersion, setReadyVersion] = useState(0);
  const appliedVersionRef = useRef(0);
  // 리셋키
  const [resetKey, setResetKey] = useState(0);
  const [cameraSnap, setCameraSnap] = useState<ViewerState | null>(null);

  //카메라 관련 refs
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<ThreeOrbitControls | null>(null);

  //router
  const router = useRouter();
  //최초 카메라 상태 저장
  const initialCamPos = useRef<THREE.Vector3 | null>(null);
  const initialCamQuat = useRef<THREE.Quaternion | null>(null);
  const initialTarget = useRef<THREE.Vector3 | null>(null);

  //카메라 초기상태 캡처
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

  //카메라 리셋
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

  //리셋 함수 (분해도,카메라,클릭한 메쉬)
  const onReset = () => {
    setExplode(0);
    setSelectedName(null);
    setResetKey((k) => k + 1);
    resetCamera();
    requestAnimationFrame(() => postSnapshot());
  };

  //캔버스 ref
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({ explode, level, axis, selectedName });
  useEffect(() => {
    stateRef.current = { explode, level, axis, selectedName };
  }, [explode, level, axis, selectedName]);

  // meta에 들어갈 정보
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

  // api (model-view)
  const postSnapshot = useCallback(async () => {
    const snap = buildSnapshot();
    if (!snap || !user || !modelIdx) return;

    const payload = {
      modelIdx,
      meta: typeof snap === "string" ? snap : JSON.stringify(snap)
    };

    const userId = encodeURIComponent(String(user.idx ?? user.idx));
    try {
      const res = await fetch(`/proxy/user/${userId}/model-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
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

  // gl.domElement에만 이벤트 걸기
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

  const moveCameraToView = useCallback(
    (view: ViewPreset) => {
      const cam = cameraRef.current;
      const ctrls = controlsRef.current;
      if (!cam || !ctrls) return;

      // 모델 중심은 OrbitControls 기준점
      const target = ctrls.target.clone();

      // 카메라와 타겟 거리 유지
      const distance = cam.position.distanceTo(target);

      const dir = new THREE.Vector3();

      switch (view) {
        case "FRONT":
          dir.set(0, 0, 1);
          break;
        case "BACK":
          dir.set(0, 0, -1);
          break;
        case "LEFT":
          dir.set(-1, 0, 0);
          break;
        case "RIGHT":
          dir.set(1, 0, 0);
          break;
        case "TOP":
          dir.set(0, 1, 0);
          break;
        case "BOTTOM":
          dir.set(0, -1, 0);
          break;
      }

      // 새 카메라 위치 = 중심 + 방향 * 거리
      const newPos = target.clone().add(dir.multiplyScalar(distance));

      cam.position.copy(newPos);

      // 카메라 방향을 target으로 정확히 맞춤
      cam.lookAt(target);
      cam.updateProjectionMatrix();

      ctrls.target.copy(target);
      ctrls.update();

      invalidate();

      requestAnimationFrame(() => postSnapshot());
    },
    [postSnapshot]
  );

  useEffect(() => {
    const canvas = canvasElRef.current;
    if (!canvas) return;

    attachCanvasListeners(canvas);
    return () => detachCanvasListeners(canvas);
  }, [attachCanvasListeners, detachCanvasListeners]);

  //서버 스냅샷을 중복 없이 1회 적용
  useEffect(() => {
    if (!model?.meta) return;
    if (!modelReady) return;

    //  같은 ready에 대해 중복 적용 방지
    if (appliedVersionRef.current === readyVersion) return;
    appliedVersionRef.current = readyVersion;

    const snap = parseSnapshot(model.meta);
    if (!snap) return;
    setCameraSnap(snap);
    // 리셋 트리거
    setExplode(0);
    setSelectedName(null);
    setAxis("Center");
    setLevel(1);
    setResetKey((k) => k + 1);

    // 리셋 effect가 먼저 먹고난 뒤 적용
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExplode(snap.explode);
        setSelectedName(snap.selectedName);
        setAxis(snap.axis);
        setLevel(snap.level);
      });
    });
  }, [readyVersion, modelReady, model?.meta, setSelectedName]);

  return (
    <div className="w-full h-full relative bg-[#FBFBFB]">
      <Canvas
        camera={{ position: [0, 6, 12], fov: 35 }}
        onCreated={({ camera, gl }) => {
          canvasElRef.current = gl.domElement;
          cameraRef.current = camera as THREE.PerspectiveCamera;
          captureInitialCamera();
        }}
        onPointerMissed={() => setSelectedName(null)}
      >
        <SpatialGrid />
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
            onReady={() => {
              setModelReady(true);
              setReadyVersion((v) => v + 1);
            }}
          />
        </Suspense>
        <CameraApplier snap={cameraSnap} cameraRef={cameraRef} controlsRef={controlsRef} />
      </Canvas>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        <ActionButton
          icon="/icons/See.svg"
          label="보기"
          onClick={() => setIsMoveCamera(!isMoveCamera)}
        />
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
      {isMoveCamera && (
        <ViewButtons moveCameraToView={moveCameraToView} setIsMoveCamera={setIsMoveCamera} />
      )}
    </div>
  );
}
