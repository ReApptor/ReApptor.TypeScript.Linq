import {ApplicationContext, ch, WebApplicationType} from "@weare/athenaeum-react-common";
import PageDefinitions from "@/pages/PageDefinitions";

class TestApplicationController {
    private _applicationContext: ApplicationContext | null = null;
    private _initialized: boolean = false;
    private _initializing: boolean = false;

    public async initializeAsync(): Promise<void> {
        if ((!this._initialized) && (!this._initializing)) {
            this._initializing = true;
            try {
                //TODO: place for initialization
                this._initialized = true;
            } finally {
                this._initializing = false;
            }
        }
    }

    public async authorizeAsync(): Promise<void> {
        if (!this._initializing) {
            this._initialized = false;
            await this.initializeAsync();
        }
    }
    
    public async fetchApplicationContextAsync(timezoneOffset: number, applicationType: WebApplicationType): Promise<ApplicationContext> {
        console.log("fetchApplicationContextAsync: timezoneOffset=", timezoneOffset, "applicationType=", applicationType);
        if (this._applicationContext == null) {
            this._applicationContext = new ApplicationContext();
            this._applicationContext.id = ch.getComponentId();
            this._applicationContext.language = "en";
            this._applicationContext.country = "fi";
            this._applicationContext.applicationName = "WeAre.Athenaeum.TestApplication";
            this._applicationContext.currentPage = PageDefinitions.testsRoute;
        }
        this._applicationContext.applicationType = applicationType;
        this._applicationContext.timezoneOffset = timezoneOffset;
        return this._applicationContext;
    }
    
    public async tokenLoginAsync(token: string): Promise<void> {
        console.log("tokenLoginAsync: token=", token);
    }
}

//Singleton
export default new TestApplicationController();