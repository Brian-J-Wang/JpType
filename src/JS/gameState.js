class GameState {
    #stateFunctions = {
        inactive: [],
        active: [],
        paused: [],
        resumed: [],
        complete: [],
        reset: [],
        exit: [],
        return: []
    }
    /*
    element = {
        id: id,
        funct: funct,
        stage: stage
    }
    */

    //exit functions do not need to
    #exitFunctions = [];

    constructor() {
        this._state = "inactive";
    }

    getState() {
        return this._state;
    }

    isState(state) {
        if (this.#stateFunctions[state] == null) {
            console.error("state: ${state} does not exist");
            return false;
        }

        return (state == this._state) ? true : false;
    }

    update() {
        //runs exit functions if it exits
        this.#exitFunctions.forEach(funct => {
            funct();
        });
        this.#exitFunctions = [];

        this.#stateFunctions[this._state].forEach(element => {
            const exitFunction = element.funct();

            if (exitFunction != null) {
                this.#exitFunctions.push(exitFunction);
            }
        });
    }

    //stage refers to the order in which functions should execute, higher numbers are executed last.
    onGameState(gameState, funct, stage = 1) {
        //invalid state
        if (this.#stateFunctions[gameState] == null) {
            console.log(`state: ${gameState} does not exist`);
            return;
        }

        //duplicate
        if (this.isDuplicate(gameState, funct, stage)) {
            return;
        }

        const id = this.generateId(gameState);

        const insertIndex = this.#stateFunctions[gameState].findIndex(element => {
            return (element.stage >= stage ) ? true : false;
        })

        const element = {
            id: id,
            funct: funct,
            stage: stage
        }

        if(insertIndex == -1) {
            this.#stateFunctions[gameState].push(element);
        } else {
            this.#stateFunctions[gameState].splice(insertIndex, 0, element);
        }

        return id;
    }

    generateId(gameState) {
        const array = new Uint32Array(5);
        crypto.getRandomValues(array);

        const id = array.reduce((id, chunk) => {
            return id.concat(chunk.toString())
        }, "");

        return gameState.concat(":",id);
    }

    removeCallback(id) {
        const data = id.split(':');

        this.#stateFunctions[data[0]] = this.#stateFunctions[data[0]].filter((callback) => {
            return callback.id == id ? false : true;
        })
    }

    removeCallbacks(ids) {
        ids.forEach(id => this.removeCallback(id));
    }

    //a function is a duplicate if it shares the same gamestate, function blueprint, and stage.
    isDuplicate(gameState, funct, stage) {
        if (this.#stateFunctions[gameState].length == 0) {
            return false;
        }

        return !this.#stateFunctions[gameState].every(element => {
            return (element.funct.toString() != funct.toString() || element.stage != stage) ? true : false
        })
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

    exit() {
        this._state = "exit";
        this.update();
    }

    return() {
        this._state = "return";
        this.update();
        this._state = "inactive";
        this.update();
    }
}   

const gameState = new GameState();


export default gameState