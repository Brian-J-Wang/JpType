import '../../assets/JPType.css';
import { useState, useRef, useEffect, useContext, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressBar, SessionDataContext, StatPanel, Stopwatch } from './components';
import settingIcon from '../../assets/setting.svg';

import styles from "./practice.module.css";

const CharacterDisplay = lazy(() => import("./components/characterDisplay/characterDisplay"));

const PracticePage: React.FC = () => {
    const navigate = useNavigate();
    const sessionDataContext = useContext(SessionDataContext);    

    const resetSession = () => {
        if ( sessionDataContext.testState == "complete" ) {
            sessionDataContext.resetSession();
        }
    }
    
    const onSettingClicked = () => {
        navigate("/settings");
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
            </div>
            <Suspense fallback={<div>loading</div>}>
                <CharacterDisplay/>
            </Suspense>
            <div className={ styles.footer }>
                <div className={ styles.footer__stats }>
                    <ProgressBar className={ styles.progressBar } progress={sessionDataContext.progress}></ProgressBar>
                    <Stopwatch/>
                </div>
                <div className={`${styles.footer__buttonBar} ${!(sessionDataContext.testState == "complete") && styles.footer__buttonBar_hidden}`}>
                    <button className={`jpType__button`} onClick={resetSession}>Reset</button>
                </div>
            </div>
            
        </div>
    )
}

export default PracticePage