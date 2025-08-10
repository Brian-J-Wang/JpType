import Hirigana from '../../../assets/hirigana.json';
import { Character } from './typingTest';

/** */
export type KanaRomaji = { en: string; jp: string };

type validHiriganaGroups = "gojuon" | "dakuon" | "han-dakuon" | "yoon";
type validKatakanaGroups = "gojoun" | "dakuten" | "handakuten" | "yoon";

export type CharacterSetConfig = {
    higigana: {
        allowed: boolean,
        allowedGroups: validHiriganaGroups[];
    },
    katakana: {
        allowed: boolean,
        allowedGroups: validKatakanaGroups[];
    }
}

class CharacterSet {
    allowedCharacterList: KanaRomaji[] = [];
    private config: CharacterSetConfig;

    constructor(config: CharacterSetConfig) {
        this.config = config;
        this.allowedCharacterList = this.buildAllowedCharacterList();
    }

    buildAllowedCharacterList() {
        const characterList: KanaRomaji[][] = [];
        if (this.config.higigana.allowed) {
            const visitedGroups: validHiriganaGroups[] = [];
            this.config.higigana.allowedGroups.forEach((group) => {
                if (visitedGroups.includes(group)) {
                    console.error("repeated allow hirigana group found in config");
                    return;
                }

                characterList.push(Hirigana[group]);
                visitedGroups.push(group);
            });
        }

        if (this.config.katakana.allowed) {
            const visitedGroups: validKatakanaGroups[] = [];
            this.config.katakana.allowedGroups.forEach((group) => {
                if (visitedGroups.includes(group)) {
                    console.error("repeated allow hirigana group found in config");
                    return;
                }

                console.error("katakana has not been implemented yet");
                visitedGroups.push(group);
            });
        }

        return characterList.flat();
    }

    //return a randomly generated list from characterList;
    shuffle(length: number) {
        const output: KanaRomaji[] = [];

        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * this.allowedCharacterList.length);
            output.push(this.allowedCharacterList[index]);
        }

        return output;
    }
}

export default CharacterSet;