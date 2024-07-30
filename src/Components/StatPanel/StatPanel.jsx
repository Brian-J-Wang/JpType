import './StatPanel.css'
import StatsCard from '../Stats/Stats'
import { useEffect, useState } from 'react'
import gameState from '../../JS/gameState';
import stathandle from '../../JS/statsHandler';


const visibleState = 'stat-panel';
const hiddenState = 'stat-panel stat-panel__state_hidden';


function StatPanel() {
    const [panelState, setPanelState] = useState(visibleState);
    const [stats, setStats] = useState([]);
    useEffect(() => {

        setStats(stathandle.get());

        gameState.onGameActive(() => {
            setPanelState(hiddenState);
        });

        gameState.onGameComplete(() => {
            setPanelState(visibleState);
            calculateStats();
        })
    },[]);

    const calculateStats = () => {
        setStats(stathandle.get());
    }

    return (
        <div className={panelState}>
            {
                stats.map((element) => {
                    return (
                        <StatsCard key={element.statName} name={element.statName} value={element.value}/>
                    )
                })
            }
        </div>
    )
}

export default StatPanel