//Autogenerated

import {Language} from "@weare/reapptor-toolkit";
import {BaseComponentLocalizer} from "@weare/reapptor-react-common";

class DocumentPreviewModalLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly previewLanguageItemName: string = `Preview`;
    public readonly downloadLanguageItemName: string = `Download`;

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
        this.set(this.previewLanguageItemName, { language: `en`, value: `Preview` }, { language: `uk`, value: `Переглянути` }, { language: `sv`, value: `Förhandsvisning` }, { language: `ru`, value: `Предпросмотр` }, { language: `pl`, value: `Podgląd` }, { language: `nb`, value: `Forhåndsvisning` }, { language: `fi`, value: `Esikatselu` }, { language: `da`, value: `Eksempel` },);
        this.set(this.downloadLanguageItemName, { language: `en`, value: `Download` }, { language: `uk`, value: `Завантажити` }, { language: `sv`, value: `Ladda ner` }, { language: `ru`, value: `Загрузить` }, { language: `pl`, value: `Pobierz` }, { language: `nb`, value: `Last ned` }, { language: `fi`, value: `Lataa` }, { language: `da`, value: `Download` },);
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