import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import CharacterSet, { KanaRomaji } from './charSet';


type CharacterState = "active" | "inactive" | "correct" | "incorrect";

export type Character = KanaRomaji & {
    display: string,
    id: number,
    state: CharacterState,
}

type CharacterSetStateAction = {
    id: number,
    setState?: Dispatch<SetStateAction<Character>>
}

//A new instance should be created when a new session starts
class TypingTest {
    currentIndex = 0;
    characterSet: Character[] = [];
    characterSetStates: CharacterSetStateAction[];
    constructor( characterSet: KanaRomaji[]) {
        this.characterSet = characterSet.map((character, index) => {
            return {
                en: character.en,
                jp: character.jp,
                display: "",
                id: index,
                state: index == 0 ? "active" : "inactive"
            }
        });
        this.characterSetStates = characterSet.map(( _, index) => {
            return {
                id: index,
                setState: undefined
            }
        });
    }

    registerSetState = (id: number, setState: Dispatch<SetStateAction<Character>>) => {
        const element = this.characterSetStates.find(element => element.id = id);
        element && (element.setState = setState);
    }

    //This method is built as an arrow function to preserve the "this" statement
    parseKeyboardInput = ({ key }: KeyboardEvent) => {
        const currentCharacter = this.characterSet[this.currentIndex];
        if (key == "Backspace") {
            if (currentCharacter.display == "") {
                this.updateCharacterState("inactive", n => n - 1);
            } else {
                currentCharacter.display = currentCharacter.display.slice(0, currentCharacter.display.length - 1) ;
            }

            return;
        }

        //ignore space press, meta inputs, and numbers
        if (key == " " || key.length != 1 || /\d/.test(key)) {
            return;
        }

        //kbInput is necessary for characters that are longer than one letter;
        currentCharacter.display += key;

        if (currentCharacter.display.length < currentCharacter.en.length) {
            return;
        }

        //checks for correctness only when the kbInput is the same length as character length in engish;
        if (currentCharacter.display.length >= currentCharacter.en.length) {
            if (currentCharacter.display == currentCharacter.en) {
                this.updateCharacterState("correct", n => n + 1);
            } else {
                this.updateCharacterState("incorrect", n => n + 1);
            }

            return;
        }
    }

    private updateCharacterState(state: CharacterState, updater: (index: number) => number) {
        let char = this.characterSet[this.currentIndex];
        char.state = state;
        char.display = "";

        this.currentIndex = updater(this.currentIndex);

        if (this.currentIndex >= this.characterSet.length) {
            return;
        }

        char = this.characterSet[this.currentIndex];
        char.state = "active";
    }
}

export default TypingTest;