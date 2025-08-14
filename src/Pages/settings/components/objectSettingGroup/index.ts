import ObjectSettingGroup, { ObjectSettingGroupType } from "./objectSettingGroup";
import ObjectSettingProperty, { ObjectSettingPropertyType } from "./objectSettingProperty";
import ObjectSettingSubGroup, { ObjectSettingSubGroupType } from "./objectSettingSubGroup";

type ObjectSettingType = React.FC<ObjectSettingGroupType> & {
    SubGroup: React.FC<ObjectSettingSubGroupType>;
    Property: React.FC<ObjectSettingPropertyType>
}

//@ts-ignore
let ObjectSetting: ObjectSettingType = ObjectSettingGroup;

ObjectSetting.SubGroup = ObjectSettingSubGroup;

ObjectSetting.Property = ObjectSettingProperty;