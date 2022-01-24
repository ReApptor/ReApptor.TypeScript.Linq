//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class AddressInputLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly validatorsCustomRequiredLanguageItemName: string = `Validators.Custom.Required`;

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
        this.set(this.validatorsCustomRequiredLanguageItemName, { language: `en`, value: `Type and select an address from the list` }, { language: `sv`, value: `Skriv och välj en adress i listan` }, { language: `pl`, value: `Wpisz i wybierz adres z listy` }, { language: `nb`, value: `Skriv inn og velg en adresse fra listen` }, { language: `fi`, value: `Kirjoita ja valitse osoite listasta` }, { language: `da`, value: `Skriv og vælg en adresse på listen` },);
    }

    /**
    /* "Validators.Custom.Required" (Type and select an address from the list)
    */
    public get validatorsCustomRequired() : string {
        return this.get(this.validatorsCustomRequiredLanguageItemName);
    }
}

//Singleton
export default new AddressInputLocalizer();