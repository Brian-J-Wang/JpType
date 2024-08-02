const settings = [
    {
        settingGroup: "General",
        children: [
            {
                characterCount: {
                    name: "Character Count",
                    description: "number of characters per run",
                    inputType: "textBox",
                    validation: /\d/,
                },
                characterSelection: {
                    name: "Character Selection",
                    description: "characters included in the test",
                    inputType: "checkBoxCards",
                    options: [
                        
                    ]
                }
            }
        ]
    },
    {
        settingGroup: "Appearance",
        children: [

        ]
    },
    {
        settingGroup: "Account",
        children: [

        ]
    }
]

export function useSettings() {
    return(
        <> 
        {
            settings.map(settingGroup => {
                return <label key={settingGroup.settingGroup} htmlFor={settingGroup.settingGroup} className='settings__group-name'>
                    <input type="radio" id={settingGroup.settingGroup} name="setting-group" value={settingGroup.settingGroup} className='settings__radio-input'/>
                    {settingGroup.settingGroup}
                </label>
            })
        }
        </>
    )
}

/*
                    <label for="general" className='settings__group-name'>
                        <input type="radio" id="general" name="setting-group" value="general" className='settings__radio-input'/>
                        General
                    </label>
                    <label for="appearance" className='settings__group-name'>
                        <input type="radio" id="appearance" name="setting-group" value="appearance" className='settings__radio-input'/>
                        Appearance
                    </label>    
                    <label for="account" className='settings__group-name'>
                        <input type="radio" id="account" name="setting-group" value="account" className='settings__radio-input'/>
                        Account
                    </label>
*/