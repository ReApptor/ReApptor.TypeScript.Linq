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
                { code: "fi", label: "Suomi" },
                { code: "pl", label: "Polski" },
                { code: "ru", label: "Русский" },
                { code: "sv", label: "Svenska" }
            ],
            "en");
        
        //Initializer
        this.set(this.clearLanguageItemName, { language: `en`, value: `Clear` }, { language: `sv`, value: `Töm` }, { language: `ru`, value: `RU: Clear` }, { language: `pl`, value: `PL: Clear` }, { language: `fi`, value: `Tyhjennä` },);
        this.set(this.doneLanguageItemName, { language: `en`, value: `Done` }, { language: `sv`, value: `Färdig` }, { language: `ru`, value: `RU: Done` }, { language: `pl`, value: `PL: Done` }, { language: `fi`, value: `Valmis` },);
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