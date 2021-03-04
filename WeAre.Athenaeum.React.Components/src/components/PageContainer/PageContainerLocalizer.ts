//Autogenerated
import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class PageContainerLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly pageHelpLanguageItemName: string = `PageHelp`;

    constructor() {

        super(
            [
                { code: "en", label: "English" },
                { code: "fi", label: "Suomi" },
                { code: "pl", label: "Polski" },
                { code: "ru", label: "Русский" },
                { code: "sv", label: "Svenska" },
                { code: "uk", label: "Українська (Україна)" }
            ],
            "en");
        
        //Initializer
        this.set(this.pageHelpLanguageItemName, { language: `en`, value: `Page help` }, { language: `uk-ua`, value: `UK-UA: Page help` }, { language: `sv`, value: `Sidhjälp` }, { language: `ru`, value: `Справка` }, { language: `pl`, value: `PL: Page help` }, { language: `fi`, value: `Sivun ohje` },);
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