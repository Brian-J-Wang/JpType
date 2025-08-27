import { createLocalStorage } from "../../../../Hooks/useLocalStorage"

export type TestSettingContextType = {
    /** the number of characters to include in a test */
    length: number
    /** controls for hirigana */
    hirigana: {
        enabled: true,
        allowedGroups: ("gojuon" | "dakuon" | "han-dakuon" | "yoon")[]
    },
    /** controls for katakana */
    katakana: {
        enabled: false
        allowedGroups: ("gojuon" | "dakuten" | "handakuten" | "yoon")[]
    }
}

const TestSettingLocalStorageContext = createLocalStorage<TestSettingContextType>("testSettingConfig", {
    length: 10,
    hirigana: {
        enabled: true,
        allowedGroups: ["gojuon", "dakuon", "han-dakuon", "yoon"]
    },
    katakana: {
        enabled: false,
        allowedGroups: []
    }
})

export default TestSettingLocalStorageContext;