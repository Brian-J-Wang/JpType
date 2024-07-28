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
    complete: [],
    reset: []
}

class GameState {
    constructor() {
        this.state = "inactive"
    }

    setState(state) {
        if (validStates.includes(state)) {
            this.state = state;
            this.update();
        } else {
            console.error("trying to change into an invalid state");
        }
    }

    update() {
        functionCalls[this.state].forEach(element => {
            element();
        });
    }

    onGameInactive(funct) {
        functionCalls.inactive.push(funct);
    }

    onGameActive(funct) {
        functionCalls.active.push(funct);
    }

    onGamePaused(funct) {
        functionCalls.paused.push(funct);
    }

    onGameComplete(funct) {
        functionCalls.complete.push(funct);
    }

    reset() {
        this.setState("reset");
        this.update();
        this.setState("inactive");
        this.update(); 
    }

    onGameReset(funct) {
        functionCalls.reset.push(funct);
    }
}

const gameState = new GameState();

export default gameState