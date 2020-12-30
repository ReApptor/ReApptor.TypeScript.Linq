import {FileModel, ILocalizer, ServiceProvider} from "@weare/athenaeum-toolkit";
import BaseComponent, {IBaseComponent} from "./BaseComponent";
import {IAsyncComponent} from "./BaseAsyncComponent";
import AlertModel from "../models/AlertModel";
import ApplicationContext from "../models/ApplicationContext";
import BasePageParameters from "../models/BasePageParameters";
import PageRoute from "../models/PageRoute";
import ch from "../providers/ComponentHelper";
import {AlertType, SwipeDirection} from "../Enums";
import DocumentEventsProvider, {DocumentEventType} from "../providers/DocumentEventsProvider";
import {ConfirmationDialogTitleCallback, IConfirmation} from "../models/IConfirmation";
import DocumentPreviewModel from "../models/DocumentPreviewModel";
import {DescriptionModel} from "../models/DescriptionModel";
import IPageContainer from "../models/IPageContainer";
import UserContext from "../models/UserContext";
import IUser from "../models/IUser";

export interface IManualProps {
    manual?: string;
    icon?: string;
    onClick?(): Promise<void>;
}

export interface IBasePage extends IBaseComponent {
    onSwipeHandlerAsync(direction: SwipeDirection): Promise<boolean>;

    alertAsync(alert: AlertModel): Promise<void>;

    alertErrorAsync(message: string, autoClose: boolean): Promise<void>;

    alertErrorAsync(message: string, autoClose: boolean, flyout: boolean): Promise<void>;

    alertMessageAsync(message: string, autoClose: boolean, flyout: boolean): Promise<void>;

    hideAlertAsync(): Promise<void>;

    confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean>;

    documentPreviewAsync(model: DocumentPreviewModel): Promise<void>;

    descriptionAsync(containerId: string, model: DescriptionModel): Promise<void>;

    getLayout(): ILayoutPage;

    getTitle(): string;

    getContext(): ApplicationContext;

    getManualProps(): IManualProps;

    isPage(): boolean;

    routeName: string;
    routeIndex: number | null;
    routeId: string | null;
    parameters: BasePageParameters | null;
    route: PageRoute;
}

export interface ILayoutPage extends IAsyncComponent {
    setPageAsync(page: IBasePage): Promise<void>;

    reloadTopNavAsync(): Promise<void>;

    setSpinnerAsync(isSpinning: boolean): Promise<void>;

    swipeLeftAsync(): Promise<void>;

    swipeRightAsync(): Promise<void>;

    isSpinning(): boolean;

    isLayout(): boolean;

    initializeTooltips(): void;

    reinitializeTooltips(): void;

    download(file: FileModel): void;
}

export interface IBasePageConstructor {
    new(props: any | null): IBasePage;
}

export interface IBasePageProps<TParams extends BasePageParameters> {
    routeName: string;
    routeIndex?: number;
    routeId?: string;
    parameters?: TParams;
}

export interface IIsLoading {
    onIsLoading(): Promise<void>;
}

export default abstract class BasePage<TParams extends BasePageParameters, TState, TContext extends ApplicationContext> extends BaseComponent<IBasePageProps<TParams>, TState> implements IBasePage {

    private readonly _asIsLoading: IIsLoading | null;

    private asIsLoading(): IIsLoading | null {
        const instance = (this as any) as (IIsLoading | null);
        if ((instance != null) && (typeof instance.onIsLoading === "function")) {
            return instance;
        }
        return null;
    }

    public isPage(): boolean { return true; }

    protected constructor(props: IBasePageProps<TParams> | null = null) {
        super(props || ({} as IBasePageProps<TParams>));

        this._asIsLoading = this.asIsLoading();
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this._asIsLoading) {
            DocumentEventsProvider.register(this.id, DocumentEventType.IsLoading, async () => await this._asIsLoading!.onIsLoading());
        }
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
        const localizer: ILocalizer | null = ServiceProvider.getLocalizer();
        return ((localizer != null) && (localizer.contains(titleLocalizationItem)))
            ? localizer.get(titleLocalizationItem)
            : this.routeName;
    }
           
    public getContext(): TContext {
        return ch.getContext() as TContext;
    }

    public findUser(): IUser | null {
        return (ch.getContext() as UserContext).user || null;
    }

    public get username(): string | null {
        return (ch.getContext() as UserContext).username || null;
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

    public get routeId(): string | null {
        return (this.props.routeId != null) ? this.props.routeId : null;
    }

    public get parameters(): BasePageParameters | null {
        return this.props.parameters || null;
    }

    public get route(): PageRoute {
        return new PageRoute(this.routeName, this.routeIndex, this.routeId, this.parameters);
    }

    public async alertAsync(alert: AlertModel): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService("IPageContainer");
        if (pageContainer != null) {
            await pageContainer.alertAsync(alert);
        }
    }

    public get alert(): AlertModel | null {
        const pageContainer: IPageContainer | null = ServiceProvider.getService("IPageContainer");
        return (pageContainer != null) ? pageContainer.alert : null;
    }

    public async alertErrorAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        let alert: AlertModel = new AlertModel();
        alert.alertType = AlertType.Danger;
        alert.message = message;
        alert.autoClose = autoClose;
        alert.flyout = flyout;
        await this.alertAsync(alert);
    }

    public async alertMessageAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        let alert: AlertModel = new AlertModel();
        alert.alertType = AlertType.Success;
        alert.message = message;
        alert.autoClose = autoClose;
        alert.flyout = flyout;
        await this.alertAsync(alert);
    }

    public async alertWarningAsync(message: string, autoClose: boolean = false, flyout: boolean = false): Promise<void> {
        let alert: AlertModel = new AlertModel();
        alert.alertType = AlertType.Warning;
        alert.message = message;
        alert.autoClose = autoClose;
        alert.flyout = flyout;
        await this.alertAsync(alert);
    }

    public async hideAlertAsync(): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService("IPageContainer");
        if (pageContainer != null) {
            await pageContainer.hideAlertAsync();
        }
    }

    public async confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService("IPageContainer");
        return (pageContainer != null) && (await pageContainer.confirmAsync(title));
    }

    public async documentPreviewAsync(model: DocumentPreviewModel): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService("IPageContainer");
        if (pageContainer != null) {
            await pageContainer.documentPreviewAsync(model);
        }
    }

    public async descriptionAsync(containerId: string, model: DescriptionModel): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService("IPageContainer");
        if (pageContainer != null) {
            await pageContainer.descriptionAsync(containerId, model);
        }
    }

    public async onSwipeHandlerAsync(direction: SwipeDirection): Promise<boolean> {
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