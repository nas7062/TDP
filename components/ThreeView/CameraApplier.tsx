"use client";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";
export function CameraApplier({
  snap,
  cameraRef,
  controlsRef
}: {
  snap: ViewerState | null;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  controlsRef: React.MutableRefObject<ThreeOrbitControls | null>;
}) {
  //three.js에게 다시 한 프레임 렌더시킴.
  const { invalidate } = useThree();

  //snap이 바뀔 때마다 실행
  useEffect(() => {
    if (!snap) return;
    const cam = cameraRef.current;
    const ctrls = controlsRef.current;
    if (!cam || !ctrls) return;

    const [px, py, pz] = snap.camera.position;
    const [qx, qy, qz, qw] = snap.camera.quaternion;
    const [tx, ty, tz] = snap.controls.target;

    cam.position.set(px, py, pz);
    cam.quaternion.set(qx, qy, qz, qw);
    cam.fov = snap.camera.fov;
    cam.zoom = snap.camera.zoom;
    cam.updateProjectionMatrix();

    ctrls.target.set(tx, ty, tz);
    ctrls.update();

    invalidate();
  }, [snap, invalidate, cameraRef, controlsRef]);

  return null;
}
