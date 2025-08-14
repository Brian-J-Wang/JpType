import { createContext, Dispatch, SetStateAction } from "react";

type ObjectPropertyContextType = {
    getProperty: <T>(key: string) => T,
    setProperty: <T>(key: string, value: T) => void
}

export const ObjectPropertyContext = createContext<ObjectPropertyContextType>({
    getProperty: function <T>(key: string): T {
        throw new Error("Function not implemented.");
    },
    setProperty: function <T>(key: string, value: T): void {
        throw new Error("Function not implemented.");
    }
});



export type ControlsAlignment = "row" | "column";

type ObjectSettingPropertyContextType = {
    setControlAlignment: Dispatch<SetStateAction<ControlsAlignment>>;
    setDescription: Dispatch<SetStateAction<string>>;
}

export const ObjectSettingPropertyContext = createContext<ObjectSettingPropertyContextType>({
    setControlAlignment: function (value: SetStateAction<ControlsAlignment>): void {
        throw new Error("Function not implemented.");
    },
    setDescription: function (value: SetStateAction<string>): void {
        throw new Error("Function not implemented.");
    }
});