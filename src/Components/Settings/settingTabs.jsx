import { useContext} from "react"
import settingContext from "./settingsContext"
import settings from "./settingData";

function SettingTabs(props) {

    const { settingTab, setSettingTab } = useContext(settingContext);

    return(
        <> 
        {
            Object.keys(settings).map(tab => {
                return <label key={tab} htmlFor={tab} className='settings__group-name'>
                    <input type="radio" id={tab} name="setting-group" value={tab} 
                    className='settings__radio-input' defaultChecked={tab} onClick={() => {setSettingTab(tab)}}/>
                    {tab}
                </label>
            })
        }
        </>
    )
}

export default SettingTabs;