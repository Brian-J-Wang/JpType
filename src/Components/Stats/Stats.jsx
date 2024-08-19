import './Stats.css'

function StatsCard(props) {

    return (
        <div className="stats">
            <p className="stats__value">{props.value}</p>
            <p className="stats__name">{props.name}</p>
        </div>
    )
}

export default StatsCard