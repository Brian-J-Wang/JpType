import { Scaffold  } from "../settingBuilders";
import "./characterSelection.css";
import "../../../assets/JPType.css";
import KanaCard from "./kanaCard";

export function characterSelection(settings) {
    return (
        <Scaffold key={settings.name} name={settings.name} desc={settings.description} direction='v'>
            <CharacterSelection settings={settings}/>
        </Scaffold>
    )
}

function CharacterSelection(props) {



    return (
        <div className="char-select">
            <KanaCard initialState={false} name="Hirigana" dbname="hirigana"></KanaCard>
            <KanaCard initialState={false} name="Katakana" dbname="katakana"></KanaCard>
        </div>
    );
}