//Autogenerated

import {BaseLocalizer} from "@weare/athenaeum-toolkit";

class Localizer extends BaseLocalizer {

    //Constants
    public readonly topNavFrontpageLanguageItemName: string = `TopNav.Frontpage`;
    public readonly pageRoutesTests2LanguageItemName: string = `PageRoutes.Tests2`;
    public readonly dayOfWeekMondayLanguageItemName: string = `DayOfWeek.Monday`;
    public readonly dayOfWeekTuesdayLanguageItemName: string = `DayOfWeek.Tuesday`;
    public readonly dayOfWeekWednsdayLanguageItemName: string = `DayOfWeek.Wednsday`;
    public readonly dayOfWeekThursdayLanguageItemName: string = `DayOfWeek.Thursday`;
    public readonly dayOfWeekFridayLanguageItemName: string = `DayOfWeek.Friday`;
    public readonly dayOfWeekSaturdayLanguageItemName: string = `DayOfWeek.Saturday`;
    public readonly dayOfWeekSundayLanguageItemName: string = `DayOfWeek.Sunday`;
    public readonly pageRoutesAnonymousTestWithParametersLanguageItemName: string = `PageRoutes.AnonymousTestWithParameters`;
    public readonly textInput2LabelLanguageItemName: string = `TextInput2.Label`;
    public readonly textInput2PlaceholderLanguageItemName: string = `TextInput2.Placeholder`;

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
        this.set(this.topNavFrontpageLanguageItemName, { language: `en`, value: `Etusivu` },);
        this.set(this.pageRoutesTests2LanguageItemName, { language: `en`, value: `helloworld` },);
        this.set(this.dayOfWeekMondayLanguageItemName, { language: `en`, value: `maanantai` },);
        this.set(this.dayOfWeekTuesdayLanguageItemName, { language: `en`, value: `tiistai` },);
        this.set(this.dayOfWeekWednsdayLanguageItemName, { language: `en`, value: `keskiviikko` },);
        this.set(this.dayOfWeekThursdayLanguageItemName, { language: `en`, value: `torstai` },);
        this.set(this.dayOfWeekFridayLanguageItemName, { language: `en`, value: `perjantai` },);
        this.set(this.dayOfWeekSaturdayLanguageItemName, { language: `en`, value: `lauantai` },);
        this.set(this.dayOfWeekSundayLanguageItemName, { language: `en`, value: `sunnuntai` },);
        this.set(this.pageRoutesAnonymousTestWithParametersLanguageItemName, { language: `en`, value: `anon` },);
        this.set(this.textInput2LabelLanguageItemName, { language: `en`, value: `FI: Text input #2` }, { language: `uk`, value: `UK: Text input #2` }, { language: `sv`, value: `SV: Text input #2` }, { language: `ru`, value: `RU: Text input #2` }, { language: `pl`, value: `PL: Text input #2` }, { language: `nb`, value: `NB: Text input #2` }, { language: `fi`, value: `FI: Text input #2` }, { language: `da`, value: `DA: Text input #2` },);
        this.set(this.textInput2PlaceholderLanguageItemName, { language: `en`, value: `FI: Text input #2 (Placeholder)` }, { language: `uk`, value: `UK: Text input #2 (Placeholder)` }, { language: `sv`, value: `SV: Text input #2 (Placeholder)` }, { language: `ru`, value: `RU: Text input #2 (Placeholder)` }, { language: `pl`, value: `PL: Text input #2 (Placeholder)` }, { language: `nb`, value: `NB: Text input #2 (Placeholder)` }, { language: `fi`, value: `FI: Text input #2 (Placeholder)` }, { language: `da`, value: `DA: Text input #2 (Placeholder)` },);
    }

    /**
    /* "TopNav.Frontpage" (Etusivu)
    */
    public get topNavFrontpage() : string {
        return this.get(this.topNavFrontpageLanguageItemName);
    }

    /**
    /* "PageRoutes.Tests2" (helloworld)
    */
    public get pageRoutesTests2() : string {
        return this.get(this.pageRoutesTests2LanguageItemName);
    }

    /**
    /* "DayOfWeek.Monday" (maanantai)
    */
    public get dayOfWeekMonday() : string {
        return this.get(this.dayOfWeekMondayLanguageItemName);
    }

    /**
    /* "DayOfWeek.Tuesday" (tiistai)
    */
    public get dayOfWeekTuesday() : string {
        return this.get(this.dayOfWeekTuesdayLanguageItemName);
    }

    /**
    /* "DayOfWeek.Wednsday" (keskiviikko)
    */
    public get dayOfWeekWednsday() : string {
        return this.get(this.dayOfWeekWednsdayLanguageItemName);
    }

    /**
    /* "DayOfWeek.Thursday" (torstai)
    */
    public get dayOfWeekThursday() : string {
        return this.get(this.dayOfWeekThursdayLanguageItemName);
    }

    /**
    /* "DayOfWeek.Friday" (perjantai)
    */
    public get dayOfWeekFriday() : string {
        return this.get(this.dayOfWeekFridayLanguageItemName);
    }

    /**
    /* "DayOfWeek.Saturday" (lauantai)
    */
    public get dayOfWeekSaturday() : string {
        return this.get(this.dayOfWeekSaturdayLanguageItemName);
    }

    /**
    /* "DayOfWeek.Sunday" (sunnuntai)
    */
    public get dayOfWeekSunday() : string {
        return this.get(this.dayOfWeekSundayLanguageItemName);
    }

    /**
    /* "PageRoutes.AnonymousTestWithParameters" (anon)
    */
    public get pageRoutesAnonymousTestWithParameters() : string {
        return this.get(this.pageRoutesAnonymousTestWithParametersLanguageItemName);
    }

    /**
    /* "TextInput2.Label" (FI: Text input #2)
    */
    public get textInput2Label() : string {
        return this.get(this.textInput2LabelLanguageItemName);
    }

    /**
    /* "TextInput2.Placeholder" (FI: Text input #2 (Placeholder))
    */
    public get textInput2Placeholder() : string {
        return this.get(this.textInput2PlaceholderLanguageItemName);
    }
}

//Singleton
export default new Localizer();