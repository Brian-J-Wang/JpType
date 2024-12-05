import React, { useState, RefObject, forwardRef, useImperativeHandle, useContext } from 'react';
import './Card.css'
import { PracticeTypeContext } from '../PracticeType/PracticeType';

const Card = forwardRef<CardHandle, CardProps>((props, ref) => {
    const practiceTypeContext = useContext(PracticeTypeContext);

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
        <div className={`card card__state_${props.data.state} ${props.hidden && `card__hidden`}`} ref={props.elementReference}>
            <h2 className={`card__jpn`}>{props.data.jp}</h2>
            <p className={`card__en ${enState()}`}>{(props.data.state == "active")? props.data.display : props.data.en}</p>
        </div>
    )
})

interface CardProps {
    data: any
    elementReference: RefObject<HTMLDivElement>,
    hidden: boolean
}

export interface CardHandle {
    setRow: (row: number) => void;
}

export default Card;