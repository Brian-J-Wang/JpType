import Hirigana from '../assets/hirigana.json';

const charGroupTemplate = {
    hirigana: {
        enabled: true,
        validCharSet: [
            "gojuon",
            "dakuon",
            "han-dakuon",
            "yoon"
        ],
        activeCharSet: [
            "gojuon"
        ],
        excludedChars: []
    },
    katakana: {
        enabled: false,
        validCharSet: [

        ]
    }
}

class CharacterSet {
    _characterList = [];
    _listLength = 50;

    constructor() {
        this._charGroups = this._getCharGroup();
        this._characterList = this.getCharacterList();
        this._listLength = 50;
        //TODO: add listener when character filtering gets added;
    }

    //gets the character groups from local storage, if there isn't it uses the default template
    _getCharGroup() {
        let charGroup = JSON.parse(localStorage.getItem("CharGroup"));
        console.log(charGroup);
        if (charGroup == undefined) {
            localStorage.setItem("CharGroup", JSON.stringify(charGroupTemplate));
            charGroup = charGroupTemplate;
        }

        return charGroup;
    }

    getCharacterList() {
        const excludedCharacters = [];
        console.log(this._charGroups);
        if (this._charGroups.hirigana.enabled) {
            this._charGroups.hirigana.activeCharSet.forEach(set => {
                this._characterList.push(Hirigana[set]);
            });

            excludedCharacters.push(this._charGroups.hirigana.excludedChars);
        }

        if (this._charGroups.katakana.enabled) {
            console.error("Katakana has not been enabled yet");
        }

        this._characterList = this._characterList.flat();

        if (excludedCharacters.length != 0) {
            console.error("excluded character function not implemented");
        }

        console.log(this._characterList);

        return this._characterList;
    }

    getCharSetData() {
        return this._charGroups;
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

    getValidCharSetGroup(kanaName) {
        return this._charGroups[kanaName].validCharSet;
    }

    getKanaSet(kanaName) {
        if (this._charGroups[kanaName] == undefined) {
            console.error(`Kanaset ${kanaName} is not found`);
        } else {
            return this._charGroups[kanaName];
        }
    }
}

const charSet = new CharacterSet();
export default charSet;