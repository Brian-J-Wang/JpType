import { useContext, useEffect, useState } from 'react';
import keyboardInputContext from '../../Contexts/keyboardInputContext';
import './Card.css'

function Card(props) {

    const enState = () => {
        if (props.data.state == "inactive") {
            return "card__en__state_hidden";
        } else if (props.data.state == "active") {
            return "card__en__state_active";
        } else {
            return "";
        }
    }

    return (
        <div className={`card card__state_${props.data.state}`}>
            <h2 className={`card__jpn`}>{props.data.jp}</h2>
            <p className={`card__en ${enState()}`}>{(props.data.state == "active")? props.data.display : props.data.en}</p>
        </div>
    )
}

export default Card