import React, { useEffect, useRef } from 'react';

interface LiquidMetalCanvasProps {
  activeProgress?: number; // 0 to 1
  isAttracting?: boolean;
  className?: string;
}

export const LiquidMetalCanvas: React.FC<LiquidMetalCanvasProps> = ({
  activeProgress = 1,
  isAttracting = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for mercury liquid simulation
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 25 + 15,
      baseRadius: Math.random() * 25 + 15,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Update particle physics
      particles.forEach((p, idx) => {
        if (isAttracting) {
          // Pull smoothly towards center for Transformation melt effect
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          p.vx += dx * 0.001;
          p.vy += dy * 0.001;
          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
          // Mild magnetic mouse interaction & fluid oscillation
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 250) {
            const force = (250 - dist) / 250;
            p.vx += (dx / dist) * force * 0.2;
            p.vy += (dy / dist) * force * 0.2;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        p.x += p.vx + Math.sin(time + idx) * 0.3;
        p.y += p.vy + Math.cos(time + idx * 0.7) * 0.3;

        // Bounce bounds
        if (p.x < p.radius) { p.x = p.radius; p.vx *= -0.8; }
        if (p.x > width - p.radius) { p.x = width - p.radius; p.vx *= -0.8; }
        if (p.y < p.radius) { p.y = p.radius; p.vy *= -0.8; }
        if (p.y > height - p.radius) { p.y = height - p.radius; p.vy *= -0.8; }
      });

      // Render molten mercury metaball connection effect
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.4 * activeProgress;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(225, 231, 239, ${alpha})`;
            ctx.lineWidth = ((p1.radius + p2.radius) / 4) * (1 - dist / 180);
            ctx.stroke();
          }
        }
      }

      // Draw metallic liquid blobs with specular highlights
      particles.forEach((p) => {
        const r = p.radius * (0.8 + 0.2 * Math.sin(time * 2 + p.x));
        const gradient = ctx.createRadialGradient(
          p.x - r * 0.3,
          p.y - r * 0.3,
          r * 0.05,
          p.x,
          p.y,
          r
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * activeProgress})`);
        gradient.addColorStop(0.35, `rgba(210, 215, 225, ${0.75 * activeProgress})`);
        gradient.addColorStop(0.7, `rgba(120, 125, 138, ${0.4 * activeProgress})`);
        gradient.addColorStop(1, 'rgba(10, 10, 15, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeProgress, isAttracting]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
