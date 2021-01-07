import {AthenaeumConstants, FileModel, ILocalizer, ServiceProvider, Utility} from "@weare/athenaeum-toolkit";
import ApplicationContext from "../models/ApplicationContext";
import {IBasePage, ILayoutPage} from "../base/BasePage";
import ApiProvider from "./ApiProvider";
import {IBaseComponent} from "../base/BaseComponent";
import AlertModel from "../models/AlertModel";
import IUser from "../models/IUser";
import IUserContext from "../models/IUserContext";
import IConfirmation, {ConfirmationDialogTitleCallback} from "../models/IConfirmation";
import DocumentPreviewModel, {DocumentPreviewSize} from "../models/DocumentPreviewModel";
import DescriptionModel from "../models/DescriptionModel";

/**
 * BaseComponent helper
 * Provides helper functions for component initialization
 */
export default class ch {

    private static readonly _initializeCallbacks: (() => Promise<void>)[] = [];
    private static readonly _authorizeCallbacks: (() => Promise<void>)[] = [];
    private static _number: number = 1;
    private static _context: ApplicationContext | null = null;
    private static _layout: ILayoutPage | null = null;
    private static _page: IBasePage | null = null;
    private static _initialized: boolean = false;

    private static async onOnSetLanguageAsync(language: string): Promise<void> {
        try {
            await ApiProvider.postAsync("api/Application/OnSetLanguage", language, null);
        } catch (e) {
            //no additional action needed, not critical
            console.error(e);
        }
    }

    private static async onInitializeAsync(): Promise<void> {
        await Utility.forEachAsync(this._initializeCallbacks, async (callback) => await callback());
    }

    private static async onAuthorizeAsync(): Promise<void> {
        await Utility.forEachAsync(this._authorizeCallbacks, async (callback) => await callback());
    }

    /**
     * Registers component
     * @param component - inherited from IBaseComponent
     */
    public static register(component: IBaseComponent): void {
        const layout = component as (ILayoutPage | null);
        if ((layout) && (layout.isLayout) && (layout.isLayout())) {
            this._layout = layout;
            return;
        }

        const page = component as (IBasePage | null);
        if ((page) && (page.isPage) && (page.isPage())) {
            this._page = page;
            return;
        }
    }

    /**
     * Sets context
     * @param context - ApplicationContext
     */
    public static async setContextAsync(context: ApplicationContext): Promise<void> {
        if (this._context !== context) {

            const authorize: boolean = (this._context != null) && ((this._context as IUserContext).username != (context as IUserContext).username);

            //set context
            this._context = context;

            if (!this._initialized) {
                this._initialized = true;
                await this.onInitializeAsync();
            }
            
            if (authorize) {
                await this.onAuthorizeAsync();
            }

            if (this._layout != null) {

                if (1 == 1)
                    throw new Error("CL DEBUGGING ERROR #1 (setContextAsync CALL).");

                const localizer: ILocalizer | null = ServiceProvider.getLocalizer();
                
                const newLanguage: boolean = (context != null) && (localizer != null) && (localizer.setLanguage(context.language));

                if (newLanguage) {
                    //reload layout
                    await this._layout.reRenderAsync();
                } else {
                    //reload top nav only
                    await this._layout.reloadTopNavAsync();
                }
            }
        }
    }

    public static async alertAsync(alert: AlertModel): Promise<void> {
        if (this._page != null) {
            await this._page.alertAsync(alert);
        }
    }
    
    public static async alertErrorAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        if (this._page != null) {
            await this._page.alertErrorAsync(message, autoClose, flyout);
        }
    }

    public static async flyoutErrorAsync(message: string): Promise<void> {
        if (this._page != null) {
            await this._page.alertErrorAsync(message, true, true);
        }
    }

    public static async alertMessageAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        if (this._page != null) {
            await this._page.alertMessageAsync(message, autoClose, flyout);
        }
    }

    public static async flyoutMessageAsync(message: string): Promise<void> {
        if (this._page != null) {
            await this._page.alertMessageAsync(message, true, true);
        }
    }

    public static async hideAlertAsync(): Promise<void> {
        if (this._page != null) {
            await this._page.hideAlertAsync();
        }
    }

    public static async confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean> {
        return (this._page != null) && (await this._page.confirmAsync(title));
    }

    public static async documentPreviewAsync(endpoint: string, id: string, title: string | null = null, size: DocumentPreviewSize = DocumentPreviewSize.Large): Promise<void> {
        if (this._page != null) {
            const model = new DocumentPreviewModel();
            model.document = async (sender) => await sender.postAsync<FileModel>(endpoint, id);
            model.title = title;
            model.size = size;
            await this._page.documentPreviewAsync(model);
        }
    }

    public static async preloadedDocumentPreviewAsync(document: FileModel, title: string | null = null, size: DocumentPreviewSize = DocumentPreviewSize.Large): Promise<void> {
        if (this._page != null) {
            const model = new DocumentPreviewModel();
            model.document = document;
            model.title = title;
            model.size = size;
            await this._page.documentPreviewAsync(model);
        }
    }

    public static async descriptionAsync(containerId: string, model: DescriptionModel): Promise<void> {
        if (this._page != null) {
            await this._page.descriptionAsync(containerId, model);
        }
    }

    public static async reinitializeContextAsync(): Promise<void> {
        this._context = null;
        if (this._layout != null) {
            await this._layout.reloadAsync();
        }
    }

    public static registerInitializeCallback(callback: () => Promise<void>): void {
        this._initializeCallbacks.push(callback);
    }

    public static registerAuthorizeCallback(callback: () => Promise<void>): void {
        this._authorizeCallbacks.push(callback);
    }

    /**
     * Gets context
     * @returns context - ApplicationContext
     */
    public static getContext(): ApplicationContext {
        if (this._context == null)
            throw Error(`Component helper. Context is not defined.`);
        
        return this._context;
    }
    
    public static get country(): string {
        const context: ApplicationContext = this.getContext();
        return context.country;
    }

    public static get language(): string {
        const context: ApplicationContext = this.getContext();
        return context.language;
    }

    public static findUser<TUser extends IUser>(): TUser | null {
        const context: ApplicationContext | null = this.findContext();
        const userContext: IUserContext | null = context as IUserContext;
        if ((userContext) && (userContext.isUserContext) && (userContext.user) && (userContext.user.username)) {
            return userContext.user;
        }
        return null;
    }

    public static getUser<TUser extends IUser>(): TUser {
        const user: TUser | null = this.findUser();
        if (user) {
            return user;
        }
        throw Error(`Component helper. User is not defined.`);
    }

    public static getUserId(): string {
        return this.getUser().id;
    }

    /**
     * Gets context
     * @returns context - ApplicationContext
     */
    public static findContext(): ApplicationContext | null {
        return this._context;
    }

    public static getSessionId(): string {
        if (this._context) {
            const userContext = this._context as IUserContext;
            if ((userContext.isUserContext) && (userContext.username)) {
                return userContext.username.getHashCode().toString();
            }
        }
        return "";
    }

    public static getApplicationSessionId(): string {
        return (this._context) ? this._context.id : "";
    }
    
    public static async setLanguageAsync(language: string): Promise<void> {
        const localizer: ILocalizer | null = ServiceProvider.getLocalizer();
        if ((localizer) && (localizer.setLanguage(language))) {
            //update context
            if (this._context != null) {
                this._context.language = language;
            }

            //do not await, just notification event
            // noinspection ES6MissingAwait
            ch.onOnSetLanguageAsync(language);
            
            //re-render layout
            const layout: ILayoutPage = this.getLayout();
            await layout.reRenderAsync();
        }
    }

    public static refresh(): void {
        window.location.reload();
    }

    /**
     * Gets Xsrf Token
     * @returns XSRF token if it is specified
     */
    public static getXsrfToken(): string | null {
        return (this._context != null) ? this._context.xsrfToken : null;
    }

    /**
     * Gets layout (All pages are pleced in Layout component)
     * @returns layout - inherited from ILayoutPage
     */
    public static getLayout(): ILayoutPage {
        if (this._layout == null)
            throw Error(`Component helper. Layout is not defined.`);

        return this._layout;
    }

    /**
     * Gets page
     * @returns page - inherited from ILayoutPage
     */
    public static getPage(): IBasePage {
        if (this._page == null)
            throw Error(`Component helper. Page is not defined.`);

        return this._page;
    }

    /**
     * Gets page
     * @returns page - inherited from ILayoutPage
     */
    public static findPage(): IBasePage | null {
        return this._page;
    }

    public static findPageId(): string {
        return (this._page != null) ? this._page.id : "";
    }

    public static findRouteName(): string {
        return (this._page != null) ? this._page.routeName : "";
    }

    public static async swipeLeftAsync(): Promise<void> {
        if (this._layout != null) {
            await this._layout.swipeLeftAsync();
        }
    }

    public static async swipeRightAsync(): Promise<void> {
        if (this._layout != null) {
            await this._layout.swipeRightAsync();
        }
    }

    public static get isDevelopment(): boolean {
        return (this._context != null) && (this._context.isDevelopment);
    }

    public static get isAuthenticated(): boolean {
        const user: IUser | null = this.findUser();
        return (!!user);
    }

    public static get mobileApp(): boolean {
        return (this._context != null) && (this._context.mobileApp);
    }

    public static get mobile(): boolean {
        return !this.desktop;
    }

    public static get desktop(): boolean {
        return (window.innerWidth >= AthenaeumConstants.desktopMinWidth);
    }

    public static get version(): string {
        return (this._context != null) ? (this._context.version) : "";
    }

    public static download(file: FileModel): void {
        if (this._layout != null) {
            this._layout.download(file);
        }
    }
    
    /**
     * Gets unique id
     * @returns id - number
     */
    public static getId(): number {
        return ++this._number;
    }

    /**
     * Gets component id
     * @returns id - number
     */
    public static getComponentId(): string {
        return `_${this.getId()}`;
    }
}