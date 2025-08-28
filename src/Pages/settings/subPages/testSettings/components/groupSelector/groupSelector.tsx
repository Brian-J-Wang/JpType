import { PropsWithChildren } from "react"
import styles from "./groupSelector.module.css"

type GroupSelectorType = PropsWithChildren & {
    title: string,
    isActive: boolean,
    onClick: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    className?: string,
}

const GroupSelector: React.FC<GroupSelectorType> = (props) => {
    return (
        <div onClick={props.onClick} className={`${styles.body} ${props.isActive ? styles.body_active : styles.body_inactive} ${props.className ?? ""}`}>
            <h3 className={styles.title}>
                {props.title}
            </h3>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default GroupSelector;