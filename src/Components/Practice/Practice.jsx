import './Practice.css'
import Stats from '../Stats/Stats'
import PracticeType from '../PracticeType/PracticeType'


function Practice(props) {

    return (
        <div className="practice">
            <div className="practice__stat-panel">
                <Stats name="WPM" value="92"/>
                <Stats name="Errors" value="3"/>
                <Stats name="Consistency" value="88%"/>
            </div>
            <PracticeType/>
        </div>
    )
}

export default Practice