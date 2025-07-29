import UseLocalStorage from '../../Hooks/UseLocalStorage'
import './ProgressBar.css'

function ProgressBar(props) {
    const [ showProgressBar ] = UseLocalStorage("showProgressBar");

    const meterSize = `${props.progress * 100}%`
    return (
        <div className={`${props.className} progress-bar`} hidden={!showProgressBar}>
            <div className="progress-bar__meter" style={{width: meterSize}}></div>
        </div>
    )   
}

export default ProgressBar