//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class LocationPickerModalLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly titleLanguageItemName: string = `Title`;
    public readonly subtitleLanguageItemName: string = `Subtitle`;
    public readonly setLocationLanguageItemName: string = `SetLocation`;

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
        this.set(this.titleLanguageItemName, { language: `en`, value: `Location picker` }, { language: `uk`, value: `UK: Location picker` }, { language: `sv`, value: `Platsväljare` }, { language: `ru`, value: `RU: Location picker` }, { language: `pl`, value: `PL: Location picker` }, { language: `nb`, value: `Location picker` }, { language: `fi`, value: `Sijaintivalitsin` }, { language: `da`, value: `Location picker` },);
        this.set(this.subtitleLanguageItemName, { language: `en`, value: `Choose location on map` }, { language: `uk`, value: `Оберіть місце на мапі` }, { language: `sv`, value: `Välj plats på kartan` }, { language: `ru`, value: `RU: Choose location on map` }, { language: `pl`, value: `PL: Choose location on map` }, { language: `nb`, value: `Choose location on map` }, { language: `fi`, value: `Valitse sijainti kartalla` }, { language: `da`, value: `Choose location on map` },);
        this.set(this.setLocationLanguageItemName, { language: `en`, value: `Set location` }, { language: `uk`, value: `Оберіть адресу` }, { language: `sv`, value: `SV: Set location` }, { language: `ru`, value: `RU: Set location` }, { language: `pl`, value: `Ställ in plats` }, { language: `nb`, value: `Set location` }, { language: `fi`, value: `Aseta sijainti` }, { language: `da`, value: `Set location` },);
    }

    /**
    /* "Title" (Location picker)
    */
    public get title() : string {
        return this.get(this.titleLanguageItemName);
    }

    /**
    /* "Subtitle" (Choose location on map)
    */
    public get subtitle() : string {
        return this.get(this.subtitleLanguageItemName);
    }

    /**
    /* "SetLocation" (Set location)
    */
    public get setLocation() : string {
        return this.get(this.setLocationLanguageItemName);
    }
}

//Singleton
export default new LocationPickerModalLocalizer();