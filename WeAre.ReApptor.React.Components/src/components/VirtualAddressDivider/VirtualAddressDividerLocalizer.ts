//Autogenerated

import {BaseComponentLocalizer} from "@weare/reapptor-react-common";

class VirtualAddressDividerLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly streetLanguageItemName: string = `Street`;
    public readonly cityLanguageItemName: string = `City`;
    public readonly postalcodeLanguageItemName: string = `Postalcode`;

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
        this.set(this.streetLanguageItemName, { language: `en`, value: `Street` }, { language: `uk`, value: `Вулиця` }, { language: `sv`, value: `Gata` }, { language: `ru`, value: `Улица` }, { language: `pl`, value: `Ulica` }, { language: `nb`, value: `Gate` }, { language: `fi`, value: `Katu` }, { language: `da`, value: `Gade` },);
        this.set(this.cityLanguageItemName, { language: `en`, value: `City` }, { language: `uk`, value: `Місто` }, { language: `sv`, value: `Stad` }, { language: `ru`, value: `Город` }, { language: `pl`, value: `Miasto` }, { language: `nb`, value: `By` }, { language: `fi`, value: `Kaupunki` }, { language: `da`, value: `By` },);
        this.set(this.postalcodeLanguageItemName, { language: `en`, value: `Postal code` }, { language: `uk`, value: `Поштовий індекс` }, { language: `sv`, value: `Postnummer` }, { language: `ru`, value: `Почтовый индекс` }, { language: `pl`, value: `Kod pocztowy` }, { language: `nb`, value: `Postnummer` }, { language: `fi`, value: `Postinumero` }, { language: `da`, value: `Postnummer` },);
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