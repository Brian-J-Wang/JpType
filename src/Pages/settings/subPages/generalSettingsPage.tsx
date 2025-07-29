import SettingInput from "../components/settingInputs/settingInput"

const GeneralSettingsPage: React.FC = () => {
    return (
        <div>
            <SettingInput name="Show Progress Bar" localStorageName={"showProgressBar"} localStorageDefaultValue={true} type={"switch"}>
                <SettingInput.description>
                    Displays the progress bar on the bottom of the typing test.
                </SettingInput.description>
            </SettingInput>
            <SettingInput name="Show Timer" localStorageName="showTimer" localStorageDefaultValue={true} type={"switch"}>
                <SettingInput.description>
                    Displays the timer on the bottom right of the typing test. It does not stop the user from being timed.
                </SettingInput.description>
            </SettingInput>
        </div>
    )
}

export default GeneralSettingsPage