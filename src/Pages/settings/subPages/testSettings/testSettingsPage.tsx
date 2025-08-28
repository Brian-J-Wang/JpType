import { SettingContextProvider } from "../../components/settingContextProvider/settingContextProvider";
import SettingGroup from "../../components/settingGroup/settingGroup";
import SettingProperty from "../../components/settingProperty";
import HiriganaGroupSelector from "./components/hiriganaGroupSelector";
import TestSettingLocalStorageContext from "./testSettingLocalStorageContext";

const TestSettingPage: React.FC = (props) => {
    return (
        <SettingContextProvider context={TestSettingLocalStorageContext}>
            <SettingProperty name={"Test Length"} description={"The length of the test measured in characters. Each kanji character, if enabled, counts as a single character."}>
                <SettingProperty.NumberInput identifier="length" min={1} max={Number.MAX_VALUE}/>
            </SettingProperty>
            <SettingGroup groupName={"Hirigana"}>
                <SettingProperty name={"Enabled"} description={""}>
                    <SettingProperty.Toggle identifier="hirigana.enabled"/>
                </SettingProperty>
                <SettingProperty alignment={"column"} name={"Allowed Characters"} description={"Which groups of characters should show up on each test."}>
                    <HiriganaGroupSelector/>
                </SettingProperty>
            </SettingGroup>
        </SettingContextProvider>
    )
}

export default TestSettingPage;

