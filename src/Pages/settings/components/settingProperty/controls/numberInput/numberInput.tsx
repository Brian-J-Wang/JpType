import { useContext, useState } from "react"
import { SettingContext } from "../../../settingContextProvider/settingContext"

type NumberInputType = {
    identifier: string
}

const NumberInput: React.FC<NumberInputType> = (props) => {
    const settingContext = useContext(SettingContext);
    const [ value, setValue ] = useState(settingContext.getProperty(props.identifier));

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        settingContext.setProperty(props.identifier, event.target.value);
        setValue(event.target.value);
    }

    return (<input type="number" value={value} onChange={onChange}/>)
}

export default NumberInput;