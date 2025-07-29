import charSet from './charSet'
import gameData from './gameData'
import gameState from './gameState'
import settings from './settings'

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
type TypingTestEventListenerFunction = (charSet: Character[]) => void;

enum CharacterState {
    active = "active",
    inactive = "inactive",
    correct = "correct",
    incorrect = "incorrect"
}

export enum TypingTestEventTypes {
    onUpdate = "onUpdate",
    onCharacterChange = "onCharacterChange",
    onCharacterForward = "onCharacterForward",
    onCharacterBackward = "onCharacterBackward"
}

export interface Character {
    en: string,
    jp: string,
    display: string,
    id: number,
    state: CharacterState
}

const onUpdate = [];
let currentChar = 0;
let kbInput = "";


class TypingTest {
    characterSet: Character[] = [];
    charList = [];
    constructor() {
        gameData.addKeyValue("charCount", settings.characterCount);
        gameData.addKeyValue("charTyped", 0);
        gameData.addKeyValue("errorCount", 0);

        this.characterSet = this.shuffleCards() as Character[];

        document.addEventListener('keydown', this.parseKeyboardInput);

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
        gameData.setValue("charCount", 50);
        gameData.setValue("charTyped", 0);
        gameData.setValue("errorCount", 0);
        this.characterSet = [];
    }
    
    shuffleCards(): Character[] {
        const charList = charSet.shuffle().map((char, index) => {
            return {
                en: char.en,
                jp: char.jp,
                display: "",
                id: index,
                state: (index == 0)? "active" : "inactive",
                row: -1
            }
        });

        return charList as Character[];
    };

    resetBoard() {
        this.clearInputs();
        this.characterSet = this.shuffleCards();
    }

    parseKeyboardInput = ({key}) => {
        
        //TODO: add escape key to stop test;

        if (key == "Backspace") {
            if (kbInput == "") {
                this.updateCharacterState("inactive", n => n - 1);
            } else {
                let char = this.characterSet[currentChar];
                kbInput = kbInput.slice(0, kbInput.length - 1);
                char.display = kbInput;
            }
            this.broadcastListener(TypingTestEventTypes.onUpdate);

            return;
        }

        //ignore space press, meta inputs, and numbers
        if (key == " " || key.length != 1 || /\d/.test(key)) {
            return;
        }

        if (gameState.isState("inactive")) {
            gameState.start();
        }

        //kbInput is necessary for characters that are longer than one letter;
        kbInput += key;
        const character = this.characterSet[currentChar];
        character.display = kbInput;

        if (kbInput.length < character.en.length) {
            this.broadcastListener(TypingTestEventTypes.onUpdate);
            return;
        }

        //checks for correctness only when the kbInput is the same length as character length in engish;
        if (kbInput.length >= character.en.length) {
            if (kbInput == character.en) {
                this.updateCharacterState("correct", n => n + 1);
            } else {
                this.updateCharacterState("incorrect", n => n + 1);
                gameData.updateValue("errorCount", n => n + 1);
            }
            
            this.broadcastListener(TypingTestEventTypes.onUpdate);
            this.broadcastListener(TypingTestEventTypes.onCharacterForward);
            return;
        }
    }

    updateCharacterState(state, updater) {
        let char = this.characterSet[currentChar];
        char.state = state;
        char.display = "";

        currentChar = updater(currentChar);
        gameData.updateValue("charTyped", updater);

        //completion checker is necessary here to prevent updating characters past the character list.
        if (currentChar >= this.characterSet.length) {
            gameState.complete();
            return;
        }

        char = this.characterSet[currentChar];
        char.state = CharacterState.active;
        kbInput = "";
    }

    broadcastListener(type: TypingTestEventTypes) {
        (this.eventListeners[type] as Array<any>).forEach((listener) => {
            listener(this.characterSet);
        })
    }

    getCurrentState() : Character[] {
        return this.characterSet;
    }

    eventListeners: EventListenerObject = {
        onUpdate: [],
        onCharacterChange: [],
        onCharacterForward: [],
        onCharacterBackward: []
    }

    addEventListener(eventType: TypingTestEventTypes, eventListener: (charSet: Character[]) => void) {
        (this.eventListeners[eventType] as Array<any>).push(eventListener);
    }

    removeEventListener(eventType, eventListener: (charSet: Character[]) => void) {
        this.eventListeners[eventType] = (this.eventListeners[eventType] as Array<any>).filter((listener) => {
            return listener != eventListener
        });
    }
}

type EventListenerObject = {
    onUpdate: ((charSet: Character[]) => void)[],
    onCharacterChange: ((charSet: Character[]) => void)[],
    onCharacterForward: ((charSet: Character[]) => void)[],
    onCharacterBackward: ((charSet: Character[]) => void)[],
}

const typingTest = new TypingTest();

export default typingTest