import { useState } from 'react'
import './settingBuilders.css'

export function Scaffold(props) {
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

//localStorage saves values as string
function getInitialValue({ name, defaultValue}) {
}

export function numberInput(settings, onValueChanged = null) {

    function handleChange(event) {
        const { value } = event.target;
        console.log( value );

        if (onValueChanged != null) {
            onValueChanged(value);
        }
    }

    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction='h'>
            <input type="number" className='numberInput' defaultValue={getInitialValue(settings)} onChange={handleChange}/>
        </Scaffold>
    )
}

//wrapper is necessary for components that have internal state.
export function toggleInput(settings) {
    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction='h'>
            <ToggleInput settings={settings}/>
        </Scaffold>
    )
}

function ToggleInput({settings}) {
    //converts string to boolean because localStorage saves value as string
    const [state, setState] = useState(() => getInitialValue(settings) == "true" );

    const handleChange = () => {
        const newState = !state;
        setState(newState);
        storage.set(settings.name, newState);
    }

    return (
        <div className={`toggle-input ${state && 'toggle-input__active'}`} onClick={handleChange}>
            <div className={`toggle-input__nub ${state && 'toggle-input__nub_active'}`}></div>
        </div>
    )
}

export function multiSelectCards(settings) {
    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction="v"></Scaffold>
    )
}