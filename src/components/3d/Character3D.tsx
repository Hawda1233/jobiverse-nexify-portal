
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface Character3DProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  modelPath?: string;
  animated?: boolean;
}

const Character3D: React.FC<Character3DProps> = ({ 
  position = [0, -1, 0],
  scale = 2,
  rotation = [0, 0, 0],
  modelPath = '/models/robot.glb',
  animated = true
}) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);

  // Clone the scene to avoid sharing issues
  const model = scene.clone();

  // Animation loop
  useFrame(({ clock }) => {
    if (groupRef.current && animated) {
      // Subtle floating animation
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
      // Slow rotation
      groupRef.current.rotation.y = rotation[1] + clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={model} scale={scale} />
    </group>
  );
};

export default Character3D;
