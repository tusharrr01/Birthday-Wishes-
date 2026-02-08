import { useEffect } from "react";
import "./Hearts.css";

function Hearts() {
  useEffect(() => {
    const emojis = ["❤", "💖", "💗", "💕"];
    const colors = ["#ff6b9d", "#ff99dd", "#ff69b4", "#ff1493"];

    const spawnHeart = () => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const x = Math.random() * window.innerWidth;
      const size = 16 + Math.random() * 16;
      const drift = -40 + Math.random() * 80;
      const duration = 6000 + Math.random() * 4000;

      heart.style.left = x + "px";
      heart.style.fontSize = size + "px";
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];

      document.querySelector(".hearts").appendChild(heart);

      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);

        const translateY = -(ease * window.innerHeight);
        const translateX = drift * progress;
        const rotate = progress * 20;
        const opacity = 1 - progress;

        heart.style.transform = `translateY(${translateY}px) translateX(${translateX}px) rotate(${rotate}deg)`;
        heart.style.opacity = opacity;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          heart.remove();
        }
      };

      requestAnimationFrame(animate);
    };

    // Slower spawn rate for better performance
    const interval = setInterval(spawnHeart, 1200);

    return () => clearInterval(interval);
  }, []);

  return <div className="hearts" aria-hidden="true"></div>;
}

export default Hearts;
