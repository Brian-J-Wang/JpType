import { useContext, useState } from "react";
import styles from "./toggle.module.css";
import { SettingContext } from "../../../settingContextProvider/settingContext";

type ToggleType = {
    identifier: string
}

const Toggle: React.FC<ToggleType> = (props) => {
    const settingContext = useContext(SettingContext);
    const [ state, setState ] = useState(settingContext.getProperty(props.identifier));
    if (typeof state != "boolean") {
        console.error("property is not a boolean for toggle control");
        return (<></>);
    }
    
    const handleChange = () => {
        setState(!state);
        settingContext.setProperty(props.identifier, !state);
    }

    return (
        <div className={`${styles.body} ${state && styles.body_active}`} onClick={handleChange}>
            <div className={`${styles.nub} ${state && styles.nub_active}`}></div>
        </div>
    )
}

export default Toggle;
