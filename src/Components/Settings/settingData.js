import { multiSelectCards, numberInput, toggleInput } from "./settingItems";

const settings = {
    General: [
        {
            name: "Character Count",
            description: `Number of characters per run. Digraphs (yōon, e.g. 'きゃ') are considered as a singular character.
            Kanji characters are considered one character followed by any leading hirigana.`,
            validation: /\d/,
            defaultValue: 10,
            builder: function (initVal) { return numberInput(this, initVal != null ? initVal : this.defaultValue, () => {

            }); }
        },
        {
            name: "Character Selection",
            description: "characters included in the test",
            inputType: "checkBoxCards",
            defaultValue: {},
            builder: function (initVal) { return multiSelectCards(this); }
        }
    ],
    Appearance: [
        {
            name: 'Dark Mode',
            description: `you don't need an explaination of what dark mode is, do you?`,
            defaultValue: false,
            builder: function (initVal) { return toggleInput(this); }
        }
    ],
    Account: [

    ]
}

export default settings;