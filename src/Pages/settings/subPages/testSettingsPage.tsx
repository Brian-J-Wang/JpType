import SettingInput from "../components/settingInputs/settingInput";

const TestSettingPage: React.FC = (props) => {
    return (<>
        <SettingInput name={"Character Count"} localStorageName={"characterCount"} localStorageDefaultValue={10} type={"number"}>
            <SettingInput.description>
                The number of characters to run on the test
            </SettingInput.description>
        </SettingInput>
    </>)
}

export default TestSettingPage;

