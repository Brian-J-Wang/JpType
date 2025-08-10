import React, { useState, RefObject, forwardRef, useImperativeHandle, useContext, useRef, useEffect } from 'react';
import './Card.css';
import { CardElementProps, PracticeTypeContext } from '../characterDisplay/characterDisplay';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionData/sessionDataProvider';

type CardProps = Character & {
    index: number,
    rowCalculator: (len: number) => number
}

const Card: React.FC<CardProps> = (props) => {
    const sessionData = useContext(SessionDataContext);
    const practiceTypeContext = useContext(PracticeTypeContext);
    const elementReference = useRef<HTMLDivElement>(null);

    const [ row, setRow ] = useState(-1);
    useEffect(() => {
        if (elementReference.current) {
            const rect = elementReference.current.getBoundingClientRect();
            
            if (props.index == 0) {
                const style = window.getComputedStyle(elementReference.current);
                console.log(parseInt(style.marginTop) + rect.height + parseInt(style.marginBottom));
                practiceTypeContext.setCardHeight(parseInt(style.marginTop) + rect.height + parseInt(style.marginBottom));
            }

            if (rect) {
                setRow(props.rowCalculator(rect.width));
            }
        }

        
    }, [ practiceTypeContext.widthUpdateFlag ]);

    const enState = () => {
        if (props.state == "inactive") {
            return "card__en__state_hidden";
        } else if (props.state == "active") {
            if (sessionData.testState == "inactive") {
                return "card__en__state_hidden";
            } else {
                return "card__en__state_active";    
            }
        } else {
            return "";
        }
    }

    const isHidden = () => {
        if (row == -1) {
            return true;
        }

        if (practiceTypeContext.currentRow == 0 && row <= practiceTypeContext.maxRows) {
            if (row <= practiceTypeContext.maxRows - 1) {
                return false;
            } else {
                return true;
            }
        }

        const lowerBounds = Math.floor((practiceTypeContext.maxRows - 1) / 2) + practiceTypeContext.currentRow;
        const upperBounds = Math.ceil((practiceTypeContext.maxRows - 1) / 2) + practiceTypeContext.currentRow;
        if ( row >= lowerBounds && row <= upperBounds) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className={`card card__state_${props.state} ${ isHidden() && `card__hidden`}`} ref={elementReference}>
            <h2 className={`card__jpn`}>{props.jp}</h2>
            <p className={`card__en ${enState()}`}>{(props.state == "active")? props.display : props.en}</p>
        </div>
    )
}

export default Card;