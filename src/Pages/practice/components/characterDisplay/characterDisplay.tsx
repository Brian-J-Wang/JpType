import styles from './characterDisplay.module.css';
import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react';
import Card from '../characterCard/Card';
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionData/sessionDataProvider';

interface CardRendererContextProps {
    currentRow: number
}

const CardRendererContext = createContext<CardRendererContextProps>({
    currentRow: 0
});

type PracticeTypeContextProps = {
    currentRow: number,
    maxRows: number,
    widthUpdateFlag: number,
    setCardHeight: (height: number) => void
}
export const PracticeTypeContext = createContext<PracticeTypeContextProps>({
    currentRow: 0,
    maxRows: 3,
    widthUpdateFlag: 0,
    setCardHeight: () => {}
})

export type CardElementProps = Character & {
    row: number
}

const CharacterDisplay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, style, ...props }) => {
    const [ cardHeight, setCardHeight ] = useState(-1);
    const currentRow = useRef<number>(0);
    const [maxRows, setMaxRows] = useState(3);
    const sessionData = useContext(SessionDataContext);

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

        return Math.floor(cumulativeLength.current / displaySize.current);
    }

    const handleFocus = () => {
        console.log("focused");
    }

    return (
        <PracticeTypeContext.Provider value={{currentRow: currentRow.current, maxRows, widthUpdateFlag, setCardHeight}}>
            <div id="practice-type" className={`${styles.body} ${sessionData.testState == "inactive" && styles.body__state_inactive}`} 
            style={{height: cardHeight * maxRows}} ref={practiceWindow} {...props} tabIndex={0} onFocus={handleFocus}>
                {
                    sessionData.characterList.map((element,index) => <Card key={index} index={index} {...element} rowCalculator={calculateRow}/>)
                }
            </div>
        </PracticeTypeContext.Provider>
    )
}

export default CharacterDisplay