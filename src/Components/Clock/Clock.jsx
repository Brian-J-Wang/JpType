import "./Clock.css"

function Clock(props) {

    const formatSeconds = () => {
        if (props.seconds < 10) {
            return `0${props.seconds}`;
        } else {
            return props.seconds;
        }
    }

    const formatMilli = () => {
        if (props.milli < 10) {
            return `00${props.milli}`;
        } else if (props.milli < 100) {
            return `0${props.milli}`;
        } else {
            return props.milli;
        } 
    }

    return (
        <div className="clock">
            <p className="clock__time">
                {props.minutes}:{formatSeconds()}<span className="clock__ms">{formatMilli()}</span>
            </p>
        </div>
    )
}

export default Clock