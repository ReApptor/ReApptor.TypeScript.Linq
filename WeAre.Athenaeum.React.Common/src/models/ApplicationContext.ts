import PageRoute from "./PageRoute";
import {WebApplicationType} from "../Enums";
import IApplicationSettings from "./IApplicationSettings";

export default class ApplicationContext<TSettings extends IApplicationSettings = any>  {
    public id: string = "";

    public version: string = "";

    public language: string = "";

    public country: string = "";
    
    public xsrfToken: string | null = null;
    
    public currentPage: PageRoute | null = null;
    
    public applicationName: string = "";

    public trace: string | null = null;

    public timezoneOffset: number = 0;

    public applicationType: WebApplicationType = WebApplicationType.DesktopBrowser;
    
    public settings: TSettings = {} as TSettings;

    public isDevelopment: boolean = false;

    public mobileApp: boolean = false;

    public pwaApp: boolean = false;

    public desktopBrowser: boolean = false;

    public mobileBrowser: boolean = false;

    public isApplicationContext: true = true;
}