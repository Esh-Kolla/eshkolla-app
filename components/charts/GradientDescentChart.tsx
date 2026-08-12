"use client";
import { useRef, useEffect } from 'react';

export default function GradientDescentChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Animation parameters
    let animationFrame: number;
    let time = 0;

    const loss = (w: number) => 0.2 * (w ** 2) + 0.1 * Math.sin(15 * w);
    const gradient = (w: number) => 0.4 * w + 1.5 * Math.cos(15 * w);

    const animate = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let i = 0; i <= width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j <= height; j += 50) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Draw loss function (centered)
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const w = (x / width) * 4 - 2; // Map [-2, 2]
        const y = height - (loss(w) * 100) - height / 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw gradient descent paths for 3 learning rates
      const rates = [0.01, 0.05, 0.1];
      const colors = ['#888888', '#00ff41', '#00d4ff'];
      
      rates.forEach((eta, idx) => {
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let w = Math.sin(time * 2) * 1.5; // Animated starting point
        for (let i = 0; i < 100; i++) {
          const x = ((w + 2) / 4) * width; // Map to canvas
          const y = height - (loss(w) * 100) - height / 2;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          
          w -= eta * gradient(w);
        }
        ctx.stroke();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={400} className="w-full" />;
}