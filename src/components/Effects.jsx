import { useEffect } from "react";
import { gsap } from "gsap";
import "./Effects.css";

function Effects() {
  useEffect(() => {
    // Launch effects with reduced intensity
    launchBalloons();
    launchFireworks();
    launchCrackers();

    // Single repeat of fireworks
    const fireworkTimer = setTimeout(() => launchFireworks(), 4000);

    return () => {
      clearTimeout(fireworkTimer);
    };
  }, []);

  // 🎈 Balloons - reduced count
  const launchBalloons = () => {
    const balloonEmojis = ["🎈", "🎈", "🎈", "🎀", "🎁"];
    const colors = ["#FF6B9D", "#FFC837", "#C4FAF8", "#FF85A2", "#A78BFA", "#60D399"];

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.textContent = balloonEmojis[i % balloonEmojis.length];

        const xPos = Math.random() * (window.innerWidth - 100);
        balloon.style.left = xPos + "px";
        balloon.style.color = colors[i % colors.length];
        balloon.style.fontSize = `${2.5 + Math.random() * 1.5}rem`;

        const drift = (Math.random() - 0.5) * 200;
        const rotate = (Math.random() - 0.5) * 360;
        balloon.style.setProperty("--drift", `${drift}px`);
        balloon.style.setProperty("--rotate", `${rotate}deg`);

        document.body.appendChild(balloon);
        setTimeout(() => balloon.remove(), 9000);
      }, i * 400);
    }
  };

  // 🎆 Fireworks - simplified
  const createFirework = (x, y, color) => {
    const particleCount = 20;
    const firework = document.createElement("div");
    firework.className = "firework";
    firework.style.left = x + "px";
    firework.style.top = y + "px";

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "firework-particle";
      particle.style.background = color;

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 50 + Math.random() * 80;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);

      firework.appendChild(particle);
    }

    document.body.appendChild(firework);
    setTimeout(() => firework.remove(), 1500);
  };

  const launchFireworks = () => {
    const colors = ["#FF6B9D", "#FFC837", "#C4FAF8", "#FF85A2", "#A78BFA", "#60D399"];

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const x = (window.innerWidth / 7) * (i + 1);
        const y = 100 + Math.random() * 200;
        const color = colors[i % colors.length];
        createFirework(x, y, color);
      }, i * 500);
    }
  };

  // 🎉 Crackers - reduced
  const launchCrackers = () => {
    const crackerEmojis = ["🎉", "🎊", "✨", "🎆"];

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const cracker = document.createElement("div");
        cracker.className = "cracker";
        cracker.textContent = crackerEmojis[i % crackerEmojis.length];

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);

        cracker.style.left = x + "px";
        cracker.style.top = y + "px";

        document.body.appendChild(cracker);
        setTimeout(() => cracker.remove(), 1000);
      }, i * 200);
    }
  };

  return null;
}

export default Effects;
