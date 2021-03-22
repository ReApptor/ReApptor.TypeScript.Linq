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
        this.set(this.previewLanguageItemName, { language: `en`, value: `Preview` }, { language: `uk`, value: `Переглянути` }, { language: `sv`, value: `Förhandsvisning` }, { language: `ru`, value: `RU: Preview` }, { language: `pl`, value: `PL: Preview` }, { language: `nb`, value: `Preview` }, { language: `fi`, value: `Esikatselu` }, { language: `da`, value: `Preview` },);
        this.set(this.downloadLanguageItemName, { language: `en`, value: `Download` }, { language: `uk`, value: `Завантажити` }, { language: `sv`, value: `SV: Download` }, { language: `ru`, value: `Загрузить` }, { language: `pl`, value: `PL: Download` }, { language: `nb`, value: `Download` }, { language: `fi`, value: `FI: Download` }, { language: `da`, value: `Download` },);
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