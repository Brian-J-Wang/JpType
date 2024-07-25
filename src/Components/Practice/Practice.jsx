import './Practice.css'
import Stats from '../Stats/Stats'
import PracticeType from '../PracticeType/PracticeType'
import { useContext, useState } from 'react'
import gameStateContext from '../../Contexts/GameStateContext'


function Practice(props) {
    const [gameState, setGameState] = useState("inactive");
    const [results, setResults] = useState([
        {
            statName: "WPM",
            value: "----",
            desc: "words per minute"
        },
        {
            statName: "Errors",
            value: "----",
            desc: "errors committed in this run"
        },
        {
            statName: "Consistency",
            value: "----",
            desc: "(number of words - errors) / number of words"
        }

    ]);

    /*
        data passed is expected to be an object whose keys match with the statName and value matches with the values

        let data = {
            WPM: "100",
            Errors: "4",
        }
    */

    const handleGameEnd = (data) => {
        const updatedResults = results.map((element) => {
            if (data[element.statName]) {
                element.value = data[element.statName];
            }

            return element;
        })

        setResults(updatedResults);
    }

    const updateGameState = (state) => {
        if (state == "inactive") {
            setGameState("inactive");
        } else if (state == "active") {
            setGameState("active");
        } else if (state == "paused") {
            setGameState("paused");
        } else if (state == "complete") {
            setGameState("complete");
        }
    }

    return (
        <div className="practice">
            <gameStateContext.Provider value={{gameState, updateGameState}}>
                <div className="practice__stat-panel">
                    {
                        results.map((element) => {
                            return (
                            <Stats key={element.statName} name={element.statName} value={element.value}/>
                            )
                        })
                    }
                </div>
                <PracticeType onGameEnd={handleGameEnd}/>
            </gameStateContext.Provider>
        </div>
    )
}

export default Practice