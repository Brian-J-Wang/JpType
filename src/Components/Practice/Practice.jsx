import './Practice.css'
import Stats from '../Stats/Stats'
import PracticeType from '../PracticeType/PracticeType'
import { useState, useRef, useEffect } from 'react'
import gameStateContext from '../../Contexts/GameStateContext'
import Timer from '../../JS/timer'
import Clock from '../Clock/Clock'


function Practice(props) {
    const [gameState, setGameState] = useState("inactive");
    const [results, setResults] = useState([
        {
            statName: "WPM",
            value: "----",
            desc: "words per minute"
        },
        {
            statName: "Errors",
            value: "----",
            desc: "errors committed in this run"
        },
        {
            statName: "Consistency",
            value: "----",
            desc: "(number of words - errors) / number of words"
        }

    ]);

    //timer variables
    const timer = useRef(new Timer());
    const timerId = useRef("");
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });

    /*
        data passed is expected to be an object whose keys match with the statName and value matches with the values

        let data = {
            WPM: "100",
            Errors: "4",
        }
    */

    const handleGameEnd = (data) => {
        const updatedResults = results.map((element) => {
            if (data[element.statName]) {
                element.value = data[element.statName];
            }

            return element;
        })

        setResults(updatedResults);
    }

    const updateGameState = (state) => {
        if (state == "inactive") {
            setGameState("inactive");
        } else if (state == "active") {
            setGameState("active");
        } else if (state == "paused") {
            setGameState("paused");
        } else if (state == "complete") {
            setGameState("complete");
        }
    }

    useEffect(() => {
        switch(gameState) {
            case "inactive":
                break;
            case "active":
                if (timer.current.getState() == "standby") {
                    timer.current.start();
                    
                    const id = setInterval(updateTimeData, 10);
                    timerId.current = id;
                } else if (timer.current.getState() == "paused") {
                    timer.current.resume();
                }
                break;
            case "paused":
                timer.current.pause();
                break;
            case "complete":
                timer.current.end();
                clearInterval(timerId.current);
                break;
        }
    }, [gameState]);

    const updateTimeData = () => {
        const timeData = timer.current.getElapsedTime();
        setTimeData(timeData);
    }

    return (
        <div className="practice">
            <gameStateContext.Provider value={{gameState, updateGameState}}>
                <div className="practice__stat-panel">
                    {
                        results.map((element) => {
                            return (
                            <Stats key={element.statName} name={element.statName} value={element.value}/>
                            )
                        })
                    }
                </div>
                <PracticeType onGameEnd={handleGameEnd}/>
                <div className="practice__footer">
                    <Clock minutes={timeData.minutes} seconds={timeData.seconds} milli={timeData.ms}/>
                </div>
            </gameStateContext.Provider>
        </div>
    )
}

export default Practice