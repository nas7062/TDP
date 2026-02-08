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
      console.log({
        meshName: o.name,
        parentName: o.parent?.name
      });
    });
    return list;
  }, [root]);
  console.log(meshes);
  const isBlocked = (name: string) => {
    const n = name.toLowerCase();
    return n.includes("솔리드") || n.includes("solid");
  };
  //  material clone + 원래 색/위치 저장
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    for (const mesh of meshes) {
      // material을 독립적으로 (색 바꿔도 공유 안 하게)
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else {
        mesh.material = mesh.material.clone();
      }

      // 원래 색상 저장 (MeshStandard/Basic만 대상으로)
      const saveColor = (m: THREE.Material) => {
        if (hasColor(m)) {
          originalColors.current.set(mesh.uuid, m.color.clone());
        }
      };

      if (Array.isArray(mesh.material)) mesh.material.forEach(saveColor);
      else saveColor(mesh.material);

      // 원래 위치 저장
      originalPositions.current.set(mesh.uuid, mesh.position.clone());
    }
  }, [meshes, originalColors, originalPositions]);

  // explode 적용 + 선택 하이라이트/복원
  useEffect(() => {
    for (const mesh of meshes) {
      //  원래 위치 기준으로 이동
      const base = originalPositions.current.get(mesh.uuid);
      if (base) {
        const dir = base.clone().normalize();
        const dist = explode * 0.1 * level;
        if (dir.lengthSq() === 0) dir.set(0, 1, 0);
        switch (axis) {
          case "Center": {
            mesh.position.copy(base.clone().add(dir.multiplyScalar(dist)));
            break;
          }
          case "X": {
            dir.set(1, 0, 0);
            mesh.position.copy(base.clone().add(dir.multiplyScalar(dist)));
            break;
          }
          case "Y": {
            dir.set(0, 1, 0);
            mesh.position.copy(base.clone().add(dir.multiplyScalar(dist)));
            break;
          }
          case "Z": {
            dir.set(0, 0, 1);
            mesh.position.copy(base.clone().add(dir.multiplyScalar(dist)));
            break;
          }
        }
      }

      // 선택된 메쉬만 빨간색, 나머지는 원래 색
      const applyColor = (m: THREE.Material, color: THREE.Color) => {
        if (hasColor(m)) m.color.copy(color);
      };

      const orig = originalColors.current.get(mesh.uuid);
      if (!orig) continue;

      const target = mesh.name === selectedName ? new THREE.Color(0xff0000) : orig;

      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => applyColor(m, target));
      else applyColor(mesh.material, target);
    }
  }, [explode, selectedName, meshes, originalPositions, originalColors, axis, level]);

  // reset
  useEffect(() => {
    for (const mesh of meshes) {
      const p = originalPositions.current.get(mesh.uuid);
      if (p) mesh.position.copy(p);

      const c = originalColors.current.get(mesh.uuid);
      if (!c) continue;

      const apply = (m: THREE.Material) => {
        const mm = m as any;
        if (mm?.color?.isColor) mm.color.copy(c);
      };

      if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
      else apply(mesh.material);
    }
  }, [resetKey, meshes, originalPositions, originalColors]);

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
