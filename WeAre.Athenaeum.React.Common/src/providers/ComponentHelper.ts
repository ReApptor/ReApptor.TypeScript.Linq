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
import {AlertType, DialogResult, MessageBoxButtons, MessageBoxIcon} from "../Enums";
import IMessageBox, {IMessageBoxButtons, MessageBoxModelCallback} from "../models/IMessageBox";

/**
 * BaseComponent helper.
 * Provides helper functions for component initialization.
 */
export default class ch {

    private static readonly _initializeCallbacks: (() => Promise<void>)[] = [];
    private static readonly _authorizeCallbacks: (() => Promise<void>)[] = [];
    private static _context: ApplicationContext | null = null;
    private static _layout: ILayoutPage | null = null;
    private static _page: IBasePage | null = null;
    private static _initialized: boolean = false;
    private static _debug: boolean = false;

    private static async onOnSetLanguageAsync(language: string): Promise<void> {
        try {
            await ApiProvider.postAsync("/api/Application/OnSetLanguage", language, null);
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

            const authorize: boolean = (!!this._context) && ((this._context as IUserContext).username !== (context as IUserContext).username);
            
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

                const localizer: ILocalizer | null = ServiceProvider.findLocalizer();

                const newLanguage: boolean = (context != null) && (localizer != null) && (localizer.setLanguage(context.language));
                const newCountry: boolean = (context != null) && ((this._context == null) || (this._context.country != context.country));

                if ((newCountry) || (newLanguage)) {
                    //reload layout
                    await this._layout.reRenderAsync();
                } else {
                    //reload top nav only
                    await this._layout.reloadTopNavAsync();
                }
            }
        }
    }

    public static async reloadTopNavAsync(): Promise<void> {
        if (this._layout != null) {
            await this._layout.reloadTopNavAsync();
        }
    }

    public static reloadTopNav(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.reloadTopNavAsync();
    }

    /**
     * Display an alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     *
     * @param alert Alert to be displayed in the {@link ILayoutPage}.
     */
    public static async alertAsync(alert: AlertModel): Promise<void> {
        if (this._layout != null) {
            await this._layout.alertAsync(alert);
        }
    }

    /**
     * The alert being displayed in the current {@link ILayoutPage}.
     */
    public static get alert(): AlertModel | null {
        return (this._layout != null) ? this._layout.alert : null;
    }

    /**
     * Display an error alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async alertErrorAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        const alert = new AlertModel(message, AlertType.Danger, autoClose, flyout);
        await this.alertAsync(alert);
    }

    /**
     * Display a flyout error alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async flyoutErrorAsync(message: string): Promise<void> {
        await this.alertErrorAsync(message, true, true);
    }

    /**
     * Display an alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async alertMessageAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        const alert = new AlertModel(message, AlertType.Success, autoClose, flyout);
        await this.alertAsync(alert);
    }

    /**
     * Display a flyout alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async flyoutMessageAsync(message: string): Promise<void> {
        await this.alertMessageAsync(message, true, true);
    }

    /**
     * Display a warning alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async alertWarningAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        const alert = new AlertModel(message, AlertType.Warning, autoClose, flyout);
        await this.alertAsync(alert);
    }

    /**
     * Display a flyout warning alert in the current {@link ILayoutPage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async flyoutWarningAsync(message: string): Promise<void> {
        await this.alertWarningAsync(message, true, true);
    }

    /**
     * Hide the alert being displayed in the current {@link ILayoutPage}.
     */
    public static async hideAlertAsync(): Promise<void> {
        if (this._layout != null) {
            await this._layout.hideAlertAsync();
        }
    }

    public static async confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean> {
        return (this._page != null) && (await this._page.confirmAsync(title));
    }

    public static async messageBoxAsync(titleOrModel: string | IMessageBox | MessageBoxModelCallback, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): Promise<DialogResult> {
        return (this._page != null)
            ? (await this._page.messageBoxAsync(titleOrModel, caption, buttons, icon))
            : DialogResult.None;
    }

    public static async documentPreviewAsync(endpoint: string, request: any, title: string | null = null, size: DocumentPreviewSize = DocumentPreviewSize.Large): Promise<void> {
        if (this._page != null) {
            const model = new DocumentPreviewModel();
            model.document = async (sender) => await sender.postAsync<FileModel>(endpoint, request);
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
     * @returns Current {@link ApplicationContext}.
     *
     * @throws Current {@link ApplicationContext} is not defined.
     */
    public static getContext(): ApplicationContext {
        if (this._context == null)
            throw Error(`Component helper. Context is not defined.`);

        return this._context;
    }

    /**
     * @returns Current {@link ApplicationContext}, or null if not defined.
     */
    public static findContext(): ApplicationContext | null {
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

    public static getUser<TUser extends IUser>(): TUser {
        const user: TUser | null = this.findUser();
        if (user) {
            return user;
        }
        throw Error(`Component helper. User is not defined.`);
    }

    public static findUser<TUser extends IUser>(): TUser | null {
        const context: ApplicationContext | null = this.findContext();
        const userContext: IUserContext | null = context as IUserContext;
        if ((userContext) && (userContext.isUserContext) && (userContext.user) && (userContext.user.username)) {
            return userContext.user;
        }
        return null;
    }

    public static getUserId(): string {
        return this.getUser().id;
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
        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();
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

    /**
     * Reload the current page.
     */
    public static refresh(): void {
        window.location.reload();
    }

    public static async reRenderAsync(): Promise<void> {
        const page: IBasePage | null = this.findPage();
        if (page) {
            await page.reRenderAsync();
        }
    }

    /**
     * Gets Xsrf Token
     * @returns XSRF token if it is specified
     */
    public static getXsrfToken(): string | null {
        return (this._context != null) ? this._context.xsrfToken : null;
    }

    /**
     * @returns Current {@link ILayoutPage}.
     *
     * @throws {Error} Current {@link ILayoutPage} is not specified.
     */
    public static getLayout(): ILayoutPage {
        if (this._layout == null)
            throw Error(`Component helper. Layout is not defined.`);

        return this._layout;
    }

    /**
     * @returns Current {@link IBasePage}.
     *
     * @throws {Error} Current {@link IBasePage} is not defined.
     */
    public static getPage(): IBasePage {
        if (this._page == null)
            throw Error(`Component helper. Page is not defined.`);

        return this._page;
    }

    /**
     * @returns Current {@link IBasePage}, or null if not defined.
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

    /**
     * Is the current window width below the desktop threshold width {@link AthenaeumConstants.desktopMinWidth}.
     */
    public static get mobile(): boolean {
        return !this.desktop;
    }

    /**
     * Is the current window width above the desktop threshold width {@link AthenaeumConstants.desktopMinWidth}.
     */
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
        return Utility.getId();
    }

    /**
     * Gets component id
     * @returns id - number
     */
    public static getComponentId(): string {
        return Utility.getComponentId();
    }

    public static get debug(): boolean {
        return this._debug;
    }

    public static set debug(value: boolean) {
        this._debug = value;
    }
}