import './StatPanel.css'
import Stats from '../Stats/Stats'
import { useEffect, useContext } from 'react'
import gameStateContext from '../../Contexts/gameStateContext'

function StatPanel(props) {
    const gameState = useContext(gameStateContext);

    const getPanelState = () => {
        return `stat-panel ${gameState.gameState == "active" && "stat-panel__state_hidden"}`
    }

    return (
        <div className={getPanelState()}>
            {props.elements.map((element) => {
                return (<Stats key={element.statName} name={element.statName} value={element.value}/>)
            })}
        </div>
    )
}

export default StatPanel