import React, { useState, RefObject, forwardRef, useImperativeHandle, useContext, useRef, useEffect } from 'react';
import { CardElementProps, CharacterDisplayContext } from '../characterDisplay/characterDisplay';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionData/sessionDataProvider';

import styles from './Card.module.css';
import { generateRandomHexColor } from '../../../../utilities/generateRandomHexColor';

type CardProps = {
    index: number,
    character: Character,
    rowCalculator: (len: number) => number
}

const Card: React.FC<CardProps> = (props) => {
    const sessionData = useContext(SessionDataContext);
    const displayContext = useContext(CharacterDisplayContext);
    const elementReference = useRef<HTMLDivElement>(null);
    const [character, setCharacter] = useState<Character>(props.character);
    useEffect(() => {
        sessionData.testSession.registerSetState(character.id, setCharacter);
    }, [])

    const [ row, setRow ] = useState(-1);
    useEffect(() => {
        if (elementReference.current) {
            const rect = elementReference.current.getBoundingClientRect();
            
            if (props.index == 0) {
                const style = window.getComputedStyle(elementReference.current);
                displayContext.setCardHeight(parseInt(style.marginTop) + rect.height + parseInt(style.marginBottom));
            }

            if (rect) {
                setRow(props.rowCalculator(rect.width));
            }
        }
    }, [ displayContext.widthUpdateFlag ]);

    if (character.state == "active" || character.state == "correcting") {
        displayContext.setActiveRow(row);
    }

    const isHidden = () => {
        if (row == -1) {
            return styles.hidden;
        }

        const { bounds } = displayContext;
        if ( row <= bounds.upper && row >= bounds.lower) {
            return "";
        } else {
            return styles.hidden;
        }
    }

    let stateStyle = "";
    switch(character.state) {
        case "active":
            stateStyle = styles.state_active;
            break;
        case "correct":
            stateStyle = styles.state_correct;
            break;
        case "correcting":
            stateStyle = styles.state_correcting;
            break;
        case "inactive":
            stateStyle = styles.state_inactive;
            break;
        case "incorrect":
            stateStyle = styles.state_incorrect;
            break;
        case "corrected":
            stateStyle = styles.state_corrected;
            break;
    }
    
    return (
        <div className={`${styles.base} ${stateStyle} ${isHidden()}`}  ref={elementReference}>
            <h2 className={styles.jp}>{character.jp}</h2>
            <p className={styles.en}>{character.display}</p>
        </div>
    )
}


export default Card;