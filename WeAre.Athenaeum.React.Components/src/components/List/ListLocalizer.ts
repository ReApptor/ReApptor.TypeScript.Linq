//Autogenerated
import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class ListLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly loadingLanguageItemName: string = `Loading`;

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
        this.set(this.loadingLanguageItemName, { language: `en`, value: `Loading...` }, { language: `sv`, value: `Laddar...` }, { language: `ru`, value: `Закрыть...` }, { language: `pl`, value: `PL: Loading...` }, { language: `fi`, value: `Ladataan...` },);
    }

    /**
    /* "Loading" (Loading...)
    */
    public get loading() : string {
        return this.get(this.loadingLanguageItemName);
    }
}

//Singleton
export default new ListLocalizer();