import { createContext, ReactNode, useEffect, useMemo, useState } from "react"
import TypingTest, { Character } from "../../classes/typingTest";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import TestSettingConfig, { TestSettingContextType } from "../../../settings/subPages/testSettings/testSettingLocalStorageContext";
import StateProxyArray from "../../classes/stateProxy";
import generateCharacterList from "../../classes/generateCharacterList";
import { generateUniqueHash } from "../../../../utilities/GenerateUniqueHash";
import UseEventEmitter from "@src/hooks/useEventEmitter";


type TestState = "inactive" | "active" | "paused" | "complete";

type SessionDataType = {
    /** Ranges from 0 to 1, displays how close to completion the session is. */
    progress: number,
    elapsedTime: number,
    setElapsedTime: React.Dispatch<React.SetStateAction<number>>,
    testState: TestState,
    resetSession: () => void,
    characters: StateProxyArray<Character>,
    testSession: TypingTest,
    display: {
        onfocus: () => void,
        onBlur: () => void
    }
    events: {
        onTestRestart: ReturnType<typeof UseEventEmitter<() => void>>
    }
}

//@ts-ignore
export const SessionDataContext = createContext<SessionDataType>();

const buildCharacterList = (config: TestSettingContextType) => {
    const characterList = generateCharacterList(config ).map((element, index) => {
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

const SessionDataProvider: React.FC<{
    children: ReactNode
}> = (props) => {
    const [ testState, _setTestState ] = useState<TestState>("inactive");
    const [ progress, _setProgress ] = useState<number>(0);
    const [ elapsedTime, setElapsedTime ] = useState<number>(0);
    const [ testSettingConfig ] = useLocalStorage(TestSettingConfig);
    const [ characters, setCharacters ] = useState<StateProxyArray<Character>>(buildCharacterList(testSettingConfig));
    const [ testSession ] = useState<TypingTest>(new TypingTest(characters));

    //event emitters
    const onTestRestart = UseEventEmitter<() => void>();
    
    useEffect(() => {
        testSession.cursor.onEndReached = stopTest;
    }, []);

    const resetSession = () => {
        _setTestState("inactive");
        onTestRestart.emit();
        setCharacters(buildCharacterList(testSettingConfig));
    }

    const startTest = () => {
        _setTestState("active");
        document.removeEventListener("keydown", startTest);
    }

    const stopTest = () => {
        _setTestState("complete");
        document.removeEventListener("keydown", testSession.parseKeyboardInput);
    }

    const onDisplayFocus = () => {
        document.addEventListener("keydown", testSession.parseKeyboardInput);
        document.addEventListener("keydown", startTest);
    }

    const onDisplayBlur = () => {
        document.removeEventListener("keydown", testSession.parseKeyboardInput);
        if (testState == "active") {
            _setTestState("paused");
        }
    }    

    return <SessionDataContext.Provider value={{
        progress,
        elapsedTime, setElapsedTime,
        testState,
        resetSession,
        characters,
        testSession,
        display: {
            onfocus: onDisplayFocus,
            onBlur: onDisplayBlur
        },
        events: {
            onTestRestart
        }
    }}>
        {props.children}
    </SessionDataContext.Provider>
}

export default SessionDataProvider;