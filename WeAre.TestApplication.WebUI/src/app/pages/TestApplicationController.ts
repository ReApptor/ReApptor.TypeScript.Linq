import {ApplicationContext, ch, WebApplicationType} from "@weare/reapptor-react-common";
import {IGoogleApiSettings, IMenuItem, IShoppingCart} from "@weare/reapptor-react-components";
import PageDefinitions from "./PageDefinitions";
import AnonymousTestWithParameters from "./AnonymousTestWithParameters/AnonymousTestWithParameters";
import Tests from "./Tests/Tests";
import AuthorizedTest from "./AuthorizedTest/AuthorizedTest";
import AuthorizedTestWithParameters from "./AuthorizedTestWithParameters/AuthorizedTestWithParameters";


class TestApplicationController {
    private _applicationContext: ApplicationContext | null = null;
    private _initialized: boolean = false;
    private _initializing: boolean = false;

    public async initializeAsync(): Promise<void> {
        if ((!this._initialized) && (!this._initializing)) {
            this._initializing = true;
            try {
                console.log("TestApplicationController.initializeAsync()");
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
        console.log("TestApplicationController.fetchApplicationContextAsync: timezoneOffset=", timezoneOffset, "applicationType=", applicationType);
        const currentPage = PageDefinitions.tests;
        currentPage.parameters = {a: "b"};
        if (this._applicationContext == null) {
            this._applicationContext = new ApplicationContext();
            this._applicationContext.id = ch.getComponentId();
            this._applicationContext.language = "en";
            this._applicationContext.country = "fi";
            this._applicationContext.applicationName = "WeAre.ReApptor.TestApplication";
            this._applicationContext.currentPage = currentPage;
            this._applicationContext.settings = {
                googleMapApiUrl: "https://maps.googleapis.com/maps/",
                googleMapApiKey: "AIzaSyBVcbAv50jbB3VKK-16OJ8kxz7Jn6eT4oc"
            } as IGoogleApiSettings;
        }
        this._applicationContext.applicationType = applicationType;
        this._applicationContext.timezoneOffset = timezoneOffset;
        return this._applicationContext;
    }

    public async tokenLoginAsync(token: string): Promise<void> {
        console.log("TestApplicationController.tokenLoginAsync: token=", token);
    }

    public async fetchTopNavItems(): Promise<IMenuItem[]> {
        return [
            {route: PageDefinitions.anonymous, label: nameof(Tests)},
            {route: PageDefinitions.authorized, label: nameof(AuthorizedTest)},
            {route: PageDefinitions.anonymousWithParams({hello: "world!", world: { key: "hello!" }}), label: nameof(AnonymousTestWithParameters)},
            {route: PageDefinitions.authorizedWithParams({object: {key: "value", another: {hello: true, world: new Date()}}}), label: nameof(AuthorizedTestWithParameters)},
        ];
    }

    public async fetchShoppingCartAsync(): Promise<IShoppingCart> {
        return {
            route: PageDefinitions.tests, productsCount: 1
        }
    }
}

//Singleton
export default new TestApplicationController();