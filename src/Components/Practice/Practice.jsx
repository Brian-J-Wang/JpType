import './Practice.css'
import Stats from '../Stats/Stats'
import PracticeType from '../PracticeType/PracticeType'
import { useState } from 'react'


function Practice(props) {
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

    return (
        <div className="practice">
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
        </div>
    )
}

export default Practice