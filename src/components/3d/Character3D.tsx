
import React, { useRef, useState } from 'react';
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
  const [modelError, setModelError] = useState(false);
  
  // Try to load the model, but catch errors
  let model;
  try {
    // Using suspend:false to prevent suspense and allow error handling
    const { scene } = useGLTF(modelPath, undefined, undefined, (error) => {
      console.error(`Failed to load model: ${modelPath}`, error);
      setModelError(true);
    });
    model = scene.clone();
  } catch (error) {
    console.error(`Error loading model: ${modelPath}`, error);
    setModelError(true);
  }

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
      {!modelError && model ? (
        <primitive object={model} scale={scale} />
      ) : (
        // Fallback 3D object when model fails to load
        <mesh scale={scale * 0.5}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={modelPath.includes('interviewer') ? "#4169E1" : "#FF6347"} />
        </mesh>
      )}
    </group>
  );
};

export default Character3D;
