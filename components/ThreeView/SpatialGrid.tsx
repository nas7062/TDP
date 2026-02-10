"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** 바닥 격자 + 수직 모서리 라인으로 공간감을 주는 배경 */
export function SpatialGrid() {
  const roomHalfSize = 9;
  const gridSize = roomHalfSize * 2; // 격자와 수직선 모서리 맞춤 (±roomHalfSize)
  const gridDivisions = 18;
  const gridY = 0;
  const roomHeight = 18;
  const lineColor = 0xcccccc;
  const lineOpacity = 0.6;

  const grid = useMemo(() => {
    const g = new THREE.GridHelper(gridSize, gridDivisions, lineColor, lineColor);
    g.position.y = gridY;
    const mats = Array.isArray(g.material) ? g.material : [g.material];
    mats.forEach((m) => {
      m.transparent = true;
      m.opacity = lineOpacity;
      m.depthWrite = false;
    });
    return g;
  }, []);

  const edges = useMemo(() => {
    const corners = [
      new THREE.Vector3(-roomHalfSize, gridY, -roomHalfSize),
      new THREE.Vector3(roomHalfSize, gridY, -roomHalfSize),
      new THREE.Vector3(roomHalfSize, gridY, roomHalfSize),
      new THREE.Vector3(-roomHalfSize, gridY, roomHalfSize)
    ];
    const points: number[] = [];
    corners.forEach((c, i) => {
      const top = c.clone();
      top.y = gridY + roomHeight;
      points.push(c.x, c.y, c.z, top.x, top.y, top.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    geo.computeBoundingSphere();
    const mat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: lineOpacity,
      depthWrite: false
    });
    return new THREE.LineSegments(geo, mat);
  }, []);

  return (
    <group>
      <primitive object={grid} />
      <primitive object={edges} />
    </group>
  );
}
