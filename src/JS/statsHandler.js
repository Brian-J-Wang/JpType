import gameData from "./gameData";
import gameState from "./gameState";

const statList = [
    {
        statName: "CPM",
        value: "----",
        desc: "Characters per minute",
        updateValue: function () { //requires: totalChar, totalTime
            const seconds = gameData.getValue("totalTime");
            const CPM = gameData.getValue("charCount") * (60 / seconds);
            this.value = Number.parseFloat(CPM).toFixed(1);
        }
    },
    {
        statName: "Errors",
        value: "----",
        desc: "errors committed in this run",
        updateValue: function () { //requires: totalError
            this.value = gameData.getValue("errorCount");
        }
    },
    {
        statName: "Consistency",
        value: "----",
        desc: "(number of words - errors) / number of words",
        updateValue: function () { //requiresL totalError, totalChar
            const totalChar = gameData.getValue("charCount");
            const totalError = gameData.getValue("errorCount");
            const consistancy = Number.parseFloat(((totalChar - totalError) / totalChar) * 100).toFixed(1);
            this.value = `${consistancy}%`;
        }
    }
]


class statHandler {
    constructor() {
        gameState.onGameComplete(() => {
            statList.forEach((stat) => {
                stat.updateValue();
            })
        })

        gameState.onGameReset(() => {
            statList.forEach((stat) => {
                stat.value = "----"
            })
        })
    }

    get() {
        const copy = statList.map((element) => {
            return {
                statName: element.statName,
                value: element.value,
                desc: element.desc
            };
        });

        return copy;
    }
}

const stathandle = new statHandler();

export default stathandle;