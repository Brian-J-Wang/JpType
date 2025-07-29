import { useState } from "react";
import styles from "./toggle.module.css";

type ToggleType = {
    state: boolean;
    updateState: (newState: boolean) => void
}

const Toggle: React.FC<ToggleType> = (props) => {
    const [ state, setState ] = useState(props.state ?? false);

    const handleChange = () => {
        const newState = !state;
        setState(newState);
        props.updateState(newState);
    }

    return (
        <div className={`${styles.body} ${state && styles.body_active}`} onClick={handleChange}>
            <div className={`${styles.nub} ${state && styles.nub_active}`}></div>
        </div>
    )
}

export default Toggle;