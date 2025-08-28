import { PropsWithChildren } from "react"
import { localStorageType, useLocalStorage } from "../../../../Hooks/useLocalStorage"
import { SettingContext } from "./settingContext"

type SettingContextProviderType = PropsWithChildren & {
    context: localStorageType<any>
}

export const SettingContextProvider: React.FC<SettingContextProviderType> = (props) => {
    const [ localStorageValue, setLocalStorageValue ] = useLocalStorage(props.context);

    /** @param identifier string with values separated by a . to move into the object to update it */
    const setProperty = ( identifier: string, value: any ) => {
        const propertyTree = identifier.split(".");
        let property = localStorageValue;

        console.log(localStorageValue);

        while (propertyTree.length != 0) {
            const next = propertyTree.shift();

            if (propertyTree.length == 0) {
                property[next!] = value;
                break;
            } else {
                property = property[next!];
            }
        }

        setLocalStorageValue({ ...localStorageValue })
    }

    const getProperty = ( identifier: string) => {
        const propertyTree = identifier.split(".");
        let property = localStorageValue;

        while (propertyTree.length != 0) {
            property = property[propertyTree.shift()!];

            console.log(property);

            if (property == undefined) {
                throw new Error("property not found");
            }

            if (propertyTree.length == 0) {
                return property;
            }
        }

        return undefined;
    }

    return (
        <SettingContext.Provider value={{
            setProperty,
            getProperty
        }}>
            { props.children }
        </SettingContext.Provider>
    )
}