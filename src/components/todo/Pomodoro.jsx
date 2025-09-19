import { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

export default function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState("");
  const [breakMinutes, setBreakMinutes] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // 秒數
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);

  // 格式化時間 (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 啟動計時
  const startTimer = () => {
    if (!workMinutes || !breakMinutes) {
      alert("請先選擇工作時間與休息時間");
      return;
    }

    if (!isRunning) {
      setIsRunning(true);

      if (timeLeft === 0) {
        setIsWorking(true);
        setTimeLeft(workMinutes * 60);
      }
    }
  };

  // 停止（重設）
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(0);
  };

  // 暫停
  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  // 倒數處理
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);

      if (isWorking) {
        setIsWorking(false);
        setTimeLeft(breakMinutes * 60);
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isWorking, breakMinutes]);

  return (
    <div className="pomodoro-container">
      <h2 className="pomodoro-title">
        {isRunning ? (isWorking ? "Working..." : "Break time!") : "Let's start working!"}
      </h2>

      <div className="pomodoro-timer">{formatTime(timeLeft)}</div>

      <div className="pomodoro-selects">
        <select
          value={workMinutes}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
        >
          <option value="">Select Pomodoro Time</option>
          <option value={25}>25 mins</option>
          <option value={45}>45 mins</option>
          <option value={60}>60 mins</option>
        </select>

        <select
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
        >
          <option value="">break time</option>
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
          Stop
        </button>
        <button className="pomodoro-reset" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}
