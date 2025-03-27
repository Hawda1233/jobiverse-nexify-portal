
import React from 'react';
import { Button } from '@/components/ui/button';

interface FloatingButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
  width?: number;
  height?: number;
}

const Button3D: React.FC<FloatingButtonProps> = ({ text, onClick }) => {
  return (
    <div style={{ height: '100px', width: '200px' }}>
      <Button className="w-full h-full" onClick={onClick}>
        {text}
      </Button>
    </div>
  );
};

export default Button3D;
