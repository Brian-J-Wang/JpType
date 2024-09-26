import './kanaCard.css'

import { useState } from "react";
import charSet from '../../../JS/charSet';

import KanaSubCard from './kanaSubCard';
import check from '../../../assets/check.svg'
import cross from '../../../assets/cross.svg'

function KanaCard(props) {
    const [isActive, setIsActive] = useState(props.initialState);
    const [kanaData, setKanaData] = useState(getKanaData());
    const [isAdvance, setIsAdvance] = useState(false);

    const [kanaSubGroups, setKanaSubGroups] = useState(charSet.getValidCharSetGroup(props.dbname));

    function getKanaData() {
        return charSet.getKanaSet(props.dbname);
    }

    return (
        <div className={`kana ${isAdvance ? 'kana__state_active' : ''}`}>
            <div className="kana__title-card">
                <div className="kana__title-card-left" onClick={() => { setIsActive(!isActive) }}>
                    <img src={kanaData.enabled ? check : cross} alt={kanaData.enabled} className="kana__state-image"/>
                    <h1 className="kana__kana-name">{props.name}</h1>
                </div>
                <button className={`kana__advanced ${isAdvance ? 'kana__advanced__state_active' : ''}`} onClick={() => {setIsAdvance(!isAdvance)}}>advanced</button>
            </div>
            <div className="kana__subGroup" hidden={!isAdvance}>
                {
                    kanaSubGroups.map((subGroup) => {
                        return (<KanaSubCard key={subGroup} name={subGroup} dbname={props.dbname}/>)
                    })
                }
            </div>
        </div>
    )
}

export default KanaCard;