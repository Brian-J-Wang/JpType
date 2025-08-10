import { createContext, ReactNode, useMemo, useRef, useState } from "react"
import TypingTest, { Character } from "../../classes/typingTest";
import { useLocalStorage } from "../../../../Hooks/UseLocalStorage";
import { characterSetConfigLSContext, sessionCharacterLengthLSContext } from "../../../../Contexts/useLocalStorageContexts";
import CharacterSet from "../../classes/charSet";


type TestState = "inactive" | "active" | "paused" | "resumed" | "complete" | "reset" | "blur" | "return";

type SessionDataType = {
    /** Ranges from 0 to 1, displays how close to completion the session is. */
    progress: number,
    elapsedTime: number,
    setElapsedTime: React.Dispatch<React.SetStateAction<number>>,
    setCharacterTyped: ( value: number ) => void,
    testState: TestState,
    resetSession: () => void,
    characterList: Character[];
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

    const [ characterSetConfig ] = useLocalStorage(characterSetConfigLSContext); 
    const characterSet = useMemo(() => new CharacterSet(characterSetConfig), [ characterSetConfig ])
    const [ characterList, setCharacterList ] = useState<Character[]>([]);

    const [ testState, _setTestState ] = useState<TestState>("inactive");
    const [ sessionLength ] = useLocalStorage(sessionCharacterLengthLSContext);
    const testSession = useMemo(() => new TypingTest(characterSet.shuffle(100), setCharacterList), [ characterSet ]);

    const setCharacterTyped = (value: number) => {
        if ( characterCount != 0 ) {
            _setProgress(characterCount / value);
        }

        _setCharacterTyped(value);
    }

    const resetSession = () => {
        _setTestState("inactive");
    }

    const startTest = () => {
        if (testState == "inactive") {

        }
    }

    return <SessionDataContext.Provider value={{
        progress,
        elapsedTime, setElapsedTime,
        setCharacterTyped,
        testState,
        resetSession,
        characterList
    }}>
        {props.children}
    </SessionDataContext.Provider>
}

export default SessionDataProvider;