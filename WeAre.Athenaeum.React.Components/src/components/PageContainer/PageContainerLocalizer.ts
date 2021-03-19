//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class PageContainerLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly pageHelpLanguageItemName: string = `PageHelp`;

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
        this.set(this.pageHelpLanguageItemName, { language: `en`, value: `Page help` }, { language: `uk`, value: `Довідка` }, { language: `sv`, value: `Sidhjälp` }, { language: `ru`, value: `Справка` }, { language: `pl`, value: `PL: Page help` }, { language: `nb`, value: `Page help` }, { language: `fi`, value: `Sivun ohje` }, { language: `da`, value: `Page help` },);
    }

    /**
    /* "PageHelp" (Page help)
    */
    public get pageHelp() : string {
        return this.get(this.pageHelpLanguageItemName);
    }
}

//Singleton
export default new PageContainerLocalizer();