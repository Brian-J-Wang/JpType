import { SettingContextProvider } from "../../components/settingContextProvider/settingContextProvider";
import SettingProperty from "../../components/settingProperty";
import TestSettingLocalStorageContext from "./testSettingLocalStorageContext";

const TestSettingPage: React.FC = (props) => {
    return (
        <SettingContextProvider context={TestSettingLocalStorageContext}>
            <SettingProperty name={"Test Length"} description={"The length of the test measured in characters. Kanji, if enabled counts as a single character"}>
                <SettingProperty.NumberInput identifier="length"/>
            </SettingProperty>
        </SettingContextProvider>
    )
}

export default TestSettingPage;

