import styles from "./numberInput.module.css"

type NumberInputType = {
    value: number
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

const NumberInput: React.FC<NumberInputType> = (props) => {
    return (<input type="number" className={styles.body} onChange={props.onChange} value={props.value} min={0}/>)
}

export default NumberInput;