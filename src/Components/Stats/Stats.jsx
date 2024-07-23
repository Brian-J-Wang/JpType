import './Stats.css'

function Stats(props) {

    return (
        <div className="stats">
            <h2 className="stats__name">{props.name}</h2>
            <p className="stats__value">{props.value}</p>
        </div>
    )
}

export default Stats