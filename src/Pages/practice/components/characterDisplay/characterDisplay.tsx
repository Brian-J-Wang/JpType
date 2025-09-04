import { useContext, useEffect, useRef, useState } from 'react';
import Card from '../characterCard/Card'
import { Character } from '../../classes/typingTest';
import { SessionDataContext } from '../sessionDataProvider/sessionDataProvider';
import useCardManager from './useCardManager';
import styles from './characterDisplay.module.css';

export type CardElementProps = Character & {
    row: number
}

//responsible for positioning and displaying the appropriate characters
const CharacterDisplay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, style, ...props }) => {
    const sessionData = useContext(SessionDataContext);
    const cardManager = useCardManager(sessionData.characters);
    const practiceWindow = useRef<HTMLDivElement>(null);

    const [ cardHeight, setCardHeight ] = useState(0);
    useEffect(() => {
        const child = practiceWindow.current?.firstElementChild;
        if (child) {
            setCardHeight(child.getBoundingClientRect().height + parseInt(getComputedStyle(child).marginTop) + parseInt(getComputedStyle(child).marginBottom));
        }     
    }, []);

    useEffect(() => {
        const arr = Array.from(practiceWindow.current?.children!).map((child) => {
            return {
                id: child.id,
                width: child.getBoundingClientRect().width
            }
        });

        cardManager.setCardWidths(arr);
    }, [ cardManager, sessionData.characters ])

    useEffect(() => {
        const rowWidth = practiceWindow.current?.getBoundingClientRect().width;
        cardManager.setRowWidth(rowWidth ?? 0);
    }, [ cardManager.setRowWidth ]);

    //display resizing and row recalculations
    useEffect(() => {
        const rowWidth = practiceWindow.current?.getBoundingClientRect().width;
        cardManager.setRowWidth(rowWidth ?? 0);

        let resizeTimer:number;
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
    }, []);

    //refocusing on display when test is restarted
    useEffect(() => {
        sessionData.events.onTestRestart.subscribe(() => {
            practiceWindow.current?.focus();
        })
    }, []);

    useEffect(() => {
        let interval;
        const updateCurrentRow = (evt: WheelEvent) => {
            if (sessionData.testState != "complete") {
                return;
            }
            const bounds = practiceWindow.current?.getBoundingClientRect()!;
            const isInside = evt.clientX >= bounds.left &&
                evt.clientX <= bounds.right &&
                evt.clientY <= bounds.bottom &&
                evt.clientY >= bounds.top;

            if (isInside) {
                if (evt.deltaY < 0) {
                    cardManager.shiftRow((currentRow) => currentRow - 1);
                } else {
                    cardManager.shiftRow((currentRow) => currentRow + 1);
                }
            }
        }

        document.addEventListener("wheel", updateCurrentRow);

        return () => {
            document.removeEventListener("wheel", updateCurrentRow);
        }
    }, [ sessionData.testState, cardManager ])

    const handleFocus = (focus: boolean) => () => {
        if (sessionData.testState == "complete") {
            return;
        }
        sessionData.setDisplayFocused(focus)
    }

    return (
        <div className={`${styles.body}`} style={{ height: 90 * 3}}>
            <div className={`${styles.content} ${sessionData.testState == "complete" && styles.content_forcedFocus}`} ref={practiceWindow} {...props} tabIndex={0} onFocus={handleFocus(true)} onBlur={handleFocus(false)}>
                {
                    cardManager.activeCards.map((active, index) => {
                        const data = sessionData.characters.find((el) => el.id == active);
                        if (data) {
                            return ( <Card key={data.id} id={data.id} initialData={data}/>)
                        } else {
                            return <div key={active}></div>
                        }
                    })
                }
            </div>
        </div>
    )
}



export default CharacterDisplay