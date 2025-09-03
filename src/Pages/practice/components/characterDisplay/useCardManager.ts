import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Character } from "../../classes/typingTest";
import { SessionDataContext } from "../sessionDataProvider/sessionDataProvider";

type CharacterData = {
    id: string,
    width: number,
    row: number
}

class CardManager extends Array<CharacterData> {
    private rowWidth: number = -1;
    private maxRowIndex: number = 0;
    private currentRow: number = -1;
    private currentCard: string = ""; 
    private setActiveCards: Dispatch<SetStateAction<string[]>>
    constructor(data: CharacterData[], setActiveCards: Dispatch<SetStateAction<string[]>>) {
        if (Array.isArray(data)) {
            super(...data)
            setActiveCards(data.map((element) => {
                return element.id
            }))
        } else {
            super();
        }

        this.setActiveCards = setActiveCards;
    }

    private recalculateCardRows () {
        if ( this.rowWidth == -1 ) {
            return;
        }

        this.maxRowIndex = 0;

        let cumulativeWidth = 0;
        for ( let i = 0; i < this.length; i++ ) {
            const threshold = Math.ceil(cumulativeWidth / this.rowWidth) * this.rowWidth;
            
            if ( cumulativeWidth + this[i].width > threshold && cumulativeWidth != threshold ) {
                cumulativeWidth = threshold + this[i].width;
            } else {
                cumulativeWidth += this[i].width;
            }

            if (cumulativeWidth % this.rowWidth == 0) {
                this[i].row = Math.floor(cumulativeWidth / this.rowWidth) -1;
            } else {
                this[i].row = Math.floor(cumulativeWidth / this.rowWidth);
            }

            if (this[i].row > this.maxRowIndex) {
                this.maxRowIndex = this[i].row;
            }
        }

        const hasChanged = this.recalculateCurrentRow(this.currentCard);
        if (hasChanged) {
            this.setActiveCards(this.getRows(this.currentRow));
        }
    }

    setRowWidth (width: number) {
        this.rowWidth = width;
        this.recalculateCardRows();
    }

    setCardWidths (cardWidths: Omit<CharacterData, "row">[]) {
        const lookup = new Map(this.map(obj => [ obj.id, obj ]));

        cardWidths.forEach((card) => {
            const obj = lookup.get(card.id);

            if (obj && !obj.width) {
                obj.width = card.width;
            }
        });
        this.recalculateCardRows();
    }

    getRows(activeRow = -1) {
        let bounds = {
            upper: Infinity,
            lower: -Infinity
        }

        if (activeRow == 0) {
            bounds.upper = 2;
            bounds.lower = 0;
        } else if (activeRow >= this.maxRowIndex - 1) {
            bounds.upper = this.maxRowIndex;
            bounds.lower = this.maxRowIndex - 2;
        } else if (activeRow != -1) {
            bounds.upper = activeRow + 1;
            bounds.lower = activeRow - 1
        }

        return this.filter((el) => {
            if (el.row > bounds.upper || el.row < bounds.lower) {
                return false;
            } else {
                return true;
            }
        }).map((el) => el.id);
    }

    setCurrentCard(id: string) {
        this.currentCard = id;
        const hasChanged = this.recalculateCurrentRow(id);
        if (hasChanged) {
            this.setActiveCards(this.getRows(this.currentRow));
        }
    }


    /**
     * @param id the string id of the card
     * @returns true if the current row has changed.
     */
    recalculateCurrentRow(id: string) {
        console.log(this.find(el => el.id == id));

        const newRow = this.find(el => el.id == id)?.row ?? -1;

        console.log(newRow);

        if (newRow == this.currentRow) {
            return false;
        } else {
            this.currentRow = newRow
            return true
        }
    }
}

function buildElementFromCharacters(characters: Character[]): CharacterData[] {
    const elements: CharacterData[] = [];

    characters.forEach((element) => {
        elements.push({
            id: element.id,
            width: 0,
            row: -1
        })
    });

    return elements;
}

const useCardManager = (initialCharacterSet: Character[]) => {
    const sessionData = useContext(SessionDataContext);
    const [ activeCards, setActiveCards ] = useState<string[]>([]);
    const [ cardManager, setCardManager ] = useState<CardManager>(() => new CardManager(buildElementFromCharacters(initialCharacterSet), setActiveCards));

    useEffect(() => {
        const onCursorUpdate = (oldValue: Character, newValue: Character) => {
            console.log(newValue.id);
            cardManager.setCurrentCard(newValue.id);
        }

        sessionData.testSession.cursor.addSubscriber(onCursorUpdate);
        return () => {
            sessionData.testSession.cursor.removeSubscriber(onCursorUpdate);
        }
    }, [ cardManager, sessionData.testSession ]);   

    useEffect(() => {
        setCardManager(new CardManager(buildElementFromCharacters(sessionData.characters), setActiveCards));
    }, [sessionData.characters])

    return {
        activeCards,
        setRowWidth: cardManager.setRowWidth.bind(cardManager),
        setCardWidths: cardManager.setCardWidths.bind(cardManager),
    }
}

export default useCardManager;