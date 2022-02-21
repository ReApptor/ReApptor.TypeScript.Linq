//Autogenerated

import {BaseComponentLocalizer} from "@weare/reapptor-react-common";

class MessageBoxLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly okLanguageItemName: string = `Ok`;
    public readonly areYouSureLanguageItemName: string = `AreYouSure`;
    public readonly commentLanguageItemName: string = `Comment`;
    public readonly yesLanguageItemName: string = `Yes`;
    public readonly noLanguageItemName: string = `No`;
    public readonly abortLanguageItemName: string = `Abort`;
    public readonly retryLanguageItemName: string = `Retry`;
    public readonly ignoreLanguageItemName: string = `Ignore`;
    public readonly cancelLanguageItemName: string = `Cancel`;

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
        this.set(this.okLanguageItemName, { language: `en`, value: `Ok` }, { language: `uk`, value: `Ok` }, { language: `sv`, value: `Ok` }, { language: `ru`, value: `Ок` }, { language: `pl`, value: `Ok` }, { language: `nb`, value: `Ok` }, { language: `fi`, value: `Ok` }, { language: `da`, value: `Ok` },);
        this.set(this.areYouSureLanguageItemName, { language: `en`, value: `Are you sure?` }, { language: `uk`, value: `Ви впевнені?` }, { language: `sv`, value: `Är du säker?` }, { language: `ru`, value: `Вы уверены?` }, { language: `pl`, value: `Czy jesteś pewien?` }, { language: `nb`, value: `Er du sikker?` }, { language: `fi`, value: `Oletko varma?` }, { language: `da`, value: `Er du sikker?` },);
        this.set(this.commentLanguageItemName, { language: `en`, value: `Please leave a comment` }, { language: `uk`, value: `Будьласка, залиште коментар` }, { language: `sv`, value: `Var vänlig och lämna en kommentar` }, { language: `ru`, value: `Пожалуйста, оставьте комментарий` }, { language: `pl`, value: `Dodaj komentarz` }, { language: `nb`, value: `Vennligst legg igjen en kommentar` }, { language: `fi`, value: `Ole hyvä ja kommentoi` }, { language: `da`, value: `Efterlad en kommentar` },);
        this.set(this.yesLanguageItemName, { language: `en`, value: `Yes` }, { language: `uk`, value: `Так` }, { language: `sv`, value: `Ja` }, { language: `ru`, value: `Да` }, { language: `pl`, value: `Tak` }, { language: `nb`, value: `NB: Yes` }, { language: `fi`, value: `Kyllä` }, { language: `da`, value: `Ja` },);
        this.set(this.noLanguageItemName, { language: `en`, value: `No` }, { language: `uk`, value: `Ні` }, { language: `sv`, value: `Nej` }, { language: `ru`, value: `Нет` }, { language: `pl`, value: `Nie` }, { language: `nb`, value: `NB: No` }, { language: `fi`, value: `Ei` }, { language: `da`, value: `Nej` },);
        this.set(this.abortLanguageItemName, { language: `en`, value: `Abort` }, { language: `uk`, value: `Перервати` }, { language: `sv`, value: `Avbryt` }, { language: `ru`, value: `Прервать` }, { language: `pl`, value: `Anulować` }, { language: `nb`, value: `NB: Abort` }, { language: `fi`, value: `Keskeytä` }, { language: `da`, value: `Afbryd` },);
        this.set(this.retryLanguageItemName, { language: `en`, value: `Retry` }, { language: `uk`, value: `Повторити` }, { language: `sv`, value: `Försök igen` }, { language: `ru`, value: `Повторить` }, { language: `pl`, value: `Spróbuj ponownie` }, { language: `nb`, value: `NB: Retry` }, { language: `fi`, value: `Yritä uudelleen` }, { language: `da`, value: `Prøv igen` },);
        this.set(this.ignoreLanguageItemName, { language: `en`, value: `Ignore` }, { language: `uk`, value: `Нехтувати` }, { language: `sv`, value: `Ignorera` }, { language: `ru`, value: `Игнорировать` }, { language: `pl`, value: `Ignoruj` }, { language: `nb`, value: `NB: Ignore` }, { language: `fi`, value: `Ohita` }, { language: `da`, value: `Ignorer` },);
        this.set(this.cancelLanguageItemName, { language: `en`, value: `Cancel` }, { language: `uk`, value: `Перервати` }, { language: `sv`, value: `Avbryt` }, { language: `ru`, value: `Отмена` }, { language: `pl`, value: `Anuluj` }, { language: `nb`, value: `NB: Cancel` }, { language: `fi`, value: `Peruuta` }, { language: `da`, value: `Annuller` },);
    }

    /**
    /* "Ok" (Ok)
    */
    public get ok() : string {
        return this.get(this.okLanguageItemName);
    }

    /**
    /* "AreYouSure" (Are you sure?)
    */
    public get areYouSure() : string {
        return this.get(this.areYouSureLanguageItemName);
    }

    /**
    /* "Comment" (Please leave a comment)
    */
    public get comment() : string {
        return this.get(this.commentLanguageItemName);
    }

    /**
    /* "Yes" (Yes)
    */
    public get yes() : string {
        return this.get(this.yesLanguageItemName);
    }

    /**
    /* "No" (No)
    */
    public get no() : string {
        return this.get(this.noLanguageItemName);
    }

    /**
    /* "Abort" (Abort)
    */
    public get abort() : string {
        return this.get(this.abortLanguageItemName);
    }

    /**
    /* "Retry" (Retry)
    */
    public get retry() : string {
        return this.get(this.retryLanguageItemName);
    }

    /**
    /* "Ignore" (Ignore)
    */
    public get ignore() : string {
        return this.get(this.ignoreLanguageItemName);
    }

    /**
    /* "Cancel" (Cancel)
    */
    public get cancel() : string {
        return this.get(this.cancelLanguageItemName);
    }
}

//Singleton
export default new MessageBoxLocalizer();