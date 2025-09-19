import { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

export default function PomodoroTimer({ onClose }) {
  const [workMinutes, setWorkMinutes] = useState();
  const [breakMinutes, setBreakMinutes] = useState();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);

  // 格式化時間
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 開始計時
  const startTimer = () => {
    if (!workMinutes || !breakMinutes) {
      alert("請先選擇工作時間與休息時間");
      return;
    }
    if (!isRunning) {
      // 如果還沒開始過，初始化時間
      if (timeLeft === 0) {
        setTimeLeft(workMinutes * 60);
        setIsWorking(true);
      }
      setIsRunning(true);
    }
  };

  // 暫停
  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  // 重設
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(workMinutes ? workMinutes * 60 : 0);
  };

  // 倒數與階段切換
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          alert(isWorking ? "Times up! Take a break🍵" : "Go back to work!💪");

          if (isWorking) {
            setIsWorking(false);
            return breakMinutes * 60; // 切換到休息
          } else {
            setIsWorking(true);
            setIsRunning(false); // 完成循環後暫停
            return workMinutes * 60; // 切換到工作
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorking, workMinutes, breakMinutes]);

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
        <select value={workMinutes || ""} onChange={(e) => setWorkMinutes(Number(e.target.value))}>
          <option value="">Select Pomodoro Time</option>
          <option value={0.1}>6 sec</option>
          <option value={25}>25 mins</option>
          <option value={45}>45 mins</option>
          <option value={60}>60 mins</option>
        </select>

        <select value={breakMinutes || ""} onChange={(e) => setBreakMinutes(Number(e.target.value))}>
          <option value="">Select Break Time</option>
          <option value={0.1}>6 sec</option>
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
