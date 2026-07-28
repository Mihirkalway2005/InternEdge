import React, { useEffect, useRef } from 'react';

interface DropletCanvasProps {
  stage: 'droplet' | 'logo' | 'complete';
  onLogoFormed?: () => void;
  className?: string;
}

export const DropletCanvas: React.FC<DropletCanvasProps> = ({
  stage,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    let morphProgress = 0; // 0: droplet, 1: logo

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (stage === 'logo' || stage === 'complete') {
        if (morphProgress < 1) morphProgress += 0.015;
      } else {
        if (morphProgress > 0) morphProgress -= 0.015;
      }

      // Render Liquid Glass Droplet / Geometric Logo
      const currentRadius = 40 + Math.sin(time * 1.5) * 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Render Liquid Glass specular outer ring
      const glassGrad = ctx.createRadialGradient(-15, -15, 2, 0, 0, currentRadius + 15);
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      glassGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
      glassGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)');
      glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');

      if (morphProgress < 0.5) {
        // Droplet mode
        ctx.beginPath();
        const dropFactor = 1 - morphProgress * 2;
        ctx.arc(0, 0, currentRadius * dropFactor, 0, Math.PI * 2);
        ctx.fillStyle = glassGrad;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.shadowBlur = 25;
        ctx.fill();

        // Internal reflection ring
        ctx.beginPath();
        ctx.arc(-8, -8, currentRadius * 0.4 * dropFactor, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      }

      if (morphProgress > 0.1) {
        // Logo unfold mode (Geometric crystal 'IE' emblem)
        const logoAlpha = morphProgress;
        ctx.rotate((1 - morphProgress) * Math.PI * 0.25);

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * logoAlpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 20;

        // Outer Octagon / Precision Frame
        const s = 36 * morphProgress;
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.5);
        ctx.lineTo(-s * 0.5, -s);
        ctx.lineTo(s * 0.5, -s);
        ctx.lineTo(s, -s * 0.5);
        ctx.lineTo(s, s * 0.5);
        ctx.lineTo(s * 0.5, s);
        ctx.lineTo(-s * 0.5, s);
        ctx.lineTo(-s, s * 0.5);
        ctx.closePath();
        ctx.stroke();

        // Inner 'IE' Monogram lines
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, -s * 0.4);
        ctx.lineTo(-s * 0.4, s * 0.4);
        ctx.moveTo(-s * 0.4, 0);
        ctx.lineTo(0, 0);

        ctx.moveTo(s * 0.4, -s * 0.4);
        ctx.lineTo(s * 0.1, -s * 0.4);
        ctx.lineTo(s * 0.1, s * 0.4);
        ctx.lineTo(s * 0.4, s * 0.4);
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
