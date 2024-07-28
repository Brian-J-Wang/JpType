import './Practice.css'
import StatPanel from '../StatPanel/StatPanel'
import PracticeType from '../PracticeType/PracticeType'
import { useState, useRef, useEffect } from 'react'
import gameStateContext from '../../Contexts/gameStateContext'
import gameDataContext from '../../Contexts/gameDataContext'
import gameDataHandler from '../../JS/gameDataHandler'
import resultsHandler from '../../JS/resultsHandler'
import Timer from '../../JS/timer'
import Clock from '../Clock/Clock'
import ProgressBar from '../ProgressBar/ProgressBar'


function Practice(props) {
    const gameDataHandle = useRef(new gameDataHandler({
        totalChar: 0,
        charTyped: 0,
        totalError: 0,
        totalTime: 0
    }))

    const [gameState, setGameState] = useState("inactive");

    const resultsHandle = useRef(new resultsHandler());
    const [results, setResults] = useState(resultsHandle.current.get());

    //timer variables
    const timer = useRef(new Timer());
    const timerId = useRef("");
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });

    const handleGameEnd = () => {
        gameDataHandle.current.setValue("totalTime", timer.current.getElapsedTime());

        console.log(gameDataHandle.current.getValues());

        setResults(resultsHandle.current.update(gameDataHandle.current.getValues()));
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

                gameDataHandle.current.setValue("totalTime", timer.current.getElapsedTime());

                handleGameEnd();
                break;
        }
    }, [gameState]);

    const updateTimeData = () => {
        const timeData = timer.current.getElapsedTime();
        setTimeData(timeData);
    }

    const getProgress = () => {
        return gameDataHandle.current.getValue("charTyped") / gameDataHandle.current.getValue("totalChar");
    }

    const getProgressBarState = () => {
        return `practice-progress ${((gameState == "complete") && "practice-progress__state_hidden")}`;
    }


    return (
        <div className="practice">
            <gameDataContext.Provider value={gameDataHandle.current}>
            <gameStateContext.Provider value={{gameState, updateGameState}}>
                <StatPanel elements={results}/>
                <PracticeType onGameEnd={handleGameEnd}/>
                <div className="practice__footer">
                    <ProgressBar className={getProgressBarState()} progress={getProgress()}></ProgressBar>
                    <Clock minutes={timeData.minutes} seconds={timeData.seconds} milli={timeData.ms}/>
                </div>
            </gameStateContext.Provider>
            </gameDataContext.Provider>
        </div>
    )
}

export default Practice