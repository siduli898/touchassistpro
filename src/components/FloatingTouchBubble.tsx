import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../services/soundEffects';
import { BubbleOpacity, BubbleSize } from './PreferencesModal';

interface FloatingTouchBubbleProps {
  onOpenPanel: () => void;
  onQuickSleep: () => void;
  isOpen: boolean;
  opacityMode?: BubbleOpacity;
  sizeMode?: BubbleSize;
}

export const FloatingTouchBubble: React.FC<FloatingTouchBubbleProps> = ({
  onOpenPanel,
  isOpen,
  opacityMode = '60',
  sizeMode = 'compact'
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 220 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 20,
    posY: 220
  });
  const hasMovedRef = useRef<boolean>(false);

  // Position on mount & reposition on window resize/orientation change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const clampToScreen = () => {
      const bubbleDim = sizeMode === 'compact' ? 44 : 52;
      const maxX = window.innerWidth - bubbleDim - 8;
      const maxY = window.innerHeight - bubbleDim - 8;

      setPosition((prev) => ({
        x: Math.max(8, Math.min(maxX, prev.x > window.innerWidth / 2 ? window.innerWidth - bubbleDim - 8 : 8)),
        y: Math.max(48, Math.min(maxY, prev.y))
      }));
    };

    const defaultX = Math.max(12, window.innerWidth - (sizeMode === 'compact' ? 56 : 64));
    const defaultY = Math.max(120, Math.min(window.innerHeight - 160, 260));
    setPosition({ x: defaultX, y: defaultY });

    window.addEventListener('resize', clampToScreen);
    return () => window.removeEventListener('resize', clampToScreen);
  }, [sizeMode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }

    const bubbleDim = sizeMode === 'compact' ? 44 : 52;
    const maxX = window.innerWidth - bubbleDim - 6;
    const maxY = window.innerHeight - bubbleDim - 6;

    const nextX = Math.max(6, Math.min(maxX, dragStartRef.current.posX + dx));
    const nextY = Math.max(40, Math.min(maxY, dragStartRef.current.posY + dy));

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Magnetic snap to nearest edge on release
    const bubbleDim = sizeMode === 'compact' ? 44 : 52;
    const midX = window.innerWidth / 2;
    const snapX = position.x < midX ? 8 : window.innerWidth - bubbleDim - 8;
    setPosition((prev) => ({ ...prev, x: snapX }));

    if (!hasMovedRef.current) {
      soundEffects.playClick();
      onOpenPanel();
    }
  };

  // Translucent styling
  let idleOpacity = 0.6;
  if (opacityMode === '80') idleOpacity = 0.8;
  if (opacityMode === '100') idleOpacity = 1.0;

  const currentOpacity = isOpen
    ? 0.15
    : isDragging || isHovered
    ? 1.0
    : idleOpacity;

  const isCompact = sizeMode === 'compact';
  const sizePixels = isCompact ? 44 : 52;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        opacity: currentOpacity,
        // CRITICAL FIX: No transition during drag = 100% butter smooth, zero jitter!
        transition: isDragging
          ? 'opacity 0.1s ease'
          : 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease'
      }}
      className={`fixed top-0 left-0 z-50 select-none cursor-pointer ${
        isOpen ? 'pointer-events-none scale-85' : 'active:scale-95'
      }`}
      aria-label="Assistive Touch Bubble"
      role="button"
      tabIndex={0}
    >
      {/* Multi-layered Frosted Acrylic Glass Ring */}
      <div
        style={{ width: `${sizePixels}px`, height: `${sizePixels}px` }}
        className="relative rounded-full flex items-center justify-center bg-slate-900/60 backdrop-blur-xl border border-cyan-400/35 shadow-lg shadow-black/50"
      >
        {/* Subtle breathing glow ring */}
        <div className="absolute inset-0.5 rounded-full border border-cyan-400/20 pointer-events-none" />

        {/* Tactile Core Sphere */}
        <div
          className={`rounded-full bg-linear-to-tr from-cyan-500 via-sky-400 to-blue-500 flex items-center justify-center shadow-inner ${
            isCompact ? 'w-6 h-6' : 'w-7.5 h-7.5'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
        </div>

        {/* 4 Cardinal micro-indicators */}
        <div className="absolute top-1 w-1 h-1 rounded-full bg-emerald-400" />
        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-400" />
        <div className="absolute left-1 w-1 h-1 rounded-full bg-sky-300" />
        <div className="absolute right-1 w-1 h-1 rounded-full bg-sky-300" />
      </div>
    </div>
  );
};
