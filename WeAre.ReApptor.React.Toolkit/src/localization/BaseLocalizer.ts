import {Dictionary} from "typescript-collections";
import Utility from "../Utility";
import AthenaeumConstants from "../AthenaeumConstants";
import ServiceProvider, {IService, ServiceType} from "../providers/ServiceProvider";

export interface ILanguage {

    /**
     * Name of the language in the language itself.
     */
    readonly label: string;

    /**
     * ISO 639 (?) code of the language.
     *
     * @example en, nb, uk
     */
    readonly code: string;
}

export class Language implements ILanguage {
    constructor(code: string = "", label: string = "") {
        this.code = code;
        this.label = label;
    }

    public code: string = "";
    
    public label: string = "";

    readonly isLanguage: true = true;
}

export interface ILocalizer {

    /**
     * Language code of the currently selected language.
     * @see ILanguage.code
     */
    readonly language: string;

    /**
     * A list of languages supported by the {@link ILocalizer}.
     */
    readonly supportedLanguages: ILanguage[];

    /**
     * Get a localized value with the specified key in the given language.
     *
     * @param languageCode Language code of the language which value to get (see {@link ILanguage.code}).
     * @param key Key of the localized value.
     * @param params Parameters which are formatted to the value.
     * @return A localized value formatted with parameters. If languageCode is not defined, the key formatted with parameters. If key is not defined, an empty string.
     */
    getValue(languageCode: string, key: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;

    /**
     * Get a localized value with the specified key in the currently selected language.
     *
     * @param key Key of the localized value.
     * @param params Parameters which are formatted to the value.
     * @return A localized value formatted with parameters. If key is not defined, an empty string.
     */
    get(key: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;

    /**
     * Does the {@link ILocalizer} contain a localized value with the given key in the given or default language.
     *
     * @param key Key to check for existing value.
     * @param languageCode Language code of the language which value to check (see {@link ILanguage.code}). Default language if not specified.
     */
    contains(key: string | null | undefined, languageCode?: string | null): boolean;

    /**
     * Set the current language.
     *
     * @param languageCode Language code of the new language (see {@link ILanguage.code}).
     * @return Was the language changed.
     * @throws The language code is not supported.
     */
    setLanguage(languageCode: string): boolean;
}

/**
 * Base class for localizers.
 */
export default abstract class BaseLocalizer implements ILocalizer, IService {

    private readonly _items: Dictionary<string, Dictionary<string, string>> = new Dictionary<string, Dictionary<string, string>>(); // Language code -> Key -> Localized value
    private readonly _supportedLanguages: ILanguage[];
    private readonly _supportedLanguageCodes: string[];
    private readonly _defaultLanguageCode: string;
    private _languageCode: string;

    /**
     * @param supportedLanguages A list of supported languages.
     * @param defaultLanguageCode Language code of the default language (see {@link ILanguage.code}).
     */
    protected constructor(supportedLanguages: ILanguage[], defaultLanguageCode: string) {
        this._supportedLanguages = supportedLanguages;
        this._supportedLanguageCodes = supportedLanguages.map(language => language.code);
        this._defaultLanguageCode = defaultLanguageCode;
        this._languageCode = defaultLanguageCode;
        ServiceProvider.addSingleton(this);
    }

    /**
     * @return A list of languages supported by the {@link BaseLocalizer}.
     */
    protected getSupportedLanguages(): ILanguage[] {
        return this._supportedLanguages;
    }

    /**
     * @return A list of language codes supported by the {@link BaseLocalizer}.
     * @see ILanguage.code
     */
    protected getSupportedLanguageCodes(): string[] {
        return this._supportedLanguageCodes;
    }

    /**
     * @return Language code of the currently selected language.
     * @see ILanguage.code
     */
    protected getLanguage(): string {
        return this._languageCode;
    }

    /**
     * @return Language code of the {@link BaseLocalizer}'s default language.
     * @see ILanguage.code
     */
    protected getDefaultLanguage(): string {
        return this._defaultLanguageCode;
    }

    /**
     * Get all localized values of a language.
     *
     * @param languageCode Language code of the language which localized values to get (see {@link ILanguage.code}).
     * @return Localized values of the given language.
     */
    protected getLanguageItems(languageCode: string): Dictionary<string, string> {
        let languageItems: Dictionary<string, string> | null = this._items.getValue(languageCode) as Dictionary<string, string> | null;
        if (!languageItems) {
            languageItems = new Dictionary<string, string>();
            this._items.setValue(languageCode, languageItems);
        }

        return languageItems;
    }

    /**
     * Set a localized value.
     *
     * @param key Key which value to set.
     * @param languageCode Language code of the language which value to set (see {@link ILanguage.code}).
     * @param value Value to set.
     */
    protected setItem(key: string, languageCode: string, value: string): void {
        const languageItems: Dictionary<string, string> = this.getLanguageItems(languageCode);
        languageItems.setValue(key, value);
    }

    /**
     * Set multiple different languages localized values which have the same key.
     *
     * @param key Key which values to set.
     * @param params Collection of Language code - Localized value pairs.
     */
    protected set(key: string, ...params: { language: string, value: string }[]): void {
        params.map((item) => this.setItem(key, item.language, item.value));
    }

    /**
     * Does nothing.
     */
    public initialize(): void {
    }

    /**
     * Find a language with the given language code.
     * If no language is found, returns the default language.
     *
     * @param languageCode Language code of the language to find (see {@link ILanguage.code}).
     * @return A language with the given language code, or the default language.
     */
    public findLanguage(languageCode: string | null | undefined): ILanguage {
        const language: ILanguage | undefined = (languageCode)
            ? this.getSupportedLanguages().find(language => language.code === languageCode)
            : undefined;

        return language || this.findLanguage(this.getDefaultLanguage());
    }

    /**
     * A list of language codes supported by the {@link BaseLocalizer}.
     * @see ILanguage.code
     */
    public get supportedLanguageCodes(): string[] {
        return this.getSupportedLanguageCodes();
    }

    /**
     * Language code of the {@link BaseLocalizer}'s default language.
     * @see ILanguage.code
     */
    public get defaultLanguage(): string {
        return this.getDefaultLanguage();
    }


    // ILocalizer


    public get language(): string {
        return this.getLanguage();
    }

    public get supportedLanguages(): ILanguage[] {
        return this.getSupportedLanguages();
    }

    public getValue(languageCode: string, key: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        let value: string | null = null;
        if (key) {
            const languageItems: Dictionary<string, string> = this.getLanguageItems(languageCode);
            value = languageItems.getValue(key) as string | null;
            if (value) {
                const lines: string[] = value.split(AthenaeumConstants.newLineRegex);
                value = lines.join("\n");
            }
        }
        value = value || key || "";
        return Utility.format(value, ...params);
    }

    public get(key: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        return this.getValue(this.getLanguage(), key, ...params);
    }

    public contains(key: string | null | undefined, languageCode?: string | null): boolean {
        if (key) {
            const defaultLanguageCode: string = languageCode || this.getDefaultLanguage();

            const languageItems = this._items.getValue(defaultLanguageCode) as Dictionary<string, string> | null;

            return (languageItems != null) && (languageItems.containsKey(key));
        }

        return false;
    }

    public setLanguage(languageCode: string): boolean {
        if (this._languageCode !== languageCode) {

            if (!this._supportedLanguageCodes.includes(languageCode))
                throw Error(`Unsupported language code "${languageCode}".`);

            this._languageCode = languageCode;

            return true;
        }

        return false;
    }


     // IService


    public getType(): ServiceType {
        // @ts-ignore
        return nameof<ILocalizer>();
    }
}