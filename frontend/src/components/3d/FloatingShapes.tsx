import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import { Mesh } from 'three';

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.1, 32, 32]}>
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
    </Sphere>
  );
}

function AnimatedBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.7;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.4;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[0.15, 0.15, 0.15]}>
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
    </Box>
  );
}

function AnimatedTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Torus ref={meshRef} position={position} args={[0.08, 0.03, 16, 100]}>
      <meshBasicMaterial color="#34d399" transparent opacity={0.4} />
    </Torus>
  );
}

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <AnimatedSphere position={[-1, 0.5, -0.5]} />
        <AnimatedBox position={[1, -0.3, -0.8]} />
        <AnimatedTorus position={[0.5, 0.8, -1]} />
        <AnimatedSphere position={[-0.8, -0.6, -0.3]} />
        <AnimatedBox position={[0.3, 0.2, -1.2]} />
      </Canvas>
    </div>
  );
};

export default FloatingShapes;