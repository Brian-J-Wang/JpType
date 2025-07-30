type elapsedTime = {
    minutes: number,
    seconds: number,
    ms: number
}
//time that passed in ms
export default class Stopwatch {
    private _elapsedTime: number;
    private _hasStarted: boolean;
    private _state: "standby" | "running" | "paused" | "complete";
    private _startTime: number;
    private _interval: number;

    constructor() {
        this._elapsedTime = 0; //measured in ms
        this._hasStarted = false;
        this._state = "standby";
    }

    getState() {
        return this._state;
    }

    start(fn: (elapsedTime: elapsedTime) => void, interval: number) {
        this._state = "running";
        this._startTime = Date.now();
        this._interval = setInterval(() => {
            fn(this.getElapsedTime());
        }, interval);
    }

    pause() {
        if (this._state != "running") {
            console.log('Timer called to pause in non-running state');
            return;
        }

        this._state = "paused";
        this._elapsedTime += Date.now() - this._startTime;
    }

    resume() {
        if (this._state != "paused") {
            console.log('Timer called to resume in non-paused state');
            return;
        }

        this._state = "running";
        this._startTime = Date.now();
    }

    end() {
        this._state = "complete";
        this._elapsedTime += Date.now() - this._startTime;
        clearInterval(this._interval);
    }

    reset() {
        this._elapsedTime = 0;
        this._hasStarted = false;
        this._state = "standby";
    }

    //returns json file that includes minutes / seconds / 
    getElapsedTime() {
        let elapsedTime = 0;
        if (this._state == "running") {
            elapsedTime = this._elapsedTime + (Date.now() - this._startTime);
        } else {
            elapsedTime = this._elapsedTime;
        }

        const ms = elapsedTime % 1000;
        elapsedTime = Math.floor(elapsedTime / 1000);
        const seconds = elapsedTime % 60;
        elapsedTime = Math.floor(elapsedTime / 60);
        const minutes = elapsedTime;
        return {
            minutes: minutes,
            seconds: seconds,
            ms: ms
        }
    }

    getElaspedTimeSeconds() {
        let elapsedTime = 0;
        if (this._state == "running") {
            elapsedTime = this._elapsedTime + (Date.now() - this._startTime);
        } else {
            elapsedTime = this._elapsedTime;
        }

        return elapsedTime / 1000;
    }
}