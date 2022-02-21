//Autogenerated

import {BaseComponentLocalizer} from "@weare/reapptor-react-common";

class LayoutLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly fourColumnsLanguageItemName: string = `FourColumns`;
    public readonly oneColumnLanguageItemName: string = `OneColumn`;
    public readonly inlineLanguageItemName: string = `Inline`;
    public readonly threeColumnsLanguageItemName: string = `ThreeColumns`;
    public readonly twoColumnsLanguageItemName: string = `TwoColumns`;

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
        this.set(this.fourColumnsLanguageItemName, { language: `en`, value: `` }, { language: `uk`, value: `` }, { language: `nb`, value: `` }, { language: `da`, value: `` },);
        this.set(this.oneColumnLanguageItemName, { language: `en`, value: `` }, { language: `uk`, value: `` }, { language: `nb`, value: `` }, { language: `da`, value: `` },);
        this.set(this.inlineLanguageItemName, { language: `en`, value: `` }, { language: `uk`, value: `` }, { language: `nb`, value: `` }, { language: `da`, value: `` },);
        this.set(this.threeColumnsLanguageItemName, { language: `en`, value: `` }, { language: `uk`, value: `` }, { language: `nb`, value: `` }, { language: `da`, value: `` },);
        this.set(this.twoColumnsLanguageItemName, { language: `en`, value: `` }, { language: `uk`, value: `` }, { language: `nb`, value: `` }, { language: `da`, value: `` },);
    }

    /**
    /* "FourColumns" ()
    */
    public get fourColumns() : string {
        return this.get(this.fourColumnsLanguageItemName);
    }

    /**
    /* "OneColumn" ()
    */
    public get oneColumn() : string {
        return this.get(this.oneColumnLanguageItemName);
    }

    /**
    /* "Inline" ()
    */
    public get inline() : string {
        return this.get(this.inlineLanguageItemName);
    }

    /**
    /* "ThreeColumns" ()
    */
    public get threeColumns() : string {
        return this.get(this.threeColumnsLanguageItemName);
    }

    /**
    /* "TwoColumns" ()
    */
    public get twoColumns() : string {
        return this.get(this.twoColumnsLanguageItemName);
    }
}

//Singleton
export default new LayoutLocalizer();