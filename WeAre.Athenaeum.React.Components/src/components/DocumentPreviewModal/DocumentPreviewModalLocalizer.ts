//Autogenerated
import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class DocumentPreviewModalLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly previewLanguageItemName: string = `Preview`;
    public readonly downloadLanguageItemName: string = `Download`;

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
        this.set(this.previewLanguageItemName, { language: `en`, value: `Preview` }, { language: `uk-ua`, value: `UK-UA: Preview` }, { language: `sv`, value: `Förhandsvisning` }, { language: `ru`, value: `RU: Preview` }, { language: `pl`, value: `PL: Preview` }, { language: `fi`, value: `Esikatselu` },);
        this.set(this.downloadLanguageItemName, { language: `en`, value: `Download` }, { language: `uk-ua`, value: `UK-UA: Download` }, { language: `sv`, value: `SV: Download` }, { language: `ru`, value: `RU: Download` }, { language: `pl`, value: `PL: Download` }, { language: `fi`, value: `FI: Download` },);
    }

    /**
    /* "Preview" (Preview)
    */
    public get preview() : string {
        return this.get(this.previewLanguageItemName);
    }

    /**
    /* "Download" (Download)
    */
    public get download() : string {
        return this.get(this.downloadLanguageItemName);
    }
}

//Singleton
export default new DocumentPreviewModalLocalizer();