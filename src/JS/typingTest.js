import gameData from './gameData'
import gameState from './gameState'
import settings from './settings'

import Hirigana from '../assets/hirigana.json'

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
    constructor() {
        gameData.addKeyValue("charCount", settings.characterCount);
        gameData.addKeyValue("charTyped", 0);
        gameData.addKeyValue("errorCount", 0);

        characterSet = this.getRandomCharacters();
        this.kbInputListener();

        gameState.onGameState("reset", () => {
            characterSet = this.getRandomCharacters();
            kbInput = "";
            currentChar = 0;
            gameData.setValue("charCount", settings.characterCount);
            gameData.setValue("charTyped", 0);
            gameData.setValue("errorCount", 0);
            this.kbInputListener();
        });
    }

    kbInputListener() {
        document.addEventListener('keydown', this.parseKeyboardInput);

        gameState.onGameState("complete", () => {
            document.removeEventListener('keydown', this.parseKeyboardInput);
        });

        gameState.onGameState("reset", () => {
            document.addEventListener('keydown', this.parseKeyboardInput);
        });
    }

    getRandomCharacters() {
        const characterList = [];
    
        for (let i = 0 ; i < settings.characterCount; i++) {
            const index = Math.floor(Math.random() * Hirigana.characters.length);
            characterList[i] = {
                en: Hirigana.characters[index].en,
                jp: Hirigana.characters[index].jp,
                display: "",
                id: i,
                state: (i == 0)? "active" : "inactive"
            };
        }

        gameData.setValue("charCount", settings.characterCount);
    
        return characterList;
    }

    parseKeyboardInput = ({key}) => {
        if (gameState.isState("inactive")) {
            gameState.start();
        }

        //TODO: redo the logic for backspacing, it is causing an issue where backspacing on a 3 letter character will result in no update.
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

        if (key == "") {
            return;
        }

        if (key.length != 1 || /\d/.test(key)) {
            return;
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