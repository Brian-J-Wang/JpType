import { sessionCharacterLengthLSContext, showProgressBarLSContext, showTimerLSContext } from "../../../Contexts/useLocalStorageContexts"
import SettingInput from "../components/settingInputs/settingInput"

const GeneralSettingsPage: React.FC = () => {
    return (
        <div>
            <SettingInput name={"Character Count"} localStorageContext={sessionCharacterLengthLSContext} type={"number"}>
                <SettingInput.description>
                    The number of characters to run on the test
                </SettingInput.description>
            </SettingInput>
            <SettingInput name="Show Progress Bar" localStorageContext={showProgressBarLSContext} type={"switch"}>
                <SettingInput.description>
                    Displays the progress bar on the bottom of the typing test.
                </SettingInput.description>
            </SettingInput>
            <SettingInput name="Show Timer" localStorageContext={showTimerLSContext} type={"switch"}>
                <SettingInput.description>
                    Displays the timer on the bottom right of the typing test. It does not stop the user from being timed.
                </SettingInput.description>
            </SettingInput>
        </div>
    )
}

export default GeneralSettingsPage