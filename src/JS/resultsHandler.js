class resultsHandler {
    constructor() {
        this.results = [
            {
                statName: "CPM",
                value: "----",
                desc: "characters per minute",
                updateValue: function (data) { //requires: totalChar, totalTime
                    const seconds = (data.totalTime.minutes * 60) + (data.totalTime.seconds) + (data.totalTime.ms / 1000);
                    const CPM = data.totalChar * (60 / seconds);
                    this.value = Number.parseFloat(CPM).toFixed(1);
                }
            },
            {
                statName: "Errors",
                value: "----",
                desc: "errors committed in this run",
                updateValue: function (data) { //requires: totalError
                    this.value = data.totalError;
                }
            },
            {
                statName: "Consistency",
                value: "----",
                desc: "(number of words - errors) / number of words",
                updateValue: function (data) { //requiresL totalError, totalChar
                    const consistancy = Number.parseFloat(((data.totalChar - data.totalError) / data.totalChar) * 100).toFixed(1);
                    this.value = `${consistancy}%`;
                }
            }
        ]
    }

    get() {
        const copy = this.results.map((element) => {
            return element;
        });

        return copy;
    }

    /*
    Data requires these values:
    {
        totalTime: time it took to finish the typing test
        totalChar: total characters in the typing test
        totalError: total errors in the typing test
    }
    */

    update(data) {
        const copy = this.results.map(element => {
            const elementCopy = {};
            Object.assign(elementCopy, element);
            elementCopy.updateValue(data);

            return elementCopy;
        });

        return copy;
    }
}

export default resultsHandler