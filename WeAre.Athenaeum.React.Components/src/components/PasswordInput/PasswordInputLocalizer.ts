//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class PasswordInputLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly helpTextLengthLanguageItemName: string = `HelpText.Length`;

    constructor() {

        super(
            [
                { code: "en", label: "English" },
                { code: "da", label: "Dansk" },
                { code: "fi", label: "Suomi" },
                { code: "nb", label: "Norsk bokmål" },
                { code: "pl", label: "Polski" },
                { code: "ru", label: "Русский" },
                { code: "sv", label: "Svenska" },
                { code: "uk", label: "Українська" }
            ],
            "en");
        
        //Initializer
        this.set(this.helpTextLengthLanguageItemName, { language: `en`, value: `at least 8 characters long` }, { language: `uk`, value: `Не менше 8 символів` }, { language: `sv`, value: `åtminstone 8 tecken` }, { language: `ru`, value: `RU: at least 8 characters long` }, { language: `pl`, value: `PL: at least 8 characters long` }, { language: `nb`, value: `NB: at least 8 characters long` }, { language: `fi`, value: `vähintään 8 merkkiä` }, { language: `da`, value: `DA: at least 8 characters long` },);
    }

    /**
    /* "HelpText.Length" (at least 8 characters long)
    */
    public get helpTextLength() : string {
        return this.get(this.helpTextLengthLanguageItemName);
    }
}

//Singleton
export default new PasswordInputLocalizer();