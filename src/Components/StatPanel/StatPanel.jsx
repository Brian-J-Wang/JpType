import './StatPanel.css'
import StatsCard from '../Stats/Stats'
import { useEffect, useState } from 'react'
import gameState from '../../JS/gameState';
import stathandle from '../../JS/statsHandler';

function StatPanel() {
    const [stats, setStats] = useState([]);
    useEffect(() => {

        setStats(stathandle.get());

        const ids = [
            gameState.onGameState("complete",() => {
                setStats(stathandle.get());
            }, 3)
        ];

        return () => {
            gameState.removeCallbacks(ids);
        }
    },[]);

    return (
        <div className="stat-panel">
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