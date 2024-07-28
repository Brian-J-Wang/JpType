class gameDataHandler {
    constructor(structure) {
        this.structure = {}
        this.structure = Object.assign(this.structure, structure);
    }

    setValue(key, value) {
        if (Object.keys(this.structure).includes(key)) {
            this.structure[key] = value;
        } else {
            console.error(`trying to update non-existant value=${key}`);
        }
    }

    updateValue(key, updater) {
        if (Object.keys(this.structure).includes(key)) {
            this.structure[key] = updater(this.structure[key]);
        } else {
            console.error(`trying to update non-existant value=${key}`);
        }
    }

    getValue(key) {
        if (Object.keys(this.structure).includes(key)) {
            return this.structure[key];
        } else {
            console.error("trying to access non-existant value");
        }
    }

    getValues() {
        return this.structure;
    }

    resetValues() {
        Object.keys(this.structure).forEach(element => {
            this.structure[element] = 0;
        });
    }
}

export default gameDataHandler;