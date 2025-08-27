import Hirigana from '../../../assets/hirigana.json';
import { TestSettingContextType } from '../../settings/subPages/testSettings/testSettingLocalStorageContext';
import { Character } from './typingTest';

/** */
export type KanaRomaji = { en: string; jp: string };

function generateCharacterList(config: TestSettingContextType) {
    let characterList: KanaRomaji[] = [];

    if (config.hirigana.enabled) {
        new Set(config.hirigana.allowedGroups).forEach((element: TestSettingContextType["hirigana"]["allowedGroups"][number]) => {
            console.log(element);
            characterList.push(...Hirigana[element]);
        })
    }

    if (config.katakana.enabled) {
        console.error("katakana characters has not been implemented yet");
    }

    const output: KanaRomaji[] = [];

    for (let i = 0; i < config.length; i++) {
        const index = Math.floor(Math.random() * characterList.length);
        output.push(characterList[index]);
    }

    console.log(output );

    return output;
}

export default generateCharacterList;