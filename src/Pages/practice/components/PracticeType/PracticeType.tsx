import './PracticeType.css'
import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react'
import Card, { CardHandle } from '../Card/Card'
import gameState from '../../../../JS/gameState'
import typingTest, { Character, TypingTestEventTypes } from '../../JS/typingTest'

interface CardRendererContextProps {
    currentRow: number
}

const CardRendererContext = createContext<CardRendererContextProps>({
    currentRow: 0
});

type PracticeTypeContextProps = {
    currentRow: number,
    maxRows: number,
}
export const PracticeTypeContext = createContext<PracticeTypeContextProps>({
    currentRow: 0,
    maxRows: 3,
})

interface CharacterProps extends Character {
    row: number
}



function PracticeType(props) {
    const [characters, setCharacters] = useState<CharacterProps[]>(typingTest.getCurrentState() as CharacterProps[]);
    const characterCards = useRef<HTMLDivElement[]>([]);
    const characterCardHandles = useRef<CardHandle[]>([]);
    const practiceWindow = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
    const currentRow = useRef<number>(0);
    const numRows = useRef<number>(0);
    const [maxRows, setMaxRows] = useState(3);

    useEffect(() => {
        typingTest.addEventListener(TypingTestEventTypes.onUpdate, updateCharacterState);

        const id = gameState.onGameState("reset", () => {
            setCharacters(typingTest.getCurrentState() as CharacterProps[]);
        }, 2);

        return () => {
            gameState.removeCallback(id);
            typingTest.removeEventListener(TypingTestEventTypes.onUpdate, updateCharacterState);
        }
    }, []);


    useEffect(() => {       
        const calculateCharacterRow = () => {
            const width = practiceWindow.current?.getBoundingClientRect().width;

            if (!width) {
                console.error("the practice window ref has not been set properly")
                return;
            }
            let cumulativeLength = 0;

            setCharacters(characters.map((character, index) => {
                const card = characterCards.current[index];

                const cardWidth = card.getBoundingClientRect().width;
                const row = Math.floor((cumulativeLength + cardWidth) / width);
                character.row = row;
                numRows.current = row;

                cumulativeLength += cardWidth
                //checks if the next card is going to fit in the remaining space
                if (cumulativeLength + cardWidth > width * (row + 1)) {
                    cumulativeLength = width * (row + 1);
                }

                return character;
            }))
        }

        calculateCharacterRow();
        window.addEventListener("resize", calculateCharacterRow)

        return () => {
            window.removeEventListener("resize", calculateCharacterRow)
        }
    }, [])

    function updateCharacterState(charSet: Character[]) {
        setCharacters(characters.map((character, index) => {
            Object.assign(character, charSet[index]);

            if (character.state == "active" && character.row > currentRow.current + 1 && currentRow.current + maxRows <= numRows.current) {
                currentRow.current += 1;
            }

            return character;
        }));
    }

    function calculateIfHidden(character: CharacterProps) {
        if (character.row == -1) {
            return true;
        }

        if (character.row < currentRow.current) {
            return true;
        }

        if (character.row > currentRow.current + (maxRows - 1)) {
            return true;
        }

        return false;
    }

    return (
        <PracticeTypeContext.Provider value={{currentRow: currentRow.current, maxRows}}>
            <div id="practice-type" className={`practice-type`} ref={practiceWindow}>
                {
                    characters.map((element,index) => <Card key={element.id} data={element} 
                        ref={(el) => (characterCardHandles.current[index] = el ?? {setRow: () => {}})}
                        //@ts-ignore - it works, trust me
                        elementReference={el => (characterCards.current[index] = el)}
                        hidden={calculateIfHidden(element)}
                    />)
                }
            </div>
        </PracticeTypeContext.Provider>
    )
}

export default PracticeType