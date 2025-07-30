import '../../assets/JPType.css'
import StatPanel from '../../Components/StatPanel/StatPanel.jsx'
import PracticeType from '../../Components/PracticeType/PracticeType.tsx'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gameState from '../../JS/gameState.js'
import gameData from '../../JS/gameData.js'
import Stopwatch from '../../JS/stopwatch.js'
import Clock from '../../Components/Clock/Clock.tsx'
import ProgressBar from '../../Components/ProgressBar/ProgressBar.jsx'
import settingIcon from '../../assets/setting.svg'

import styles from "./practice.module.css"


function PracticePage(props) {
    //global variable declaration
    useEffect(() => {
        gameData.addKeyValue("progress", 0.0);
        gameData.addKeyValue("totalTime", 0.0);
    }, [])

    //stopwatch functions
    const stopwatch = useRef(new Stopwatch());
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });
    useEffect(() => {
        const ids = [
            gameState.onGameState("active", () => {
                stopwatch.current.start((elapsedTime) => {
                    setTimeData(elapsedTime);
                }, 10);
            }),
            gameState.onGameState("paused", () => {
                stopwatch.current.pause();
            }),
            gameState.onGameState("resumed", () => {
                stopwatch.current.resume();
            }),
            gameState.onGameState("complete", () => {
                stopwatch.current.end();
                gameData.setValue("totalTime", stopwatch.current.getElaspedTimeSeconds());
            }),
            gameState.onGameState("reset", () => {
                stopwatch.current.reset();
                setTimeData({
                    minutes: 0,
                    seconds: 0,
                    ms: 0
                });
            })
        ];

        return () => {
            gameState.removeCallbacks(ids);
        }
    }, []);

    //function for hiding the header when the game begins;
    const [ headerHidden, setHeaderHidden ] = useState<boolean>(false);
    useEffect(() => {
        const ids = [
            gameState.onGameState("active", () => {
                setHeaderHidden(true);
            }),
            gameState.onGameState("complete", () => {
                setHeaderHidden(false)
            })
        ]

        return () => {
            gameState.removeCallbacks(ids);
        }
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
        const timeData = stopwatch.current.getElapsedTime();
        setTimeData(timeData);
    }

    const resetGame = () => {
        console.log(gameState.getState());
        if (gameState.isState("complete")) {
            gameState.reset();
        } else {
            return;
        }
    }

    const navigate = useNavigate();
    const onSettingClicked = () => {
        gameState.exit();
        navigate("/settings/general");
    }

    const onProfileClicked = () => {
        navigate("/profile")
    }

    return (
        <div className={ styles.page }>
            <div className={`${ styles.header } ${ headerHidden && styles.header_hidden }`}>
                <div className={ styles.header__topBar }>
                    <button onClick={onSettingClicked} className="jpType__button">Settings</button>
                    <button onClick={onProfileClicked} className="jpType__button">Profile</button>
                </div>
                <StatPanel/>
                <div className={ styles.header__quickSettings }>
                    <button className="jpType__square-button"> 
                        <img className="jpType__icon-small" src={settingIcon} alt="Settings" /> 
                    </button>
                    <button className="jpType__square-button">10</button>
                    <button className="jpType__square-button">30</button>
                    <button className="jpType__square-button">50</button>
                    <button className="jpType__square-button">Custom</button>
                </div>
            </div>
            <PracticeType/>
            <div className={ styles.footer }>
                <div className={ styles.footer__stats }>
                    <ProgressBar className={ styles.progressBar } progress={progress}></ProgressBar>
                    <Clock minutes={timeData.minutes} seconds={timeData.seconds} milli={timeData.ms}/>
                </div>
                <div className={`${styles.footer__buttonBar} ${!gameState.isState("complete") && styles.footer__buttonBar_hidden}`}>
                    <button className={`jpType__button`} onClick={resetGame}>Reset</button>
                </div>
            </div>
            
        </div>
    )
}

export default PracticePage