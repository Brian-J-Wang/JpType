import { createContext, ReactNode, useState } from "react"

type SessionDataType = {
    progress: number,
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    elapsedTime: number
    setElapsedTime: React.Dispatch<React.SetStateAction<number>>
}

//@ts-ignore
export const SessionDataContext = createContext<SessionDataType>();

const SessionDataProvider: React.FC<{
    children: ReactNode
}> = (props) => {
    const [ progress, setProgress ] = useState<number>(0);
    const [ elapsedTime, setElapsedTime ] = useState<number>(0);
    const [ characterCount, setCharacterCount ] = useState<number>(0);
    const [ characterTyped, setCharacterTyped ] = useState<number>(0);

    return <SessionDataContext.Provider value={{
        progress, setProgress,
        elapsedTime, setElapsedTime
    }}>
    </SessionDataContext.Provider>
}

export default SessionDataProvider;