"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

type Props = {
  modelPath: string;
  explode: number;
  selectedName: string | null;
  setSelectedName: (name: string | null) => void;
  originalColors: React.MutableRefObject<Map<string, THREE.Color>>;
  originalPositions: React.MutableRefObject<Map<string, THREE.Vector3>>;
  resetKey: number;
  level: number;
  axis: AxisType;
};

function hasColor(
  material: THREE.Material
): material is THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.MeshPhongMaterial {
  return "color" in material;
}

export function Model({
  modelPath,
  explode,
  selectedName,
  setSelectedName,
  originalColors,
  originalPositions,
  resetKey,
  level,
  axis
}: Props) {
  const gltf = useGLTF(modelPath);
  const root = gltf.scene;

  // 메쉬 목록 캐시
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) list.push(o);
    });
    return list;
  }, [root]);

  const isBlocked = (name: string) => {
    const n = (name ?? "").toLowerCase();
    return n.includes("솔리드") || n.includes("solid");
  };

  //  material clone + original(world) capture는 모델 로드 후 1회
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    // world matrix 최신화 (중요)
    root.updateMatrixWorld(true);

    for (const mesh of meshes) {
      // material clone
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();

      // original color 저장
      const saveColor = (m: THREE.Material) => {
        if (hasColor(m)) originalColors.current.set(mesh.uuid, m.color.clone());
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(saveColor);
      else saveColor(mesh.material);

      //  original world position 저장
      const wp = new THREE.Vector3();
      mesh.getWorldPosition(wp);
      originalPositions.current.set(mesh.uuid, wp.clone());
    }
  }, [meshes, root, originalColors, originalPositions]);

  useEffect(() => {
    root.updateMatrixWorld(true);

    // parent별 inverseWorld 캐시
    const invCache = new Map<string, THREE.Matrix4>();

    for (const mesh of meshes) {
      const worldBase = originalPositions.current.get(mesh.uuid);
      if (!worldBase) continue;

      const parent = mesh.parent;
      if (!parent) continue;

      const pid = parent.uuid;
      let inv = invCache.get(pid);
      if (!inv) {
        inv = parent.matrixWorld.clone().invert();
        invCache.set(pid, inv);
      }

      const localBase = worldBase.clone().applyMatrix4(inv);
      mesh.position.copy(localBase);

      const origColor = originalColors.current.get(mesh.uuid);
      if (!origColor) continue;

      const apply = (m: THREE.Material) => {
        if (hasColor(m)) m.color.copy(origColor);
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
      else apply(mesh.material);
    }
  }, [resetKey, meshes, root, originalPositions, originalColors]);

  //  explode + 하이라이트
  useEffect(() => {
    root.updateMatrixWorld(true);

    // parent별 inverseWorld 캐시
    const invCache = new Map<string, THREE.Matrix4>();

    // 월드 고정축
    const axisDir = new THREE.Vector3();
    const centerDir = new THREE.Vector3();

    for (const mesh of meshes) {
      const worldBase = originalPositions.current.get(mesh.uuid);
      if (!worldBase) continue;

      const parent = mesh.parent;
      if (!parent) continue;

      const pid = parent.uuid;
      let inv = invCache.get(pid);
      if (!inv) {
        inv = parent.matrixWorld.clone().invert();
        invCache.set(pid, inv);
      }

      const dist = explode * 0.1 * level;

      // 방향 결정
      if (axis === "X") axisDir.set(1, 0, 0);
      else if (axis === "Y") axisDir.set(0, 1, 0);
      else if (axis === "Z") axisDir.set(0, 0, 1);
      else {
        centerDir.copy(worldBase).normalize();
        if (centerDir.lengthSq() === 0) centerDir.set(0, 1, 0);
        axisDir.copy(centerDir);
      }

      const worldPos = worldBase.clone().add(axisDir.clone().multiplyScalar(dist));

      //  world -> local (
      const localPos = worldPos.clone().applyMatrix4(inv);
      mesh.position.copy(localPos);

      // 색상 처리
      const origColor = originalColors.current.get(mesh.uuid);
      if (!origColor) continue;

      const targetColor = mesh.name === selectedName ? new THREE.Color(0xff0000) : origColor;

      const apply = (m: THREE.Material) => {
        if (hasColor(m)) m.color.copy(targetColor);
      };

      if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
      else apply(mesh.material);
    }
  }, [explode, selectedName, meshes, root, originalPositions, originalColors, axis, level]);

  return (
    <primitive
      object={root}
      scale={[5, 5, 5]}
      onPointerDown={(e) => {
        e.stopPropagation();
        const mesh = e.object as THREE.Mesh;
        const name = mesh.name ?? "";
        if (isBlocked(name)) return;
        setSelectedName(mesh.name);
      }}
    />
  );
}
