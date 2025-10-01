import { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

export default function PomodoroTimer({ onClose = () => {} }) {
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const nextPhaseRef = useRef<"work" | "break" | null>(null);

  const formatTime = (seconds = 0) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(workMinutes * 60);
    setNotification(null);
    setShowNotification(false);
    nextPhaseRef.current = null;
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setNotification(null);

    if (nextPhaseRef.current === "break") {
      // 工作結束 → 開始休息
      setIsWorking(false);
      setTimeLeft(Math.round(breakMinutes * 60));
      setIsRunning(true); // 按下才開始休息
    } else if (nextPhaseRef.current === "work") {
      // 休息結束 → 暫停
      setIsWorking(true);
      setTimeLeft(Math.round(workMinutes * 60));
      setIsRunning(false);
    }

    nextPhaseRef.current = null;
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);

          if (isWorking) {
            setNotification("Times up! Take a break 🍵");
            nextPhaseRef.current = "break";
          } else {
            setNotification("Break is over! Choose next session 💪");
            nextPhaseRef.current = "work";
          }

          setShowNotification(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWorking, workMinutes, breakMinutes]);

  // 圓環進度條
  const totalTime = isWorking ? workMinutes * 60 : breakMinutes * 60;
  const progress = (timeLeft / totalTime) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <h2 className="pomodoro-title">
          {isRunning
            ? isWorking
              ? "Working..."
              : "Break time!"
            : "⏳ Let's start working!"}
        </h2>
        {onClose && <button className="pomodoro-close" onClick={onClose}>✖</button>}
      </div>

      {/* 圓形進度條 */}
      <div className="pomodoro-circle">
        <svg width="200" height="200">
          <circle
            className="progress-bg"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="none"
          />
          <circle
            className="progress-bar"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            className="progress-text"
          >
            {formatTime(timeLeft)}
          </text>
        </svg>
      </div>

      <div className="pomodoro-selects">
        <select value={workMinutes} onChange={e => setWorkMinutes(Number(e.target.value))}>
          <option value={6/60}>6 sec</option>
          <option value={25}>25 mins</option>
          <option value={45}>45 mins</option>
          <option value={60}>60 mins</option>
        </select>

        <select value={breakMinutes} onChange={e => setBreakMinutes(Number(e.target.value))}>
          <option value={6/60}>6 sec</option>
          <option value={5}>5 mins</option>
          <option value={10}>10 mins</option>
          <option value={15}>15 mins</option>
        </select>
      </div>

      <div className="pomodoro-controls">
        <button onClick={startTimer}>Start / Resume</button>
        <button onClick={pauseTimer}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      {/* 自訂通知小視窗 */}
      {showNotification && notification && (
        <div className="pomodoro-notification">
          <span>{notification}</span>
          <button className="notification-close" onClick={handleCloseNotification}>✖</button>
        </div>
      )}
    </div>
  );
}
