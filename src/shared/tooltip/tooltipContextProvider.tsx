import { createContext, PropsWithChildren, ReactNode, useState } from "react"

type ToolTipContextType = {
    setToolTip: (node: ReactNode) => void,
    clearToolTip: () => void
}

const ToolTipContext = createContext<ToolTipContextType>({
    setToolTip: function (node: ReactNode): void {
        throw new Error("Function not implemented.");
    },
    clearToolTip: function (): void {
        throw new Error("Function not implemented.");
    }
});

const ToolTipProvider: React.FC<PropsWithChildren> = (props) => {
    const [ toolTip, setToolTip ] = useState<ReactNode>(null);

    const clearToolTip = () => {
        setToolTip(null);
    }

    return (
        <ToolTipContext.Provider value={{setToolTip, clearToolTip}}>
            {props.children}
            <div>
                {toolTip}
            </div>
        </ToolTipContext.Provider>
    )
}

export default ToolTipProvider;