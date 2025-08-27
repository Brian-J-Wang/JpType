import styles from './characterDisplay.module.css';
import React, { createContext, Dispatch, RefObject, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Card from '../characterCard/Card';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionDataProvider/sessionDataProvider';

type RowDisplayBounds = {
    upper: number,
    lower: number
}

interface CardRendererContextProps {
    currentRow: number
}

const CardRendererContext = createContext<CardRendererContextProps>({
    currentRow: 0
});

type CharacterDisplayContextProps = {
    setActiveRow: Dispatch<SetStateAction<number>>,
    widthUpdateFlag: number,
}
export const CharacterDisplayContext = createContext<CharacterDisplayContextProps>({
    setActiveRow: function (value: React.SetStateAction<number>): void {
        throw new Error('Function not implemented.');
    },
    widthUpdateFlag: 0,
})

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
    const practiceWindow = useRef<HTMLDivElement>(null);
    
    const [ activeRow, setActiveRow ] = useState(0);
    
    //This logic assumes that each component will call the calculate row in the order that they
    //were created.
    const maxRow = useRef<number>(-1);

    const calculateDisplayBounds = (row: number) => {
        if ( row <= 0 ) {
            return {
                upper: 2,
                lower: 0
            }
        } else if (row >= maxRow.current - 1) {
            return {
                upper: maxRow.current,
                lower: maxRow.current - 2
            }
        } else {
            return {
                upper: row + 1,
                lower: row - 1
            }
        }
    }

    const [ cards, setCards ] = useState<Map<string, internalCardProps>>(() => new Map(sessionData.characters.map((character) => {
        return [
            character.id,
            {
                row: -1,
                hidden: false
            }
        ]}))
    );
    
    useEffect(() => {
        const onCursorUpdate = (oldValue: Character, newValue: Character) => {
            if (oldValue.id === newValue.id) {
                return;
            }

            const newRow = cards.get(newValue.id)!.row;

            if (newRow != activeRow) {
                setActiveRow(newRow);

                recalculateInternalCardProps(newRow);
            }
        }

        sessionData.testSession.cursor.addSubscriber(onCursorUpdate);
        return () => {
            sessionData.testSession.cursor.removeSubscriber(onCursorUpdate);
        }
    }, [ cards ]);    

    const recalculateInternalCardProps = (row: number = activeRow) => {
        const displayBounds = calculateDisplayBounds(row);

        const newCards = new Map(cards);
    
        [...newCards.entries()].forEach(([key, value]) => {
            value.hidden = value.row > displayBounds.upper || value.row < displayBounds.lower;
        });

        setCards(newCards);
    }
    
    const [ cardHeight, setCardHeight ] = useState(0);
    useEffect(() => {
        const child = practiceWindow.current?.firstElementChild;

        if (child) {
            setCardHeight(child.getBoundingClientRect().height + parseInt(getComputedStyle(child).marginTop) + parseInt(getComputedStyle(child).marginBottom));
        }
    }, [])

    //builds and defines the rows, updates when the window is resized.
    const [ widthUpdateFlag, setWidthUpdateFlag ] = useState(0);
    useEffect(() => {
        const children = Array.from(practiceWindow.current!.children);
        const displaySize = practiceWindow.current?.getBoundingClientRect().width ?? -1;
        let cumulativeLength = 0;

        const newCards = new Map(cards);

        children.forEach((child, index) => {
            const threshold = Math.ceil(cumulativeLength / displaySize) * displaySize;

            const elementLength = child.scrollWidth;

            if (cumulativeLength + elementLength > threshold && cumulativeLength != threshold) {
                cumulativeLength = threshold + elementLength;
            } else {
                cumulativeLength += elementLength;
            }

            let row = Math.floor(cumulativeLength / displaySize);

            if (cumulativeLength % displaySize == 0) {
                row -= 1;
            }

            if (row > maxRow.current) {
                maxRow.current = row;
            }

            const displayBounds = calculateDisplayBounds(activeRow);
            const hidden = row > displayBounds.upper || row < displayBounds.lower;
            newCards.set(child.id, {
                row: row,
                hidden: hidden
            })
        });

        setCards(newCards);
    }, [ widthUpdateFlag ])

    const [ focused, setFocused ] = useState(false);
    const handleFocus = () => {
        sessionData.display.onfocus();
        setFocused(true);
    }

    const handleBlur = () => {
        sessionData.display.onBlur();
        setFocused(false);
    }

    return (
        <CharacterDisplayContext.Provider value={{setActiveRow, widthUpdateFlag}}>
            <div className={`${styles.body} ${!focused && styles.body__state_inactive}`} ref={practiceWindow} {...props} tabIndex={0} onFocus={handleFocus}
            onBlur={sessionData.display.onBlur} style={{ height: cardHeight * 3}}>
                {
                    sessionData.characters.map((characters) => {
                        return ( <Card key={characters.id} id={characters.id} initialData={characters} hidden={cards.get(characters.id)!.hidden as boolean}/>)
                    })
                }
            </div>
        </CharacterDisplayContext.Provider>
    )
}



export default CharacterDisplay