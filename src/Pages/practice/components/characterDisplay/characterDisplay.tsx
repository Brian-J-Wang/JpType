import styles from './characterDisplay.module.css';
import React, { createContext, Dispatch, RefObject, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Card from '../characterCard/Card';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionDataProvider/sessionDataProvider';
import useCardManager from './useCardManager';

export type CardElementProps = Character & {
    row: number
}

type internalCardProps = {
    row: number,
    hidden: boolean
}

//responsible for positioning and displaying the appropriate characters
const CharacterDisplay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, style, ...props }) => {
    const sessionData = useContext(SessionDataContext);
    const cardManager = useCardManager(sessionData.characters);
    const practiceWindow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onCursorUpdate = (oldValue: Character, newValue: Character) => {
            cardManager.setCurrentCard(newValue.id);
        }

        sessionData.testSession.cursor.addSubscriber(onCursorUpdate);
        return () => {
            sessionData.testSession.cursor.removeSubscriber(onCursorUpdate);
        }
    }, []);    

    const [ cardHeight, setCardHeight ] = useState(0);
    useEffect(() => {
        const child = practiceWindow.current?.firstElementChild;

        if (child) {
            setCardHeight(child.getBoundingClientRect().height + parseInt(getComputedStyle(child).marginTop) + parseInt(getComputedStyle(child).marginBottom));
        }
    }, [])

    useEffect(() => {
        const rowWidth = practiceWindow.current?.getBoundingClientRect().width;

        cardManager.setRowWidth(rowWidth ?? 0);

        const cardWidths = Array.from(practiceWindow.current?.children!).map((child) => {
            return {
                id: child.id,
                width: child.getBoundingClientRect().width
            }
        })

        cardManager.setCardWidths(cardWidths);
    }, []);

    //display resizing and row recalculations
    useEffect(() => {
        let resizeTimer:number ;
        const updateRowWidth = () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                const rowWidth = practiceWindow.current?.getBoundingClientRect().width;
                cardManager.setRowWidth(rowWidth ?? 0);

            }, 200)
            
        }

        window.addEventListener("resize", updateRowWidth);

        return () => {
            window.removeEventListener("resize", updateRowWidth);
        }
    }, [])

    return (
        <div className={`${styles.body}`} style={{ height: cardHeight * 3}}>
            <div className={`${styles.content}`} ref={practiceWindow} {...props} tabIndex={0} onFocus={sessionData.display.onfocus} onBlur={sessionData.display.onBlur}>
                {
                    cardManager.activeCards.map((active) => {
                        const data = sessionData.characters.find((el) => el.id == active);

                        if (data) {
                            return ( <Card key={data.id} id={data.id} initialData={data}/>)
                        } else {
                            return <></>
                        }
                    })
                }
            </div>
        </div>
    )
}



export default CharacterDisplay