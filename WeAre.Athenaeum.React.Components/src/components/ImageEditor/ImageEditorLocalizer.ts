//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class ImageEditorLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly saveLanguageItemName: string = `Save`;
    public readonly browseLanguageItemName: string = `Browse`;
    public readonly rotateLeftLanguageItemName: string = `RotateLeft`;
    public readonly rotateRightLanguageItemName: string = `RotateRight`;
    public readonly deleteLanguageItemName: string = `Delete`;
    public readonly editLanguageItemName: string = `Edit`;
    public readonly cameraLanguageItemName: string = `Camera`;
    public readonly backLanguageItemName: string = `Back`;
    public readonly previewLanguageItemName: string = `Preview`;

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
        this.set(this.saveLanguageItemName, { language: `en`, value: `Save` }, { language: `uk`, value: `UK: Save` }, { language: `sv`, value: `SV: Save` }, { language: `ru`, value: `RU: Save` }, { language: `pl`, value: `PL: Save` }, { language: `nb`, value: `NB: Save` }, { language: `fi`, value: `Tallentaa` }, { language: `da`, value: `DA: Save` },);
        this.set(this.browseLanguageItemName, { language: `en`, value: `Browse` }, { language: `uk`, value: `UK: Browse` }, { language: `sv`, value: `SV: Browse` }, { language: `ru`, value: `RU: Browse` }, { language: `pl`, value: `PL: Browse` }, { language: `nb`, value: `NB: Browse` }, { language: `fi`, value: `Selaa` }, { language: `da`, value: `DA: Browse` },);
        this.set(this.rotateLeftLanguageItemName, { language: `en`, value: `Rotate left` }, { language: `uk`, value: `UK: RotateLeft` }, { language: `sv`, value: `SV: RotateLeft` }, { language: `ru`, value: `RU: RotateLeft` }, { language: `pl`, value: `PL: RotateLeft` }, { language: `nb`, value: `NB: RotateLeft` }, { language: `fi`, value: `Kierrä vasemmalle` }, { language: `da`, value: `DA: RotateLeft` },);
        this.set(this.rotateRightLanguageItemName, { language: `en`, value: `Rotate right` }, { language: `uk`, value: `UK: RotateRight` }, { language: `sv`, value: `SV: RotateRight` }, { language: `ru`, value: `RU: RotateRight` }, { language: `pl`, value: `PL: RotateRight` }, { language: `nb`, value: `NB: RotateRight` }, { language: `fi`, value: `Kierrä oikealle` }, { language: `da`, value: `DA: RotateRight` },);
        this.set(this.deleteLanguageItemName, { language: `en`, value: `Delete` }, { language: `uk`, value: `UK: Delete` }, { language: `sv`, value: `Radera` }, { language: `ru`, value: `RU: Delete` }, { language: `pl`, value: `PL: Delete` }, { language: `nb`, value: `Slett` }, { language: `fi`, value: `Poistaa` }, { language: `da`, value: `DA: Delete` },);
        this.set(this.editLanguageItemName, { language: `en`, value: `Edit` }, { language: `uk`, value: `UK: Edit` }, { language: `sv`, value: `SV: Edit` }, { language: `ru`, value: `RU: Edit` }, { language: `pl`, value: `PL: Edit` }, { language: `nb`, value: `NB: Edit` }, { language: `fi`, value: `Muokkaa` }, { language: `da`, value: `DA: Edit` },);
        this.set(this.cameraLanguageItemName, { language: `en`, value: `Camera` }, { language: `uk`, value: `UK: Camera` }, { language: `sv`, value: `SV: Camera` }, { language: `ru`, value: `RU: Camera` }, { language: `pl`, value: `PL: Camera` }, { language: `nb`, value: `NB: Camera` }, { language: `fi`, value: `Kamera` }, { language: `da`, value: `DA: Camera` },);
        this.set(this.backLanguageItemName, { language: `en`, value: `Back` }, { language: `uk`, value: `UK: Back` }, { language: `sv`, value: `Tillbaka` }, { language: `ru`, value: `RU: Back` }, { language: `pl`, value: `PL: Back` }, { language: `nb`, value: `Tilbake` }, { language: `fi`, value: `Takaisin` }, { language: `da`, value: `DA: Back` },);
        this.set(this.previewLanguageItemName, { language: `en`, value: `Preview` }, { language: `uk`, value: `UK: Preview` }, { language: `sv`, value: `SV: Preview` }, { language: `ru`, value: `RU: Preview` }, { language: `pl`, value: `PL: Preview` }, { language: `nb`, value: `NB: Preview` }, { language: `fi`, value: `Esikatsele` }, { language: `da`, value: `DA: Preview` },);
    }

    /**
    /* "Save" (Save)
    */
    public get save() : string {
        return this.get(this.saveLanguageItemName);
    }

    /**
    /* "Browse" (Browse)
    */
    public get browse() : string {
        return this.get(this.browseLanguageItemName);
    }

    /**
    /* "RotateLeft" (Rotate left)
    */
    public get rotateLeft() : string {
        return this.get(this.rotateLeftLanguageItemName);
    }

    /**
    /* "RotateRight" (Rotate right)
    */
    public get rotateRight() : string {
        return this.get(this.rotateRightLanguageItemName);
    }

    /**
    /* "Delete" (Delete)
    */
    public get delete() : string {
        return this.get(this.deleteLanguageItemName);
    }

    /**
    /* "Edit" (Edit)
    */
    public get edit() : string {
        return this.get(this.editLanguageItemName);
    }

    /**
    /* "Camera" (Camera)
    */
    public get camera() : string {
        return this.get(this.cameraLanguageItemName);
    }

    /**
    /* "Back" (Back)
    */
    public get back() : string {
        return this.get(this.backLanguageItemName);
    }

    /**
    /* "Preview" (Preview)
    */
    public get preview() : string {
        return this.get(this.previewLanguageItemName);
    }
}

//Singleton
export default new ImageEditorLocalizer();