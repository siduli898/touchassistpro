import React from 'react';

interface SoftwareDimmerOverlayProps {
  brightnessLevel: number; // 10 - 100
}

export const SoftwareDimmerOverlay: React.FC<SoftwareDimmerOverlayProps> = ({
  brightnessLevel
}) => {
  if (brightnessLevel >= 100) return null;

  // Calculate black overlay opacity (maximum 0.82 when brightness is 10%)
  const opacity = ((100 - brightnessLevel) / 100) * 0.82;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-40 bg-black pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    />
  );
};
