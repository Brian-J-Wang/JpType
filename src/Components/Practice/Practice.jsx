import './Practice.css'
import '../../assets/JPType.css'
import StatPanel from '../StatPanel/StatPanel'
import PracticeType from '../PracticeType/PracticeType'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gameState from '../../JS/gameState'
import gameData from '../../JS/gameData'
import Timer from '../../JS/timer'
import Clock from '../Clock/Clock'
import ProgressBar from '../ProgressBar/ProgressBar'


function Practice(props) {
    //global variable declaration
    useEffect(() => {
        gameData.addKeyValue("progress", 0.0);
        gameData.addKeyValue("totalTime", 0.0);
    }, [])

    //timer functions
    const timer = useRef(new Timer());
    const timerId = useRef("");
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });
    useEffect(() => {
        const id = [
            gameState.onGameState("active", () => {
                timer.current.start();
                timerId.current = setInterval(updateTimeData, 10);
            }),
            gameState.onGameState("paused", () => {
                timer.current.pause();
            }),
            gameState.onGameState("resumed", () => {
                timer.current.resume();
            }),
            gameState.onGameState("complete", () => {
                timer.current.end();
                clearInterval(timerId.current);
    
                gameData.setValue("totalTime", timer.current.getElaspedTimeSeconds());
            }),
            gameState.onGameState("reset", () => {
                timer.current.reset();
                setTimeData({
                    minutes: 0,
                    seconds: 0,
                    ms: 0
                });
            })
        ];

        return () => {
            gameState.removeCallbacks(id);
        }
    }, []);

    //functions for hidding the button states;
    const [buttonBarState, setButtonBarState] = useState("practice__button-bar");
    useEffect(() => {

        gameState.onGameState("active", () => {
            setButtonBarState('practice__button-bar button-bar__state_hidden');
        })

        gameState.onGameState("complete", () => {
            setButtonBarState('practice__button-bar');
        })
    }, []);

    //progress bar logic 
    const [progress, setProgress] = useState(0); //range: 0.0 - 1.0
    useEffect(() => {

        gameData.onValueUpdated("charTyped", () => {
            const charCount = gameData.getValue("charCount");
            const charTyped = gameData.getValue("charTyped");
            gameData.setValue("progress", charTyped / charCount);
        })

        gameData.onValueUpdated("progress", (value) => {
            if (value > 1.0) {
                setProgress(1.0);
            } else {
                setProgress(value);
            }
        })
        
        return () => {
            gameData.clearOnUpdateFunctions("progress");
        }
    }, []);

    const updateTimeData = () => {
        const timeData = timer.current.getElapsedTime();
        setTimeData(timeData);
    }

    const resetGame = () => {
        if (gameState.isState("complete")) {
            gameState.reset();
        } else {
            return;
        }
    }

    const [menuBarClasses, setMenuBarClasses] = useState("practice__menu-bar");
    useEffect(() => {
        gameState.onGameState("active", () => {
            setMenuBarClasses("practice__menu-bar practice__menu-bar__state_hidden");
        });

        gameState.onGameState("complete", () => {
            setMenuBarClasses("practice__menu-bar");
        })
    }, [])

    const navigate = useNavigate();
    const onSettingClicked = () => {
        gameState.exit();
        navigate("/settings");
    }

    const onProfileClicked = () => {
        navigate("/profile")
    }

    return (
        <div className="practice">
            <div className={menuBarClasses}>
                <button onClick={onSettingClicked} className="jpType__button">Settings</button>
                <button onClick={onProfileClicked} className="jpType__button">Profile</button>
            </div>
            <StatPanel/>
            <PracticeType/>
            <div className="practice__footer">
                <ProgressBar className="practice-progress" progress={progress}></ProgressBar>
                <Clock minutes={timeData.minutes} seconds={timeData.seconds} milli={timeData.ms}/>
            </div>
            <div className={buttonBarState}>
                <button className="jpType__button" onClick={resetGame}>Reset</button>
            </div>
        </div>
    )
}

export default Practice