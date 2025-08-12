export default class ArrayCursor<T> {
    array: T[];
    currentIndex: number;
    currentElement: T;
    onEndReached: () => void = () => {};
    onBeginningReached: () => void = () => {};
    
    constructor(array: T[], startIndex = 0) {
        this.array = array;
        this.currentIndex = startIndex;
        this.currentElement = this.array[this.currentIndex];
    }


    getPrev = () => {
        const prevIndex = this.currentIndex - 1;
        return this.array[prevIndex >= 0 ? prevIndex : 0];
    }

    /** moves the cursor to either the previous or the next index while updating the elements. the new element won't be updated if the cursor
     *  moves out of bounds
     */
    shift = (direction: "prev" | "next", oldElementUpdater: (element: T) => T = (el) => el, newElementUpdater: (element: T) => T = (el) => el) => {
        this.currentElement = oldElementUpdater(this.currentElement);

        const newIndex = this.currentIndex + (direction == "prev" ? -1 : 1);
        if ( newIndex < 0 ) {
            this.onBeginningReached();
        } else if ( newIndex >= this.array.length) {
            this.onEndReached();
        } else {
            this.currentIndex = newIndex;
            this.currentElement = this.array[this.currentIndex];
            this.currentElement = newElementUpdater(this.currentElement);
        }
    }

    update = (updater: (element: T) => T) => {
        this.currentElement = updater(this.currentElement);
    } 
}