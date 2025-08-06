import { createContext, PropsWithChildren, useState } from "react";

type characterElement = {
    id: number,
    character: string
}

type characterSetContextType = {
    characterSet: characterElement[]
}

const characterSetContext = createContext<characterSetContextType>({
    characterSet: []
});

export const CharacterSetProvider: React.FC<PropsWithChildren> = (props) => {
    const [ characterSet, setCharacterSet ] = useState<characterElement[]>([]);

    return (
        <characterSetContext.Provider value={{
            characterSet: characterSet
        }}>
            {props.children}
        </characterSetContext.Provider>
    )
}