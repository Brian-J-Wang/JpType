import './Settings.css'
import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react';
import SettingTabs from './settingTabs.jsx';
import settingContext from './settingsContext.js';
import SettingGroup from './settingGroup.jsx';


function Settings(props) {
    const [settingTab, setSettingTab] = useState("General");

    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/");
    }

    return (
        <div className="settings">
            <div className='settings__header'>
                <button className='settings__back' onClick={handleBackClick}>
                    <svg id='svg' width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle id='colorable' cx="30" cy="30" r="28" stroke="#272727" strokeWidth="4"/>
                        <line id='colorable' x1="34.9705" y1="15.8142" x2="19.4142" y2="31.3706" stroke="#272727" strokeWidth="4"/>
                        <line id='colorable' x1="19.4142" y1="28.5858" x2="34.9706" y2="44.1421" stroke="#272727" strokeWidth="4"/>
                    </svg>
                </button>
                <h1 className='settings__title'>Settings</h1>
            </div>
            <div className="settings__container">
                <settingContext.Provider value={{settingTab, setSettingTab}}>
                    <fieldset className="settings__panel">
                        <SettingTabs />
                    </fieldset>
                    <div className="settings__optionals">
                        <SettingGroup />
                    </div>
                </settingContext.Provider>
            </div>
        </div>
    
    )
}

export default Settings