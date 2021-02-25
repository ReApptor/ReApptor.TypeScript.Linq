//Autogenerated
import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class VirtualAddressDividerLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly streetLanguageItemName: string = `Street`;
    public readonly cityLanguageItemName: string = `City`;
    public readonly postalcodeLanguageItemName: string = `Postalcode`;

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
        this.set(this.streetLanguageItemName, { language: `en`, value: `Street` }, { language: `sv`, value: `Gata` }, { language: `ru`, value: `RU: Street` }, { language: `pl`, value: `PL: Street` }, { language: `fi`, value: `Katu` },);
        this.set(this.cityLanguageItemName, { language: `en`, value: `City` }, { language: `sv`, value: `Stad` }, { language: `ru`, value: `RU: City` }, { language: `pl`, value: `PL: City` }, { language: `fi`, value: `Kaupunki` },);
        this.set(this.postalcodeLanguageItemName, { language: `en`, value: `Postal code` }, { language: `sv`, value: `Postnummer` }, { language: `ru`, value: `RU: Postal code` }, { language: `pl`, value: `PL: Postal code` }, { language: `fi`, value: `Postinumero` },);
    }

    /**
    /* "Street" (Street)
    */
    public get street() : string {
        return this.get(this.streetLanguageItemName);
    }

    /**
    /* "City" (City)
    */
    public get city() : string {
        return this.get(this.cityLanguageItemName);
    }

    /**
    /* "Postalcode" (Postal code)
    */
    public get postalcode() : string {
        return this.get(this.postalcodeLanguageItemName);
    }
}

//Singleton
export default new VirtualAddressDividerLocalizer();