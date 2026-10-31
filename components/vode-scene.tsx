"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { MathUtils, type Group, type Mesh } from "three";

type SceneProps = {
  visible: boolean;
  rotation: { x: number; y: number };
  immediate: boolean;
  onReady: () => void;
  onFailure: () => void;
  dragging: boolean;
};
function Signature({
  rotation,
  immediate,
  onReady,
}: Pick<SceneProps, "rotation" | "immediate" | "onReady">) {
  const viewport = useThree((state) => state.viewport);
  const invalidate = useThree((state) => state.invalidate);
  const group = useRef<Group>(null);
  const text = useRef<Mesh>(null);
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
    // One scale for every angle; the taller transparent canvas provides room to turn.
    const geometry = text.current?.geometry;
    if (geometry) {
      if (!geometry.boundingSphere) geometry.computeBoundingSphere();
      const diameter = (geometry.boundingSphere?.radius || 1) * 2;
      group.current.scale.setScalar(Math.min(1, viewport.width * 0.9 / diameter, viewport.height * 0.9 / diameter));
    }
  });
  return (
    <group ref={group}>
      <Center>
        <Text3D
          ref={text}
          font="/fonts/optimer-bold.typeface.json"
          size={1.7}
          height={0.35}
          bevelEnabled
          bevelThickness={0.045}
          bevelSize={0.03}
          bevelSegments={3}
          curveSegments={10}
          letterSpacing={0.09}
        >
          <meshBasicMaterial color="#000000" toneMapped={false} />
          VODE
        </Text3D>
      </Center>
    </group>
  );
}
function ContextRecovery({ onFailure }: { onFailure: () => void }) {
  const canvas = useThree(state => state.gl.domElement);
  useEffect(() => {
    function lost(event: Event) {
      event.preventDefault();
      onFailure();
    }
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [canvas, onFailure]);
  return null;
}

export default function VodeScene({ visible, dragging, onFailure, ...props }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={dragging ? "always" : visible ? "demand" : "never"}
      orthographic
      camera={{ position: [0, 0, 12], zoom: 32, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback={<span className="footer-static-signature">VODE</span>}
      aria-hidden="true"
    >
      <ContextRecovery onFailure={onFailure} />
      <Suspense fallback={null}>
        <Signature {...props} />
      </Suspense>
    </Canvas>
  );
}
