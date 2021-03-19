//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class NavigationWidgetLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly previousLanguageItemName: string = `Previous`;
    public readonly returnToPreviousLanguageItemName: string = `ReturnToPrevious`;
    public readonly nextLanguageItemName: string = `Next`;
    public readonly goToNextLanguageItemName: string = `GoToNext`;

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
        this.set(this.previousLanguageItemName, { language: `en`, value: `Previous` }, { language: `uk`, value: `Назад` }, { language: `sv`, value: `Föregående` }, { language: `ru`, value: `RU: Previous` }, { language: `pl`, value: `PL: Previous` }, { language: `nb`, value: `Previous` }, { language: `fi`, value: `Edellinen` }, { language: `da`, value: `Previous` },);
        this.set(this.returnToPreviousLanguageItemName, { language: `en`, value: `Return to previous step` }, { language: `uk`, value: `Повернутися до попереднього кроку` }, { language: `sv`, value: `Återgå till föregående steg` }, { language: `ru`, value: `RU: Return to previous step` }, { language: `pl`, value: `PL: Return to previous step` }, { language: `nb`, value: `Return to previous step` }, { language: `fi`, value: `Palaa edelliseen vaiheeseen` }, { language: `da`, value: `Return to previous step` },);
        this.set(this.nextLanguageItemName, { language: `en`, value: `Next` }, { language: `uk`, value: `Далі` }, { language: `sv`, value: `Nästa` }, { language: `ru`, value: `RU: Next` }, { language: `pl`, value: `PL: Next` }, { language: `nb`, value: `Next` }, { language: `fi`, value: `Seuraava` }, { language: `da`, value: `Next` },);
        this.set(this.goToNextLanguageItemName, { language: `en`, value: `Go to next step` }, { language: `uk`, value: `Перейти до наступного кроку` }, { language: `sv`, value: `Gå till nästa steg` }, { language: `ru`, value: `RU: Go to next step` }, { language: `pl`, value: `PL: Go to next step` }, { language: `nb`, value: `Go to next step` }, { language: `fi`, value: `Siirry seuraavaan vaiheeseen` }, { language: `da`, value: `Go to next step` },);
    }

    /**
    /* "Previous" (Previous)
    */
    public get previous() : string {
        return this.get(this.previousLanguageItemName);
    }

    /**
    /* "ReturnToPrevious" (Return to previous step)
    */
    public get returnToPrevious() : string {
        return this.get(this.returnToPreviousLanguageItemName);
    }

    /**
    /* "Next" (Next)
    */
    public get next() : string {
        return this.get(this.nextLanguageItemName);
    }

    /**
    /* "GoToNext" (Go to next step)
    */
    public get goToNext() : string {
        return this.get(this.goToNextLanguageItemName);
    }
}

//Singleton
export default new NavigationWidgetLocalizer();