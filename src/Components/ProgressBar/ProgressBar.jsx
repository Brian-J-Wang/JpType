import './ProgressBar.css'

function ProgressBar(props) {

    const meterSize = `${props.progress * 100}%`
    return (
        <div className={`${props.className} progress-bar`}>
            <div className="progress-bar__meter" style={{width: meterSize}}></div>
        </div>
    )   
}

export default ProgressBar