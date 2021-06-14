//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class SignatureWidgetLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly clearLanguageItemName: string = `Clear`;
    public readonly doneLanguageItemName: string = `Done`;

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
        this.set(this.clearLanguageItemName, { language: `en`, value: `Clear` }, { language: `uk`, value: `Очистити` }, { language: `sv`, value: `Töm` }, { language: `ru`, value: `Очистить` }, { language: `pl`, value: `Wyczyść` }, { language: `nb`, value: `NB: Clear` }, { language: `fi`, value: `Tyhjennä` }, { language: `da`, value: `DA: Clear` },);
        this.set(this.doneLanguageItemName, { language: `en`, value: `Done` }, { language: `uk`, value: `Завершити` }, { language: `sv`, value: `Färdig` }, { language: `ru`, value: `Завершить` }, { language: `pl`, value: `Gotowe` }, { language: `nb`, value: `NB: Done` }, { language: `fi`, value: `Valmis` }, { language: `da`, value: `DA: Done` },);
    }

    /**
    /* "Clear" (Clear)
    */
    public get clear() : string {
        return this.get(this.clearLanguageItemName);
    }

    /**
    /* "Done" (Done)
    */
    public get done() : string {
        return this.get(this.doneLanguageItemName);
    }
}

//Singleton
export default new SignatureWidgetLocalizer();