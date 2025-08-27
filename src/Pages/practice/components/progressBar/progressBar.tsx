
import styles from "./progressBar.module.css";


type ProgressBarType = {
    /** How complete the bar is ranging from 0.0 to 1.0 */
    progress: number,
    className: string
}

const ProgressBar: React.FC<ProgressBarType> = (props) => {

    return (
        <div className={`${props.className} ${styles.body}`} hidden={false}>
            <div className={`${styles.meter}`} style={{width: `${props.progress * 100}%`}}></div>
        </div>
    )   
}

export default ProgressBar;