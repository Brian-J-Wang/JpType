import { useCallback, useContext } from "react"
import settingContext from "./settingsContext"
import { settings } from "./settingData.js";


function SettingGroup(props) {
    const setting = useContext(settingContext);

    return (
        <>
            {
                settings[setting.settingTab].map(item => {
                    return item.builder();
                })
            }
        </>
    )
}

export default SettingGroup