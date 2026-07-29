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

        // Logo unfold mode (Official InternEdge geometric 'IE' emblem)
        const logoAlpha = morphProgress;
        ctx.rotate((1 - morphProgress) * Math.PI * 0.25);

        ctx.fillStyle = `rgba(255, 255, 255, ${logoAlpha})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 24 * logoAlpha;

        const s = 0.65 * morphProgress; // scale factor
        const mapX = (x: number) => (x - 50) * s;
        const mapY = (y: number) => (y - 50) * s;

        // Left Pillar 'I'
        ctx.beginPath();
        ctx.moveTo(mapX(14), mapY(14));
        ctx.lineTo(mapX(30), mapY(14));
        ctx.lineTo(mapX(30), mapY(86));
        ctx.lineTo(mapX(14), mapY(86));
        ctx.closePath();
        ctx.fill();

        // Top Arm 'E' (45° parallel chamfer)
        ctx.beginPath();
        ctx.moveTo(mapX(43), mapY(14));
        ctx.lineTo(mapX(86), mapY(14));
        ctx.lineTo(mapX(70), mapY(30));
        ctx.lineTo(mapX(43), mapY(30));
        ctx.closePath();
        ctx.fill();

        // Middle Arm 'E'
        ctx.beginPath();
        ctx.moveTo(mapX(43), mapY(42));
        ctx.lineTo(mapX(68), mapY(42));
        ctx.lineTo(mapX(68), mapY(58));
        ctx.lineTo(mapX(43), mapY(58));
        ctx.closePath();
        ctx.fill();

        // Bottom Arm 'E' (45° parallel chamfer)
        ctx.beginPath();
        ctx.moveTo(mapX(43), mapY(70));
        ctx.lineTo(mapX(86), mapY(70));
        ctx.lineTo(mapX(70), mapY(86));
        ctx.lineTo(mapX(43), mapY(86));
        ctx.closePath();
        ctx.fill();
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
