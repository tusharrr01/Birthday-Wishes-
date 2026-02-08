import { gsap } from "gsap";
import { useEffect, useState, useRef } from "react";
import "./CelebrationPage.css";
import Confetti from "./Confetti";

// Generate heart positions (reduced for performance)
const generateHeartPositions = () =>
  [...Array(8)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 12 + Math.random() * 5,
    emoji: ["💗", "💖", "✨"][Math.floor(Math.random() * 3)],
    size: 0.9 + Math.random() * 0.5,
  }));

// Generate floating emojis (reduced)
const generateFloatingEmojis = () =>
  [...Array(5)].map(() => ({
    emoji: ["🎈", "🎁", "🌟", "🎉"][Math.floor(Math.random() * 4)],
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 14 + Math.random() * 5,
    size: 1 + Math.random() * 0.3,
  }));

const heartPositions = generateHeartPositions();
const floatingEmojis = generateFloatingEmojis();

function CelebrationPage({ onComplete, musicPlayerRef, isActive }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [activatedButtons, setActivatedButtons] = useState({
    lights: false,
    music: false,
    decorate: false,
    balloons: false,
    message: false,
  });
  const [lightsOn, setLightsOn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const titleRef = useRef(null);
  const slideIconRef = useRef(null);

  // Reset celebration state when returning to this page
  useEffect(() => {
    if (isActive) {
      setCurrentSlide(0);
      setShowButtons(false);
      setActivatedButtons({
        lights: false,
        music: false,
        decorate: false,
        balloons: false,
        message: false,
      });
      setLightsOn(false);
      setShowConfetti(false);
    }
  }, [isActive]);

  // Animate slide icons with bounce
  useEffect(() => {
    if (slideIconRef.current && isActive) {
      gsap.fromTo(slideIconRef.current, 
        { scale: 0, rotation: -180 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 0.8, 
          ease: "elastic.out(1, 0.5)",
          delay: 0.2
        }
      );
    }
  }, [currentSlide, isActive]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isActive) return;

      // Enter/Space to proceed through slides
      if ((e.key === 'Enter' || e.key === ' ') && !showButtons && currentSlide < slides.length) {
        e.preventDefault();
        handleNext();
      }

      // 'y' for Yes on question slide
      if (e.key.toLowerCase() === 'y' && slides[currentSlide]?.type === 'question') {
        e.preventDefault();
        handleAnswer('yes');
      }

      // 'n' for No on question slide
      if (e.key.toLowerCase() === 'n' && slides[currentSlide]?.type === 'question') {
        e.preventDefault();
        handleAnswer('no');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, currentSlide, showButtons]);

  // QNA Slides data with more emojis
  const slides = [
    {
      icon: "🎉",
      subIcons: ["✨", "🌟", "💫"],
      text: "It's Your Special Day Choti Fatakadiiii 🥰💥",
      type: "announcement",
    },
    {
      icon: "🎁",
      subIcons: ["💝", "🎀", "💖"],
      text: "Wanna see what We made ?? 👀",
      type: "question",
      options: [
        { text: "Yes!", value: "yes", emoji: "😍" },
        { text: "No", value: "no", emoji: "😅" },
      ],
    },
    {
      icon: "🥳",
      subIcons: ["🎊", "🪅", "🎈"],
      text: "Let's Goooo, Chubby Jiii 🐼💅",
      type: "announcement",
    },
  ];

  // Handle slide progression with enhanced animations
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      // Animate out current slide with particles
      createSlideParticles();
      
      gsap.to(".slide-content", {
        opacity: 0,
        y: -50,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setCurrentSlide(currentSlide + 1);
          // Animate in next slide
          gsap.fromTo(
            ".slide-content",
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
          );
        },
      });
    } else {
      // Show celebration buttons with burst effect
      createSlideParticles();
      gsap.to(".slides-container", {
        opacity: 0,
        scale: 0.8,
        rotation: 5,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => setShowButtons(true),
      });
    }
  };

  // Create particle burst on slide change
  const createSlideParticles = () => {
    const emojis = ["✨", "⭐", "💫", "🌟", "💖", "🎉"];
    const container = document.querySelector('.celebration-page');
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'slide-particle';
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      particle.style.position = 'absolute';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.fontSize = `${1 + Math.random()}rem`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '100';
      
      container.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 100 + Math.random() * 100;
      
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  };

  const handleAnswer = (value) => {
    if (value === "no") {
      // Playful response for "No" with shake and emojis
      gsap.to(".question-options", {
        x: -20,
        duration: 0.1,
        yoyo: true,
        repeat: 7,
        ease: "power2.inOut"
      });
      
      // Show "Please?" emojis
      const pleaseEmojis = ["🥺", "😢", "🙏", "💔"];
      pleaseEmojis.forEach((emoji, i) => {
        const el = document.createElement('div');
        el.textContent = emoji;
        el.style.position = 'fixed';
        el.style.left = `${20 + i * 20}%`;
        el.style.top = '50%';
        el.style.fontSize = '3rem';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '1000';
        document.body.appendChild(el);
        
        gsap.fromTo(el,
          { y: 0, opacity: 1, scale: 0 },
          { 
            y: -100, 
            opacity: 0, 
            scale: 2,
            duration: 1.5,
            delay: i * 0.1,
            ease: "power2.out",
            onComplete: () => el.remove()
          }
        );
      });
    } else {
      handleNext();
    }
  };

  // Determine which buttons to show based on activation state
  const showLightsButton = true;
  const showMusicButton = activatedButtons.lights;
  const showDecorateButton = activatedButtons.music;
  const showBalloonsButton = activatedButtons.decorate;
  const showMessageButton = activatedButtons.balloons;

  // Animate buttons in when they become visible
  useEffect(() => {
    if (showButtons) {
      // Celebration title animation
      gsap.fromTo(
        ".celebration-title",
        { opacity: 0, y: -30, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: "elastic.out(1, 0.5)" 
        }
      );
      
      gsap.fromTo(
        ".celebration-buttons",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.2 }
      );
      
      // Animate floating decorations
      gsap.fromTo(
        ".celebration-floating-decor",
        { opacity: 0, scale: 0 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: "back.out(2)",
          delay: 0.4 
        }
      );
    }
  }, [showButtons]);

  // Animate each button when it appears
  useEffect(() => {
    if (showDecorateButton) {
      const decorateBtn = document.querySelector('[data-button="decorate"]');
      if (decorateBtn) {
        gsap.fromTo(
          decorateBtn,
          { opacity: 0, x: -50, scale: 0.5, rotation: -15 },
          { opacity: 1, x: 0, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }
    }
  }, [showDecorateButton]);

  useEffect(() => {
    if (showBalloonsButton) {
      const balloonsBtn = document.querySelector('[data-button="balloons"]');
      if (balloonsBtn) {
        gsap.fromTo(
          balloonsBtn,
          { opacity: 0, x: -50, scale: 0.5, rotation: 15 },
          { opacity: 1, x: 0, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }
    }
  }, [showBalloonsButton]);

  useEffect(() => {
    if (showMessageButton) {
      const messageBtn = document.querySelector('[data-button="message"]');
      if (messageBtn) {
        gsap.fromTo(
          messageBtn,
          { opacity: 0, scale: 0.5, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
        );
        
        // Add pulsing glow effect
        gsap.to(messageBtn, {
          boxShadow: "0 0 30px rgba(255, 107, 181, 0.8), 0 0 60px rgba(255, 107, 181, 0.4)",
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      }
    }
  }, [showMessageButton]);

  // Handle button activation
  const handleButtonClick = (buttonType) => {
    if (activatedButtons[buttonType]) return;

    const button = document.querySelector(`[data-button="${buttonType}"]`);

    // Enhanced button click animation
    gsap.timeline()
      .to(button, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.in",
      })
      .to(button, {
        scale: 1.1,
        duration: 0.2,
        ease: "elastic.out(1, 0.5)",
      })
      .to(button, {
        scale: 1,
        duration: 0.1,
      });

    // Create click particles
    createButtonParticles(button, buttonType);

    // Activate the button
    setActivatedButtons((prev) => ({ ...prev, [buttonType]: true }));

    // Special handling for lights button
    if (buttonType === "lights") {
      setLightsOn(true);
      // Animate the room with dramatic lighting
      gsap.to(".celebration-page", {
        background: "linear-gradient(135deg, #1a0a1f 0%, #2d1b3d 50%, #1f0f29 100%)",
        duration: 1.5,
        ease: "power2.inOut",
      });
      
      // Add light beam effect
      createLightBeams();
      return;
    }

    // Special handling for music button
    if (buttonType === "music") {
      if (musicPlayerRef && musicPlayerRef.current) {
        musicPlayerRef.current.play();
      }
      // Create music notes
      createMusicNotes();
    }

    // Show corresponding decoration with animations
    setTimeout(() => {
      const decoration = document.querySelector(`.decoration-${buttonType}`);
      if (decoration) {
        if (buttonType === "decorate") {
          gsap.fromTo(
            decoration,
            { opacity: 0, y: 100, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.7)" }
          );
          // Add sparkle effect to bunting
          createBuntingSparkles();
        }
        else if (buttonType === "music") {
          gsap.fromTo(
            decoration,
            { opacity: 0, scale: 0, rotation: -30 },
            { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" }
          );
        }
        else if (buttonType === "balloons") {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);

          gsap.fromTo(
            decoration,
            { opacity: 0, y: 400 },
            { opacity: 1, y: 0, duration: 2.5, ease: "elastic.out(1, 0.8)" }
          );
        }
        else {
          gsap.fromTo(
            decoration,
            { opacity: 0, scale: 0, rotation: -180 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
          );
        }
      }
    }, 200);

    // If message button clicked, navigate to message page
    if (buttonType === "message") {
      // Grand finale effect
      createGrandFinale();
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    }
  };

  // Create particles around button on click
  const createButtonParticles = (button, type) => {
    const emojis = {
      lights: ["💡", "✨", "⚡", "🌟"],
      music: ["🎵", "🎶", "🎼", "🎤"],
      decorate: ["🎨", "🎀", "🌸", "🎊"],
      balloons: ["🎈", "🎉", "🪅", "🎊"],
      message: ["💌", "💖", "💕", "💝"]
    };
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.textContent = emojis[type][Math.floor(Math.random() * emojis[type].length)];
      particle.style.position = 'fixed';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.fontSize = '1.5rem';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 60 + Math.random() * 40;
      
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  };

  // Create light beam effects
  const createLightBeams = () => {
    const colors = ["#FFD700", "#FF6B9D", "#A78BFA", "#60D399"];
    
    for (let i = 0; i < 6; i++) {
      const beam = document.createElement('div');
      beam.className = 'light-beam';
      beam.style.left = `${15 + i * 15}%`;
      beam.style.background = `linear-gradient(to bottom, ${colors[i % colors.length]}44, transparent)`;
      document.querySelector('.celebration-page').appendChild(beam);
      
      gsap.fromTo(beam,
        { opacity: 0, scaleY: 0 },
        { 
          opacity: 0.6, 
          scaleY: 1, 
          duration: 1.5, 
          delay: i * 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(beam, {
              opacity: 0.3,
              duration: 2,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut"
            });
          }
        }
      );
    }
  };

  // Create floating music notes
  const createMusicNotes = () => {
    const notes = ["🎵", "🎶", "🎼", "♪", "♫"];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const note = document.createElement('div');
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.position = 'fixed';
        note.style.left = `${Math.random() * 100}%`;
        note.style.bottom = '0';
        note.style.fontSize = `${1.5 + Math.random()}rem`;
        note.style.pointerEvents = 'none';
        note.style.zIndex = '100';
        note.style.color = ['#FF6B9D', '#A78BFA', '#60D399', '#FFD700'][Math.floor(Math.random() * 4)];
        document.body.appendChild(note);
        
        gsap.to(note, {
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 200,
          rotation: (Math.random() - 0.5) * 360,
          opacity: 0,
          duration: 4 + Math.random() * 2,
          ease: "none",
          onComplete: () => note.remove()
        });
      }, i * 200);
    }
  };

  // Create sparkles on bunting
  const createBuntingSparkles = () => {
    const bunting = document.querySelector('.bunting');
    if (!bunting) return;
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.textContent = "✨";
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.pointerEvents = 'none';
        bunting.appendChild(sparkle);
        
        gsap.fromTo(sparkle,
          { scale: 0, opacity: 1 },
          { 
            scale: 1.5, 
            opacity: 0, 
            duration: 1,
            ease: "power2.out",
            onComplete: () => sparkle.remove()
          }
        );
      }, i * 300);
    }
  };

  // Grand finale effect
  const createGrandFinale = () => {
    const emojis = ["🎉", "🎊", "✨", "💖", "🌟", "🎈", "💫", "🥳"];
    
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.position = 'fixed';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.fontSize = `${1.5 + Math.random() * 1.5}rem`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        
        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          rotation: Math.random() * 720,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => particle.remove()
        });
      }, i * 50);
    }
  };

  return (
    <div className={`celebration-page ${lightsOn ? "lights-on" : ""}`}>
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Enhanced Floating hearts background */}
      <div className="floating-hearts-bg">
        {heartPositions.map((pos, i) => (
          <div
            key={i}
            className="heart-float"
            style={{
              left: `${pos.left}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
              fontSize: `${pos.size}rem`,
            }}
          >
            {pos.emoji}
          </div>
        ))}
      </div>

      {/* Additional floating emojis */}
      <div className="floating-emojis-bg">
        {floatingEmojis.map((item, i) => (
          <div
            key={i}
            className="emoji-float"
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

      {/* Sparkle overlay (reduced) */}
      <div className="sparkle-overlay">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="ambient-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* QNA Slides Section */}
      {!showButtons && (
        <div className="slides-container">
          <div className="slide-content">
            {/* Sub icons floating around main icon */}
            <div className="slide-sub-icons">
              {slides[currentSlide].subIcons?.map((icon, i) => (
                <span 
                  key={i} 
                  className="sub-icon"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {icon}
                </span>
              ))}
            </div>
            
            <div ref={slideIconRef} className="slide-icon">{slides[currentSlide].icon}</div>
            <h2 className="slide-text">{slides[currentSlide].text}</h2>

            {slides[currentSlide].type === "question" ? (
              <div className="question-options">
                {slides[currentSlide].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      option.value === "yes" ? "yes-button" : "no-button"
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.emoji} {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <button className="next-button" onClick={handleNext}>
                {currentSlide < slides.length - 1 ? "Next ✨" : "Chaloooooooo! 🎉"}
              </button>
            )}
          </div>

          {/* Progress dots with emojis */}
          <div className="slide-progress">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  index === currentSlide ? "active" : ""
                } ${index < currentSlide ? "completed" : ""}`}
              >
                {index < currentSlide ? "✓" : index === currentSlide ? "💖" : "○"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Celebration Buttons Section */}
      {showButtons && (
        <>
          {/* Floating decorations around buttons (reduced) */}
          <div className="celebration-floating-decors">
            {["🎈", "🎁", "🌟"].map((emoji, i) => (
              <div 
                key={i} 
                className="celebration-floating-decor"
                style={{
                  left: `${15 + i * 35}%`,
                  top: `${i === 1 ? 10 : 85}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Buttons Section */}
          <div className="celebration-buttons">
            <h2 className="celebration-title">
              <span className="title-emoji">🎂</span>
              Let's Celebrate!
              <span className="title-emoji">🎂</span>
            </h2>
            <p className="celebration-subtitle">
              ✨ Click the buttons to decorate ✨
            </p>

            <div className="buttons-grid">
              {/* Lights Button */}
              {showLightsButton && !activatedButtons.lights && (
                <button
                  className="action-button lights-button"
                  data-button="lights"
                  onClick={() => handleButtonClick("lights")}
                >
                  <span className="btn-emoji">💡</span>
                  <span className="btn-text">Lights Chalu Kar Nanu</span>
                  <span className="btn-sparkle">✨</span>
                </button>
              )}

              {/* Music Button */}
              {showMusicButton && !activatedButtons.music && (
                <button
                  className="action-button music-button"
                  data-button="music"
                  onClick={() => handleButtonClick("music")}
                >
                  <span className="btn-emoji">🎵</span>
                  <span className="btn-text">Play Music</span>
                  <span className="btn-sparkle">🎶</span>
                </button>
              )}

              {/* Decorate Button */}
              {showDecorateButton && !activatedButtons.decorate && (
                <button
                  className="action-button decorate-button"
                  data-button="decorate"
                  onClick={() => handleButtonClick("decorate")}
                >
                  <span className="btn-emoji">🎨</span>
                  <span className="btn-text">Decorate</span>
                  <span className="btn-sparkle">🎀</span>
                </button>
              )}

              {/* Balloons Button */}
              {showBalloonsButton && !activatedButtons.balloons && (
                <button
                  className="action-button balloons-button"
                  data-button="balloons"
                  onClick={() => handleButtonClick("balloons")}
                >
                  <span className="btn-emoji">🎈</span>
                  <span className="btn-text">Fly the Balloons</span>
                  <span className="btn-sparkle">🎉</span>
                </button>
              )}

              {/* Message Button */}
              {showMessageButton && (
                <button
                  className="action-button message-button"
                  data-button="message"
                  onClick={() => handleButtonClick("message")}
                >
                  <span className="btn-emoji">💌</span>
                  <span className="btn-text">Do Shabd Apke Liye Ma'am....</span>
                  <span className="btn-sparkle">💖</span>
                </button>
              )}
            </div>
          </div>

          {/* Decorations Container */}
          <div className="decorations-container">
            {/* Twinkling Lights (reduced) */}
            {activatedButtons.lights && (
              <div className="decoration-lights string-lights">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`light light-${i % 4}`}
                    style={{
                      left: `${5 + i * 8}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Enhanced Bunting decoration */}
            {activatedButtons.decorate && (
              <div className="decoration-decorate bunting">
                <div className="bunting-string">
                  {[
                    "🎉", "H", "a", "p", "p", "y", "🎂",
                    "B", "i", "r", "t", "h", "d", "a", "y", "🎉"
                  ].map((letter, i) => (
                    <div 
                      key={i} 
                      className={`bunting-flag ${letter.length > 1 ? 'emoji-flag' : `flag-${i % 4}`}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                {/* Streamers */}
                {/* <div className="streamers">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="streamer"
                      style={{
                        left: `${10 + i * 12}%`,
                        background: ['#FF6B9D', '#FFC837', '#A78BFA', '#60D399', '#FF69B4', '#00CED1', '#FFB6C1', '#87CEEB'][i],
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div> */}
              </div>
            )}

            {/* Cake (simplified) */}
            {activatedButtons.music && (
              <div className="decoration-music cake-container">
                <div className="cake">
                  <div className="cake-layer layer-3"></div>
                  <div className="cake-layer layer-2"></div>
                  <div className="cake-layer layer-1"></div>
                  <div className="cake-candles">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="candle">
                        <div className="flame"></div>
                        <div className="wick"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Balloons (reduced) */}
            {activatedButtons.balloons && (
              <div className="decoration-balloons">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`balloon balloon-${i % 4}`}
                    style={{
                      left: `${10 + i * 15}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${3.5 + (i % 3) * 0.5}s`,
                    }}
                  >
                    <div className="balloon-body"></div>
                    <div className="balloon-string"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CelebrationPage;
