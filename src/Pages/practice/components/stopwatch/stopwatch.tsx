import { SessionDataContext } from "../sessionData/sessionDataProvider"
import { useContext, useEffect, useRef, useState } from "react"
import Clock from "./clock"

import "./stopwatch.css"


const Stopwatch: React.FC = () => {
    const sessionDataContext = useContext(SessionDataContext);

    const watch = useRef(new Clock());
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });

    useEffect(() => {
        switch ( sessionDataContext.testState ) {
            case "active":
                watch.current.start((elapsedTime) => {
                    setTimeData(elapsedTime);
                }, 10);
                break;
            case "complete":
                watch.current.end();
                sessionDataContext.setElapsedTime(watch.current.getElaspedTimeSeconds());
                break;
            case "paused":
                watch.current.pause();
                break;
            case "reset":
                watch.current.reset();
                setTimeData({
                    minutes: 0,
                    seconds: 0,
                    ms: 0
                });
                break;
            case "resumed":
                watch.current.resume();
                break;
        }

    }, [ sessionDataContext.testState ]);

    const formatSeconds = () => {
        if (timeData.seconds < 10) {
            return `0${timeData.seconds}`;
        } else {
            return timeData.seconds;
        }
    }

    const formatms = () => {
        if (timeData.ms < 10) {
            return `00${timeData.ms}`;
        } else if (timeData.ms < 100) {
            return `0${timeData.ms}`;
        } else {
            return timeData.ms;
        } 
    }

    return (
        <div className="clock">
            <p className="clock__time">
                {timeData.minutes}:{formatSeconds()}<span className="clock__ms">{formatms()}</span>
            </p>
        </div>
    )
}

export default Stopwatch;