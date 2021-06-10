import React from "react";
import {ServiceProvider, Utility} from "@weare/athenaeum-toolkit";
import {ch, IBasePage, IManualProps, AlertModel, DescriptionModel, DocumentPreviewModel, IPageContainer, IBaseAsyncComponentState, BaseAsyncComponent, IContainer, IGlobalResize, IConfirmation, ConfirmationDialogTitleCallback} from "@weare/athenaeum-react-common";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import Alert from "../Alert/Alert";
import PageRow from "./PageRow/PageRow";
import Modal from "../Modal/Modal";
import DocumentPreviewModal from "../DocumentPreviewModal/DocumentPreviewModal";
import Description from "../Popover/Description/Description";
import PageContainerLocalizer from "./PageContainerLocalizer";

import styles from "./PageContainer.module.scss";

interface IPageContainerProps {
    id?: string;
    transparent?: boolean;
    className?: string;
    alertClassName?: string;
    endpoint?: string;
    scale?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
}

interface IPageContainerState extends IBaseAsyncComponentState<{}> {
    alert: AlertModel | null;
    alertClassName: string | null;
}

export default class PageContainer extends BaseAsyncComponent<IPageContainerProps, IPageContainerState, {}> implements IContainer, IGlobalResize, IPageContainer {

    state: IPageContainerState = {
        data: null,
        isLoading: false,
        alert: null,
        alertClassName: this.props.alertClassName || null
    };

    private readonly _alertContainerRef: React.RefObject<PageRow> = React.createRef();
    private readonly _documentPreviewModalRef: React.RefObject<DocumentPreviewModal> = React.createRef();
    private readonly _descriptionRef: React.RefObject<Description> = React.createRef();
    private readonly _confirmationDialogRef: React.RefObject<ConfirmationDialog> = React.createRef();
    
    private _height: number = 0;

    // noinspection JSUnusedLocalSymbols
    private static initialize = (() => ServiceProvider.addSingleton(nameof<IPageContainer>(), () => PageContainer.instance))();
 
    private get manual(): IManualProps {
        const page: IBasePage | null = ch.findPage();
        return (page)
            ? page.getManualProps()
            : {};
    }
    
    private toggleVerticalScroll() {
        if(!this.mobile && this.props.scale) {
            this.JQuery("html").addClass("vertical-scroll");
        } else {
            this.JQuery("html").removeClass("vertical-scroll");
        }
    }
    
    private async onAlertCloseAsync(sender: Alert, userInteraction: boolean = true): Promise<void> {
        const animation: boolean = (sender.model.autoClose) && (!userInteraction);
        await this.invokeHideAlertAsync(animation);
    }

    private async invokeHideAlertAsync(animation: boolean): Promise<void> {
        if (this.state.alert) {
            if ((animation) && (this._alertContainerRef.current)) {
                this._alertContainerRef.current.minimize(AthenaeumComponentsConstants.alertAnimationDelay);
                await Utility.wait(AthenaeumComponentsConstants.alertAnimationDelay);
            }
            await this.setState({ alert: null });
        }
    }

    protected getEndpoint(): string {
        return this.props.endpoint || "";
    }

    public isAsync(): boolean {
        return this.getEndpoint().length > 0;
    }

    public height(): number {
        
        if (this._height === 0) {
            const node: JQuery = this.getNode();
            this._height = node.children().first().height() || 0;
        }
        
        const alertHeight: number = (this._alertContainerRef.current)
            ? this._alertContainerRef.current.outerHeight(true)
            : 0;
        
        return (this._height - alertHeight);
    }

    public async onGlobalResize(e: React.SyntheticEvent): Promise<void> {
        this._height = 0;
    }
    
    public get alert(): AlertModel | null {
        return this.state.alert;
    }

    public async alertAsync(alert: AlertModel): Promise<void> {
        await this.setState({ alert: alert });
    }
    
    public async hideAlertAsync(): Promise<void> {
        await this.invokeHideAlertAsync(false);
    }
    
    public async confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean> {
        return this._confirmationDialogRef.current!.confirmAsync(title);
    }

    public async documentPreviewAsync(model: DocumentPreviewModel): Promise<void> {
        const documentPreviewModal: DocumentPreviewModal = this._documentPreviewModalRef.current!;
        await documentPreviewModal.openAsync(model);
    }

    public async descriptionAsync(containerId: string, model: DescriptionModel): Promise<void> {
        const description: Description = this._descriptionRef.current!;
        await description.toggleAsync(containerId, model);
    }

    public async componentDidMount(): Promise<void> {
        this.toggleVerticalScroll();
        PageContainer.instance = this;
        await super.componentDidMount();
    }

    public async componentWillUnmount(): Promise<void> {
        PageContainer.instance = null;
        await super.componentWillUnmount();
    }

    public render(): React.ReactNode {
        
        const transparentStyle = this.props.transparent ? { backgroundColor: "transparent" } : {};
        
        return (
            <div className={this.css(styles.page, this.props.className, this.props.scale && styles.scale)} id={this.id}>
                
                <div className={this.css("container", styles.container, this.props.fullHeight && styles.fullHeight, this.props.fullWidth && styles.fullWidth)} style={transparentStyle} >
                    
                    {
                        ((this.alert) && (this.alert.message)) &&
                        (
                            <PageRow ref={this._alertContainerRef} className={this.css(styles.pageRow, styles.alertRow)}>
                                <div className="col d-flex justify-content-center">
                                    <Alert className={this.props.alertClassName}
                                           model={this.alert}
                                           onClose={async (sender, userInteraction) => await this.onAlertCloseAsync(sender, userInteraction)} />
                                </div>
                            </PageRow>
                        )
                    }
                    
                    {this.props.children}
                    
                </div>
                
                {
                    (this.manual.manual) &&
                    (
                        <Modal id="page-help-info" title={this.manual.title || PageContainerLocalizer.pageHelp} content={this.manual.manual} info />
                    )
                }

                <DocumentPreviewModal ref={this._documentPreviewModalRef} />
                
                <Description ref={this._descriptionRef} />
                
                <ConfirmationDialog ref={this._confirmationDialogRef} />
                
            </div>
        );
    }

    public static instance: PageContainer | null = null;
}
