import { SetStateAction } from 'react';
import CharacterSet, { KanaRomaji } from './charSet';


type CharacterState = "active" | "inactive" | "correct" | "incorrect";

export type Character = KanaRomaji & {
    display: string,
    id: number,
    state: CharacterState
}

let kbInput = "";

//A new instance should be created when a new session starts
class TypingTest {
    currentIndex = 0;
    characterSet: Character[] = [];
    setStateAction: React.Dispatch<SetStateAction<Character[]>>;
    constructor( characterSet: KanaRomaji[], setStateAction: React.Dispatch<SetStateAction<Character[]>> ) {
        this.setStateAction = setStateAction;
        this.characterSet = characterSet.map((character, index) => {
            return {
                en: character.en,
                jp: character.jp,
                display: "",
                id: index,
                state: index == 0 ? "active" : "inactive"
            }
        });
        this.setStateAction(this.characterSet);
    }

    //This method is built as an arrow function to preserve the "this" statement
    parseKeyboardInput = ({ key }: KeyboardEvent) => {
        if (key == "Backspace") {
            if (kbInput == "") {
                this.updateCharacterState("inactive", n => n - 1);
            } else {
                let char = this.characterSet[this.currentIndex];
                kbInput = kbInput.slice(0, kbInput.length - 1);
                char.display = kbInput;
            }

            return;
        }

        //ignore space press, meta inputs, and numbers
        if (key == " " || key.length != 1 || /\d/.test(key)) {
            return;
        }

        //kbInput is necessary for characters that are longer than one letter;
        kbInput += key;
        const character = this.characterSet[this.currentIndex];
        character.display = kbInput;

        if (kbInput.length < character.en.length) {
            return;
        }

        //checks for correctness only when the kbInput is the same length as character length in engish;
        if (kbInput.length >= character.en.length) {
            if (kbInput == character.en) {
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
        kbInput = "";
    }
}

export default TypingTest;