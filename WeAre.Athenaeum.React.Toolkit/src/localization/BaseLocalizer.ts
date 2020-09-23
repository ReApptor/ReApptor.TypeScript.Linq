import {Dictionary} from "typescript-collections";
import AthenaeumConstants from "../AthenaeumConstants";
import Utility from "../Utility";
import ServiceProvider, {IService, ServiceType} from "../providers/ServiceProvider";

export interface ILanguage {
    readonly label: string;
    readonly code: string;
}

export interface ILocalizer {
    get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;
}

export interface IEnumProvider {
    isEnum(typeName: string): boolean;

    getEnumText(enumName: string, value: any): string;
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
        let languageItems: Dictionary<string, string> = this.getLanguageItems(language);
        languageItems.setValue(name, value);
    }

    protected set(name: string, ...params: { language: string, value: string }[]): void {
        params.map((item) => this.setItem(name, item.language, item.value));
    }

    public getType(): ServiceType {
        return "ILocalizer";
    }
    
    public get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        let value: string | null = null;
        if (name) {
            let languageItems: Dictionary<string, string> = this.getLanguageItems(this._language);
            value = languageItems.getValue(name) as string | null;
            if (value) {
                let lines: string[] = value.split(AthenaeumConstants.newLineRegex);
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

    public getDayOfWeek(dayOfWeekOrDate: number | Date | string): string {

        switch (typeof dayOfWeekOrDate) {
            case  "string":
                dayOfWeekOrDate = new Date(dayOfWeekOrDate);
                return this.getDayOfWeek(dayOfWeekOrDate);

            case "number":
                switch (dayOfWeekOrDate) {
                    case 0:
                        return this.get("DayOfWeek.Sunday");
                    case 1:
                        return this.get("DayOfWeek.Monday");
                    case 2:
                        return this.get("DayOfWeek.Tuesday");
                    case 3:
                        return this.get("DayOfWeek.Wednesday");
                    case 4:
                        return this.get("DayOfWeek.Thursday");
                    case 5:
                        return this.get("DayOfWeek.Friday");
                    case 6:
                        return this.get("DayOfWeek.Saturday");
                }

                throw Error(`Unsupported day of week number "${dayOfWeekOrDate}", can be [0..6] => [Sunday..Saturday].`);

            case "object":
                if (typeof dayOfWeekOrDate.getDay === "function") {
                    dayOfWeekOrDate = (dayOfWeekOrDate as Date).getDay();
                    return this.getDayOfWeek(dayOfWeekOrDate);
                }
                break;
        }

        throw Error(`Unsupported type for day of week "${dayOfWeekOrDate}", can be number, string or Date.`);
    }

    public getMonth(monthOrDate: number | string | Date): string {

        if (Utility.isDateType(monthOrDate)) {
            monthOrDate = (monthOrDate as Date).getMonth();
            return this.getMonth(monthOrDate);
        }
        
        if (typeof monthOrDate === "string") {
            monthOrDate = monthOrDate.toLowerCase();
        }

        switch (monthOrDate) {
            case "january":
            case 0:
                return this.get("Month.January");
            case "february":
            case 1:
                return this.get("Month.February");
            case "march":
            case 2:
                return this.get("Month.March");
            case "april":
            case 3:
                return this.get("Month.April");
            case "may":
            case 4:
                return this.get("Month.May");
            case "june":
            case 5:
                return this.get("Month.June");
            case "july":
            case 6:
                return this.get("Month.July");
            case "august":
            case 7:
                return this.get("Month.August");
            case "september":
            case 8:
                return this.get("Month.September");
            case "october":
            case 9:
                return this.get("Month.October");
            case "november":
            case 10:
                return this.get("Month.November");
            case "december":
            case 11:
                return this.get("Month.December");
        }

        throw Error(`Unsupported month "${monthOrDate}", can be number ([0..11]), string (month name in English) or Date.`);
    }
}