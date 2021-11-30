//Autogenerated

import {BaseComponentLocalizer} from "@weare/athenaeum-react-common";

class ImageInputLocalizer extends BaseComponentLocalizer {

    //Constants
    public readonly documentTypeNotSupportedLanguageItemName: string = `DocumentTypeNotSupported`;
    public readonly documentTooBigLanguageItemName: string = `DocumentTooBig`;
    public readonly saveLanguageItemName: string = `Save`;
    public readonly browseLanguageItemName: string = `Browse`;
    public readonly rotateLeftLanguageItemName: string = `RotateLeft`;
    public readonly rotateRightLanguageItemName: string = `RotateRight`;
    public readonly deleteLanguageItemName: string = `Delete`;
    public readonly editLanguageItemName: string = `Edit`;
    public readonly cameraLanguageItemName: string = `Camera`;
    public readonly backLanguageItemName: string = `Back`;
    public readonly previewLanguageItemName: string = `Preview`;
    public readonly dropItLanguageItemName: string = `DropIt`;
    public readonly moveToTopLanguageItemName: string = `MoveToTop`;
    public readonly moveUpLanguageItemName: string = `MoveUp`;
    public readonly moveDownLanguageItemName: string = `MoveDown`;

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
        this.set(this.documentTypeNotSupportedLanguageItemName, { language: `en`, value: `Document type is not supported, choose file with extension {0}` }, { language: `uk`, value: `Тип документа не підтримується, виберіть файл з розширенням {0}` }, { language: `sv`, value: `Dokumenttyp stöds inte. Välj dokument som är {0}.` }, { language: `ru`, value: `Тип документа не поддерживается, выберите файл с расширением {0}` }, { language: `pl`, value: `Format dokumentu nieprawidłowy. Wybierz dokument {0}` }, { language: `nb`, value: `Dokumenttype støttes ikke. Velg fil med filtypen {0}` }, { language: `fi`, value: `Dokumentin tyyppi ei ole tuettu. Valitse tiedosto, joka on {0}` }, { language: `da`, value: `Dokumenttype understøttes ikke. Vælg fil med udvidelse {0}` },);
        this.set(this.documentTooBigLanguageItemName, { language: `en`, value: `Document file is too big` }, { language: `uk`, value: `Файл документа занадто великий` }, { language: `sv`, value: `Dokument filen är för stor` }, { language: `ru`, value: `Файл документа слишком большой` }, { language: `pl`, value: `Dokument jest za duży` }, { language: `nb`, value: `Dokumentfilen er for stor` }, { language: `fi`, value: `Dokumentti tiedosto liian iso` }, { language: `da`, value: `Dokumentfilen er for stor` },);
        this.set(this.saveLanguageItemName, { language: `en`, value: `Save` }, { language: `uk`, value: `Зберегти` }, { language: `sv`, value: `Spara` }, { language: `ru`, value: `Сохранить` }, { language: `pl`, value: `Zapisać` }, { language: `nb`, value: `Lagre` }, { language: `fi`, value: `Tallenna` }, { language: `da`, value: `Gemme` },);
        this.set(this.browseLanguageItemName, { language: `en`, value: `Browse` }, { language: `uk`, value: `Перегляд` }, { language: `sv`, value: `Bläddra` }, { language: `ru`, value: `Просмотр` }, { language: `pl`, value: `Przeglądaj` }, { language: `nb`, value: `Bla gjennom` }, { language: `fi`, value: `Selaa` }, { language: `da`, value: `Gennemse` },);
        this.set(this.rotateLeftLanguageItemName, { language: `en`, value: `Rotate left` }, { language: `uk`, value: `Повернути наліво` }, { language: `sv`, value: `Rotera vänster` }, { language: `ru`, value: `Повернуть налево` }, { language: `pl`, value: `Obrót w lewo` }, { language: `nb`, value: `Rotér mot venstre` }, { language: `fi`, value: `Kierrä vasemmalle` }, { language: `da`, value: `Rotere venstre` },);
        this.set(this.rotateRightLanguageItemName, { language: `en`, value: `Rotate right` }, { language: `uk`, value: `Повернути праворуч` }, { language: `sv`, value: `Vrid höger` }, { language: `ru`, value: `Повернуть вправо` }, { language: `pl`, value: `Obróć w prawo` }, { language: `nb`, value: `Roter til høyre` }, { language: `fi`, value: `Kierrä oikealle` }, { language: `da`, value: `Drej til højre` },);
        this.set(this.deleteLanguageItemName, { language: `en`, value: `Delete` }, { language: `uk`, value: `Видалити` }, { language: `sv`, value: `Radera` }, { language: `ru`, value: `Удалить` }, { language: `pl`, value: `Kasować` }, { language: `nb`, value: `Slett` }, { language: `fi`, value: `Poista` }, { language: `da`, value: `Delete` },);
        this.set(this.editLanguageItemName, { language: `en`, value: `Edit` }, { language: `uk`, value: `Змінити` }, { language: `sv`, value: `Redigera` }, { language: `ru`, value: `Изменить` }, { language: `pl`, value: `Edytować` }, { language: `nb`, value: `Redigere` }, { language: `fi`, value: `Muokkaa` }, { language: `da`, value: `Redigere` },);
        this.set(this.cameraLanguageItemName, { language: `en`, value: `Camera` }, { language: `uk`, value: `Камера` }, { language: `sv`, value: `Kamera` }, { language: `ru`, value: `Камера` }, { language: `pl`, value: `Kamera` }, { language: `nb`, value: `Kamera` }, { language: `fi`, value: `Kamera` }, { language: `da`, value: `Kamera` },);
        this.set(this.backLanguageItemName, { language: `en`, value: `Back` }, { language: `uk`, value: `Назад` }, { language: `sv`, value: `Tillbaka` }, { language: `ru`, value: `Назад` }, { language: `pl`, value: `Plecy` }, { language: `nb`, value: `Tilbake` }, { language: `fi`, value: `Takaisin` }, { language: `da`, value: `Tilbage` },);
        this.set(this.previewLanguageItemName, { language: `en`, value: `Preview` }, { language: `uk`, value: `Переглянути` }, { language: `sv`, value: `Förhandsvisning` }, { language: `ru`, value: `Предпросмотр` }, { language: `pl`, value: `Zapowiedź` }, { language: `nb`, value: `Forhåndsvisning` }, { language: `fi`, value: `Esikatsele` }, { language: `da`, value: `Preview` },);
        this.set(this.dropItLanguageItemName, { language: `en`, value: `Drop it` }, { language: `uk`, value: `Перетягніть сюди` }, { language: `sv`, value: `Släppa` }, { language: `ru`, value: `Перетащите сюда` }, { language: `pl`, value: `Upuszczać` }, { language: `nb`, value: `Miste` }, { language: `fi`, value: `Pudota` }, { language: `da`, value: `Dråbe` },);
        this.set(this.moveToTopLanguageItemName, { language: `en`, value: `Move to top` }, { language: `uk`, value: `На початок` }, { language: `sv`, value: `Flytta upp` }, { language: `ru`, value: `В начало` }, { language: `pl`, value: `Podnieść` }, { language: `nb`, value: `Flytte opp` }, { language: `fi`, value: `Siirrä huipulle` }, { language: `da`, value: `Flytte op` },);
        this.set(this.moveUpLanguageItemName, { language: `en`, value: `Move up` }, { language: `uk`, value: `Піднятися` }, { language: `sv`, value: `Flytta till toppen` }, { language: `ru`, value: `Подняться` }, { language: `pl`, value: `Przejdź do góry` }, { language: `nb`, value: `Flytt til toppen` }, { language: `fi`, value: `Siirrä ylös` }, { language: `da`, value: `Flyt til toppen` },);
        this.set(this.moveDownLanguageItemName, { language: `en`, value: `Move below` }, { language: `uk`, value: `Опуститись нижче` }, { language: `sv`, value: `Flytta ner` }, { language: `ru`, value: `Опуститься ниже` }, { language: `pl`, value: `Padnij` }, { language: `nb`, value: `Flytte ned` }, { language: `fi`, value: `Siirrä alas` }, { language: `da`, value: `Flyt ned` },);
    }

    /**
    /* "DocumentTypeNotSupported" (Document type is not supported, choose file with extension {0})
    */
    public get documentTypeNotSupported() : string {
        return this.get(this.documentTypeNotSupportedLanguageItemName);
    }

    /**
    /* "DocumentTooBig" (Document file is too big)
    */
    public get documentTooBig() : string {
        return this.get(this.documentTooBigLanguageItemName);
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

    /**
    /* "DropIt" (Drop it)
    */
    public get dropIt() : string {
        return this.get(this.dropItLanguageItemName);
    }

    /**
    /* "MoveToTop" (Move to top)
    */
    public get moveToTop() : string {
        return this.get(this.moveToTopLanguageItemName);
    }

    /**
    /* "MoveUp" (Move up)
    */
    public get moveUp() : string {
        return this.get(this.moveUpLanguageItemName);
    }

    /**
    /* "MoveDown" (Move below)
    */
    public get moveDown() : string {
        return this.get(this.moveDownLanguageItemName);
    }
}

//Singleton
export default new ImageInputLocalizer();