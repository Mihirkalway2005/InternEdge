import React, { useEffect, useRef } from 'react';

interface CausticBackgroundProps {
  theme?: 'dark' | 'sapphire' | 'gold';
  className?: string;
}

export const CausticBackground: React.FC<CausticBackgroundProps> = ({
  theme = 'dark',
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

    const particles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      speedY: (Math.random() - 0.5) * 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render Caustic ambient glow waves
      const cx = width / 2;
      const cy = height / 2;
      const waveRadius = Math.min(width, height) * 0.6;

      const causticGrad = ctx.createRadialGradient(
        cx + Math.sin(time) * 100,
        cy + Math.cos(time * 0.8) * 60,
        10,
        cx,
        cy,
        waveRadius
      );

      if (theme === 'sapphire') {
        causticGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        causticGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.04)');
        causticGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
      } else if (theme === 'gold') {
        causticGrad.addColorStop(0, 'rgba(236, 227, 206, 0.08)');
        causticGrad.addColorStop(0.5, 'rgba(30, 25, 15, 0.04)');
        causticGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
      } else {
        causticGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
        causticGrad.addColorStop(0.6, 'rgba(20, 20, 20, 0.02)');
        causticGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
      }

      ctx.fillStyle = causticGrad;
      ctx.fillRect(0, 0, width, height);

      // Render micro ambient particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (theme === 'sapphire') {
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.8})`;
        } else if (theme === 'gold') {
          ctx.fillStyle = `rgba(236, 227, 206, ${p.alpha * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.4})`;
        }
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
