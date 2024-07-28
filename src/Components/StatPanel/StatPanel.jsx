import './StatPanel.css'
import Stats from '../Stats/Stats'
import { useEffect, useState } from 'react'
import gameState from '../../JS/gameState';

const visibleState = 'stat-panel';
const hiddenState = 'stat-panel stat-panel__state_hidden';

function StatPanel(props) {
    const [panelState, setPanelState] = useState(visibleState);

    useEffect(() => {
        gameState.onGameActive(() => {
            setPanelState(hiddenState);
        });

        gameState.onGameComplete(() => {
            setPanelState(visibleState);
        })
    }
    ,[]);

    return (
        <div className={panelState}>
            {props.elements.map((element) => {
                return (<Stats key={element.statName} name={element.statName} value={element.value}/>)
            })}
        </div>
    )
}

export default StatPanel