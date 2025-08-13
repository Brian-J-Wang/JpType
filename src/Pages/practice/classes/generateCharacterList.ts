import Hirigana from '../../../assets/hirigana.json';
import { Character } from './typingTest';

/** */
export type KanaRomaji = { en: string; jp: string };

type validHiriganaGroups = "gojuon" | "dakuon" | "han-dakuon" | "yoon";
type validKatakanaGroups = "gojoun" | "dakuten" | "handakuten" | "yoon";

export type CharacterSetConfig = {
    length: number,
    higigana: {
        allowed: boolean,
        allowedGroups: validHiriganaGroups[];
    },
    katakana: {
        allowed: boolean,
        allowedGroups: validKatakanaGroups[];
    }
}

function generateCharacterList(config: CharacterSetConfig) {
    let characterList: KanaRomaji[] = [];

    if (config.higigana.allowed) {
        new Set(config.higigana.allowedGroups).forEach((element) => {
            characterList.push(...Hirigana[element]);
        })
    }

    if (config.katakana.allowed) {
        console.error("katakana characters has not been implemented yet");
    }

    const output: KanaRomaji[] = [];

    for (let i = 0; i < config.length; i++) {
        const index = Math.floor(Math.random() * characterList.length);
        output.push(characterList[index]);
    }

    return output;
}

export default generateCharacterList;