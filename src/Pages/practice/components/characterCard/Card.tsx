import React, { useState, useContext, useRef, useEffect } from 'react';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionDataProvider/sessionDataProvider';
import styles from './Card.module.css';

type CardProps = {
    id: string,
    initialData: Character
}

/** responsible for rendering the contents of the character */
const Card: React.FC<CardProps> = (props) => {
    const sessionData = useContext(SessionDataContext);
    const elementReference = useRef<HTMLDivElement>(null);
    const [ character, setCharacter ] = useState<Character>(props.initialData);

    useEffect(() => {
        sessionData.characters.register(props.id, setCharacter);
    }, [])

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
        <div className={`${styles.base} ${stateStyle}`} ref={elementReference} id={props.id}>
            <h2 className={styles.jp}>{character.jp}</h2>
            <p className={styles.en}>{character.display}</p>
        </div>
    )
}


export default Card;