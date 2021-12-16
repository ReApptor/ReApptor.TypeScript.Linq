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
import {FileModel, ILocalizer, ServiceProvider} from "@weare/athenaeum-toolkit";
import DocumentEventsProvider, {DocumentEventType} from "../providers/DocumentEventsProvider";
import {PageRouteProvider} from "../index";


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
     */
    alertAsync(alert: AlertModel): Promise<void>;

    /**
     * Display an error alert on the {@link IBasePage}.
     */
    alertErrorAsync(message: string, autoClose: boolean): Promise<void>;

    /**
     * Display an error alert on the {@link IBasePage}.
     */
    alertErrorAsync(message: string, autoClose: boolean, flyout: boolean): Promise<void>;

    /**
     * Display a success alert on the {@link IBasePage}.
     */
    alertMessageAsync(message: string, autoClose: boolean, flyout: boolean): Promise<void>;

    /**
     * Hide the alert currently being displayed on the {@link IBasePage}.
     */
    hideAlertAsync(): Promise<void>;

    confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean>;

    messageBoxAsync(titleOrModel: string | IMessageBox | MessageBoxModelCallback, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): Promise<DialogResult>;

    documentPreviewAsync(model: DocumentPreviewModel): Promise<void>;

    descriptionAsync(containerId: string, model: DescriptionModel): Promise<void>;

    beforeRedirectAsync(nextRoute: PageRoute, innerRedirect: boolean): Promise<boolean>;

    /**
     * Get the {@link ILayoutPage} which contains the {@link IBasePage}.
     */
    getLayout(): ILayoutPage;

    /**
     * Get the title of the {@link IBasePage}.
     */
    getTitle(): string;

    getContext(): ApplicationContext;

    getManualProps(): IManualProps;

    /**
     * Returns true.
     */
    isPage(): boolean;

    readonly hasTopNav: boolean;
    readonly hasFooter: boolean;

    /**
     * The alert currently being displayed in the page.
     */
    readonly alert: AlertModel | null;
    readonly routeName: string;
    readonly routeIndex: number | null;
    readonly routeId: string | null;
    readonly parameters: BasePageParameters | null;
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
 * A page containing an {@link IBasePage}.
 */
export interface ILayoutPage extends IAsyncComponent {

    /**
     * Set an {@link IBasePage} to the {@link ILayoutPage}.
     */
    setPageAsync(page: IBasePage): Promise<void>;

    reloadTopNavAsync(): Promise<void>;

    setSpinnerAsync(isSpinning: boolean): Promise<void>;

    swipeLeftAsync(): Promise<void>;

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
     * Does the {@link ILayoutPage} have a spinner.
     */
    isSpinning(): boolean;

    /**
     * Returns true.
     */
    isLayout(): boolean;

    initializeTooltips(): void;

    reinitializeTooltips(): void;

    download(file: FileModel): void;

    readonly hasTopNav: boolean;
    readonly hasFooter: boolean;
    readonly alert: AlertModel | null;

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
 * Implementation of {@link IBasePage}.
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

    public isPage(): boolean {
        return true;
    }

    protected constructor(props: IBasePageProps<TParams> | null = null) {
        super(props || ({} as IBasePageProps<TParams>));

        this._asIsLoading = this.asIsLoading();
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this._asIsLoading) {
            DocumentEventsProvider.register(this.id, DocumentEventType.IsLoading, async () => await this._asIsLoading!.onIsLoading());
        }

        await this.setPageUrlAsync();
    }

    private async setPageUrlAsync(): Promise<void> {

        const page: IBasePage = this.getPage();

        if (!page?.automaticUrlChange || !this.useRouting) {
            return;
        }

        document.title = page.getTitle();

        await PageRouteProvider.changeUrlWithRouteWithoutReloadAsync(page.route);
    }

    public async componentWillUnmount(): Promise<void> {

        if (this._asIsLoading) {
            DocumentEventsProvider.unregister(this.id, DocumentEventType.IsLoading);
        }

        await super.componentWillUnmount();
    }

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

    public getContext(): TContext {
        return ch.getContext() as TContext;
    }

    public findUser<TUser extends IUser>(): TUser | null {
        return (ch.getContext() as IUserContext).user || null;
    }

    public get username(): string | null {
        return (ch.getContext() as IUserContext).username || null;
    }

    public get isAuthorized(): boolean {
        return (!!this.username);
    }

    public get routeName(): string {
        return this.props.routeName;
    }

    public get routeIndex(): number | null {
        return (this.props.routeIndex != null) ? this.props.routeIndex : null;
    }

    public get automaticUrlChange(): boolean {
        return !!this.props.automaticUrlChange;
    }

    public get routeId(): string | null {
        return (this.props.routeId != null) ? this.props.routeId : null;
    }

    public get parameters(): BasePageParameters | null {
        return this.props.parameters || null;
    }

    public get route(): PageRoute {
        return new PageRoute(this.routeName, this.routeIndex, this.routeId, this.parameters);
    }

    public get hasTopNav(): boolean {
        return true;
    }

    public get hasFooter(): boolean {
        return true;
    }

    /**
     * Display an alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public async alertAsync(alert: AlertModel): Promise<void> {
        await ch.alertAsync(alert);
    }

    /**
     * The alert currently displayed on the {@link ILayoutPage} which contains the {@link IBasePage}.
     */
    public get alert(): AlertModel | null {
        return ch.alert;
    }

    /**
     * Display an error alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public async alertErrorAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        return ch.alertErrorAsync(message, autoClose, flyout);
    }

    /**
     * Display a flyout error alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async flyoutErrorAsync(message: string): Promise<void> {
        await ch.flyoutErrorAsync(message);
    }

    /**
     * Display an alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public async alertMessageAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        return ch.alertMessageAsync(message, autoClose, flyout);
    }

    /**
     * Display a flyout alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async flyoutMessageAsync(message: string): Promise<void> {
        await ch.flyoutMessageAsync(message);
    }

    /**
     * Display a warning alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public async alertWarningAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        return ch.alertWarningAsync(message, autoClose, flyout);
    }

    /**
     * Display a flyout warning alert on the {@link ILayoutPage} which contains the {@link IBasePage}.
     *
     * NOTE: Only one alert can be displayed at the same time. If a previous alert exists, it will be overwritten by the new one.
     */
    public static async flyoutWarningAsync(message: string): Promise<void> {
        await ch.flyoutWarningAsync(message);
    }

    /**
     * Hide the alert currently being displayed on the {@link ILayoutPage} which contains the {@link IBasePage}.
     */
    public async hideAlertAsync(): Promise<void> {
        return ch.hideAlertAsync();
    }

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

    public async onSwipeHandlerAsync(direction: SwipeDirection): Promise<boolean> {
        return true;
    }

    public async beforeRedirectAsync(nextRoute: PageRoute, innerRedirect: boolean): Promise<boolean> {
        return true;
    }

    public getManual(): string {
        return "";
    }

    public getManualProps(): IManualProps {
        return {
            manual: this.getManual()
        }
    }
}