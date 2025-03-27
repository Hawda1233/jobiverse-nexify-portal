
import React, { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh } from 'three';

interface FloatingButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
  width?: number;
  height?: number;
}

const ButtonMesh = ({ 
  text, 
  onClick, 
  color = '#4361ee', 
  hoverColor = '#3a0ca3',
  width = 2, 
  height = 0.6
}: FloatingButtonProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.05;
      // Subtle rotation
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <roundedBoxGeometry args={[width, height, 0.1, 10, 0.1]} />
        <meshStandardMaterial color={hovered ? hoverColor : color} />
        <Text 
          position={[0, 0, 0.06]} 
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </mesh>
    </group>
  );
};

const Button3D: React.FC<FloatingButtonProps> = (props) => {
  return (
    <div style={{ height: '100px', width: '200px', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ButtonMesh {...props} />
      </Canvas>
    </div>
  );
};

export default Button3D;
