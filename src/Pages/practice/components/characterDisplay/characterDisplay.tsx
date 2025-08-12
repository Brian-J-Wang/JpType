import styles from './characterDisplay.module.css';
import React, { createContext, Dispatch, RefObject, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Card from '../characterCard/Card';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionData/sessionDataProvider';

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
    setCardHeight: (height: number) => void,
    bounds: RowDisplayBounds
}
export const CharacterDisplayContext = createContext<CharacterDisplayContextProps>({
    setActiveRow: function (value: React.SetStateAction<number>): void {
        throw new Error('Function not implemented.');
    },
    widthUpdateFlag: 0,
    setCardHeight: function (height: number): void {
        throw new Error('Function not implemented.');
    },
    bounds: {
        upper: 2,
        lower: 0
    }
})

export type CardElementProps = Character & {
    row: number
}

const CharacterDisplay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, style, ...props }) => {
    const [ cardHeight, setCardHeight ] = useState(-1);
    const [ activeRow, setActiveRow ] = useState(-1);
    const sessionData = useContext(SessionDataContext);
    const displayBounds = useMemo<RowDisplayBounds>(() => {
        if (activeRow == 0 || activeRow == -1) {
            return {
                upper: 2,
                lower: 0
            }
        } else {
            return {
                upper: activeRow + 1,
                lower: activeRow - 1
            }
        }
    } , [activeRow])

    //This logic assumes that each component will call the calculate row in the order that they
    //were created.
    const cumulativeLength = useRef<number>(0);
    const displaySize = useRef<number>(-1);

    const [ widthUpdateFlag, setWidthUpdateFlag ] = useState(0);
    const practiceWindow = useRef<HTMLDivElement>(null);
    const updateDisplaySize = () => {
        cumulativeLength.current = 0;
        displaySize.current = practiceWindow.current?.getBoundingClientRect().width ?? 0 ;
        setWidthUpdateFlag(n => n + 1);
    }

    useEffect(() => {
        updateDisplaySize();
        window.addEventListener("resize", updateDisplaySize);

        return () => {
            window.removeEventListener("resize", updateDisplaySize);
        }
    }, [])

    const calculateRow = (length: number) => {
        const threshold = Math.ceil(cumulativeLength.current / displaySize.current) * displaySize.current;

        if ( cumulativeLength.current + length > threshold && cumulativeLength.current != threshold ) {
            cumulativeLength.current = threshold + length;
        } else {
            cumulativeLength.current += length;
        }

        const row = Math.floor(cumulativeLength.current / displaySize.current);

        //cumulative rows that is divisible by the displaySize will be counted as the next row if I use the one above;
        if (cumulativeLength.current % displaySize.current == 0) {
            return row - 1;
        } else {
            return row;
        }
    }

    useEffect(() => {

    }, [sessionData.testSession.cursor.currentElement])

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
        <CharacterDisplayContext.Provider value={{setActiveRow, widthUpdateFlag, setCardHeight, bounds: displayBounds}}>
            <div className={`${styles.body} ${!focused && styles.body__state_inactive}`} ref={practiceWindow} {...props} tabIndex={0} onFocus={handleFocus}
            onBlur={sessionData.display.onBlur}>
                {
                    sessionData.characterList.map((element,index) => {
                        return (<Card key={element.id} index={index} character={element} rowCalculator={calculateRow}/>)
                    })
                }
            </div>
        </CharacterDisplayContext.Provider>
    )
}



export default CharacterDisplay