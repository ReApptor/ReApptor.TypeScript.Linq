//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class FileInputLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly dragAndDropLanguageItemName: string = `DragAndDrop`;
    public readonly readonlyLanguageItemName: string = `Readonly`;
    public readonly chooseFileLanguageItemName: string = `ChooseFile`;
    public readonly previewLanguageItemName: string = `Preview`;

    constructor() {

        super(
            [
                { code: "en", label: "English" },
                { code: "fi", label: "Suomi" },
                { code: "pl", label: "Polski" },
                { code: "ru", label: "Русский" },
                { code: "sv", label: "Svenska" },
                { code: "uk", label: "Українська" }
            ],
            "en");
        
        //Initializer
        this.set(this.dragAndDropLanguageItemName, { language: `en`, value: `Drag'n'drop file here, or click to select` }, { language: `uk`, value: `Перетягніть файл, або оберіть його` }, { language: `sv`, value: `dra och släpp filen här, eller välj med att klicka` }, { language: `ru`, value: `RU: Drag'n'drop file here, or click to select` }, { language: `pl`, value: `PL: Drag'n'drop file here, or click to select` }, { language: `fi`, value: `Pudota tiedosto tähän tai valitse klikkaamalla` },);
        this.set(this.readonlyLanguageItemName, { language: `en`, value: `File is readonly` }, { language: `uk`, value: `UK: File is readonly` }, { language: `sv`, value: `Filen är bara läsbar` }, { language: `ru`, value: `RU: File is readonly` }, { language: `pl`, value: `PL: File is readonly` }, { language: `fi`, value: `Tämä tiedosto on vain luettavissa` },);
        this.set(this.chooseFileLanguageItemName, { language: `en`, value: `Choose file` }, { language: `uk`, value: `Оберіть файл` }, { language: `sv`, value: `Välj fil` }, { language: `ru`, value: `RU: Choose file` }, { language: `pl`, value: `PL: Choose file` }, { language: `fi`, value: `Valitse tiedosto` },);
        this.set(this.previewLanguageItemName, { language: `en`, value: `Preview` }, { language: `uk`, value: `Переглянути` }, { language: `sv`, value: `Förhandsvisning` }, { language: `ru`, value: `RU: Preview` }, { language: `pl`, value: `PL: Preview` }, { language: `fi`, value: `Esikatselu` },);
    }

    /**
    /* "DragAndDrop" (Drag'n'drop file here, or click to select)
    */
    public get dragAndDrop() : string {
        return this.get(this.dragAndDropLanguageItemName);
    }

    /**
    /* "Readonly" (File is readonly)
    */
    public get readonly() : string {
        return this.get(this.readonlyLanguageItemName);
    }

    /**
    /* "ChooseFile" (Choose file)
    */
    public get chooseFile() : string {
        return this.get(this.chooseFileLanguageItemName);
    }

    /**
    /* "Preview" (Preview)
    */
    public get preview() : string {
        return this.get(this.previewLanguageItemName);
    }
}

//Singleton
export default new FileInputLocalizer();