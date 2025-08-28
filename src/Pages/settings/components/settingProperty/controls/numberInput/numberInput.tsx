import { useContext, useState } from "react"
import { SettingContext } from "../../../settingContextProvider/settingContext"

type NumberInputType = {
    identifier: string
    min: number,
    max: number
}

const NumberInput: React.FC<NumberInputType> = (props) => {
    const settingContext = useContext(SettingContext);
    const [ value, setValue ] = useState(settingContext.getProperty(props.identifier));

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //removes leading zeros
        event.target.value = (+event.target.value).toString();

        if (event.target.value == "") {
            event.target.value = "0";
        }

        if (Number.parseInt(event.target.value) < props.min) {
            event.target.value = props.min.toString();
        }

        if (Number.parseInt(event.target.value) > props.max) {
            event.target.value = props.max.toString();
        }

        settingContext.setProperty(props.identifier, event.target.value);
        setValue(event.target.value);
    }

    return (<input type="number" value={value} onChange={onChange}/>)
}

export default NumberInput;