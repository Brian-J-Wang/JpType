import Hirigana from '../assets/hirigana.json';
import { storage } from '../Components/Settings/settingData';

class CharacterSet {
    _validCharGroup = [];
    _characterList = [];
    _listLength = 10;

    constructor() {
        //TODO: get character group from local storage in the future;
        this._validCharGroup = [
            "gojuon"
        ];

        this._characterList = this.getCharacterList();
        this._listLength = storage.get("Character Count");

        storage.addListener("Character Count", (value) => {
            this._listLength = value;
        });
        //TODO: add listener when character filtering gets added;
    }

    getCharacterList() {
        this._validCharGroup.forEach(group => {
            this._characterList.push(Hirigana[group]);
        })

        return this._characterList.flat();
    }

    //return a randomly generated list from characterList;
    shuffle() {
        const output = [];

        for (let i = 0; i < this._listLength; i++) {
            const index = Math.floor(Math.random() * this._characterList.length);
            output.push(this._characterList[index]);
        }

        return output;
    }
}

const charSet = new CharacterSet();
export default charSet;