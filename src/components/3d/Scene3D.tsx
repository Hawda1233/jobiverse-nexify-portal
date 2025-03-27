
import React from 'react';

interface Scene3DProps {
  height?: string;
  enableControls?: boolean;
  characterPath?: string;
  showCharacter?: boolean;
  showStars?: boolean;
}

const Scene3D = ({
  height = '400px',
}: Scene3DProps) => {
  return (
    <div 
      style={{ height, width: '100%' }}
      className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg flex items-center justify-center"
    >
      <div className="text-center p-4 text-white opacity-60">
        <p>3D elements disabled</p>
      </div>
    </div>
  );
};

export default Scene3D;
