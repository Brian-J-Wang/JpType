import { multiSelectCards, numberInput, toggleInput } from "./settingBuilders";
import { characterSelection } from "./Custom/characterSelection";

export const settings = {
    General: [
        {
            name: "Character Count",
            description: `Number of characters per run. Digraphs (yōon, e.g. 'きゃ') are considered as a singular character.
            Kanji characters are considered one character followed by any leading hirigana.`,
            defaultValue: 10,
            builder: function () { return numberInput(this); }
        },
        {
            name: "Character Selection",
            inputType: "checkBoxCards",
            defaultValue: {},
            builder: function () { return characterSelection(this); }
        }
    ],
    Appearance: [
        {
            name: 'Show Progress Bar',
            description: 'Show the progress bar on the bottom of the typing board?',
            defaultValue: true,
            builder: function () { return toggleInput(this); }
        },
        {
            name: 'Show Timer',
            description: `Show the timer on the bottom right side.`,
            defaultValue: true,
            builder: function () { return toggleInput(this); }
        },
        {
            name: 'Show Typing Status',
            description: `Shows the total number of characters typed and the number remaining`,
            defaultValue: false,
            builder: function () { return toggleInput(this);}
        },
        {
            name: 'Dark Mode',
            description: `you don't need an explaination of what dark mode is, do you?`,
            defaultValue: false,
            builder: function () { return toggleInput(this); }
        }
    ],
    Account: [

    ]
}