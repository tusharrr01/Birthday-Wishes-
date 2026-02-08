import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState, useEffect } from "react";
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Confetti from "./components/Confetti";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";
import ErrorBoundary from "./components/ErrorBoundary";

gsap.registerPlugin(ScrollToPlugin);

// Generate floating party elements (reduced for performance)
const generatePartyElements = () => {
  const emojis = ["🎈", "🎁", "🌟", "💖", "✨"];
  return [...Array(8)].map(() => ({
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 18 + Math.random() * 8,
    size: 0.9 + Math.random() * 0.6,
  }));
};

const partyElements = generatePartyElements();

function App() {
  const [currentPage, setCurrentPage] = useState(1); // Start at 1 for Countdown page
  const heroRef = useRef(null);

  // Dev: if URL contains ?resetCountdown=1, clear persisted state and reload once
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("resetCountdown") === "1") {
        localStorage.removeItem("birthdayReached");
        params.delete("resetCountdown");
        const base = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, document.title, base);
        window.location.reload();
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  // Initialize to false so countdown shows on reload and clear persisted flag
  const [birthdayReached, setBirthdayReached] = useState(false);

  // Clear persisted flag on mount so reload always shows the countdown
  useEffect(() => {
    try {
      localStorage.removeItem("birthdayReached");
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  const [showEffects, setShowEffects] = useState(false);

  const page1Ref = useRef(null); // Countdown page
  const page2Ref = useRef(null); // Celebration Page
  const page3Ref = useRef(null); // MessageCard
  const page4Ref = useRef(null); // Gallery
  const musicPlayerRef = useRef(null); // Music player control

  // Animate hero section on mount
  useEffect(() => {
    if (heroRef.current && currentPage === 1) {
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    }
  }, [currentPage]);

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];

    const isForward = pageNumber > currentPage;

    // Animate out current page
    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    // Prepare next page
    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
    });

    // Animate in next page
    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        setCurrentPage(pageNumber);
        // Reset current page position
        gsap.set(currentPageRef.current, { x: "0%", visibility: "hidden" });

        // Smooth scroll to top
        gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
      },
    });
  };

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    localStorage.setItem("birthdayReached", "true"); // Persist to localStorage
    setShowEffects(true);
    // Stop effects after some time
    setTimeout(() => setShowEffects(false), 10000);
  };

  // Dev helper: reset persisted state so countdown shows again
  const resetBirthdayReached = () => {
    localStorage.removeItem("birthdayReached");
    setBirthdayReached(false);
    setCurrentPage(1);
    setShowEffects(false);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="animated-bg" />
        
        {/* Enhanced floating party elements */}
        <div className="floating-party-elements">
          {partyElements.map((item, i) => (
            <div
              key={i}
              className="party-element"
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
        <div className="global-sparkles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="global-sparkle"
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
        
        <MusicPlayer ref={musicPlayerRef} />
        <Hearts />

      {/* PAGE 1: Countdown Timer */}
      <div
        ref={page1Ref}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        style={{ visibility: currentPage === 1 ? "visible" : "hidden" }}
      >
        <section ref={heroRef} className="hero">
          <div className="hero-decoration">
            <span className="hero-emoji hero-emoji-1">🎈</span>
            <span className="hero-emoji hero-emoji-2">🎁</span>
            <span className="hero-emoji hero-emoji-3">🎀</span>
          </div>
          <h1 id="heroTitle">
            {birthdayReached ? (
              <>
                <span className="title-emoji-left">🎉</span>
                Happy Birthday <span className="highlight">Shrutiii</span>
                <span className="title-emoji-right">🎉</span>
                <span className="cake-emoji">🎂</span>
              </>
            ) : (
              <>
                <span className="sparkle-emoji">✨</span>
                Counting down to <span className="highlight">Shrutiii's</span>{" "}
                special day
                <span className="sparkle-emoji">✨</span>
                <span className="cake-emoji">🎂</span>
              </>
            )}
          </h1>
          <p className="hero-subtitle">
            <span className="subtitle-heart">💖</span>
            Wish You Many Many Happy Returns Of The Day Jadiiiiiiiiii 
            <span className="subtitle-heart">💖</span>
          </p>
        </section>

        <Countdown
          onBirthdayReached={handleBirthdayReached}
          birthdayReached={birthdayReached}
          // targetDate="NOW+2MIN"
        />

        <section className="teaser">
          <h2 id="teaserHeading">
            {birthdayReached ? (
              <>
                <span className="teaser-emoji">💖</span>
                Ready for your surprise!
                <span className="teaser-emoji">💖</span>
              </>
            ) : (
              <>
                <span className="teaser-emoji">✨</span>
                A special celebration awaits you at midnight...
                <span className="teaser-emoji">✨</span>
              </>
            )}
          </h2>
          <p className="teaser-hint">
            <span className="hint-emoji">🌟</span>
            Something magical is about to unfold
            <span className="hint-emoji">💫</span>
          </p>
        </section>

        <button
          id="surpriseBtn"
          className="celebrate-btn"
          disabled={!birthdayReached}
          onClick={() => goToPage(2)}
        >
          <span className="btn-emoji-left">🎀</span>
          Let's Celebrate
          <span className="btn-emoji-right">🎉</span>
        </button>
        
      </div>

      {/* PAGE 2: Celebration/QNA Page */}
      <div
        ref={page2Ref}
        className={`page ${currentPage === 2 ? "active" : ""}`}
        style={{ visibility: currentPage === 2 ? "visible" : "hidden" }}
      >
        <CelebrationPage
          onComplete={() => goToPage(3)}
          musicPlayerRef={musicPlayerRef}
          isActive={currentPage === 2}
        />
      </div>

      {/* PAGE 3: Message Card */}
      <div
        ref={page3Ref}
        className={`page ${currentPage === 3 ? "active" : ""}`}
        style={{ visibility: currentPage === 3 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(2)}>
          <span className="back-arrow">←</span> Back
        </button>
        <MessageCard isActive={currentPage === 3} />
        <button className="page-nav-btn" onClick={() => goToPage(4)}>
          <span className="nav-emoji">📸</span>
          View Our Memories
          <span className="nav-emoji">💕</span>
        </button>
      </div>

      {/* PAGE 4: Gallery */}
      <div
        ref={page4Ref}
        className={`page ${currentPage === 4 ? "active" : ""}`}
        style={{ visibility: currentPage === 4 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(3)}>
          ← Back
        </button>
        <Gallery isActive={currentPage === 4} />
        <section className="final">
          <div className="final-decorations">
            <span className="final-deco">🎈</span>
            <span className="final-deco">🎁</span>
            <span className="final-deco">🌟</span>
          </div>
          <h2 className="final-message">
            <span className="final-heart">💖</span>
            Forever Yours — Friends
            <span className="final-heart">💖</span>
          </h2>
          <p className="final-subtitle">
            <span className="final-sparkle">✨</span>
            Radhe Radhe
            <span className="final-sparkle">✨</span>
          </p>
          <div className="final-emojis">
            <span>🎉</span>
            <span>🎂</span>
            <span>🎊</span>
            <span>💕</span>
            <span>🌸</span>
          </div>
        </section>
      </div>

      {/* Effects */}
      {showEffects && <Effects />}
      {/* Confetti canvas during celebration */}
      {showEffects && <Confetti />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
