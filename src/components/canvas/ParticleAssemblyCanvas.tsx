'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleAssemblyCanvasProps {
  onAssemblyComplete?: () => void;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  targetSize: number;
  color: string;
  delay: number;
  curvedAngle: number;
  curvedDistance: number;
}

export const ParticleAssemblyCanvas: React.FC<ParticleAssemblyCanvasProps> = ({
  onAssemblyComplete,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const dpr = Math.max(2, window.devicePixelRatio || 1);
    const cssWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    const cssHeight = canvas.parentElement?.clientHeight || window.innerHeight;

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    ctx.scale(dpr, dpr);

    let width = cssWidth;
    let height = cssHeight;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      const currentDpr = Math.max(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * currentDpr);
      canvas.height = Math.floor(height * currentDpr);
      ctx.scale(currentDpr, currentDpr);
    };
    window.addEventListener('resize', handleResize);

    const fontSize = Math.min(width * 0.13, 140);
    const fontStr = `900 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist", "Inter", sans-serif`;

    // Off-screen canvas sampling for exact "InternEdge" pixel targets
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.floor(width * dpr);
    offCanvas.height = Math.floor(height * dpr);
    const offCtx = offCanvas.getContext('2d');

    const targetPoints: { x: number; y: number }[] = [];

    if (offCtx) {
      offCtx.scale(dpr, dpr);
      offCtx.font = fontStr;
      offCtx.fillStyle = '#FFFFFF';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText('INTERNEDGE', width / 2, height / 2 - 20);

      const imgData = offCtx.getImageData(0, 0, Math.floor(width * dpr), Math.floor(height * dpr));
      const data = imgData.data;
      const step = Math.max(2, Math.floor(fontSize / 45));

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const px = Math.floor(x * dpr);
          const py = Math.floor(y * dpr);
          const index = (py * Math.floor(width * dpr) + px) * 4;
          if (data[index + 3] > 128) {
            targetPoints.push({ x, y });
          }
        }
      }
    }

    targetPoints.sort((a, b) => a.x - b.x);

    const minX = targetPoints.length > 0 ? targetPoints[0].x : 0;
    const maxX = targetPoints.length > 0 ? targetPoints[targetPoints.length - 1].x : width;
    const wordWidth = Math.max(1, maxX - minX);

    const particleColors = [
      'rgba(255, 255, 255, ',
      'rgba(240, 244, 248, ',
      'rgba(226, 232, 240, ',
      'rgba(236, 227, 206, ',
    ];

    // Direct left-to-right assembly timing (0s start delay)
    const particles: Particle[] = targetPoints.map((target) => {
      let startX = 0;
      let startY = 0;
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { startX = Math.random() * width; startY = -30; }
      else if (edge === 1) { startX = width + 30; startY = Math.random() * height; }
      else if (edge === 2) { startX = Math.random() * width; startY = height + 30; }
      else { startX = -30; startY = Math.random() * height; }

      const normalizedX = (target.x - minX) / wordWidth;
      const delay = normalizedX * 1.8 + Math.random() * 0.2; // Direct assembly start from left to right

      return {
        x: startX,
        y: startY,
        startX,
        startY,
        targetX: target.x,
        targetY: target.y,
        size: Math.random() * 1.2 + 1.0,
        targetSize: Math.random() * 1.2 + 2.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        delay,
        curvedAngle: (Math.random() - 0.5) * Math.PI,
        curvedDistance: Math.random() * 90 + 30,
      };
    });

    const startTime = performance.now();
    let isCompletedFired = false;

    // Render loop
    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Direct curved trajectory assembly (No double animation / initial wander)
      particles.forEach((p) => {
        if (elapsed < p.delay) {
          // Waiting for its left-to-right turn
          ctx.fillStyle = `${p.color}0.3)`;
          ctx.beginPath();
          ctx.arc(p.startX, p.startY, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const duration = 1.0;
          const progress = Math.min(1, (elapsed - p.delay) / duration);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Smooth cubic ease-out

          const midX = (p.startX + p.targetX) / 2 + Math.cos(p.curvedAngle) * p.curvedDistance;
          const midY = (p.startY + p.targetY) / 2 + Math.sin(p.curvedAngle) * p.curvedDistance;

          const invT = 1 - easeProgress;
          p.x = invT * invT * p.startX + 2 * invT * easeProgress * midX + easeProgress * easeProgress * p.targetX;
          p.y = invT * invT * p.startY + 2 * invT * easeProgress * midY + easeProgress * easeProgress * p.targetY;

          const currentSize = p.size + (p.targetSize - p.size) * easeProgress;
          const alpha = 0.5 + 0.5 * easeProgress;

          ctx.fillStyle = `${p.color}${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // High-DPI Vector Text Overlay & Specular Sheen (as assembly finishes from ~2.8s onwards)
      if (elapsed > 2.8) {
        const solidAlpha = Math.min(1, (elapsed - 2.8) / 0.6);
        
        ctx.save();
        ctx.font = fontStr;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = `rgba(255, 255, 255, ${solidAlpha})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 15 * solidAlpha;
        ctx.fillText('INTERNEDGE', width / 2, height / 2 - 20);

        // Specular metallic sheen sweep across solid wordmark
        if (elapsed > 3.2 && elapsed < 4.4) {
          const sweepProgress = (elapsed - 3.2) / 1.0;
          const sweepX = minX + sweepProgress * wordWidth;

          ctx.globalCompositeOperation = 'source-atop';
          const sheenGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
          sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
          sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = sheenGrad;
          ctx.fillRect(minX, height / 2 - 100, wordWidth, 200);
        }

        ctx.restore();
      }

      // Signal subtitle reveal (~3.6s)
      if (elapsed >= 3.6 && !isCompletedFired) {
        isCompletedFired = true;
        if (onAssemblyComplete) onAssemblyComplete();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onAssemblyComplete]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
