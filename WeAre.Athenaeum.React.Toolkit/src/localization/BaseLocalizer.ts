import {Dictionary} from "typescript-collections";
import Utility from "../Utility";
import AthenaeumConstants from "../AthenaeumConstants";
import ServiceProvider, {IService, ServiceType} from "../providers/ServiceProvider";

export interface ILanguage {
    readonly label: string;
    readonly code: string;
}

export interface ILocalizer {
    get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;
    contains(name: string): boolean;
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
    
    protected getLanguageItems(language: string): Dictionary<string, string> {
        if (!this._supportedLanguageCodes.includes(language))
            throw Error(`Unsupported language ${language}.`);

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

    public getType(): ServiceType {
        return nameof<ILocalizer>();
    }
    
    public get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        let value: string | null = null;
        if (name) {
            const languageItems: Dictionary<string, string> = this.getLanguageItems(this._language);
            value = languageItems.getValue(name) as string | null;
            if (value) {
                const lines: string[] = value.split(AthenaeumConstants.newLineRegex);
                value = lines.join("\n");
            }
        }
        value = value || name || "";
        return Utility.format(value, ...params);
    }

    public contains(name: string): boolean {
        let languageItems = this._items.getValue(this._defaultLanguage) as Dictionary<string, string>;
        return languageItems.containsKey(name);
    }
    
    public findLanguage(language: string | null | undefined): ILanguage {
        const item: ILanguage | undefined = (language) ? this.supportedLanguages.find(item => item.code == language) : undefined;
        return item || this.findLanguage(this.defaultLanguage);
    }
    
    public setLanguage(language: string): boolean {
        if (!this._supportedLanguageCodes.includes(language))
            throw Error(`Unsupported language code "${language}".`);
        
        if (this._language !== language) {
            this._language = language;
            return true;
        }
        
        return false;
    }
    
    public get supportedLanguageCodes(): string[] {
        return this._supportedLanguageCodes;
    }

    public get supportedLanguages(): ILanguage[] {
        return this._supportedLanguages;
    }

    public get language(): string {
        return this._language;
    }

    public get defaultLanguage(): string {
        return this._defaultLanguage;
    }
}