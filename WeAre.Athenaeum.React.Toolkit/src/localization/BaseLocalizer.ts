import {Dictionary} from "typescript-collections";
import Utility from "../Utility";
import AthenaeumConstants from "../AthenaeumConstants";
import ServiceProvider, {IService, ServiceType} from "../providers/ServiceProvider";

export interface ILanguage {
    readonly label: string;
    readonly code: string;
}

export interface ILocalizer {

    /**
     * Currently selected language.
     */
    readonly language: string;

    /**
     * List of all supported languages.
     */
    readonly supportedLanguages: ILanguage[];

    /**
     * Get a localized value with the specified key in the given language.
     */
    getValue(language: string, name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;

    /**
     * Get a localized value with the specified key in the currently selected language.
     */
    get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;

    /**
     * Does the {@link ILocalizer} contain a localized value with the given key in the given (or default) language.
     *
     * @param name Key to check for existing value.
     * @param language Language of the value. Default language if not specified.
     */
    contains(name: string | null | undefined, language?: string | null): boolean;

    /**
     * Set the current language.
     *
     * @param language New language.
     * @return Was the language changed.
     * @throws The language is not supported.
     */
    setLanguage(language: string): boolean;
}

export default abstract class BaseLocalizer implements ILocalizer, IService {
    private readonly _items: Dictionary<string, Dictionary<string, string>> = new Dictionary<string, Dictionary<string, string>>();
    private readonly _supportedLanguages: ILanguage[];
    private readonly _supportedLanguageCodes: string[];
    private readonly _defaultLanguage: string;
    private _language: string;

    protected constructor(supportedLanguages: ILanguage[], language: string) {
        this._supportedLanguages = supportedLanguages;
        this._supportedLanguageCodes = supportedLanguages.map(item => item.code);
        this._defaultLanguage = language;
        this._language = language;
        ServiceProvider.addSingleton(this);
    }

    protected getSupportedLanguages(): ILanguage[] {
        return this._supportedLanguages;
    }

    protected getSupportedLanguageCodes(): string[] {
        return this._supportedLanguageCodes;
    }

    protected getLanguage(): string {
        return this._language;
    }

    protected getDefaultLanguage(): string {
        return this._defaultLanguage;
    }

    protected getLanguageItems(language: string): Dictionary<string, string> {
        let languageItems: Dictionary<string, string> | null = this._items.getValue(language) as Dictionary<string, string> | null;
        if (!languageItems) {
            languageItems = new Dictionary<string, string>();
            this._items.setValue(language, languageItems);
        }

        return languageItems as Dictionary<string, string>;
    }

    protected setItem(name: string, language: string, value: string): void {
        const languageItems: Dictionary<string, string> = this.getLanguageItems(language);
        languageItems.setValue(name, value);
    }

    protected set(name: string, ...params: { language: string, value: string }[]): void {
        params.map((item) => this.setItem(name, item.language, item.value));
    }

    public initialize(): void {
    }

    public getType(): ServiceType {
        return nameof<ILocalizer>();
    }

    public getValue(language: string, name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        let value: string | null = null;
        if (name) {
            const languageItems: Dictionary<string, string> = this.getLanguageItems(language);
            value = languageItems.getValue(name) as string | null;
            if (value) {
                const lines: string[] = value.split(AthenaeumConstants.newLineRegex);
                value = lines.join("\n");
            }
        }
        value = value || name || "";
        return Utility.format(value, ...params);
    }

    public get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        return this.getValue(this.getLanguage(), name, ...params);
    }

    public contains(name: string | null | undefined, language?: string | null): boolean {
        if (name) {
            const defaultLanguage: string = language || this.getDefaultLanguage();

            const languageItems = this._items.getValue(defaultLanguage) as Dictionary<string, string> | null;

            return (languageItems != null) && (languageItems.containsKey(name));
        }

        return false;
    }

    public findLanguage(language: string | null | undefined): ILanguage {
        const item: ILanguage | undefined = (language) ? this.getSupportedLanguages().find(item => item.code === language) : undefined;
        return item || this.findLanguage(this.getDefaultLanguage());
    }

    public setLanguage(language: string): boolean {
        if (this._language !== language) {

            if (!this._supportedLanguageCodes.includes(language))
                throw Error(`Unsupported language code "${language}".`);

            this._language = language;

            return true;
        }

        return false;
    }

    public get supportedLanguageCodes(): string[] {
        return this.getSupportedLanguageCodes();
    }

    public get supportedLanguages(): ILanguage[] {
        return this.getSupportedLanguages();
    }

    public get language(): string {
        return this.getLanguage();
    }

    public get defaultLanguage(): string {
        return this.getDefaultLanguage();
    }
}