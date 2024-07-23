import './PracticeType.css'
import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import Hirigana from '../../assets/hirigana.json'
import keyboardInputContext from '../../Contexts/keyboardInputContext'

function PracticeType(props) {
    const [characters, setCharacters] = useState([]);
    const [kbInput, setKBInput] = useState("");
    const keyboardInput = useRef("");
    const currentChar = useRef(0);

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

    useEffect(() => {
        const characterList = []
        for (let i = 0; i < 50; i++) {
            const index = Math.floor(Math.random() * Hirigana.characters.length);
            const data = {};
            data.en = Hirigana.characters[index].en;
            data.jp = Hirigana.characters[index].jp;
            data.id = i;
            data.state = "inactive";
            characterList[i] = data;
        }

        setCharacters(characterList);

    }, []);

    //game state
    const [isActive, setIsActive] = useState(false);

    const startGame = () => {
        setIsActive(true);

        toggleActiveCharacter(true);

        document.addEventListener("mouseup", onMouseClickedOut);
        document.addEventListener('keyup', parseKeyboardInput);
    }

    const pauseGame = () => {
        setIsActive(false);

        toggleActiveCharacter(false);

        document.removeEventListener("mouseup", onMouseClickedOut);
        document.removeEventListener('keyup', parseKeyboardInput);
    }

    const toggleActiveCharacter = (state) => {
        const characterList = characters.map((element) => {
            if (element.id == currentChar.current) {
                element.state = (state) ? 'active' : 'inactive';
            }

            return element;
        });

        setCharacters(characterList);
    }

    const onMouseClickedOut = (evt) => {
        if (evt.target != "practice-type") {
            pauseGame();
        }
    }

    const parseKeyboardInput = (evt) => {
        const index = currentChar.current;

        if (evt.key == " ") {
            return;
        }

        if (evt.key == "Backspace") {
            if (keyboardInput.current != "") {
                keyboardInput.current = keyboardInput.current.substring(0, keyboardInput.current.length - 1);
                setKBInput(keyboardInput.current);
            } else {
                updateCharacterState(index, "Backspace");
                currentChar.current = index - 1;
            }
            return;
        }

        keyboardInput.current = keyboardInput.current.concat(evt.key);
        setKBInput(keyboardInput.current);
        if (keyboardInput.current.length >= characters[index].en.length) {
            if (keyboardInput.current == characters[index].en) {
                updateCharacterState(index, "CorrectIncrement");
            } else {
                updateCharacterState(index, "IncorrectIncrement");
            }
    
            currentChar.current = index + 1;
            keyboardInput.current = "";
            setKBInput("");
            return;
        }
    }

    /*
    State Update Types:

    CorrectIncrement - shifts active character to the right, makes former active
                       element correct.

    IncorrectIncrement - shifts active character to the right, makes former active
                         element incorrect.

    Backspace - shifts active character to the left, it makes for active element 
                inactive.

    */

    const updateCharacterState = (index, type) => {
        let characterList = [];

        if (type == "CorrectIncrement") {
            characterList = characters.map((element) => {
                if (element.id == index) {
                    element.state = "correct";
                } else if (element.id == index + 1) {
                    element.state = "active";
                } 

                return element;
            })
        } else if (type == "IncorrectIncrement") {
            characterList = characters.map((element) => {
                if (element.id == index) {
                    element.state = "incorrect";
                } else if (element.id == index + 1) {
                    element.state = "active";
                }

                return element;
            })
        } else if (type == "Backspace") {
            characterList = characters.map((element) => {
                if (element.id == index) {
                    element.state = "inactive";
                } else if (element.id == index - 1) {
                    element.state = "active";
                }

                return element;
            })
        }

        setCharacters(characterList);

    }

    return (
        <div id="practice-type" className={`practice-type ${!isActive && "practice-type__state_inactive"}`} onClick={startGame}>
            <keyboardInputContext.Provider value={kbInput}>
            {
            characters.map((element) => {
                return (
                    <Card key={element.id} data={element}/>
                );
            })
            }
            </keyboardInputContext.Provider>
        </div>
    )
}

export default PracticeType