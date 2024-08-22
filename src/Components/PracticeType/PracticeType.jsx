import './PracticeType.css'
import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import Hirigana from '../../assets/hirigana.json'
import keyboardInputContext from '../../Contexts/keyboardInputContext'
import gameState from '../../JS/gameState'
import gameData from '../../JS/gameData'
import typingTest from '../../JS/typingTest'

function PracticeType(props) {
    const [characters, setCharacters] = useState(typingTest.getCurrentState());
    useEffect(() => {
        typingTest.onUpdate((newState) => {
            setCharacters(newState);
        })

        const id = gameState.onGameState("reset", () => {
            setCharacters(typingTest.getCurrentState());
        }, 2);

        return () => {
            gameState.removeCallback(id);
        }
    }, [])
    
    //
    // useEffect(() => {

    //     gameState.onGameState("active", () => {
    //         toggleDocumentListeners();
    //     })

    //     gameState.onGameState("paused", () => {
    //         toggleDocumentListeners();
    //     })

    //     gameState.onGameState("complete", () => {
    //         console.log("game is over");
    //         toggleDocumentListeners();
    //     })

    //     return () => {
    //         document.removeEventListener("mouseup", onMouseClickedOut);
    //     }
    // }, []);

    // const toggleDocumentListeners = () => {
    //     if (gameState.isState("active")) {
    //         document.addEventListener("mouseup", onMouseClickedOut);
    //     } else {
    //         document.removeEventListener("mouseup", onMouseClickedOut);
    //     }
    // }

    // const onMouseClickedOut = (evt) => {
    //     if (evt.target != "practice-type") {
    //         gameState.pause();   
    //     }
    // }

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