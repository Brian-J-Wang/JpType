import { useState } from 'react'
import './settingItems.css'

function Scaffold(props) {
    return (
        <div className={`scaffold ${props.direction == "v" && 'scaffold__vertical'}`}>
            <div className={`scaffold__option-details ${props.direction == "v" && 'scaffold__option-details__direction_vertical'}`}>
                <h1 className="scaffold__option-name">
                    {props.name}
                </h1>
                {
                    props.desc != null && <p className="scaffold__option-desc">
                        {props.desc}
                    </p>
                }
            </div>
            {props.children}
        </div>
    )
}

export function numberInput(settings, initialValue, onValueChanged) {

    function handleChange(event) {
        const value = event.target.value;

        console.log(value);
    }

    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction='h'>
            <input type="number" className='numberInput' defaultValue={initialValue} onChange={handleChange}/>
        </Scaffold>
    )
}

export function toggleInput(settings) {
    const [state, setState] = useState(false);

    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction='h'>
            <div className={`toggle-input ${state && 'toggle-input__active'}`} onClick={() => {setState(!state)}}>
                <div className={`toggle-input__nub ${state && 'toggle-input__nub_active'}`}></div>
            </div>
        </Scaffold>
    )
}

export function multiSelectCards(settings) {
    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction="v"></Scaffold>
    )
}

function textInput(setting) {

}