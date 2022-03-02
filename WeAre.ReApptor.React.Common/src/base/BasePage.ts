import {FileModel, ILocalizer, ServiceProvider} from "@weare/reapptor-toolkit";
import BaseComponent, {IBaseComponent} from "./BaseComponent";
import {IAsyncComponent} from "./BaseAsyncComponent";
import AlertModel from "../models/AlertModel";
import ApplicationContext from "../models/ApplicationContext";
import BasePageParameters from "../models/BasePageParameters";
import PageRoute from "../models/PageRoute";
import ch from "../providers/ComponentHelper";
import {DialogResult, MessageBoxButtons, MessageBoxIcon, SwipeDirection} from "../Enums";
import IConfirmation, {ConfirmationDialogTitleCallback} from "../models/IConfirmation";
import IMessageBox, {IMessageBoxButtons, MessageBoxModelCallback} from "../models/IMessageBox";
import DocumentPreviewModel from "../models/DocumentPreviewModel";
import DescriptionModel from "../models/DescriptionModel";
import IPageContainer from "../models/IPageContainer";
import IUser from "../models/IUser";
import IUserContext from "../models/IUserContext";
import PageRouteProvider from "../providers/PageRouteProvider";
import DocumentEventsProvider, {DocumentEventType} from "../providers/DocumentEventsProvider";

export interface IManualProps {
    title?: string;
    manual?: string;
    icon?: string;

    onClick?(): Promise<void>;
}

/**
 * A page contained in an {@link ILayoutPage}.
 */
export interface IBasePage extends IBaseComponent {

    onSwipeHandlerAsync(direction: SwipeDirection): Promise<boolean>;

    /**
     * Display an alert on the {@link IBasePage}.
     * @param alert {@link AlertModel} to create the alert from.
     */
    alertAsync(alert: AlertModel): Promise<void>;

    /**
     * Display an error alert on the {@link IBasePage}.
     *
     * @param message Message to display in the alert.
     * @param autoClose Should the alert be closed automatically after a set period of time.
     */
    alertErrorAsync(message: string, autoClose: boolean): Promise<void>;  // Unnecessary due to the method below (there are no overloads in TS/JS)

    /**
     * Display an error alert on the {@link IBasePage}.
     *
     * @param message Message to display in the alert.
     * @param autoClose Should the alert be closed automatically after a set period of time.
     * @param flyout Should the alert fly-out from the side of the window, instead of being displayed in the top of the {@link IBasePage}.
     */
    alertErrorAsync(message: string, autoClose: boolean, flyout: boolean): Promise<void>;

    /**
     * Display a success alert on the {@link IBasePage}.
     *
     * @param message Message to display in the success alert.
     * @param autoClose Should the alert be closed automatically after a set period of time.
     * @param flyout Should the alert fly-out from the side of the window, instead of being displayed in the top of the {@link IBasePage}.
     */
    alertMessageAsync(message: string, autoClose: boolean, flyout: boolean): Promise<void>;

    /**
     * Hide the alert currently being displayed on the {@link IBasePage}.
     */
    hideAlertAsync(): Promise<void>;

    /**
     * Display a confirmation dialog.
     * @param title Title of the confirmation dialog.
     * @return Result of the confirmation.
     */
    confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean>;

    messageBoxAsync(titleOrModel: string | IMessageBox | MessageBoxModelCallback, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): Promise<DialogResult>;

    documentPreviewAsync(model: DocumentPreviewModel): Promise<void>;

    descriptionAsync(containerId: string, model: DescriptionModel): Promise<void>;

    beforeRedirectAsync(nextRoute: PageRoute, innerRedirect: boolean): Promise<boolean>;

    /**
     * @return The {@link ILayoutPage} which contains the {@link IBasePage}.
     */
    getLayout(): ILayoutPage;

    /**
     * @return The title of the {@link IBasePage}.
     */
    getTitle(): string;

    /**
     * @return The current {@link ApplicationContext}.
     */
    getContext(): ApplicationContext;

    getManualProps(): IManualProps;

    /**
     * Is the {@link IBasePage} a page.
     * @return true
     */
    isPage(): boolean;

    /**
     * Does the {@link IBasePage} have a TopNav.
     */
    readonly hasTopNav: boolean;

    /**
     * Does the {@link IBasePage} have a LeftNav.
     */
    readonly hasLeftNav: boolean;

    /**
     * Does the {@link IBasePage} have a Footer.
     */
    readonly hasFooter: boolean;

    /**
     * The alert currently being displayed in the {@link IBasePage}.
     */
    readonly alert: AlertModel | null;

    /**
     * Name of the {@link IBasePage}'s {@link route}.
     */
    readonly routeName: string;

    /**
     * Index of the {@link IBasePage}'s {@link route}.
     */
    readonly routeIndex: number | null;

    /**
     * Id of the {@link IBasePage}'s {@link route}.
     */
    readonly routeId: string | null;

    /**
     * Parameters of the {@link IBasePage}'s {@link route}.
     */
    readonly parameters: BasePageParameters | null;

    /**
     * Route of the {@link IBasePage}.
     */
    readonly route: PageRoute;

    /**
     * Should {@link window.URL} be updated automatically when the {@link IBasePage} is loaded.
     * Has effect only if {@link ILayoutPage.useRouting} is set to true.
     *
     * @default false
     */
    readonly automaticUrlChange?: boolean;
}

/**
 * A base layout page containing an {@link IBasePage}.
 */
export interface ILayoutPage extends IAsyncComponent {

    /**
     * Set an {@link IBasePage} to the {@link ILayoutPage}.
     */
    setPageAsync(page: IBasePage): Promise<void>;

    /**
     * Reload the {@link ILayoutPage}'s TopNav.
     */
    reloadTopNavAsync(): Promise<void>;

    /**
     * Reload the {@link ILayoutPage}'s LeftNav.
     */
    reloadLeftNavAsync(): Promise<void>;

    /**
     * Perform a swipe to the left on the {@link ILayoutPage}.
     */
    swipeLeftAsync(): Promise<void>;

    /**
     * Perform a swipe to the right on the {@link ILayoutPage}.
     */
    swipeRightAsync(): Promise<void>;

    /**
     * Display an alert on the {@link ILayoutPage}.
     */
    alertAsync(alert: AlertModel): Promise<void>;

    /**
     * Hide the alert currently being displayed in the {@link ILayoutPage}.
     */
    hideAlertAsync(): Promise<void>;

    /**
     * Is the {@link ILayoutPage} a layout.
     */
    isLayout(): boolean;

    /**
     * Initialize tooltips in the {@link ILayoutPage}.
     */
    initializeTooltips(): void;

    /**
     * Reinitialize tooltips in the {@link ILayoutPage}.
     */
    reinitializeTooltips(): void;

    /**
     * Download a file.
     * @param file File to download.
     */
    download(file: FileModel): void;


    /**
     * Take a picture (file) from camera of file storage.
     * @param camera True to take a picture from camera (outward-facing camera, "capture:environment").
     */
    takePictureAsync(camera?: boolean): Promise<FileModel | null>;

    /**
     * Does the {@link ILayoutPage} have a TopNav.
     */
    readonly hasTopNav: boolean;

    /**
     * Does the {@link ILayoutPage} have a LeftNav.
     */
    readonly hasLeftNav: boolean;

    /**
     * Does the {@link ILayoutPage} have a Footer.
     */
    readonly hasFooter: boolean;

    /**
     * The {@link AlertModel} currently being displayed in the {@link ILayoutPage}.
     */
    readonly alert: AlertModel | null;

    setSpinnerAsync(isSpinning: boolean): Promise<void>;    // Duplicated from ISpinner.

    isSpinning(): boolean;  // Duplicated from ISpinner.

    /**
     * Should routing functionalities be enabled application-wide.
     *
     * @default false
     */
    readonly useRouting?: boolean;
}

export interface IBasePageConstructor {
    new(props: any | null): IBasePage;
}

export interface IBasePageProps<TParams extends BasePageParameters> {
    routeName: string;
    routeIndex?: number;
    routeId?: string;
    parameters?: TParams;
    automaticUrlChange?: boolean;
}

export interface IIsLoading {
    onIsLoading(): Promise<void>;
}

/**
 * Base class for pages.
 */
export default abstract class BasePage<TParams extends BasePageParameters, TState, TContext extends ApplicationContext> extends BaseComponent<IBasePageProps<TParams>, TState> implements IBasePage {

    private readonly _asIsLoading: IIsLoading | null;

    private asIsLoading(): IIsLoading | null {
        const instance = (this as any) as (IIsLoading | null);
        if ((instance != null) && (typeof instance.onIsLoading === "function")) {
            return instance;
        }
        return null;
    }

    protected constructor(props: IBasePageProps<TParams> | null = null) {
        super(props || ({} as IBasePageProps<TParams>));

        this._asIsLoading = this.asIsLoading();
    }

    private async setPageUrlAsync(): Promise<void> {

        const page: IBasePage = this.getPage();

        if (!page?.automaticUrlChange || !this.useRouting) {
            return;
        }

        document.title = page.getTitle();

        await PageRouteProvider.changeUrlWithRouteWithoutReloadAsync(page.route);
    }

    /**
     * @return User of current {@link IUserContext}.
     * @see ch.getContext
     */
    public findUser<TUser extends IUser>(): TUser | null {
        return (ch.getContext() as IUserContext).user || null;
    }

    /**
     * @return Username of current {@link IUserContext}.
     * @see ch.getContext
     */
    public get username(): string | null {
        return (ch.getContext() as IUserContext).username || null;
    }

    /**
     * @return Is {@link username} defined.
     */
    public get isAuthorized(): boolean {
        return (!!this.username);
    }

    /**
     * @see ch.flyoutErrorAsync
     */
    public static async flyoutErrorAsync(message: string): Promise<void> {
        await ch.flyoutErrorAsync(message);
    }

    /**
     * @see ch.flyoutMessageAsync
     */
    public static async flyoutMessageAsync(message: string): Promise<void> {
        await ch.flyoutMessageAsync(message);
    }

    /**
     * @see ch.alertWarningAsync
     */
    public async alertWarningAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        return ch.alertWarningAsync(message, autoClose, flyout);
    }

    /**
     * @see ch.flyoutWarningAsync
     */
    public static async flyoutWarningAsync(message: string): Promise<void> {
        await ch.flyoutWarningAsync(message);
    }

    /**
     * @return ""
     */
    public getManual(): string {
        return "";
    }


    // BaseComponent


    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this._asIsLoading) {
            DocumentEventsProvider.register(this.id, DocumentEventType.IsLoading, async () => await this._asIsLoading!.onIsLoading());
        }

        await this.setPageUrlAsync();
    }

    public async componentWillUnmount(): Promise<void> {

        if (this._asIsLoading) {
            DocumentEventsProvider.unregister(this.id, DocumentEventType.IsLoading);
        }

        await super.componentWillUnmount();
    }


    // IBasePage


    /**
     * @inheritDoc
     *
     * Does nothing and returns.
     * @return true
     */
    public async onSwipeHandlerAsync(direction: SwipeDirection): Promise<boolean> {
        return true;
    }

    /**
     * @inheritDoc
     * @see ch.alertAsync
     */
    public async alertAsync(alert: AlertModel): Promise<void> {
        await ch.alertAsync(alert);
    }

    /**
     * @inheritDoc
     * @see ch.alertErrorAsync
     */
    public async alertErrorAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        return ch.alertErrorAsync(message, autoClose, flyout);
    }

    /**
     * @inheritDoc
     * @see ch.alertMessageAsync
     */
    public async alertMessageAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        return ch.alertMessageAsync(message, autoClose, flyout);
    }

    /**
     * @inheritDoc
     * @see ch.hideAlertAsync
     */
    public async hideAlertAsync(): Promise<void> {
        return ch.hideAlertAsync();
    }

    /**
     * @inheritDoc
     * @see IPageContainer.confirmAsync
     */
    public async confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        return (pageContainer != null) && (await pageContainer.confirmAsync(title));
    }

    public async messageBoxAsync(titleOrModel: string | IMessageBox | MessageBoxModelCallback, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): Promise<DialogResult> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        return (pageContainer != null)
            ? await pageContainer.messageBoxAsync(titleOrModel, caption, buttons, icon)
            : DialogResult.None;
    }

    public async documentPreviewAsync(model: DocumentPreviewModel): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        if (pageContainer != null) {
            await pageContainer.documentPreviewAsync(model);
        }
    }

    public async descriptionAsync(containerId: string, model: DescriptionModel): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        if (pageContainer != null) {
            await pageContainer.descriptionAsync(containerId, model);
        }
    }

    /**
     * @inheritDoc
     *
     * Does nothing and returns.
     * @return true
     */
    public async beforeRedirectAsync(nextRoute: PageRoute, innerRedirect: boolean): Promise<boolean> {
        return true;
    }

    /**
     * @inheritDoc
     * @see ch.getLayout
     */
    public getLayout(): ILayoutPage {
        return ch.getLayout();
    }

    public getTitle(): string {
        const titleLocalizationItem: string = `${this.routeName}Page.Title`;
        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();
        return ((localizer != null) && (localizer.contains(titleLocalizationItem)))
            ? localizer.get(titleLocalizationItem)
            : this.routeName;
    }

    /**
     * @inheritDoc
     * @see ch.getContext
     */
    public getContext(): TContext {
        return ch.getContext() as TContext;
    }

    public getManualProps(): IManualProps {
        return {
            manual: this.getManual()
        }
    }

    /**
     * @inheritDoc
     * @return true
     */
    public isPage(): boolean {
        return true;
    }

    /**
     * @inheritDoc
     * Can be overridden in a page class to show/hide top navigation menu.
     * @return true
     */
    public get hasTopNav(): boolean {
        return true;
    }

    /**
     * @inheritDoc
     * Can be overridden in a page class to show/hide left navigation menu.
     * @return true
     */
    public get hasLeftNav(): boolean {
        return true;
    }

    /**
     * @inheritDoc
     * @return true
     */
    public get hasFooter(): boolean {
        return true;
    }

    public get alert(): AlertModel | null {
        return ch.alert;
    }

    public get routeName(): string {
        return this.props.routeName;
    }

    public get routeIndex(): number | null {
        return (this.props.routeIndex != null)
            ? this.props.routeIndex
            : null;
    }

    public get routeId(): string | null {
        return (this.props.routeId != null)
            ? this.props.routeId
            : null;
    }

    public get parameters(): BasePageParameters | null {
        return this.props.parameters || null;
    }

    public get route(): PageRoute {
        return new PageRoute(this.routeName, this.routeIndex, this.routeId, this.parameters);
    }

    public get automaticUrlChange(): boolean {
        return !!this.props.automaticUrlChange;
    }
}