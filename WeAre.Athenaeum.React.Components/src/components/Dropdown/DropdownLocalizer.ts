//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class DropdownLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly multipleSelectedLanguageItemName: string = `MultipleSelected`;
    public readonly noItemsLanguageItemName: string = `NoItems`;
    public readonly noDataLanguageItemName: string = `NoData`;
    public readonly filterResultsLanguageItemName: string = `FilterResults`;
    public readonly getResultsLanguageItemName: string = `GetResults`;
    public readonly addLanguageItemName: string = `Add`;
    public readonly nothingSelectedLanguageItemName: string = `NothingSelected`;

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
        this.set(this.multipleSelectedLanguageItemName, { language: `en`, value: `{0} selected` }, { language: `uk`, value: `{0} вибран(о)` }, { language: `sv`, value: `{0} valt` }, { language: `ru`, value: `{0} выбран(о)` }, { language: `pl`, value: `PL: {0} selected` }, { language: `fi`, value: `{0} valittu` },);
        this.set(this.noItemsLanguageItemName, { language: `en`, value: `No items found` }, { language: `uk`, value: `Нічого не знайдено` }, { language: `sv`, value: `Inga objekt hittades` }, { language: `ru`, value: `Данные не найдены` }, { language: `pl`, value: `PL: No items found` }, { language: `fi`, value: `Kohteita ei löytynyt` },);
        this.set(this.noDataLanguageItemName, { language: `en`, value: `No data` }, { language: `uk`, value: `Немає даних` }, { language: `sv`, value: `Ingen information` }, { language: `ru`, value: `Нет данных` }, { language: `pl`, value: `PL: No data` }, { language: `fi`, value: `Ei tietoja` },);
        this.set(this.filterResultsLanguageItemName, { language: `en`, value: `Filter results` }, { language: `uk`, value: `UK: Filter results` }, { language: `sv`, value: `Filtrera resultat` }, { language: `ru`, value: `RU: Filter results` }, { language: `pl`, value: `PL: Filter results` }, { language: `fi`, value: `Suodata tulokset` },);
        this.set(this.getResultsLanguageItemName, { language: `en`, value: `Start typing to get results` }, { language: `uk`, value: `Почніть писати, щоб побачити дані` }, { language: `sv`, value: `Börja skriva för att få resultat` }, { language: `ru`, value: `Начните писать, чтобы увидеть данные` }, { language: `pl`, value: `PL: Start typing to get results` }, { language: `fi`, value: `Aloita kirjoittaminen saadaksesi tuloksia` },);
        this.set(this.addLanguageItemName, { language: `en`, value: `Add` }, { language: `uk`, value: `Додати` }, { language: `sv`, value: `SV: Add` }, { language: `ru`, value: `Новый` }, { language: `pl`, value: `PL: Add` }, { language: `fi`, value: `Lisää` },);
        this.set(this.nothingSelectedLanguageItemName, { language: `en`, value: `Nothing is selected` }, { language: `uk`, value: `Нічого не вибрано` }, { language: `sv`, value: `Ingenting är valt` }, { language: `ru`, value: `Ничего не выбрано` }, { language: `pl`, value: `PL: Nothing is selected` }, { language: `fi`, value: `Ei mitään valittu` },);
    }

    /**
    /* "MultipleSelected" ({0} selected)
    */
    public get multipleSelected() : string {
        return this.get(this.multipleSelectedLanguageItemName);
    }

    /**
    /* "NoItems" (No items found)
    */
    public get noItems() : string {
        return this.get(this.noItemsLanguageItemName);
    }

    /**
    /* "NoData" (No data)
    */
    public get noData() : string {
        return this.get(this.noDataLanguageItemName);
    }

    /**
    /* "FilterResults" (Filter results)
    */
    public get filterResults() : string {
        return this.get(this.filterResultsLanguageItemName);
    }

    /**
    /* "GetResults" (Start typing to get results)
    */
    public get getResults() : string {
        return this.get(this.getResultsLanguageItemName);
    }

    /**
    /* "Add" (Add)
    */
    public get add() : string {
        return this.get(this.addLanguageItemName);
    }

    /**
    /* "NothingSelected" (Nothing is selected)
    */
    public get nothingSelected() : string {
        return this.get(this.nothingSelectedLanguageItemName);
    }
}

//Singleton
export default new DropdownLocalizer();