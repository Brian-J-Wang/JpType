import { ToggleContainer } from "@src/shared"
import { PropsWithChildren } from "react"
import styles from "./groupSelector.module.css"

type GroupSelectorType = PropsWithChildren & {
    title: string,
    subtitle: string,
    isActive: boolean,
    onClick: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    className?: string,
}

const GroupSelector: React.FC<GroupSelectorType> = (props) => {
    const handleAdvanceClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        evt.stopPropagation();
    }

    return (
        <ToggleContainer onClick={props.onClick} isActive={props.isActive}>
            <div>
                <h3 className={styles.title}>
                    {props.title}
                </h3>
                <small className={styles.subtitle}>
                    {props.subtitle}
                </small>
            </div>
            <div>
                {props.children}
            </div>
            <button className={styles.button} onClick={handleAdvanceClick}>
                advanced
            </button>
        </ToggleContainer>
    )
}

export default GroupSelector;