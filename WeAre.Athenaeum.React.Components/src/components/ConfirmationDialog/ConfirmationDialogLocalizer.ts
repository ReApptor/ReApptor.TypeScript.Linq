//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class ConfirmationDialogLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly areYouSureLanguageItemName: string = `AreYouSure`;
    public readonly confirmButtonLanguageItemName: string = `ConfirmButton`;
    public readonly closeButtonLanguageItemName: string = `CloseButton`;
    public readonly commentLanguageItemName: string = `Comment`;

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
        this.set(this.areYouSureLanguageItemName, { language: `en`, value: `Are you sure?` }, { language: `uk`, value: `Ви впевнені?` }, { language: `sv`, value: `Är du säker?` }, { language: `ru`, value: `Вы уверены?` }, { language: `pl`, value: `PL: Are you sure?` }, { language: `fi`, value: `Oletko varma?` },);
        this.set(this.confirmButtonLanguageItemName, { language: `en`, value: `Confirm` }, { language: `uk`, value: `Підтвердети` }, { language: `sv`, value: `Bekräfta` }, { language: `ru`, value: `Подтвердить` }, { language: `pl`, value: `PL: Confirm` }, { language: `fi`, value: `Kyllä` },);
        this.set(this.closeButtonLanguageItemName, { language: `en`, value: `Close` }, { language: `uk`, value: `Закрити` }, { language: `sv`, value: `SV: Close` }, { language: `ru`, value: `Отмена` }, { language: `pl`, value: `PL: Close` }, { language: `fi`, value: `Ei` },);
        this.set(this.commentLanguageItemName, { language: `en`, value: `Please leave a comment` }, { language: `uk`, value: `Будьласка, залиште коментар` }, { language: `sv`, value: `Var vänlig och lämna en kommentar` }, { language: `ru`, value: `Пожалуйста, оставьте комментарий` }, { language: `pl`, value: `PL: Please leave a comment` }, { language: `fi`, value: `Ole hyvä ja kommentoi` },);
    }

    /**
    /* "AreYouSure" (Are you sure?)
    */
    public get areYouSure() : string {
        return this.get(this.areYouSureLanguageItemName);
    }

    /**
    /* "ConfirmButton" (Confirm)
    */
    public get confirmButton() : string {
        return this.get(this.confirmButtonLanguageItemName);
    }

    /**
    /* "CloseButton" (Close)
    */
    public get closeButton() : string {
        return this.get(this.closeButtonLanguageItemName);
    }

    /**
    /* "Comment" (Please leave a comment)
    */
    public get comment() : string {
        return this.get(this.commentLanguageItemName);
    }
}

//Singleton
export default new ConfirmationDialogLocalizer();