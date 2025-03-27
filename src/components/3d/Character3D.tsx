
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface Character3DProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  modelPath?: string;
}

// Fallback model to display when GLB can't be loaded
const FallbackBox = ({ color = '#4361ee' }: { color?: string }) => {
  const meshRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const Character3D = ({
  position = [0, -1, 0],
  scale = 2,
  rotation = [0, 0, 0],
  modelPath = '/models/robot.glb'
}: Character3DProps) => {
  const groupRef = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  
  // Try to load the model but handle error gracefully
  const { scene, nodes, animations } = useGLTF(modelPath, true, true, 
    (error) => {
      console.error('Error loading 3D model:', error);
      setModelError(true);
    }
  ) || { scene: null, nodes: null, animations: null };
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Simple idle animation
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  // If there was an error loading the model, show fallback
  if (modelError) {
    return <FallbackBox />;
  }

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {scene && <primitive object={scene} />}
    </group>
  );
};

export default Character3D;
