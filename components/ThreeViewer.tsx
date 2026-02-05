"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ActionButton from "./ActionButton";
import { ActionButtons } from "@/constant";

interface Props {
  onMeshSelect: (meshData: any) => void;
}

export default function ThreeViewer({ onMeshSelect }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<THREE.Object3D | null>(null);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const selectedMeshRef = useRef<THREE.Mesh | null>(null);
  const originalColors = useRef<Map<string, THREE.Color>>(new Map()); // 원래 색상을 저장할 Ref

  useEffect(() => {
    if (!mountRef.current) return;

    /* 씬 */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    /* 카메라 */
    const camera = new THREE.PerspectiveCamera(
      30,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(6, 6, 5);
    camera.lookAt(0, 0, 0);

    /* 렌더러 */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true // 나중에 PNG 저장 가능.
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    /* 조명 */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 6, 5);
    scene.add(dirLight);

    /* 컨트롤 영역 */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 2; // 너무 가까이 못 가게
    controls.maxDistance = 15; // 너무 멀리 못 가게

    /* glb 로드 영역 */
    const loader = new GLTFLoader();

    loader.load("/models/Engine2.glb", (gltf) => {
      const drone = gltf.scene;
      drone.scale.setScalar(5);

      scene.add(drone);
      droneRef.current = drone;

      //  원래 위치 저장 + name 부여
      let idx = 0;
      drone.traverse((obj) => {
        console.log(obj);
        if ((obj as any).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.name = `name-${idx}`;
          mesh.meshId = idx.toString();
          idx += 1;

          // 각 mesh의 material을 클론하여 독립적으로 만들어줌
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else {
            mesh.material = mesh.material.clone();
          }

          // 원래 색상을 저장
          if (Array.isArray(mesh.material)) {
            // 배열일 경우 각 material의 color 저장
            mesh.material.forEach((m) => {
              if (m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshStandardMaterial) {
                originalColors.current.set(mesh.uuid, m.color.clone());
              }
            });
          } else {
            // 단일 material일 경우 color 저장
            if (
              mesh.material instanceof THREE.MeshBasicMaterial ||
              mesh.material instanceof THREE.MeshStandardMaterial
            ) {
              originalColors.current.set(mesh.uuid, mesh.material.color.clone());
            }
          }

          originalPositions.current.set(mesh.uuid, mesh.position.clone());

          // 클릭 가능하게 만들기 위해 material 속성 설정
          (mesh.material as any).opacity = 1;
          (mesh.material as any).transparent = false;
        }
      });

      controls.target.copy(drone.position);
      controls.update();
    });

    /* Raycaster 및 마우스 이벤트 추가 */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let selectedObject: THREE.Mesh | null = null; // 현재 선택된 메쉬 저장

    function onPointerDown(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const obj = hit.object as THREE.Mesh;
        const meshId = `mesh-${obj.uuid}`;
        const meshData = {
          id: meshId,
          name: obj.name,
          uuid: obj.uuid,
        };
        onMeshSelect(meshData);
        // 선택된 메쉬 ref 에도 저장
        selectedMeshRef.current = obj;

        // 이미 선택된 mesh가 있을 경우 그 색을 원래 색으로 복원
        if (selectedObject && selectedObject !== obj) {
          // 이전 선택된 객체 색상 복원
          const originalColor = originalColors.current.get(selectedObject.uuid);
          if (originalColor) {
            // 배열일 경우 모든 material에 대해 색상 복원
            if (Array.isArray(selectedObject.material)) {
              selectedObject.material.forEach((m) => {
                if (
                  m instanceof THREE.MeshBasicMaterial ||
                  m instanceof THREE.MeshStandardMaterial
                ) {
                  m.color.copy(originalColor); // 배열에 대해 색상 복원
                }
              });
            } else {
              if (
                selectedObject.material instanceof THREE.MeshBasicMaterial ||
                selectedObject.material instanceof THREE.MeshStandardMaterial
              ) {
                selectedObject.material.color.copy(originalColor); // 단일 material에 대해 색상 복원
              }
            }
          }
        }

        selectedObject = obj;
        // 선택된 객체 색상 변경
        if (Array.isArray(selectedObject.material)) {
          selectedObject.material.forEach((m) => {
            if (m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshStandardMaterial) {
              m.color.set(0xff0000); // 빨간색으로 변경
            }
          });
        } else {
          if (
            selectedObject.material instanceof THREE.MeshBasicMaterial ||
            selectedObject.material instanceof THREE.MeshStandardMaterial
          ) {
            selectedObject.material.color.set(0xff0000); // 빨간색으로 변경
          }
        }
      } else {
        if (selectedObject) {
          // 클릭하지 않으면 원래 색으로 복원
          const originalColor = originalColors.current.get(selectedObject.uuid);
          if (originalColor) {
            // 배열일 경우 모든 material에 대해 색상 복원
            if (Array.isArray(selectedObject.material)) {
              selectedObject.material.forEach((m) => {
                if (
                  m instanceof THREE.MeshBasicMaterial ||
                  m instanceof THREE.MeshStandardMaterial
                ) {
                  m.color.copy(originalColor); // 배열에 대해 색상 복원
                }
              });
            } else {
              if (
                selectedObject.material instanceof THREE.MeshBasicMaterial ||
                selectedObject.material instanceof THREE.MeshStandardMaterial
              ) {
                selectedObject.material.color.copy(originalColor); // 단일 material에 대해 색상 복원
              }
            }
          }
          selectedObject = null;
        }
        selectedMeshRef.current = null;
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    /* ReSize */
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", onPointerDown);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  /* 분해 */
  const applyExplode = (value: number) => {
    const drone = droneRef.current;
    if (!drone) return;

    drone.traverse((obj) => {
      if (!obj.isMesh) return;

      const origin = originalPositions.current.get(obj.uuid);
      if (!origin) return;

      const dir = origin.clone().normalize();

      //방향 없는 것들
      if (dir.length() === 0) {
        dir.set(0, 0.5, 0); // 위로 분해
      }
      // 중심을 기반으로 하여 분해
      obj.position.copy(origin.clone().add(dir.multiplyScalar(value * 0.3)));
    });
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full" />

      {/*분해 및 조합  range*/}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        defaultValue={0}
        onChange={(e) => applyExplode(Number(e.target.value))}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px"
        }}
      />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        {ActionButtons.map((button) => <ActionButton key={button.label} icon={button.icon} label={button.label} />)}
      </div>
    </div>
  );
}
