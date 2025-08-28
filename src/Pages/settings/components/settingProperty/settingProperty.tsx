import { PropsWithChildren } from "react"

import styles from "./settingProperty.module.css";

type PropertyType = PropsWithChildren & {
    alignment?: "row" | "column",
    name: string,
    description: string
}

const SettingProperty: React.FC<PropertyType> = ({ alignment = "row", ...props}) => {

    const alignmentStyle = alignment == "row" ? styles.alignmentRow : styles.alignmnetColumn;

    return (
        <div className={`${styles.body} ${alignmentStyle}`}>
            <div>
                <h3 className={styles.title}>{props.name}</h3>
                <small className={styles.desc}>{props.description}</small>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default SettingProperty