import { PropsWithChildren } from "react"

type PropertyType = PropsWithChildren & {
    alignment?: "row" | "column",
    name: string,
    description: string
}

const SettingProperty: React.FC<PropertyType> = ({ alignment = "row", ...props}) => {
    return (
        <div className="">
            <div>
                <h3>{props.name}</h3>
                <small>{props.description}</small>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default SettingProperty