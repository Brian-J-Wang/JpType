import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import CharacterSet, { KanaRomaji } from './generateCharacterList';
import ArrayCursor from './cursor';
import { generateUniqueHash } from '../../../utilities/GenerateUniqueHash';

type CharacterState = "active" | "inactive" | "correct" | "incorrect" | "correcting" | "corrected";

export type Character = KanaRomaji & {
    display: string,
    id: string,
    state: CharacterState,
}

//keys refer to the keyboard keys, character refer to the japanese characters 
type SessionStatistics = {
    totalKeys: number;
    keysTyped: number;
}

//A new instance should be created when a new session starts
class TypingTest {
    sessionStatistics: SessionStatistics;
    cursor: ArrayCursor<Character>;
    constructor( characters: Character[]) {
        this.cursor = new ArrayCursor(characters);
        this.sessionStatistics = {
            totalKeys: characters.reduce<number>((prev, current) => {
                return prev + current.en.length
            }, 0),
            keysTyped: 0
        }
    }

    getCharacters = () => {
        return this.cursor.array;
    }

    startTest = () => {
        this.cursor.update((element) => {
            element.state = "active";
            return element;
        });
    }

    //This method is built as an arrow function to preserve the "this" statement
    parseKeyboardInput = ({ key }: KeyboardEvent) => {
        const character = this.cursor.currentElement;

        if (key == "Backspace") {
            if (character.display == "") {
                if ( this.cursor.currentIndex == 0 ) {
                    return;
                }

                //not allowed to go back on a character that was correct;
                if ( this.cursor.getPrev().state == "correct" || this.cursor.getPrev().state == "corrected") {
                    return;
                }

                this.cursor.shift("prev", (oldChar) => {
                    oldChar.state = "inactive";
                    return oldChar;
                }, (newChar) => {
                    newChar.state = "correcting";
                    newChar.display = newChar.display.slice(0, newChar.display.length - 1);
                    return newChar
                })
            } else {
                this.cursor.update((char) => {
                    char.display = char.display.slice(0, char.display.length - 1);
                    return char;
                })
            }
            return;
        }

        //ignore space press, meta inputs, and numbers
        if (key == " " || key.length != 1 || /\d/.test(key)) {
            return;
        }
        
        //kbInput is necessary for characters that are longer than one letter;
        this.cursor.update((char) => {
            char.display += key.toLowerCase();
            return char;
        });

        //checks for correctness only when the kbInput is the same length as character length in engish;
        if (character.display.length >= character.en.length) {
            this.cursor.shift("next", (oldChar) => {
                if (oldChar.display == oldChar.en) {
                    if (oldChar.state == "correcting") {
                        oldChar.state = "corrected"
                    } else {
                        oldChar.state = "correct"
                    }
                } else {
                    oldChar.state = "incorrect"
                }
                return oldChar;
            }, (newChar) => {
                newChar.state = "active";
                return newChar;
            });
        }
    }
}

export default TypingTest;