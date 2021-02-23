import {ILocalizer, ServiceType, BaseLocalizer, ILanguage, IService, ServiceProvider} from "@weare/athenaeum-toolkit";

export type LanguageCallback = string | (() => string);

export interface ILanguageProps {
    language?: LanguageCallback;
}

export interface ILanguageSetting {
    language?: LanguageCallback;
}

export interface IComponentsLocalizer {
    readonly supportedLanguages: ILanguage[];
    getValue(language: string, name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;
    contains(name: string | null | undefined): boolean;
}

export interface IComponentLocalizer {
    readonly language: string;
    readonly supportedLanguages: ILanguage[];
    get(language: string, name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;
    contains(name: string): boolean;
}

export abstract class BaseComponentsLocalizer extends BaseLocalizer implements IComponentsLocalizer, IService {

    protected constructor(supportedLanguages: ILanguage[], language: string) {
        super(supportedLanguages, language);
    }
    
    public getType(): ServiceType {
        return nameof<IComponentsLocalizer>();
    }
}

export abstract class BaseComponentLocalizer extends BaseLocalizer implements IComponentLocalizer, IService {
    
    //private readonly _component: IBaseComponent;
    private _allSupportedLanguages: ILanguage[] | null = null;
    private _browserLanguageCode: string | null = null;
    private _applicationLocalizer: ILocalizer | null = null;
    private _componentsLocalizer: IComponentsLocalizer | null = null;

    protected constructor(supportedLanguages: ILanguage[], language: string) {
        super(supportedLanguages, language);
        //this._component = component;
    }

    protected getApplicationLocalizer(): ILocalizer | null {
        return this._applicationLocalizer || (this._applicationLocalizer = ServiceProvider.getService(nameof<ILocalizer>()));
    }

    protected getComponentsLocalizer(): IComponentsLocalizer | null {
        return this._componentsLocalizer || (this._componentsLocalizer = ServiceProvider.getService(nameof<IComponentsLocalizer>()));
    }

    protected getSupportedLanguages(): ILanguage[] {
        if (this._allSupportedLanguages == null) {
            const applicationLocalizer: ILocalizer | null = this.getApplicationLocalizer();
            this._allSupportedLanguages = (applicationLocalizer)
                ? applicationLocalizer.supportedLanguages
                : super.getSupportedLanguages();
        }
        return this._allSupportedLanguages;
    }
    
    protected getLanguage(): string {
        let language: string | null = null;

        // const props = this._component.props as ILanguageProps;
        //
        // // Fetch language from component property
        // if (props.language) {
        //     language = (typeof props.language === "function")
        //         ? props.language()
        //         : props.language;
        // }
        //
        // // Fetch language from component settings
        // //TODO:

        // Fetch language from application localizer
        const localizer: ILocalizer | null = this.getApplicationLocalizer();
        if (localizer != null) {
            return localizer.language;
        }

        // Fetch language from browser country
        language = this.browserLanguageCode;

        return language || this.getDefaultLanguage();
    }
    
    public get browserLanguageCode(): string | null {
        if (this._browserLanguageCode == null) {
            const code: string = window.navigator.language.toLowerCase();
            const supportedLanguages: ILanguage[] = this.getSupportedLanguages();
            const supportedLanguage: ILanguage | null = supportedLanguages.find(item => (item.code.toLowerCase() == code) || (item.label.toLowerCase() == code)) || null;
            this._browserLanguageCode = (supportedLanguage) ? supportedLanguage.code : null;
        }
        return this._browserLanguageCode;
    }
    
    public getType(): ServiceType {
        return this.constructor.name;
    }

    public get language(): string {
        return this.getLanguage();
    }

    public getValue(language: string, name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string {
        
        const applicationLocalizer: ILocalizer | null = this.getApplicationLocalizer();
        if ((applicationLocalizer != null) && (applicationLocalizer.contains(name))) {
            return applicationLocalizer.getValue(language, name, ...params);
        }

        const componentsLocalizer: IComponentsLocalizer | null = this.getComponentsLocalizer();
        if ((componentsLocalizer) && (componentsLocalizer.contains(name))) {
            return componentsLocalizer.getValue(language, name, ...params);
        }

        return super.getValue(language, name, ...params);
    }

    public contains(name: string): boolean {
        return super.contains(name);
    }
}