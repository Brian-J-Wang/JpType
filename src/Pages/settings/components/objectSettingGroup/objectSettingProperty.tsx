import { PropsWithChildren, useState } from "react"
import { ControlsAlignment, ObjectSettingPropertyContext } from "./contexts";

export type ObjectSettingPropertyType = PropsWithChildren & {
    settingName: string,
    property: string
}

const ObjectSettingProperty: React.FC<ObjectSettingPropertyType> = (props) => {
    const [ controlAlignment, setControlAlignment ] = useState<ControlsAlignment>("row");
    const [ description, setDescription ] = useState<string>("");

    return (
        <ObjectSettingPropertyContext.Provider value={{setControlAlignment, setDescription}}>
            <div className="">
                <div>
                    <h3>{props.settingName}</h3>
                    <small>{description}</small>
                </div>
                <div>
                    {props.children}
                </div>
            </div>
        </ObjectSettingPropertyContext.Provider>
    )
}

export default ObjectSettingProperty;