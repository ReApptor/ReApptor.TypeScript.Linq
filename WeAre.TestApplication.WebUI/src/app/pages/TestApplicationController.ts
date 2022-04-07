import {Utility} from "@weare/reapptor-toolkit";
import {ApplicationContext, ch, IUserContext, WebApplicationType} from "@weare/reapptor-react-common";
import {IGoogleApiSettings, ILeftNavProps, IMenuItem, IShoppingCart, ITopNavNotifications, ITopNavProfile} from "@weare/reapptor-react-components";
import PageDefinitions from "./PageDefinitions";
import AnonymousTestWithParameters from "./AnonymousTestWithParameters/AnonymousTestWithParameters";
import Tests from "./Tests/Tests";
import AuthorizedTest from "./AuthorizedTest/AuthorizedTest";
import AuthorizedTestWithParameters from "./AuthorizedTestWithParameters/AuthorizedTestWithParameters";

import styles from "./../App.module.scss"

class TestApplicationController {
    private _applicationContext: ApplicationContext | null = null;
    private _initialized: boolean = false;
    private _initializing: boolean = false;
    private _leftNav: ILeftNavProps | null = null;

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
            this._applicationContext.applicationName = "WeAre.Athenaeum.TestApplication";
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

    public get applicationContext(): ApplicationContext | null {
        return this._applicationContext;
    }

    public async signInAsync(): Promise<void> {
        if (this.applicationContext) {
            const username: string = "test.console@weare.fi";

            const context = (Utility.clone(this.applicationContext)) as IUserContext;
            context.isUserContext = true;
            context.id = ch.getComponentId();
            context.username = username;
            context.user = {
                isUser: true,
                id: ch.getComponentId(),
                username: username,
                fullName: "Test Console",
                role: {
                    roleName: "Admin",
                }
            };

            console.log("TestApplicationController.signInAsync username=", username);

            await ch.setContextAsync(context);
        }
    }

    public async signOutAsync(): Promise<void> {
        if (this.applicationContext) {
            console.log("TestApplicationController.signOutAsync");

            await ch.setContextAsync(this.applicationContext);
        }
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

    public getNotifications(): ITopNavNotifications {
        return {
            count: 12,
            onClick: async () => alert("Notifications onCLick!")
        }
    }

    public profile(): ITopNavProfile | null {
        return {
            items: [
                {
                    route: PageDefinitions.tests,
                    label: "Tests",
                    icon: "far check-double",
                },
                {
                    //route: PageDefinitions.dummyRoute,
                    route: async () => alert("Settings!"),
                    label: "Settings",
                    icon: "far fa-cog",
                },
                {
                    //route: PageDefinitions.dummyRoute,
                    route: async () => alert("Routes!"),
                    label: "Routes",
                    icon: "fas fa-route",
                    count: 1
                },
                {
                    //route: PageDefinitions.dummyRoute,
                    route: async () => alert("Notifications!"),
                    label: "My notifications to test count",
                    icon: "fal fa-comment-alt check",
                    count: () => 3,
                    countClassName: styles.menuItemCountTransparent
                },
                //Separator:
                {
                    label: "-",
                    bottom: true
                },
                {
                    //route: PageDefinitions.dummyRoute,
                    route: async () => {
                        await _controller.signOutAsync();
                        await ch.reRenderAsync();
                    },
                    label: "Logout from the app",
                    icon: "fal fa-sign-out-alt",
                    bottom: true
                }
            ],
            userProfile: {
                userFullName: "Andrey Popov",
                roleName: "Administrator",
                rating: 4
            }
        }
    }

    public get leftNav(): ILeftNavProps | null {
        return this._leftNav;
    }

    public async switchLeftNavAsync(enable: boolean): Promise<void> {
        const enabled: boolean = (this._leftNav != null);

        if (enabled != enable) {
            this._leftNav = (enable)
                ? {}
                : null;

            await ch.reloadLeftNavAsync();
        }
    }
}

//Singleton
let _controller: TestApplicationController;
export default (_controller = new TestApplicationController());