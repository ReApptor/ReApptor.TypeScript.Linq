//Autogenerated

import {Language} from "@weare/reapptor-toolkit";
import {BaseComponentLocalizer} from "@weare/reapptor-react-common";

class PageContainerLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly pageHelpLanguageItemName: string = `PageHelp`;

    constructor() {

        super(
            [
                new Language("en", "English"),
                new Language("da", "Dansk"),
                new Language("fi", "Suomi"),
                new Language("nb", "Norsk bokmål"),
                new Language("pl", "Polski"),
                new Language("ru", "Русский"),
                new Language("sv", "Svenska"),
                new Language("uk", "Українська")
            ],
            "en");
        
        //Initializer
        this.set(this.pageHelpLanguageItemName, { language: `en`, value: `Page help` }, { language: `uk`, value: `Довідка` }, { language: `sv`, value: `Sidhjälp` }, { language: `ru`, value: `Справка` }, { language: `pl`, value: `Pomoc strony` }, { language: `nb`, value: `Sidehjelp` }, { language: `fi`, value: `Sivun ohje` }, { language: `da`, value: `Hjælp til sider` },);
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