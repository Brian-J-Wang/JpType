import charSet from './characterSet'
import gameData from './gameData'
import gameState from './gameState'
import settings from './settings'

import Hirigana from '../assets/hirigana.json'
import { storage } from '../Components/Settings/settingData';

/*
characterSet stores characters in this format 
{
    en: english translation
    jp: japanese character
    input: currentkeyboard input;
    id: numeric
    state: [active, correct, incorrect, inactive];
}

*/

const onUpdate = [];
let characterSet = [];
let currentChar = 0;
let kbInput = "";


class TypingTest {
    charList = [];
    constructor() {
        gameData.addKeyValue("charCount", settings.characterCount);
        gameData.addKeyValue("charTyped", 0);
        gameData.addKeyValue("errorCount", 0);

        characterSet = this.shuffleCards();

        document.addEventListener('keydown', this.parseKeyboardInput.bind(this));

        gameState.onGameState("complete", () => {
            document.removeEventListener('keydown', this.parseKeyboardInput);
        });

        gameState.onGameState("reset", () => {
            this.resetBoard();

            document.addEventListener('keydown', this.parseKeyboardInput);
        });

        gameState.onGameState("exit", () => {
            document.removeEventListener('keydown', this.parseKeyboardInput);
        })

        gameState.onGameState("return", () => {
            this.resetBoard();
            document.addEventListener('keydown', this.parseKeyboardInput);
        });
    }

    clearInputs() {
        kbInput = "";
        currentChar = 0;
        gameData.setValue("charCount", storage.get("Character Count"));
        gameData.setValue("charTyped", 0);
        gameData.setValue("errorCount", 0);
        characterSet = [];
    }
    
    shuffleCards() {
        const charList = charSet.shuffle().map((char, index) => {
            return {
                en: char.en,
                jp: char.jp,
                display: "",
                id: index,
                state: (index == 0)? "active" : "inactive"
            }
        });

        return charList;
    };

    resetBoard() {
        this.clearInputs();
        characterSet = this.shuffleCards();
    }

    parseKeyboardInput ({key}) {
        if (key == "Backspace") {
            if (kbInput == "") {
                this.updateCharacterState("inactive", n => n - 1);
            } else {
                let char = characterSet[currentChar];
                kbInput = kbInput.slice(0, kbInput.length - 1);
                char.display = kbInput;
            }
            this.callOnUpdate();

            return;
        }

        if (key == " ") {
            return;
        }

        if (key.length != 1 || /\d/.test(key)) {
            return;
        }

        if (gameState.isState("inactive")) {
            gameState.start();
        }

        kbInput += key;
        const character = characterSet[currentChar];
        character.display = kbInput;

        if (kbInput.length < character.en.length) {
            this.callOnUpdate();
            return;
        }

        if (kbInput.length >= character.en.length) {
            if (kbInput == character.en) {
                this.updateCharacterState("correct", n => n + 1);
            } else {
                this.updateCharacterState("incorrect", n => n + 1);
                gameData.updateValue("errorCount", n => n + 1);
            }
            
            this.callOnUpdate();
            return;
        }
    }

    updateCharacterState(state, updater) {
        let char = characterSet[currentChar];
        char.state = state;
        char.display = "";

        currentChar = updater(currentChar);
        gameData.updateValue("charTyped", updater);
        if (currentChar >= characterSet.length) {
            gameState.complete();
            return;
        }

        char = characterSet[currentChar];
        char.state = "active";
        kbInput = "";
    }

    onStateUpdate(funct) {
        const notDuplicate = onUpdate.every(element => {
            (element.toString() == funct.toString()) ? false : true;
        })

        if (notDuplicate) {
            onUpdate.push(funct);
        }
    }

    callOnUpdate() {
        onUpdate.forEach((funct) => {
            funct(characterSet);
        })
    }

    getCurrentState() {
        return characterSet;
    }
}

const typingTest = new TypingTest();

export default typingTest