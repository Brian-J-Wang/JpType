import { PropsWithChildren, useContext, useState } from "react";
import { ObjectPropertyContext } from "./contexts";

type ObjectSettingSubGroupType = PropsWithChildren & {
    property: string
}

const ObjectSettingSubGroup: React.FC<ObjectSettingSubGroupType> = (props) => {
    const objectPropertyContext = useContext(ObjectPropertyContext);
    const [ obj, setObj ] = useState<Record<string,any>>(objectPropertyContext.getProperty(props.property));

    const getProperty = (key: string) => {
        const result = obj[key];
        return result;
    }

    const setProperty = (key: string, value: any) => {
        const result = obj[key];

        if (result) {
            const newObj = {
                ...obj,
                [key]: value
            }
            setObj(newObj);
            objectPropertyContext.setProperty(props.property, newObj);
        }
    }

    if (typeof obj === 'object') {
        return (
            <ObjectPropertyContext.Provider value={{ getProperty, setProperty }}>
                {props.children}
            </ObjectPropertyContext.Provider>
        )
    } else {
        return (<></>)
    }
}
