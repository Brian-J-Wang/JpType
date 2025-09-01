import { SessionDataContext } from "../sessionDataProvider/sessionDataProvider"
import { useContext, useEffect, useRef, useState } from "react"
import Clock from "./clock"

import "./stopwatch.css"


const Stopwatch: React.FC = () => {
    const sessionDataContext = useContext(SessionDataContext);

    const clock = useRef(new Clock());
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });

    useEffect(() => {
        const id = sessionDataContext.events.onTestRestart.subscribe(() => {
            clock.current.reset();
        })

        return () => {
            sessionDataContext.events.onTestRestart.unsubscribe(id);
        };
    }, [])

    useEffect(() => {
        switch ( sessionDataContext.testState ) {
            case "active":
                if (clock.current.getState() == "paused") {
                    clock.current.resume();
                } else {
                    clock.current.start((elapsedTime) => {
                        setTimeData(elapsedTime);
                    }, 10);
                }
                break;
            case "complete":
                clock.current.end();
                sessionDataContext.setElapsedTime(clock.current.getElaspedTimeSeconds());
                break;
            case "paused":
                clock.current.pause();
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