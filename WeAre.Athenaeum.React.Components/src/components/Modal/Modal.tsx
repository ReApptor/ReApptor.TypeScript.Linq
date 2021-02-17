import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {BaseAsyncComponent, IBaseAsyncComponentState, RenderCallback} from "@weare/athenaeum-react-common";
import Icon, { IconSize, IconStyle } from "../Icon/Icon";
import Button, { ButtonType } from "../Button/Button";
import Spinner from "../Spinner/Spinner";

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
    title?: string;
    subtitle?: string;
    content?: string;
    info?: boolean;
    className?: string;
    contentClassName?: string;
    bodyClassName?: string;
    toolbar?: RenderCallback;
    keepTextFormatting?: boolean;
    transform?(data: any): TData;
    onBeforeOpen?(sender: Modal): Promise<void>;
    onOpen?(sender: Modal): Promise<void>;
    onBeforeClose?(sender: Modal): Promise<void>;
    onClose?(sender: Modal): Promise<void>;
    onToggle?(sender: Modal, isOpen: boolean): Promise<void>;
}

interface IModalState extends IBaseAsyncComponentState<any> {
    isOpen: boolean;
    parent: Modal | null;
}

export default class Modal<TData = {}> extends BaseAsyncComponent<IModalProps<TData>, IModalState> {
    
    state: IModalState = {
        isOpen: false,
        data: null,
        isLoading: false,
        parent: null
    };

    private static _openInstance: Modal | null = null;
    private _animation: boolean = true;
    private _modalRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _modalBodyRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _data: TData | null = null;
    private _scrollY: number = 0;
    
    private async setModal(isOpen: boolean, animation: boolean = true): Promise<void> {
        
        if (this.state.isOpen != isOpen) {

            if (isOpen) {
                if (this.props.onBeforeOpen) {
                    await this.props.onBeforeOpen(this);
                }
            } else {
                if (this.props.onBeforeClose) {
                    await this.props.onBeforeClose(this);
                }
            }
            
            const parent: Modal | null = (isOpen)
                ? this.state.parent || Modal._openInstance
                : this.state.parent;

            await this.setState({ isOpen, parent });

            if (isOpen) {
                
                this.open(animation);
                
                if (this.props.onOpen) {
                    await this.props.onOpen(this);
                }
                
                if (parent) {
                    await parent.closeAsync();
                }
                
            } else {
                
                this.close();
                
                if (this.props.onClose) {
                    await this.props.onClose(this);
                }
                
                if ((parent) && (Modal._openInstance == null)) {
                    await parent.openAsync();

                    await this.setState({parent: null})
                }
            }

            if (this.props.onToggle) {
                await this.props.onToggle(this, isOpen);
            }
        }
    }

    private togglePageScroll(toggle: boolean): void {
        if (!this.mobile) {
            if (toggle) {
                $("html").addClass("prevent-scroll");
            } else {
                $("html").removeClass("prevent-scroll");
            }
        }
    }

    private setData(data: TData | null = null): void {
        if (data != null) {
            this._data = data;
        }
    }

    private dismissModal(e: React.MouseEvent): void {
        if (this.props.info) {
            e.stopPropagation();

            if(this.modal) {
                this.close();
            }
        }
    }

    private async onOpenHandlerAsync(event: any): Promise<void> {
        this.togglePageScroll(true);

        const data: any = $(event.relatedTarget).data("modal");
        if (data != null) {
            this.setData(this.transformData(data));
        }

        if (this.mobile) {
            $("body").addClass("mobile");
        }

        await this.setModal(true);
    }

    private async onCloseHandlerAsync(): Promise<void> {
        this.togglePageScroll(false);
        
        if (this.mobile) {
            $("body").removeClass("mobile");
        }
        
        await this.setModal(false);
        
        this.scrollBack();
    }

    private close(): void {
        if (this.modal) {
            $(this.modal).modal("hide");

            if (Modal._openInstance === this) {
                Modal._openInstance = null;
            }
        }
    }

    private open(animation: boolean = true): void {
        if (this.modal) {
            this._animation = animation;
            
            $(this.modal).modal("show");

            Modal._openInstance = this;
        }
    }

    private scrollBack(): void {
        window.scrollTo(0, this.scrollY);
    }
    
    public async toggleAsync(data: TData | null = null, animation: boolean = true): Promise<void> {
        if (this.state.isOpen) {
            await this.closeAsync();
        } else {
            await this.openAsync(data, animation);
        }
    }
    
    public async openAsync(data: TData | null = null, animation: boolean = true): Promise<void> {
        this._scrollY = window.scrollY;
        this.setData(data);
        await this.setModal(true, animation);
    }
    
    public async closeAsync(): Promise<void> {
        await this.setModal(false);
    }

    public get data(): TData | null {
        return this._data;
    }

    public get isOpen(): boolean {
        return this.state.isOpen;
    }

    public get body(): React.ReactNode {
        return this._modalBodyRef.current!;
    }    
    
    public getBodyNode(): JQuery {
        return $(`#${this.id}_body`);
    }

    private get title(): string {
        return this.props.title || "...";
    }

    private get subtitle(): string {
        return this.props.subtitle || "";
    }

    private get sizeStyle(): string {
        if (this.mobile) {
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
    
    private get content(): string {
        return this.props.content || "";
    }
    
    private get modal(): HTMLDivElement | null {
        return this._modalRef.current;
    }
    
    private get scrollY(): number {
        return this._scrollY;
    }
    
    protected getEndpoint(): string {
        return "";
    }
    
    protected renderToolbar(): React.ReactNode {
        return (this.props.toolbar) ? this.props.toolbar(this) : null;
    }
    
    protected transformData(data: any): TData {
        return (this.props.transform)
            ? this.props.transform(data)
            : data as TData;
    }
    
    public hasSpinner(): boolean {
        return true;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        const modal: HTMLDivElement | null = this.modal;
        if (modal) {
            const node: JQuery = $(modal);
            node.on("shown.bs.modal", async (event) => await this.onOpenHandlerAsync(event));
            node.on("hide.bs.modal", async () => await this.onCloseHandlerAsync());
        }
    }

    async componentWillUnmount(): Promise<void> {
        this.close();
        
        await super.componentWillUnmount();

        const modal: HTMLDivElement | null = this.modal;
        if (modal) {
            const node: JQuery = $(modal);
            node.off("shown.bs.modal");
            node.off("hide.bs.modal");
        }
    }
    
    public renderModal(): React.ReactNode {
        const modalContentStyle: any = (this.props.size == ModalSize.Auto) && "w-auto";
        const toolbarStyle: any = (this.mobile) ? "mobile-toolbar" : "toolbar";
        const infoContentStyle: any = this.props.keepTextFormatting ? "textFormatting" : "";
        
        return (
            <div id={this.id} ref={this._modalRef}
                 tabIndex={-1} role="dialog"
                 className={this.css("modal", this.props.className)}
            >
                
                <div className={this.css("modal-dialog", this.desktop && "modal-dialog-centered", this.sizeStyle)} role="document">

                    <div className={this.css("modal-content", modalContentStyle, this.props.contentClassName)}>
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
                                    (this.mobile)
                                        ? <Icon name="chevron-down" style={IconStyle.Regular} size={IconSize.X2} onClick={() => this.closeAsync()} />
                                        : <Icon name="times" className="dismiss" style={IconStyle.Regular} size={IconSize.X2} onClick={() => this.closeAsync()} />

                                }
                                
                            </div>

                        </div>

                        <div id={`${this.id}_body`} ref={this._modalBodyRef} className={this.css("modal-body", this.props.bodyClassName)} onClick={(e: React.MouseEvent) => this.dismissModal(e)}>

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
                                    <Button label={this.localizer.componentModalSaveChanges} type={ButtonType.Orange} submit />
                                    <Button label={this.localizer.componentModalClose} type={ButtonType.Default} onClick={() => this.closeAsync()} />
                                </div>
                            )
                        }

                        {
                            (this.isSpinning()) && <Spinner/>
                        }

                    </div>
                    
                </div>
                
            </div>
        )
    }
    
    // This needs improvement in next version
    // Needed for correctly applying blur effect without moving modals outside of Layout manually
    public render(): React.ReactNode {
        return ReactDOM.createPortal(this.renderModal(), document.body);
    }
}