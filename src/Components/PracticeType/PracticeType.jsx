import './PracticeType.css'
import { useEffect, useRef, useState, useContext } from 'react'
import Card from '../Card/Card'
import Hirigana from '../../assets/hirigana.json'
import keyboardInputContext from '../../Contexts/keyboardInputContext'
import gameDataContext from '../../Contexts/gameDataContext'
import gameState from '../../JS/gameState'

function PracticeType(props) {
    const gameData = useContext(gameDataContext);
    
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

    const shuffleCharacters = () => {
        const characterList = [];
        const characterCount = 36;

        gameData.setValue('totalChar', characterCount);

        for (let i = 0; i < characterCount; i++) {  //magic number: is character count
            const index = Math.floor(Math.random() * Hirigana.characters.length);
            const data = {};
            data.en = Hirigana.characters[index].en;
            data.jp = Hirigana.characters[index].jp;
            data.id = i;
            data.state = (data.id == 0)? "active" : "inactive";
            characterList[i] = data;
        }

        return characterList;
    }

    const [characters, setCharacters] = useState(shuffleCharacters);
    useEffect(() => {
        gameState.onGameReset(() => {
            setCharacters(shuffleCharacters);
        });
    })
    //
    useEffect(() => {
        document.addEventListener('keydown', onKeyFirstTyped);
        document.addEventListener('keydown', parseKeyboardInput);

        gameState.onGameActive(() => {
            toggleActiveCharacter();
            toggleDocumentListeners();
        });

        gameState.onGamePaused(() => {
            toggleActiveCharacter();
            toggleDocumentListeners();
        })

        gameState.onGameComplete(() => {
            console.log("game is over");
            toggleDocumentListeners();
        })


        return () => {
            document.removeEventListener('keydown', onKeyFirstTyped);
            document.removeEventListener("mouseup", onMouseClickedOut);
            document.removeEventListener('keydown', parseKeyboardInput);
        }
    }, []);

    const toggleActiveCharacter = () => {
        const characterList = characters.map((element) => {
            if (element.id == currentChar.current) {
                element.state = (gameState.getState() == "active") ? 'active' : 'inactive';
            }

            return element;
        });

        setCharacters(characterList);
    }

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

    const parseKeyboardInput = (evt) => {
        if (evt.key == "Tab") {
            evt.preventDefault();
            return;
        }

        const index = currentChar.current;

        if (evt.key == " ") {
            return;
        }

        if (evt.key == "Backspace") {
            if (currentChar.current == 0) { //prevent moving a character behind the first character.
                return;
            }

            if (keyboardInput.current != "") { //clears current inputs
                keyboardInput.current = keyboardInput.current.substring(0, keyboardInput.current.length - 1);
                setKBInput(keyboardInput.current);
            } else {
                updateCharacterState(index, "Backspace");
                currentChar.current = index - 1;
            }
            return;
        }

        if (evt.key.length != 1) {
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
    Element state update types.

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

            gameData.updateValue("charTyped", n => n + 1);
        } else if (type == "IncorrectIncrement") {
            characterList = characters.map((element) => {
                if (element.id == index) {
                    element.state = "incorrect";
                } else if (element.id == index + 1) {
                    element.state = "active";
                }

                return element;
            })

            gameData.updateValue("charTyped", n => n + 1);
            gameData.updateValue("totalError", n => n + 1);
        } else if (type == "Backspace") {
            characterList = characters.map((element) => {
                if (element.id == index) {
                    element.state = "inactive";
                } else if (element.id == index - 1) {
                    element.state = "active";
                }

                return element;
            })

            gameData.updateValue("charTyped", n => n - 1);
        }

        setCharacters(characterList);

        if (index >= characters.length - 1) {
            gameState.complete();
            return;
        }
    }

    const onKeyFirstTyped = () => {
        gameState.start();

        document.removeEventListener('keydown', onKeyFirstTyped);
    }

    return (
        <div id="practice-type" className={`practice-type`}>
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