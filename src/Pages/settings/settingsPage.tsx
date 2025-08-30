import { Route, Routes, useNavigate } from "react-router-dom";
import styles from "./settings.module.css"
import { NavLink } from "react-router-dom";
import GeneralSettingsPage from "./subPages/generalSettingsPage";
import { useEffect } from "react";
import TestSettingPage from "./subPages/testSettings/testSettingsPage";

const settingsPage: React.FC = (props) => {
    const navigate = useNavigate();
    
    const handleBackClick = () => {
        navigate("/");
    }

    useEffect(() => {
        if (window.location.pathname === "/settings") {
            navigate("test-settings");
        }
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.header__backButton} onClick={handleBackClick}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle id="colorable" cx="16" cy="16" r="14" stroke="#D0CFCF" stroke-width="4"/>
                        <path id="colorable" d="M19.4667 9L12 16.4667L19.4667 23.9333" stroke="#D0CFCF" stroke-width="4"/>
                    </svg>
                </button>
                <h2 className={styles.header__text}>
                    Settings
                </h2>
            </div>
            <div className={styles.body}>
                <nav className={styles.left_panel}>
                    <NavLink to="test-settings" className={({isActive}) => `${styles.navlink} ${isActive && styles.navlink_active }`}>Test Settings</NavLink>
                    <NavLink to="general" className={({isActive}) => `${styles.navlink} ${isActive && styles.navlink_active }`}>General</NavLink>
                </nav>
                <div className={styles.right_panel}>
                    <Routes>
                        <Route path="test-settings" element={<TestSettingPage/>}/>
                        <Route path="general" element={<GeneralSettingsPage/>}/>
                        <Route path="*" element={<div> How'd you get here? </div>}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default settingsPage;