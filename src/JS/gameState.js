/*
there are 4 different game states
    inactive - game has not started
    active - game has started and is running
    paused - game is paused
    complete = game is completed
*/

const validStates = [
    "inactive",
    "active",
    "paused",
    "complete"
]

const functionCalls = {
    inactive: [],
    active: [],
    paused: [],
    resumed: [],
    complete: [],
    reset: []
}

class GameState {
    constructor() {
        this._state = "inactive"
    }

    getState() {
        return this._state;
    }

    update() {
        console.log(functionCalls);
        functionCalls[this._state].forEach(element => {
            element();
        });
    }

    onGameInactive(funct) {
        if (this.notDuplicate(funct, "inactive")) {
            functionCalls.inactive.push(funct);
        }
    }

    onGameActive(funct) {
        if (this.notDuplicate(funct, "active")) {
            functionCalls.active.push(funct);

        }
    }

    onGamePaused(funct) {
        if (this.notDuplicate(funct, "paused")) {
            functionCalls.paused.push(funct);
        }
    }

    onGameResumed(funct) {
        if (this.notDuplicate(funct, "resumed")) {
            functionCalls.resumed.push(funct);
        }
    }

    onGameComplete(funct) {
        if (this.notDuplicate(funct, "complete")) {
            functionCalls.complete.push(funct);
        }
    }

    onGameReset(funct) {
        if (this.notDuplicate(funct, "reset")) {
            functionCalls.reset.push(funct);
        }
    }

    notDuplicate(funct, location) {
        const functAsString = funct.toString();
        return functionCalls[location].every((element => {
            return (element.toString() == functAsString) ? false : true;
        }))
    }

    start() {
        if(this._state != "inactive") {
            console.error("trying to start a game that has already started");
            return;
        } else {
            this._state = "active";
            this.update();
        }
    }

    pause() {
        if (this._state != "active") {
            console.error("trying to pause a game that is not running");
            return;
        } else {
            this._state = "paused";
            this.update();
        }
    }

    resume() {
        if (this._state != "paused") {
            console.error("trying to resume a game that is not paused");
            return;
        } else {
            this._state = "active";
            
            functionCalls.resumed.forEach(funct => {
                funct();
            });
        }
    }

    complete() {
        if (this._state != "active") {
            console.error("trying to complete a game that is not active");
            return;
        } else {
            this._state = "complete";

            this.update();
        }
    }

    reset() {
        this._state = "reset";
        this.update();
        this._state = "inactive";
        this.update(); 
    }

    
}

const gameState = new GameState();

export default gameState