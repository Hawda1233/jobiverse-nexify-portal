
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import Character3D from './Character3D';

// Fallback component when 3D rendering fails
const Scene3DFallback = () => (
  <div className="flex items-center justify-center h-full w-full bg-gray-800 rounded-lg">
    <p className="text-white text-center p-4">
      Unable to load 3D scene. Please ensure WebGL is enabled in your browser.
    </p>
  </div>
);

interface Scene3DProps {
  height?: string;
  enableControls?: boolean;
  characterPath?: string;
  showCharacter?: boolean;
  showStars?: boolean;
}

const Scene3D = ({
  height = '400px',
  enableControls = false,
  characterPath = '/models/robot.glb',
  showCharacter = true,
  showStars = true
}: Scene3DProps) => {
  const [renderError, setRenderError] = useState(false);

  // If there was a critical render error, show fallback UI
  if (renderError) {
    return <Scene3DFallback />;
  }

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        onError={(error) => {
          console.error("Canvas error:", error);
          setRenderError(true);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {showCharacter && (
            <Character3D modelPath={characterPath} />
          )}
          
          {showStars && (
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          )}
          
          <Environment preset="city" />
          
          {enableControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={false}
              minDistance={3}
              maxDistance={10}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
