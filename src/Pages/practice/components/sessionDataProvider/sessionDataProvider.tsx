import { createContext, ReactNode, useMemo, useState } from "react"
import TypingTest, { Character } from "../../classes/typingTest";
import { useLocalStorage } from "../../../../Hooks/useLocalStorage";
import TestSettingConfig from "../../../settings/subPages/testSettings/testSettingLocalStorageContext";
import StateProxyArray from "../../classes/stateProxy";
import generateCharacterList from "../../classes/generateCharacterList";
import { generateUniqueHash } from "../../../../utilities/GenerateUniqueHash";


type TestState = "inactive" | "active" | "paused" | "resumed" | "complete" | "reset" | "blur" | "return";

type SessionDataType = {
    /** Ranges from 0 to 1, displays how close to completion the session is. */
    progress: number,
    elapsedTime: number,
    setElapsedTime: React.Dispatch<React.SetStateAction<number>>,
    setCharacterTyped: ( value: number ) => void,
    testState: TestState,
    resetSession: () => void,
    characters: StateProxyArray<Character>,
    testSession: TypingTest,
    display: {
        onfocus: () => void,
        onBlur: () => void
    }
}

//@ts-ignore
export const SessionDataContext = createContext<SessionDataType>();

const SessionDataProvider: React.FC<{
    children: ReactNode
}> = (props) => {
    const [ progress, _setProgress ] = useState<number>(0);
    const [ elapsedTime, setElapsedTime ] = useState<number>(0);
    const [ characterCount ] = useState<number>(0);
    const [ characterTyped, _setCharacterTyped ] = useState<number>(0);

    const [ testSettingConfig ] = useLocalStorage(TestSettingConfig);

    const buildCharacterList = () => {
        const characterList = generateCharacterList(testSettingConfig ).map((element, index) => {
            return {
                en: element.en,
                jp: element.jp,
                display: "",
                id: generateUniqueHash(),
                state: index == 0 ? "active" : "inactive"
            } as Character
        });
        return new StateProxyArray<Character>(characterList);
    }
    const [ characters, setCharacters ] = useState<StateProxyArray<Character>>(buildCharacterList());
    
    const testSession = useMemo(() => new TypingTest(characters), []);
    
    const [ testState, _setTestState ] = useState<TestState>("inactive");

    const setCharacterTyped = (value: number) => {
        if ( characterCount != 0 ) {
            _setProgress(characterCount / value);
        }

        _setCharacterTyped(value);
    }

    const resetSession = () => {
        _setTestState("inactive");
    }

    const onDisplayFocus = () => {
        document.addEventListener("keydown", testSession.parseKeyboardInput);
        document.addEventListener("keydown", startTest);
    }

    const startTest = () => {
        _setTestState("active");

        document.removeEventListener("keydown", startTest);
    }

    const onDisplayBlur = () => {
        _setTestState("paused");
        document.removeEventListener("keydown", testSession.parseKeyboardInput);
    }

    return <SessionDataContext.Provider value={{
        progress,
        elapsedTime, setElapsedTime,
        setCharacterTyped,
        testState,
        resetSession,
        characters,
        testSession,
        display: {
            onfocus: onDisplayFocus,
            onBlur: onDisplayBlur
        }
    }}>
        {props.children}
    </SessionDataContext.Provider>
}

export default SessionDataProvider;