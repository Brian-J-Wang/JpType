import './Practice.css'
import StatPanel from '../StatPanel/StatPanel'
import PracticeType from '../PracticeType/PracticeType'
import { useState, useRef, useEffect } from 'react'
import gameState from '../../JS/gameState'
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

    const resultsHandle = useRef(new resultsHandler());
    const [results, setResults] = useState(resultsHandle.current.get());

    //timer functions
    const timer = useRef(new Timer());
    const timerId = useRef("");
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });
    useEffect(() => {
        gameState.onGameActive(() => {
            timer.current.start();
            timerId.current = setInterval(updateTimeData, 10);
        });

        gameState.onGamePaused(() => {
            timer.current.pause();
        });

        gameState.onGameResumed(() => {
            timer.current.resume();
        })

        gameState.onGameComplete(() => {
            timer.current.end();
            clearInterval(timerId.current);

            gameDataHandle.current.setValue("totalTime", timer.current.getElapsedTime());

            setResults(resultsHandle.current.update(gameDataHandle.current.getValues()));
        })
    }, []);

    //functions for hidding the button states;
    const [buttonBarState, setButtonBarState] = useState("practice__button-bar");
    useEffect(() => {
        gameState.onGameActive(() => {
            setButtonBarState('practice__button-bar button-bar__state_hidden');
        })

        gameState.onGameComplete(() => {
            setButtonBarState('practice__button-bar');
        })
    })

    const updateTimeData = () => {
        const timeData = timer.current.getElapsedTime();
        setTimeData(timeData);
    }

    const getProgress = () => {
        return gameDataHandle.current.getValue("charTyped") / gameDataHandle.current.getValue("totalChar");
    }

    const getProgressBarState = () => {
        return `practice-progress ${((gameState.getState() == "complete") && "practice-progress__state_hidden")}`;
    }

    const resetGame = () => {
        if (gameState.getState() != "complete") {
            return;
        } else {
            gameState.reset();
        }
    }


    return (
        <div className="practice">
            <gameDataContext.Provider value={gameDataHandle.current}>
                <StatPanel elements={results}/>
                <PracticeType/>
                <div className="practice__footer">
                    <ProgressBar className={getProgressBarState()} progress={getProgress()}></ProgressBar>
                    <Clock minutes={timeData.minutes} seconds={timeData.seconds} milli={timeData.ms}/>
                </div>
                <div className={buttonBarState}>
                    <button className="practice__reset" onClick={resetGame}>Reset</button>
                </div>
            </gameDataContext.Provider>
        </div>
    )
}

export default Practice