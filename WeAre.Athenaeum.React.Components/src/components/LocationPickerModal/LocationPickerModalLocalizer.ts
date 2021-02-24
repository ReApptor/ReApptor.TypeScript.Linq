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
                { code: "fi", label: "Suomi" },
                { code: "pl", label: "Polski" },
                { code: "ru", label: "Русский" },
                { code: "sv", label: "Svenska" }
            ],
            "en");
        
        //Initializer
        this.set(this.titleLanguageItemName, { language: `en`, value: `Location picker` }, { language: `sv`, value: `Platsväljare` }, { language: `ru`, value: `RU: Location picker` }, { language: `pl`, value: `PL: Location picker` }, { language: `fi`, value: `Sijaintivalitsin` },);
        this.set(this.subtitleLanguageItemName, { language: `en`, value: `Choose location on map` }, { language: `sv`, value: `Välj plats på kartan` }, { language: `ru`, value: `RU: Choose location on map` }, { language: `pl`, value: `PL: Choose location on map` }, { language: `fi`, value: `Valitse sijainti kartalla` },);
        this.set(this.setLocationLanguageItemName, { language: `en`, value: `Set location` }, { language: `sv`, value: `SV: Set location` }, { language: `ru`, value: `RU: Set location` }, { language: `pl`, value: `Ställ in plats` }, { language: `fi`, value: `Aseta sijainti` },);
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