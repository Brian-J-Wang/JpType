import { createContext, ReactNode, useEffect, useState } from "react"
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
    setDisplayFocused: (focused: boolean) => void
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
    const [ characters, setCharacters ] = useState<StateProxyArray<Character>>(() => buildCharacterList(testSettingConfig));
    const [ testSession, setTestSession ] = useState<TypingTest>(() => { return buildTypingTest(characters) });

    //event emitters
    const onTestRestart = UseEventEmitter<() => void>();

    const resetSession = () => {
        _setProgress(0);
        _setTestState("inactive");
        const newCharacters = buildCharacterList(testSettingConfig)
        setCharacters(newCharacters);
        setTestSession(() => buildTypingTest(newCharacters));
        onTestRestart.emit();
    }

    const setDisplayFocused = (focused: boolean) => {
        if (!focused) {
            if (testState == "active") {
                _setTestState("paused");
            }
        } else {
            if (testState == "paused") {
                _setTestState("active")
            }
        }
    }

    function buildTypingTest (characters: Character[]) {
        const typingTest = new TypingTest(characters);
        console.log(characters);
        typingTest.cursor.onEndReached = () => {
            _setTestState("complete");
        };
        typingTest.cursor.addSubscriber(() => {
            _setProgress(typingTest.cursor.currentIndex / (typingTest.cursor.array.length - 1))
        });

        return typingTest;
    }

    useEffect(() => {
        const handleKeyDown = (evt: KeyboardEvent) => {
            if (testState == "inactive") {
                _setTestState("active");
            } else if (testState != "active") {
                return;
            } 

            testSession.parseKeyboardInput(evt);
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [ testState, testSession])

    return <SessionDataContext.Provider value={{
        progress,
        elapsedTime, setElapsedTime,
        testState,
        resetSession,
        characters,
        testSession,
        setDisplayFocused,
        events: {
            onTestRestart
        }
    }}>
        {props.children}
    </SessionDataContext.Provider>
}

export default SessionDataProvider;