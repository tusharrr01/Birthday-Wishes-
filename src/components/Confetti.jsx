import { useEffect, useRef } from "react";
import "./Confetti.css";

class ConfettiParticle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = -10 - Math.random() * 100;
    this.size = Math.random() * 10 + 6;
    this.speedY = Math.random() * 4 + 3;
    this.speedX = Math.random() * 3 - 1.5;
    this.color = [
      "#e91e63", "#ff6b9d", "#ffd1dc",
      "#ffeb3b", "#4caf50", "#00bcd4",
      "#9c27b0", "#ff5722"
    ][Math.floor(Math.random() * 8)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 6 - 3;
    this.opacity = 1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.speedY += 0.1;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (Math.random() > 0.5) {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function Confetti() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Reduced particle count for performance
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        particles.current.push(new ConfettiParticle(canvas));
      }, i * 20);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((particle) => {
        particle.update();
        particle.draw(ctx);
        return particle.y < canvas.height + 50;
      });

      if (particles.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particles.current = [];
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

export default Confetti;
