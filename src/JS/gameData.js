/*structure blueprint
{
    name: initialvalue;
}
*/

/*this.structure blueprint
{
    name: {
        value: any
        index: number           //index is used to give a function a unique id, it is returned when a onValueUpdated function is called.
        onUpdate: [             //used for when any value needs to be tracked over it's lifetime, eg the progress bar percentage.
        {
            funct: function,
            id: number          //id is used to remove a function when needed, eg a component unmounts;
        }
        ]  
    }
}
*/
class GameData {
    constructor(structure) {
        this.structure = {};
        
        Object.keys(structure).forEach(key => {
            this.structure[key] = {
                value: structure[key],
                index: 0,
                onUpdate: []
            };
        });
    }

    onValueUpdated(key, funct) {

        if (!this.contains(key)) {
            console.error(`Key: ${key} does not exist`);
            return;
        }

        if (!this.structure[key].onUpdate.every((element) => {
            console.log(element.funct.toString());
            console.log(funct.toString());
            (element.funct.toString() == funct.toString())? false : true;
        })) {
            return;
        }

        const functionID = this.structure[key].index;
        this.structure[key].onUpdate.push({
                funct: funct,
                id: functionID
            }
        );

        this.structure[key].index++;

        return functionID;
    }

    addKeyValue(key, value) {
        if (this.contains(key)) {
            return;
        }

        this.structure[key] = {
            value: value,
            index: 0,
            onUpdate: []
        }
    }

    setValue(key, value) {
        if (!this.contains(key)) {
            console.error(`Key: ${key} does not exist`);
            return;
        }

        this.structure[key].value = value;
        this.structure[key].onUpdate.forEach(element => {
            
            element.funct(value);
        })
    }

    updateValue(key, updater) {
        if (!this.contains(key)) {
            console.error(`Key: ${key} does not exist`);
            return;
        }

        this.structure[key].value = updater(this.structure[key].value);
        this.structure[key].onUpdate.forEach(element => {
            element.funct(this.structure[key].value);
        })
    }

    getValue(key) {
        if (!this.contains(key)) {
            console.error(`Key: ${key} does not exist`);
            return;
        }

        return this.structure[key].value;
    }

    //returns an array of key-value pairs
    getValues() {
        return Object.keys(this.structure).map(key => {
            let scaffold = {};
            scaffold[key] = this.structure[key].value;

            return scaffold;
        });
    }

    resetValues() {
        Object.keys(this.structure).forEach(key => {
            this.structure[key].value = 0;
        });
    }

    clearOnUpdateFunction(key, functionID) {
        if (!this.contains(key)) {
            console.error(`Key: ${key} does not exist`);
            return;
        }

        this.structure[key].onUpdate = this.structure[key].onUpdate.filter(funct => {
            (funct.id == functionID) ? false : true;
        })
    }

    clearOnUpdateFunctions(key) {
        if (!this.contains(key)) {
            console.error(`Key: ${key} does not exist`);
            return;
        }

        Object.keys(this.structure).forEach(key => {
            this.structure[key].onUpdate = [];
        })
    }

    contains(key) {
        if (Object.keys(this.structure).includes(key)) {
            return true;
        } else {
            return false;
        }
    }
}

const gameData = new GameData({});

export default gameData;