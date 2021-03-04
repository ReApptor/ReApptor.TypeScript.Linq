import {
    AlertModel,
    ApplicationContext,
    BasePageParameters,
    ConfirmationDialogTitleCallback,
    DescriptionModel,
    DocumentPreviewModel,
    IBaseComponent,
    IConfirmation,
    ILayoutPage,
    IManualProps,
    PageRoute,
    SwipeDirection
} from "@weare/athenaeum-react-common";

export interface IWizardPage extends IBasePage {
    prevAsync(): Promise<void>;
    nextAsync(): Promise<void>;
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