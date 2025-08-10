import { createLocalStorage, useLocalStorage } from "../Hooks/UseLocalStorage";
import { CharacterSetConfig } from "../Pages/practice/classes/charSet";

export const showProgressBarLSContext = createLocalStorage("showProgressBar", false);

export const characterSetConfigLSContext = createLocalStorage<CharacterSetConfig>("characterSetConfig", {
    higigana: {
        allowed: true,
        allowedGroups: [ "gojuon", "dakuon", "han-dakuon", "yoon" ]
    },
    katakana: {
        allowed:  false,
        allowedGroups: [ "gojoun", "dakuten", "handakuten", "yoon" ]
    }
})

export const sessionCharacterLengthLSContext = createLocalStorage("characterLength", 30);