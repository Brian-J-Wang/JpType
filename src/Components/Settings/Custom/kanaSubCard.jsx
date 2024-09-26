import { useState } from "react";
import charSet from "../../../JS/charSet";

import "./kanaSubCard.css"


function KanaSubCard(props) {
    const [isActive, setIsActive] = useState(true);
    const [subCharacters, setSubCharacters] = useState(getCharacters());

    function changeState() {
        setIsActive(!isActive);

        //update the state in the characterSelection as well;
    }

    function getCharacters() {
        return " ";
    }
    
    return (
        <div className="subCard">
            <button className={`subCard__major ${!isActive && 'subCard__major__state_inactive'}`}
            onClick={changeState}>{props.name}</button>
        </div>
    )
}

export default KanaSubCard;