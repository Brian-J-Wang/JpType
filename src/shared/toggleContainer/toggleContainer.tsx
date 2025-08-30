import { PropsWithChildren } from "react"
import styles from "./toggleContainer.module.css"

type ToggleContainerProps = PropsWithChildren & {
    isActive: boolean,
    onClick: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    className?: string,
}

const ToggleContainer: React.FC<ToggleContainerProps> = (props) => {
    return (
        <div onClick={props.onClick} className={`${styles.body} ${props.isActive ? styles.body_active : styles.body_inactive} ${props.className ?? ""}`}>
            {props.children}
        </div>
    )
}

export default ToggleContainer;