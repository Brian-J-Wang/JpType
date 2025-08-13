import { createLocalStorage, useLocalStorage } from "../Hooks/UseLocalStorage";
import { CharacterSetConfig } from "../Pages/practice/classes/generateCharacterList";

export const showProgressBarLSContext = createLocalStorage("showProgressBar", false);

export const characterSetConfigLSContext = createLocalStorage<CharacterSetConfig>("characterSetConfig", {
    higigana: {
        allowed: true,
        allowedGroups: ["gojuon", "dakuon", "han-dakuon", "yoon"]
    },
    katakana: {
        allowed: false,
        allowedGroups: ["gojoun", "dakuten", "handakuten", "yoon"]
    },
    length: 100
})

export const sessionCharacterLengthLSContext = createLocalStorage("characterLength", 30);