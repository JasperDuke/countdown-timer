import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!isRunning && isSession) {
      setTimer({ minutes: sessionTime, seconds: 0 });
    }
  }, [sessionTime, isRunning, isSession]);

  const resetTimer = () => {
    clearInterval(intervalId);
    setBreakTime(5);
    setSessionTime(25);
    setTimer({ minutes: 25, seconds: 0 });
    setIsRunning(false);
    setIsSession(true);
  };

  const startTimer = () => {
    if (isRunning) return;

    const id = setInterval(() => {
      setTimer((prev) => {
        const { minutes, seconds } = prev;

        if (seconds > 0) {
          return { minutes, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { minutes: minutes - 1, seconds: 59 };
        } else {
          if (isSession) {
            setIsSession(false);
            return { minutes: breakTime, seconds: 0 };
          } else {
            setIsSession(true);
            return { minutes: sessionTime, seconds: 0 };
          }
        }
      });
    }, 1000);

    setIntervalId(id);
    setIsRunning(true);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
  };

  const data = [
    {
      time: breakTime,
      setTime: setBreakTime,
      label: "Break Length",
      id: "break",
    },
    {
      time: sessionTime,
      setTime: setSessionTime,
      label: "Session Length",
      id: "session",
    },
  ];

  return (
    <div className="App">
      <div className="clock-wrapper">
        <h1>25 + 5 Clock</h1>

        {/* Counter Buttons */}
        <div className="counter-headings">
          {data.map((timer, index) => (
            <div className="heading" key={index}>
              <h2 id={timer.id + "-label"}>{timer.label}</h2>
              <div className="counter">
                <button
                  id={timer.id + "-decrement"}
                  onClick={() => {
                    if (timer.time <= 1) return;
                    timer.setTime((prev) => prev - 1);
                  }}
                  className="counter-button"
                >
                  ⬇️
                </button>
                <h3 id={timer.id + "-length"}>{timer.time}</h3>
                <button
                  id={timer.id + "-increment"}
                  onClick={() => timer.setTime((prev) => prev + 1)}
                  className="counter-button"
                >
                  ⬆️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Timer */}
        <div className="watch">
          <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
          <div className="watch-time">
            <div id="time-left">
              <span id="minute" className="count-down">
                {String(timer.minutes).padStart(2, "0")}
              </span>
              :
              <span id="second" className="count-down">
                {String(timer.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
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
      </div>
    </div>
  );
}

export default App;
