import { useContext, useState } from "react";
import { SettingContext } from "../../../components/settingContextProvider/settingContext";
import { TestSettingContextType } from "../testSettingLocalStorageContext";
import Hirigana from "@src/assets/hirigana.json";
import GroupSelector from "./groupSelector/groupSelector";

import styles from "./hiriganaGroupSelector.module.css";

type HiriganaGroups = TestSettingContextType["hirigana"]["allowedGroups"][number];

const HiriganaGroupSelector: React.FC = (props) => {

    const settingContext = useContext(SettingContext);
    const [ allowedList, setAllowedList ] = useState<TestSettingContextType["hirigana"]["allowedGroups"]>(settingContext.getProperty("hirigana.allowedGroups"))

    const handleClick = (group: HiriganaGroups) => {
        return () => {
            let filteredOut = false;

            const newList = allowedList.filter((element) => {
                if ( element == group ) {
                    filteredOut = true;
                    return false;
                } else {
                    return true;
                }
            });

            if (!filteredOut) {
                newList.push(group);
            }

            settingContext.setProperty("hirigana.allowedGroups", newList);
            setAllowedList(newList);
        }
    }

    const shouldBeActive = (group: HiriganaGroups) => {
        return allowedList.includes(group);
    }

    const getRandomCharacters = (group: HiriganaGroups) => {
        const result = [];
        
        const length = Hirigana[group].length;
        for (let i = 0; i < 5; i++ ){
            result.push(Hirigana[group][Math.floor(Math.random() * length)].jp);
        }

        return result;
    }

    return (
        <div className={styles.body}>
            <GroupSelector title={"Gojuon"} subtitle={"五十音"} isActive={shouldBeActive("gojuon")} onClick={handleClick("gojuon")}>
                <small>
                    The basic hirigana called the 50 sounds (though it actually contains around 46 characters)
                </small>
            </GroupSelector>
            <GroupSelector title={"Dakuon"} subtitle={"濁音"} isActive={shouldBeActive("dakuon")} onClick={handleClick("dakuon")}>
                <small>
                    Hirigana with the "dakuten" mark, which looks like a double qoute.
                </small>
            </GroupSelector>
            <GroupSelector title={"Han-dakuon"} subtitle={"半濁音"} isActive={shouldBeActive("han-dakuon")} onClick={handleClick("han-dakuon")}>
                <small>
                    Hirigana with the "handakuten" mark, which is a small circle.
                </small>
            </GroupSelector>
            <GroupSelector title={"Yoon"} subtitle={"拗音"} isActive={shouldBeActive("yoon")} onClick={handleClick("yoon")}>
                <small>
                    Compound characters with smaller ゃ, ゅ, or ょ attached to each character
                </small>
            </GroupSelector>
        </div>
    )
}

export default HiriganaGroupSelector