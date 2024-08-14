import { useCallback, useContext } from "react"
import settingContext from "./settingsContext"
import settings from "./settingData";


function SettingGroup(props) {
    const { settingTab: current } = useContext(settingContext);

    console.log(current);

    return (
        <>
            {
                settings[current].map(item => {
                    const initialValue = localStorage.getItem(item.name);
                    return item.builder(initialValue);
                })
            }
        </>
    )
}

export default SettingGroup