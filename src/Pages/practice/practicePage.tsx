import '../../assets/JPType.css'
import { useState, useRef, useEffect, useContext, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Stopwatch from '../../JS/stopwatch.js'
import Clock from '../../Components/Clock/Clock'
import { ProgressBar, SessionDataContext, StatPanel } from './components'
import settingIcon from '../../assets/setting.svg'

import styles from "./practice.module.css"

const CharacterDisplay = lazy(() => import("./components/characterDisplay/characterDisplay"));

const PracticePage: React.FC = () => {
    const navigate = useNavigate();
    const sessionDataContext = useContext(SessionDataContext);

    //stopwatch functions
    const stopwatch = useRef(new Stopwatch());
    const [timeData, setTimeData] = useState({
        minutes: 0,
        seconds: 0,
        ms: 0
    });

    useEffect(() => {
        switch ( sessionDataContext.testState ) {
            case "active":
                stopwatch.current.start((elapsedTime) => {
                    setTimeData(elapsedTime);
                }, 10);
                break;
            case "complete":
                stopwatch.current.end();
                sessionDataContext.setElapsedTime(stopwatch.current.getElaspedTimeSeconds());
                break;
            case "paused":
                stopwatch.current.pause();
                break;
            case "reset":
                stopwatch.current.reset();
                setTimeData({
                    minutes: 0,
                    seconds: 0,
                    ms: 0
                });
                break;
            case "resumed":
                stopwatch.current.resume();
                break;
        }

    }, [ sessionDataContext.testState ]);

    const resetGame = () => {
        if ( sessionDataContext.testState == "complete" ) {
            sessionDataContext.resetSession();
        }
    }
    
    const onSettingClicked = () => {
        navigate("/settings/general");
    }

    const onProfileClicked = () => {
        navigate("/profile")
    }

    return (
        <div className={ styles.page }>
            <div className={`${ styles.header } ${ sessionDataContext.testState == "active" && styles.header_hidden }`}>
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
            <Suspense fallback={<div>loading</div>}>
                <CharacterDisplay/>
            </Suspense>
            <div className={ styles.footer }>
                <div className={ styles.footer__stats }>
                    <ProgressBar className={ styles.progressBar } progress={sessionDataContext.progress}></ProgressBar>
                    <Clock minutes={timeData.minutes} seconds={timeData.seconds} milli={timeData.ms}/>
                </div>
                <div className={`${styles.footer__buttonBar} ${!(sessionDataContext.testState == "complete") && styles.footer__buttonBar_hidden}`}>
                    <button className={`jpType__button`} onClick={resetGame}>Reset</button>
                </div>
            </div>
            
        </div>
    )
}

export default PracticePage