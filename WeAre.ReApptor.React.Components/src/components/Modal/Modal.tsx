import React from "react";
import ReactDOM from "react-dom";
import {BaseAsyncComponent, IBaseAsyncComponentState, RenderCallback} from "@weare/reapptor-react-common";
import Icon, { IconSize, IconStyle } from "../Icon/Icon";
import Button, { ButtonType } from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import ConfirmationDialog, {ConfirmationDialogTitleCallback, IConfirmation} from "../ConfirmationDialog/ConfirmationDialog";
import ModalLocalizer from "./ModalLocalizer";

import "./BootstrapOverride.scss";

export enum ModalSize {
    Default,

    Small,

    Large,

    ExtraLarge,

    /*
     * Modal will resize according to content size
     */
    Auto
}

interface IModalProps<TData = {}> {
    id?: string;
    size?: ModalSize;

    /**
     * Text displayed in the header of the {@link Modal}.
     */
    title?: string;

    /**
     * Secondary text displayed in the header of the {@link Modal}.
     */
    subtitle?: string;

    /**
     * Text displayed in the {@link Modal}'s body.
     */
    content?: string;

    /**
     * True to disable modal responsiveness (full window in mobile view).
     */
    notResponsive?: boolean;

    /**
     * True to hide the modal header
     */
    noHeader?: boolean;
    
    info?: boolean;
    className?: string;
    contentClassName?: string;
    bodyClassName?: string;
    toolbar?: RenderCallback;
    keepTextFormatting?: boolean;
    closeConfirm?: string | boolean | IConfirmation | ConfirmationDialogTitleCallback | null;
    
    transform?(data: any): TData;
    onBeforeOpen?(sender: Modal): Promise<void>;
    onOpen?(sender: Modal): Promise<void>;
    onBeforeClose?(sender: Modal): Promise<void>;
    onClose?(sender: Modal, data: string): Promise<void>;
    onToggle?(sender: Modal, isOpen: boolean): Promise<void>;
}

interface IModalState extends IBaseAsyncComponentState<any> {
    isOpen: boolean;
    openInstance: Modal | null;
}

export default class Modal<TData = {}> extends BaseAsyncComponent<IModalProps<TData>, IModalState> {

    state: IModalState = {
        isOpen: false,
        data: null,
        isLoading: false,
        openInstance: null
    };

    private static _openInstance: Modal | null = null;
    private readonly _closeConfirmDialogRef: React.RefObject<ConfirmationDialog> = React.createRef();
    private _animation: boolean = true;
    private _modalRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _modalBodyRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _data: TData | null = null;
    private _scrollY: number = 0;

    //  Getters

    private get title(): string {
        return this.props.title || "...";
    }

    private get subtitle(): string {
        return this.props.subtitle || "";
    }

    private get content(): string {
        return this.props.content || "";
    }

    private get modal(): HTMLDivElement | null {
        return this._modalRef.current;
    }

    private get scrollY(): number {
        return this._scrollY;
    }

    private get sizeStyle(): string {
        if (this.fullWindow) {
            return (this._animation) ? "mobile" : "mobile animation";
        }

        switch (this.props.size) {
            case ModalSize.Small:
                return "modal-sm";
            case ModalSize.Large:
                return "modal-lg";
            case ModalSize.ExtraLarge:
                return "modal-xl";
            case ModalSize.Auto:
                return "modal-auto";

            default:
                return "default-maxWidth";
        }
    }

    public get data(): TData | null {
        return this._data;
    }

    public get isOpen(): boolean {
        return this.state.isOpen;
    }

    public get isInfo(): boolean {
        return this.props.info || false;
    }

    public get notResponsive(): boolean {
        return (this.props.notResponsive == true);
    }

    /**
     * The modal takes the full size of the window (if mobile is true and responsive is true)
     */
    public get fullWindow(): boolean {
        return (!this.notResponsive) && (this.mobile);
    }

    public get noHeader(): boolean {
        return (this.props.noHeader === true);
    }

    public getBodyNode(): JQuery {
        return this.JQuery(`#${this.id}_body`);
    }

    public get body(): React.ReactNode {
        return this._modalBodyRef.current!;
    }

    //  ViewMethodCalls

    private onModalBodyClick(e: React.MouseEvent): void {
        if (!this.isInfo) {
            return;
        }

        e.stopPropagation();

        this.closeModal();
    }

    //  Logics

    private togglePageScroll(toggle: boolean): void {
        if (this.fullWindow) {
            return
        }

        if (toggle) {
            this.JQuery("html").addClass("prevent-scroll");
            return;
        }

        this.JQuery("html").removeClass("prevent-scroll");
    }

    private setData(data: TData | null = null): void {
        if (data) {
            this._data = data;
        }
    }

    private async onOpenHandlerAsync(event: any): Promise<void> {
        this.togglePageScroll(true);

        const data: any = this.JQuery(event.relatedTarget).data("modal");

        if (data !== null && data !== undefined) {
            this.setData(this.transformData(data));
        }

        if (this.fullWindow) {
            this.JQuery("body").addClass("mobile");
        }

        await this.setModalToOpen();
    }

    private async onCloseHandlerAsync(): Promise<void> {
        this.togglePageScroll(false);

        if (this.fullWindow) {
            this.JQuery("body").removeClass("mobile");
        }

        await this.setModalToCloseAsync(false);

        this.scrollBack();
    }

    private async onCloseAsync(confirmed: boolean = false, data: string = ""): Promise<void> {
        await this.setModalToCloseAsync(confirmed, data);
    }

    private scrollBack(): void {
        window.scrollTo(0, this.scrollY);
    }

    protected getEndpoint(): string {
        return "";
    }

    protected transformData(data: any): TData {
        if (!this.props.transform) {
            return data as TData;
        }

        return this.props.transform(data);
    }

    public hasSpinner(): boolean {
        return true;
    }

    private async setModalToOpen(animation: boolean = true) {
        if (this.state.isOpen) {
            return;
        }

        await this.onPropBeforeOpen();

        const openInstance: Modal | null = this.state.openInstance || Modal._openInstance;

        await this.setState({ isOpen: true, openInstance });

        this.openModal(animation);

        await this.onPropOpen();

        if (openInstance) {
            await openInstance.closeAsync();
        }

        await this.onPropToggle(true);
    }

    private async setModalToCloseAsync(confirmed: boolean, data: string = "") {
        if (!this.state.isOpen) {
            return;
        }

        const confirmNeeded: boolean = (!!this.props.closeConfirm) && (!confirmed);

        if ((confirmNeeded) && (this._closeConfirmDialogRef.current)) {
            await this._closeConfirmDialogRef.current.openAsync();
            return;
        }

        await this.onPropBeforeClose();

        const openInstance: Modal | null = this.state.openInstance;

        await this.setState({ isOpen: false, openInstance });

        this.closeModal();

        await this.onPropCloseAsync(data);

        if ((openInstance) && (Modal._openInstance == null)) {
            await openInstance.openAsync();

            await this.setState({openInstance: null})
        }

        await this.onPropToggle(false);
    }

    private openModal(animation: boolean = true): void {
        if (!this.modal) {
            return;
        }

        this._animation = animation;

        this.showBootstrapModal();

        Modal._openInstance = this;
    }

    private closeModal(): void {
        if (!this.modal) {
            return;
        }

        this.hideBootstrapModal();

        if (Modal._openInstance === this) {
            Modal._openInstance = null;
        }
    }

    //  LifeCycleHooks

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        this.enableBootstrapEventHandlers();
    }

    async componentWillUnmount(): Promise<void> {
        this.closeModal();
        await super.componentWillUnmount();
        this.disableBootstrapEventHandlers();
    }

    //  Bootstrap Methods

    private enableBootstrapEventHandlers(): void {
        if (!this.modal) {
            return;
        }

        const node: JQuery = this.JQuery(this.modal);
        node.on("shown.bs.modal", async (event) => await this.onOpenHandlerAsync(event));
        node.on("hide.bs.modal", async () => await this.onCloseHandlerAsync());
    }

    private disableBootstrapEventHandlers(): void {
        if (!this.modal) {
            return;
        }

        const node: JQuery = this.JQuery(this.modal);

        node.off("shown.bs.modal");
        node.off("hide.bs.modal");
    }

    private showBootstrapModal(): void {
        if (!this.modal) {
            return;
        }

        const modal = this.JQuery(this.modal);

        if ((modal) && (typeof modal.modal === "function")) {
            modal.modal("show");
        }
    }

    private hideBootstrapModal(): void {
        if (!this.modal) {
            return;
        }

        const modal = this.JQuery(this.modal);

        if ((modal) && (typeof modal.modal === "function")) {
            modal.modal("hide");
        }
    }

    //  PropsMethodCallHelpers

    private async onPropBeforeOpen(): Promise<void> {
        if (this.props.onBeforeOpen) {
            await this.props.onBeforeOpen(this);
        }
    }

    private async onPropBeforeClose(): Promise<void> {
        if (this.props.onBeforeClose) {
            await this.props.onBeforeClose(this);
        }
    }

    private async onPropOpen(): Promise<void> {
        if (this.props.onOpen) {
            await this.props.onOpen(this);
        }
    }

    private async onPropCloseAsync(data: string = ""): Promise<void> {
        if (this.props.onClose) {
            await this.props.onClose(this, data);
        }
    }

    private async onPropToggle(isOpen: boolean): Promise<void> {
        if (this.props.onToggle) {
            await this.props.onToggle(this, isOpen);
        }
    }

    //  Interface

    public async openAsync(data: TData | null = null, animation: boolean = true): Promise<void> {
        this._scrollY = window.scrollY;
        this.setData(data);
        await this.setModalToOpen(animation);
    }

    public async closeAsync(): Promise<void> {
        await this.onPropCloseAsync();
    }

    public async toggleAsync(data: TData | null = null, animation: boolean = true): Promise<void> {
        if (this.state.isOpen) {
            await this.closeAsync();
            return;
        }

        await this.openAsync(data, animation);
    }

    //  Renders

    protected renderToolbar(): React.ReactNode {
        return (this.props.toolbar) ? this.props.toolbar(this) : null;
    }

    public renderModal(): React.ReactNode {
        const modalContentStyle: any = (this.props.size === ModalSize.Auto) && "w-auto";
        const infoContentStyle: any = this.props.keepTextFormatting && "textFormatting";
        const centeredStyle: any = (!this.fullWindow) && "modal-dialog-centered";
        const toolbarStyle: any = (this.fullWindow) ? "mobile-toolbar" : "toolbar";

        return (
            <div id={this.id}
                 ref={this._modalRef}
                 tabIndex={-1}
                 role="dialog"
                 className={this.css("modal", this.props.className)}
            >

                <div className={this.css("modal-dialog", centeredStyle, this.sizeStyle)} role="document">

                    <div className={this.css("modal-content", modalContentStyle, this.props.contentClassName)}>

                        {
                            (!this.noHeader) &&
                            (
                                <div className="modal-header">

                                    <div className="modal-header-content">
                                        <h5 className="modal-title">{this.toMultiLines(this.title)}</h5>
                                        <h6 className="modal-title">{this.toMultiLines(this.subtitle)}</h6>
                                    </div>

                                    <div className={toolbarStyle}>

                                        {
                                            this.renderToolbar()
                                        }

                                        {
                                            <Icon name={this.fullWindow ? "chevron-down" : "times"}
                                                  className={this.fullWindow ? "" : "dismiss"}
                                                  style={IconStyle.Regular}
                                                  size={IconSize.X2}
                                                  onClick={() => this.onCloseAsync()}
                                            />
                                        }

                                    </div>
                                </div>
                            )
                        }

                        <div id={`${this.id}_body`}
                             ref={this._modalBodyRef}
                             className={this.css("modal-body", this.props.bodyClassName)}
                             onClick={(e: React.MouseEvent) => this.onModalBodyClick(e)}
                        >

                            {
                                (!this.props.children) &&
                                (
                                    <p className={infoContentStyle}>{this.toMultiLines(this.content)}</p>
                                )
                            }

                            {this.props.children}

                        </div>

                        {
                            // If the Modal will receive children (most likely Form) instead of text content(this.props.content)
                            // Modal footer does not need to be displayed therefore Form will contain it's own control buttons
                            ((!this.props.info) && (!this.props.children)) &&
                            (
                                <div className="modal-footer">
                                    
                                    <Button submit
                                            label={ModalLocalizer.saveChanges}
                                            type={ButtonType.Orange}
                                    />
                                    
                                    <Button label={ModalLocalizer.close}
                                            type={ButtonType.Default}
                                            onClick={() => this.onCloseAsync()}
                                    />
                                    
                                </div>
                            )
                        }

                        {
                            (this.isSpinning()) && <Spinner/>
                        }

                        {
                            (this.props.closeConfirm) &&
                            (
                                <ConfirmationDialog ref={this._closeConfirmDialogRef}
                                                    title={typeof this.props.closeConfirm !== "boolean" ? this.props.closeConfirm : undefined}
                                                    callback={(caller, data) => this.onCloseAsync(true, data)}
                                />
                            )
                        }

                    </div>

                </div>

            </div>
        );
    }

    // This needs improvement in next version
    // Needed for correctly applying blur effect without moving modals outside of Layout manually
    public render(): React.ReactNode {
        return ReactDOM.createPortal(this.renderModal(), document.body);
    }
}