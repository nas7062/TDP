"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
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
  onReady?: () => void;
};

export function Model({
  modelPath,
  explode,
  selectedName,
  setSelectedName,
  originalColors,
  originalPositions,
  resetKey,
  level,
  axis,
  onReady
}: Props) {
  const gltf = useGLTF(modelPath);
  // 캐시된 gltf.scene을 직접 쓰지 않고 clone해서 사용
  const root = useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);
  //모델 전체 중심 좌표 저장용
  const modelCenter = useRef<THREE.Vector3 | null>(null);
  //explode 대상 메쉬 목록 생성
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;

      if (o.parent instanceof THREE.Mesh) return;

      list.push(o);
    });
    return list;
  }, [root]);
  // 초기화가 한 번만 수행되도록 제어 Ref
  const inited = useRef(false);

  // model 바뀌면  이전 모델의 원본 데이터를 전부 비우고 다시 생성하도록
  useEffect(() => {
    inited.current = false;
    originalPositions.current.clear();
    originalColors.current.clear();
    modelCenter.current = null;
  }, [modelPath, root, originalColors, originalPositions]);

  // 원본 캡처
  useEffect(() => {
    if (inited.current) return;
    if (!meshes.length) return;

    root.scale.set(5, 5, 5);
    root.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    box.getCenter(center);
    modelCenter.current = center;

    for (const mesh of meshes) {
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();

      const saveColor = (m: THREE.Material) => {
        if ("color" in m) originalColors.current.set(mesh.uuid, (m as any).color.clone());
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(saveColor);
      else saveColor(mesh.material);

      originalPositions.current.set(mesh.uuid, mesh.position.clone());
    }

    inited.current = true; // ✅ 마지막에 true

    const n = originalPositions.current.size;
    if (n > 0) {
      console.log("ORIGINAL CAPTURED", n);
      onReady?.();
    }
  }, [root, meshes, modelPath, onReady, originalPositions, originalColors]);

  // Reset 처리
  useEffect(() => {
    for (const mesh of meshes) {
      const baseLocal = originalPositions.current.get(mesh.uuid);
      if (!baseLocal) continue;

      mesh.position.copy(baseLocal);

      const origColor = originalColors.current.get(mesh.uuid);
      if (origColor) {
        const apply = (m: THREE.Material) => {
          if ("color" in m) (m as any).color.copy(origColor);
        };
        if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
        else apply(mesh.material);
      }
    }

    root.updateMatrixWorld(true);
  }, [resetKey, meshes, root, originalPositions, originalColors]);

  //  explode: baseLocal -> baseWorld -> 이동 -> 다시 로컬로
  useEffect(() => {
    root.updateMatrixWorld(true);

    // Explode + Highlight(클릭시  색 변경 ) 처리
    if (!modelCenter.current) {
      const box = new THREE.Box3().setFromObject(root);
      modelCenter.current = new THREE.Vector3();
      box.getCenter(modelCenter.current);
    }

    const dist = explode * 0.1 * level;
    const axisDir = new THREE.Vector3();
    const worldBase = new THREE.Vector3();
    const worldPos = new THREE.Vector3();
    const centerDir = new THREE.Vector3();

    for (const mesh of meshes) {
      const baseLocal = originalPositions.current.get(mesh.uuid);
      if (!baseLocal) continue;

      const parent = mesh.parent;
      if (!parent) continue;

      worldBase.copy(baseLocal);
      parent.localToWorld(worldBase);

      // 모델 중심 기준 벡터 (world)
      centerDir.copy(worldBase).sub(modelCenter.current!);

      // 모델 중심
      if (axis === "X") axisDir.set(centerDir.x, 0, 0);
      else if (axis === "Y") axisDir.set(0, centerDir.y, 0);
      else if (axis === "Z") axisDir.set(0, 0, centerDir.z);
      else axisDir.copy(centerDir);

      if (axisDir.lengthSq() === 0) axisDir.set(0, 1, 0);
      axisDir.normalize();

      worldPos.copy(worldBase).addScaledVector(axisDir, dist);

      parent.worldToLocal(worldPos);
      mesh.position.copy(worldPos);

      const origColor = originalColors.current.get(mesh.uuid);
      if (!origColor) continue;

      const targetColor = mesh.name === selectedName ? new THREE.Color(0xff0000) : origColor;
      const apply = (m: THREE.Material) => {
        if ("color" in m) (m as any).color.copy(targetColor);
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
      else apply(mesh.material);
    }
  }, [explode, selectedName, meshes, root, originalPositions, originalColors, axis, level]);

  return (
    <primitive
      object={root}
      onPointerDown={(e) => {
        e.stopPropagation();
        let obj = e.object as THREE.Object3D;
        while (obj.parent && obj.parent instanceof THREE.Mesh) {
          obj = obj.parent;
        }
        const name = obj.name ?? "";
        setSelectedName(name);
      }}
    />
  );
}
