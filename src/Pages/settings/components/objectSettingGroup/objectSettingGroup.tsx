import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react"
import { localStorageType, useLocalStorage } from "../../../../Hooks/UseLocalStorage"
import { ObjectPropertyContext } from "./contexts"

export type ObjectSettingGroupType = PropsWithChildren & {
    localStorageContext: localStorageType<Record<string, any>>
}

const ObjectSettingGroup: React.FC<ObjectSettingGroupType> = (props) => {
    const [ obj, setObj ] = useLocalStorage(props.localStorageContext);    

    const getProperty = (key: string) => {
        const result = obj[key];
        return result;
    }

    const setProperty = (key: string, value: any) => {
        const result = value[key];
        
        if (result) {
            setObj({
                ...value,
                [key]: value
            })
        } else {
            console.error(`property "${key}" does not exist on object`);
        }
    }

    if (typeof obj === 'object') {
        return (
            <ObjectPropertyContext.Provider value={{ getProperty, setProperty }}>
                { props.children }
            </ObjectPropertyContext.Provider>
        )
    } else {
        return (<></>)
    } 
}

export default ObjectSettingGroup;