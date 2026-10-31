"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { MathUtils, type Group } from "three";

type SceneProps = {
  visible: boolean;
  rotation: { x: number; y: number };
  immediate: boolean;
  onReady: () => void;
};
function Signature({
  rotation,
  immediate,
  onReady,
}: Omit<SceneProps, "visible">) {
  const viewportWidth = useThree((state) => state.viewport.width);
  const invalidate = useThree((state) => state.invalidate);
  const group = useRef<Group>(null);
  useEffect(() => {
    onReady();
  }, [onReady]);
  useEffect(() => {
    invalidate();
  }, [rotation, immediate, invalidate]);
  useFrame((_, delta) => {
    if (!group.current) return;
    const current = group.current.rotation;
    current.x = immediate
      ? rotation.x
      : MathUtils.damp(current.x, rotation.x, 10, Math.min(delta, 0.05));
    current.y = immediate
      ? rotation.y
      : MathUtils.damp(current.y, rotation.y, 10, Math.min(delta, 0.05));
    if (
      Math.abs(current.x - rotation.x) + Math.abs(current.y - rotation.y) >
      0.0001
    )
      invalidate();
    else {
      current.x = rotation.x;
      current.y = rotation.y;
    }
  });
  return (
    <group ref={group} scale={Math.min(1, viewportWidth / 7.6)}>
      <Center>
        <Text3D
          font="/fonts/optimer-regular.typeface.json"
          size={1.7}
          height={0.2}
          bevelEnabled
          bevelThickness={0.025}
          bevelSize={0.018}
          bevelSegments={3}
          curveSegments={10}
          letterSpacing={0.09}
        >
          <meshStandardMaterial
            color="#eeeeee"
            metalness={0.35}
            roughness={0.27}
          />
          VODE
        </Text3D>
      </Center>
    </group>
  );
}
export default function VodeScene({ visible, ...props }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={visible ? "demand" : "never"}
      camera={{ position: [0, 0, 4.6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback={<span className="footer-static-signature">VODE</span>}
      aria-hidden="true"
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 6]} intensity={3.5} />
      <directionalLight position={[-5, -2, 3]} intensity={1.2} />
      <Suspense fallback={null}>
        <Signature {...props} />
      </Suspense>
    </Canvas>
  );
}
