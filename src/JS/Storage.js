//wrapper classes to allow other classes to listen when a value is changed;
class Storage {
    #values = {};

    //values are included to ensure there's no incorrect callbacks for the 
    //wrong storage values;
    constructor( values ) {
        values.forEach(value => {
            this.#values[value] = [];
        })

        console.log(this.#values);
    }

    addListener(key, funct) {
        if (this.invalidKey(key)) {
            return;
        }

        this.#values[key].push(funct);
    }

    set(key, value) {
        if (this.invalidKey(key)) {
            return;
        }

        localStorage.setItem(key, value);

        this.#values[key].forEach(funct => {
            funct();
        })
    }

    get(key) {
        if (this.invalidKey(key)) {
            return;
        }

        return localStorage.getItem(key);
    }

    clear() {
        this.#values.forEach(value => {
            localStorage.removeItem(value);
        })
    }

    invalidKey(key) {
        if (this.#values[key] == null) {
            console.error(`"${key}" is an invalid key`);
            return true;
        }

        else return false;
    }
}

export default Storage;