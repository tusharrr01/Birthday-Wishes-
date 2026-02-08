import { useEffect, useState } from "react";
import "./Countdown.css";

function Countdown({ onBirthdayReached, birthdayReached, targetDate }) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [prevTime, setPrevTime] = useState({
    hours: null,
    minutes: null,
    seconds: null,
  });

  useEffect(() => {
    // If birthday already reached, don't start the countdown
    if (birthdayReached) {
      return;
    }

    // === How to set the target date ===
    // Pass a `targetDate` prop to this component. Supported values:
    // - Date object: new Date('2026-01-30T00:00:00')
    // - ISO string: '2026-01-30T00:00:00'
    // - Test shorthand: 'NOW+2MIN' -> two minutes from now (useful while developing)
    // If `targetDate` is omitted or invalid, the component falls back to
    // the default below. Replace this ISO string with your real birthday.
    const defaultTarget = new Date('2026-01-30T16:05:00');

    let parsedTarget;
    if (targetDate === 'NOW+2MIN') {
      parsedTarget = new Date(Date.now() + 2 * 60 * 1000);
    } else if (targetDate) {
      parsedTarget = targetDate instanceof Date ? targetDate : new Date(targetDate);
      if (isNaN(parsedTarget)) {
        console.warn('Countdown: invalid targetDate prop, falling back to default');
        parsedTarget = defaultTarget;
      }
    } else {
      parsedTarget = defaultTarget;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, parsedTarget - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime({ hours, minutes, seconds });

      if (diff <= 0 && !birthdayReached) {
        onBirthdayReached();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [onBirthdayReached, birthdayReached, targetDate]);

  useEffect(() => {
    setPrevTime(time);
  }, [time]);

  const Digit = ({ value, label, prevValue }) => {
    const shouldFlip = prevValue !== null && prevValue !== value;

    return (
      <div className="digit">
        <div className={`card ${shouldFlip ? "flip" : ""}`}>
          <div className="text">{String(value).padStart(2, "0")}</div>
        </div>
        <div className="label">{label}</div>
      </div>
    );
  };

  if (birthdayReached) {
    return (
      <section className="countdown">
        <div className="flip-timer">
          <span className="birthday-celebration">
            🎉 It's Your Birthday! 🎉
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="countdown">
      <div className="flip-timer">
        <Digit value={time.hours} label="Hours" prevValue={prevTime.hours} />
        <Digit
          value={time.minutes}
          label="Minutes"
          prevValue={prevTime.minutes}
        />
        <Digit
          value={time.seconds}
          label="Seconds"
          prevValue={prevTime.seconds}
        />
      </div>
    </section>
  );
}

export default Countdown;
