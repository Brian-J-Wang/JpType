import { createContext } from "react";
import { localStorageType } from "../../../../Hooks/useLocalStorage";


type SettingContextType = {
    getProperty: (identifier: string ) => any,
    setProperty: (identifier: string, value: any) => void
}

export const SettingContext = createContext<SettingContextType>({
    getProperty: function (identifier: string) {
        throw new Error("Function not implemented.");
    },
    setProperty: function (identifier: string, value: any): void {
        throw new Error("Function not implemented.");
    }
});