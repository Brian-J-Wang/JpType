import { WithSubComponents } from "../../../../types/withSubComponents";
import NumberInput from "./controls/numberInput/numberInput";
import Toggle from "./controls/toggle/toggle";
import Base from "./settingProperty";

const SettingProperty = Base as WithSubComponents<typeof Base, {
    Toggle: typeof Toggle,
    NumberInput: typeof NumberInput
}>

SettingProperty.Toggle = Toggle;
SettingProperty.NumberInput = NumberInput;

export default SettingProperty;