import { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

export default function PomodoroTimer({ onClose = () => {} }) {
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // 格式化時間
  const formatTime = (seconds = 0) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 開始計時
  const startTimer = () => {
    console.log("startTimer called", { workMinutes, breakMinutes, timeLeft, isRunning });

    if (!workMinutes || !breakMinutes) {
      alert("請先選擇工作時間與休息時間");
      return;
    }

    if (!isRunning) {
      if (timeLeft === 0 || timeLeft === breakMinutes * 60) {
        setTimeLeft(workMinutes * 60);
        setIsWorking(true);
      }
      setIsRunning(true);
    }
  };

  // 暫停
  const pauseTimer = () => {
    console.log("pauseTimer called");
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  // 重設
  const resetTimer = () => {
    console.log("resetTimer called");
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(workMinutes * 60);
  };

  // 倒數與階段切換
  useEffect(() => {
    console.log("useEffect triggered", { isRunning, isWorking, timeLeft });

    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          alert(isWorking ? "Times up! Take a break 🍵" : "Go back to work! 💪");

          if (isWorking) {
            setIsWorking(false);
            return breakMinutes * 60;
          } else {
            setIsWorking(true);
            setIsRunning(false);
            return workMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log("clearing interval");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWorking, workMinutes, breakMinutes]);

  // 更新 timeLeft 當工作/休息時間改變
  useEffect(() => {
    console.log("workMinutes or breakMinutes changed", { workMinutes, breakMinutes });
    if (!isRunning) setTimeLeft(workMinutes * 60);
  }, [workMinutes, breakMinutes, isRunning]);

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <h2 className="pomodoro-title">
          {isRunning ? (isWorking ? "Working..." : "Break time!") : "Let's start working!"}
        </h2>
        {onClose && (
          <button className="pomodoro-close" onClick={onClose}>
            ✖
          </button>
        )}
      </div>

      <div className="pomodoro-timer">{formatTime(timeLeft)}</div>

      <div className="pomodoro-selects">
        <select value={workMinutes} onChange={(e) => setWorkMinutes(Number(e.target.value))}>
          <option value={6 / 60}>6 sec</option>
          <option value={25}>25 mins</option>
          <option value={45}>45 mins</option>
          <option value={60}>60 mins</option>
        </select>

        <select value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))}>
          <option value={6 / 60}>6 sec</option>
          <option value={5}>5 mins</option>
          <option value={10}>10 mins</option>
          <option value={15}>15 mins</option>
        </select>
      </div>

      <div className="pomodoro-controls">
        <button className="pomodoro-start" onClick={startTimer}>
          Start
        </button>
        <button className="pomodoro-pause" onClick={pauseTimer}>
          Pause
        </button>
        <button className="pomodoro-reset" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}
