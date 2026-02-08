import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import Confetti from "./Confetti";
import "./MessageCard.css";

// Generate floating decorations (reduced)
const generateDecorations = () =>
  [...Array(5)].map(() => ({
    emoji: ["💖", "✨", "🌟"][Math.floor(Math.random() * 3)],
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 12 + Math.random() * 5,
    size: 0.9 + Math.random() * 0.4,
  }));

const decorations = generateDecorations();

function MessageCard({ isActive }) {
  const [curtainsOpened, setCurtainsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const prevIsActive = useRef(isActive);

  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);
  const curtainHintRef = useRef(null);
  const messageContentRef = useRef(null);
  const containerRef = useRef(null);

  const message = `Nanu Beta 🤏,

Happy Birthday 🥳 to my best friend 🫂 who somehow gets chubbier every year… while I just get more tired. 😌 Thanks for existing and making my life 10x more tiring (and a little dramatic — which, actually, you are 🫠).

Honestly, life with you is a mix of laughing too hard, roasting each other (oh — sorry, just you 🤣), and saying, “We’re never talking about this again” after every wild memory. Thanks for being unpaid drama film in my life, my partner in crime 👀, and the reason my phone storage is always full… just like you jadiiiii.

I hope this year brings you success 🧿, happiness, glow-up energy, and enough food to forget all your responsibilities. Never change — because the world needs your craziness, and I need someone to match mine 😁.

Happy Birthday! 🎉🎂✨
Now go enjoy your day like the real hippopotamus 🦛 you are.

— Sonal And Tushar 💖`;

  // Handle page transitions
  useEffect(() => {
    // Only trigger on transition to active
    if (isActive && !prevIsActive.current) {
      setTimeout(() => setShowConfetti(true), 10);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      
      // Animate title
      gsap.fromTo(".message h2",
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
      );
      
      prevIsActive.current = isActive;
      return () => clearTimeout(timer);
    }

    // Reset curtains when leaving page with smooth animation
    if (!isActive && prevIsActive.current) {
      setTimeout(() => {
        setCurtainsOpened(false);
        setShowSparkles(false);

        // Smooth reset animation
        if (curtainLeftRef.current && curtainRightRef.current) {
          const resetTimeline = gsap.timeline();

          resetTimeline.to([curtainLeftRef.current, curtainRightRef.current], {
            opacity: 1,
            duration: 0.3,
          });

          resetTimeline.to(
            [curtainLeftRef.current, curtainRightRef.current],
            {
              x: "0%",
              rotationY: 0,
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.3
          );
        }

        if (messageContentRef.current) {
          gsap.to(messageContentRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
          });
        }
      }, 300);
    }

    prevIsActive.current = isActive;
    return undefined;
  }, [isActive]);

  // Create sparkle burst effect (reduced)
  const createSparkles = () => {
    if (!containerRef.current) return;
    
    const emojis = ["✨", "🌟", "💖"];
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.className = "message-sparkle";
        sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        sparkle.style.position = "absolute";
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.fontSize = `${1 + Math.random() * 0.5}rem`;
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "100";
        
        containerRef.current.appendChild(sparkle);
        
        gsap.fromTo(sparkle,
          { scale: 0, opacity: 1 },
          {
            scale: 1.3,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            onComplete: () => sparkle.remove()
          }
        );
      }, i * 150);
    }
  };

  const handleOpenCurtains = () => {
    if (!curtainsOpened) {
      setCurtainsOpened(true);
      setShowSparkles(true);

      // Detect screen size for responsive animations
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;

      // Adjust animation parameters based on screen size
      const duration = isSmallMobile ? 1.2 : isMobile ? 1.4 : 1.5;
      const rotationAngle = isSmallMobile ? 10 : isMobile ? 12 : 15;

      // Animate curtain hint fade out with sparkle
      gsap.to(curtainHintRef.current, {
        opacity: 0,
        scale: 1.5,
        rotation: 10,
        duration: 0.5,
        ease: "power2.in",
      });

      // Create sparkle burst when opening
      createSparkles();

      // Animate curtains opening with 3D effect
      const timeline = gsap.timeline();

      timeline.to(
        curtainLeftRef.current,
        {
          x: "-100%",
          rotationY: -rotationAngle,
          duration: duration,
          ease: "power3.inOut",
        },
        0
      );

      timeline.to(
        curtainRightRef.current,
        {
          x: "100%",
          rotationY: rotationAngle,
          duration: duration,
          ease: "power3.inOut",
        },
        0
      );

      // Fade out curtains
      timeline.to(
        [curtainLeftRef.current, curtainRightRef.current],
        {
          opacity: 0,
          duration: 0.5,
          delay: isMobile ? 0.8 : 1,
        },
        0
      );

      // Reveal message content with enhanced animation
      timeline.to(
        messageContentRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: isMobile ? 0.8 : 1,
          ease: "elastic.out(1, 0.5)",
          delay: isMobile ? 0.6 : 0.8,
          onComplete: () => {
            // Add glow effect to message
            gsap.to(".typed-text", {
              boxShadow: "0 15px 50px rgba(255, 107, 181, 0.4), 0 0 30px rgba(255, 107, 181, 0.2)",
              duration: 1,
              yoyo: true,
              repeat: 2,
              ease: "sine.inOut"
            });
          }
        },
        0
      );
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    if (!curtainsOpened) {
      // Add subtle scale effect on touch
      gsap.to(curtainHintRef.current, {
        scale: 0.95,
        duration: 0.1,
      });
    }
  };

  const handleTouchEnd = () => {
    if (!curtainsOpened) {
      gsap.to(curtainHintRef.current, {
        scale: 1,
        duration: 0.1,
      });
    }
  };

  return (
    <section className="message" ref={containerRef}>
      {/* Floating decorations */}
      <div className="message-decorations">
        {decorations.map((item, i) => (
          <div
            key={i}
            className="message-deco"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              fontSize: `${item.size}rem`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <h2 className="abc">
        <span className="title-icon">💌</span>
         Choti Bachi Ke Liye Do Lines......
        <span className="title-icon">👀</span>
      </h2>

      <div className="curtain-container">
        <div className="curtain-rod">
          <span className="rod-decor rod-decor-left">🎀</span>
          <span className="rod-decor rod-decor-right">🎀</span>
        </div>

        <div
          className={`curtain-wrapper ${
            curtainsOpened ? "opened opening" : ""
          }`}
          onClick={handleOpenCurtains}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={curtainsOpened ? -1 : 0}
          aria-label="Click or tap to open the curtains and reveal the birthday message"
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !curtainsOpened) {
              e.preventDefault();
              handleOpenCurtains();
            }
          }}
        >
          <div ref={curtainLeftRef} className="curtain curtain-left"></div>
          <div ref={curtainRightRef} className="curtain curtain-right"></div>
          {!curtainsOpened && (
            <div ref={curtainHintRef} className="curtain-hint">
              <span className="hint-sparkle">✨</span>
              {window.innerWidth <= 768 ? "Tap" : "Click"} to Open
              <span className="hint-sparkle">✨</span>
            </div>
          )}
        </div>

        <div
          ref={messageContentRef}
          className="message-content"
          role="article"
          aria-label="Birthday message"
        >
          <div className="message-frame">
            <span className="frame-corner frame-tl">🌸</span>
            <span className="frame-corner frame-tr">🌸</span>
            <span className="frame-corner frame-bl">🌸</span>
            <span className="frame-corner frame-br">🌸</span>
          </div>
          <p className="typed-text">{message}</p>
        </div>
      </div>

      {showConfetti && <Confetti />}
      
      {/* Sparkle overlay when opened (reduced) */}
      {showSparkles && (
        <div className="sparkle-overlay-message">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="message-ambient-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              ✦
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MessageCard;
