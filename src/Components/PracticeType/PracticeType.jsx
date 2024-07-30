import './PracticeType.css'
import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import Hirigana from '../../assets/hirigana.json'
import keyboardInputContext from '../../Contexts/keyboardInputContext'
import gameState from '../../JS/gameState'
import gameData from '../../JS/gameData'
import typingTest from '../../JS/typingTest'

function PracticeType(props) {

    //data.state
    //  inactive - user has not reached to this character
    //  active - user is currently typing out this character
    //  correct - user has typed the character correctly
    //  incorrect - user has typed the character incorrectly
    //
    //  expected order in charcterList should be:
    //  cor, cor, incor, cor, active, inact, inact
    //  - only one active character exists at any given time
    //  - characters to the left of the active character are
    //  either correct or incorrect
    //  - characters to the right of the active character are
    //  inactive
    //  - when the player stops the practive, the active element
    //  returns to an inactive element
    //  - when the player resumes the practive, the first inactive
    //  element becomes an active element.

    const [characters, setCharacters] = useState(typingTest.getCurrentState());
    useEffect(() => {
        typingTest.onStateUpdate((newState) => {
            setCharacters(newState);
        })

        gameState.onGameReset(() => {
            setCharacters(typingTest.getCurrentState());
        });
    }, [])
    
    //
    useEffect(() => {

        gameState.onGameActive(() => {
            toggleDocumentListeners();
        });

        gameState.onGamePaused(() => {
            toggleDocumentListeners();
        })

        gameState.onGameComplete(() => {
            console.log("game is over");
            toggleDocumentListeners();
        })


        return () => {
            document.removeEventListener("mouseup", onMouseClickedOut);
        }
    }, []);

    const toggleDocumentListeners = () => {
        if (gameState.getState() == "active") {
            document.addEventListener("mouseup", onMouseClickedOut);
        } else {
            document.removeEventListener("mouseup", onMouseClickedOut);
        }
    }

    const onMouseClickedOut = (evt) => {
        if (evt.target != "practice-type") {
            gameState.pause();   
        }
    }

    return (
        <div id="practice-type" className={`practice-type`}>
            {
            characters.map((element) => {
                return (
                    <Card key={element.id} data={element}/>
                );
            })
            }
        </div>
    )
}

export default PracticeType