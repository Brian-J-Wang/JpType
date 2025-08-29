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
            <GroupSelector title={"gojoun"} isActive={shouldBeActive("gojuon")} onClick={handleClick("gojuon")}>
                {getRandomCharacters("gojuon")}
            </GroupSelector>
            <GroupSelector title={"dakuon"} isActive={shouldBeActive("dakuon")} onClick={handleClick("dakuon")}>
                {getRandomCharacters("dakuon")}
            </GroupSelector>
            <GroupSelector title={"han-dakuon"} isActive={shouldBeActive("han-dakuon")} onClick={handleClick("han-dakuon")}>
                {getRandomCharacters("han-dakuon")}
            </GroupSelector>
            <GroupSelector title={"yoon"} isActive={shouldBeActive("yoon")} onClick={handleClick("yoon")}>
                {getRandomCharacters("yoon")}
            </GroupSelector>
        </div>
    )
}

export default HiriganaGroupSelector