import { PropsWithChildren } from "react"

import style from "./settingGroup.module.css";

type SettingGroupProps = PropsWithChildren & {
    groupName: string,
}

const SettingGroup: React.FC<SettingGroupProps> = (props) => {
    return (
        <div className={style.body}>
            <div className={style.header}>
                <hr className={style.firstHR}/>
                <h2 className={style.title}>
                    {props.groupName}
                </h2>
                <hr /> 
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )   
}

export default SettingGroup;