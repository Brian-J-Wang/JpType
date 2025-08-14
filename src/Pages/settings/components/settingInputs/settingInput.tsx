import { createContext, PropsWithChildren, ReactNode, SetStateAction, useCallback, useContext, useState } from "react";
import { useLocalStorage, localStorageType } from "../../../../Hooks/UseLocalStorage"
import Toggle from "../../../../shared/inputs/toggle/toggle";
import styles from "./settingInput.module.css";
import NumberInput from "../../../../shared/inputs/numberInput/numberInput";

type SettingInputContextType = {
    input: any,
    setInput: React.Dispatch<SetStateAction<any>>
    setDesc: React.Dispatch<React.SetStateAction<ReactNode | undefined>>   
}
const SettingInputContext = createContext<SettingInputContextType | undefined>(undefined);

type SettingInputType<T> = {
    localStorageContext: localStorageType<T>
    name: string,
    type: "switch" | "text" | "number" | "slider",
    children: ReactNode
}

function SettingInput<T>(props: SettingInputType<T>) {
    const [ input, setInput ] = useLocalStorage<T>(props.localStorageContext);
    const [ desc, setDesc] = useState<ReactNode | undefined>(undefined);

    const getControl = () => {
        switch (props.type) {
            case "switch":
                return (
                    <Toggle state={input as boolean} updateState={function (newState: boolean): void {
                        setInput(newState as T)!;
                    } }/>
                );
            case "text": 
                return (
                    <div></div>
                );
            case "number":
                return (
                    <NumberInput value={input as number} onChange={function (evt: React.ChangeEvent<HTMLInputElement>): void {
                        setInput(evt.target.value as T);
                    } }></NumberInput>
                )
            case "slider":
                return (
                    <div></div>
                )
        }
    }

    return (
        <SettingInputContext.Provider value={{input, setInput, setDesc}}>
            { props.children }
            <div className={styles.body}>
                <div className={styles.leftSide}>
                    <h3 className={styles.leftSide__title}>{props.name}</h3>
                    <small>{desc ?? ""}</small>
                </div>
                <div>
                    { getControl() }
                </div>
            </div>
        </SettingInputContext.Provider>
    )
}

const settingDescription: React.FC<PropsWithChildren> = (props) => {
    const settingInputContext = useContext(SettingInputContext);

    settingInputContext?.setDesc(props.children);

    return <></>
}

SettingInput.description = settingDescription;

export default SettingInput;