import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const playBeep = () => {
    const beepAudio = document.getElementById("beep");
    beepAudio.currentTime = 0;
    beepAudio.play();
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setBreakTime(5);
    setSessionTime(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);

    const beepAudio = document.getElementById("beep");
    beepAudio.pause();
    beepAudio.currentTime = 0;
  };

  const startTimer = () => {
    if (isRunning) return;

    const id = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 0) {
          return prevTimeLeft - 1;
        } else {
          if (isSession) {
            playBeep();
            setIsSession(false);
            return breakTime * 60;
          } else {
            setIsSession(true);
            return sessionTime * 60;
          }
        }
      });
    }, 100);

    setIntervalId(id);
    setIsRunning(true);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isSession ? sessionTime * 60 : breakTime * 60);
    }
  }, [sessionTime, breakTime, isSession]);

  return (
    <div className="App">
      <div className="clock-wrapper">
        <h1>25 + 5 Clock</h1>

        {/* Counter Buttons */}
        <div className="counter-headings">
          {[
            {
              label: "Break Length",
              time: breakTime,
              setTime: setBreakTime,
              id: "break",
            },
            {
              label: "Session Length",
              time: sessionTime,
              setTime: setSessionTime,
              id: "session",
            },
          ].map(({ label, time, setTime, id }) => (
            <div className="heading" key={id}>
              <h2 id={`${id}-label`}>{label}</h2>
              <div className="counter">
                <button
                  id={`${id}-decrement`}
                  onClick={() => {
                    if (time > 1) setTime(time - 1);
                  }}
                  className="counter-button"
                >
                  ⬇️
                </button>
                <h3 id={`${id}-length`}>{time}</h3>
                <button
                  id={`${id}-increment`}
                  onClick={() => {
                    if (time < 60) setTime(time + 1);
                  }}
                  className="counter-button"
                >
                  ⬆️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Timer Display */}
        <div className="watch">
          <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button
            id="start_stop"
            onClick={isRunning ? stopTimer : startTimer}
            className="control-button"
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button id="reset" onClick={resetTimer} className="control-button">
            Reset
          </button>
        </div>

        {/* Beep Sound */}
        <audio id="beep" preload="auto" src="beep.mp3"></audio>
      </div>
    </div>
  );
}

export default App;
