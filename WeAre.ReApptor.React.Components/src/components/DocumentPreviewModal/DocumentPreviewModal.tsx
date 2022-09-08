import React from "react";
import {FileModel, Utility} from "@weare/reapptor-toolkit";
import {DocumentPreviewModel, DocumentPreviewSize, ch, IBaseAsyncComponentState, BaseAsyncComponent} from "@weare/reapptor-react-common";
import Spinner from "../Spinner/Spinner";
import Modal, { ModalSize } from "../Modal/Modal";
import Icon, { IconSize } from "../Icon/Icon";
import DocumentPreviewModalLocalizer from "./DocumentPreviewModalLocalizer";

import styles from "./DocumentPreviewModal.module.scss";

const A4 = { width: 595, height: 842 };

class DocumentSize {
    constructor(width: number = A4.width, height: number = A4.height, zoom: number = 100) {
        this.width = width;
        this.height = height;
        this.zoom = zoom;
    }

    public width: number;

    public height: number;

    public zoom: number;

    public getSrc(data: FileModel | null): string {
        return ((data) && (data.src))
            ? (this.zoom > 0)
                ? `${Utility.toObjectUrl(data)}#zoom=${this.zoom}`
                : Utility.toObjectUrl(data)
            : "";
    }

    public static getDocumentSize(width: number, height: number, size: DocumentPreviewSize): DocumentSize {
        const toolbarHeight: number = 43;
        const deltaX: number = 32;
        const deltaY: number = (ch.desktop) ? (86 + 16 + toolbarHeight) : (45 + 86 + 16 + toolbarHeight);

        width = (width > deltaX) ? width - deltaX : 0;
        height = (height > deltaY) ? height - deltaY : 0;
        
        const k1: number = width / A4.width;
        const k2: number = height / A4.height;
        const scaleHeight: boolean = (k1 >= k2);
        
        const zoomK: number = (ch.desktop)
            ? 0.72
            : (scaleHeight)
                ? 0.71
                : 0.72;

        const modalK: number = (size == DocumentPreviewSize.Medium) ? 0.82 : 0.99;
        
        let zoom: number;
        
        if (scaleHeight) {
            const k: number = modalK * k2;
            width = k * A4.width;
            height = modalK * height + toolbarHeight;
            zoom = zoomK * k * 100;
        } else {
            const k: number = modalK * k1;
            height = k * A4.height + toolbarHeight;
            width = modalK * width;
            zoom = zoomK * k * 100;
        }

        return new DocumentSize(width, height, zoom);
    }
}

export type DocumentPreviewCallback = (sender: DocumentPreviewModal) => any;

interface IDocumentPreviewModalProps {
}

interface IDocumentPreviewModalState<FileModel> extends IBaseAsyncComponentState<FileModel> {
    model: DocumentPreviewModel;
}

export default class DocumentPreviewModal extends BaseAsyncComponent<IDocumentPreviewModalProps, IDocumentPreviewModalState<FileModel>> {

    state: IDocumentPreviewModalState<FileModel> = {
        isLoading: false,
        data: null,
        model: new DocumentPreviewModel()
    };

    private readonly _modalRef: React.RefObject<Modal<any>> = React.createRef();

    private async onToggleAsync(isOpen: boolean): Promise<void> {
        if (isOpen) {
            await this.reloadAsync();
        } else {
            await this.setState({ data: null });
        }
    }

    private geDocumentSize(): DocumentSize {
        const node: JQuery = this.getNode();

        const width: number = node.width() || 0;
        const height: number = node.height() || 0;
        
        return DocumentSize.getDocumentSize(width, height, this.model.size);
    }
    
    private download(): void {
        const document: FileModel | null = this.state.data;

        if (document) {
            return ch.download(document);
        }
    }
    
    private renderToolbar(): React.ReactNode {
        return (
            <Icon name="far download"
                  className="blue"
                  size={IconSize.X2}
                  onClick={async () => this.download()} 
                  tooltip={DocumentPreviewModalLocalizer.download}
            />
        );
    }

    protected async fetchDataAsync(): Promise<FileModel> {
        if (typeof this.model.document === "function") {
            const callback = this.model.document as DocumentPreviewCallback;
            return await callback(this);
        }
        return this.model.document;
    }

    protected getEndpoint(): string {
        return ""
    }

    public isAsync(): boolean {
        return true;
    }
    
    public async openAsync(model: DocumentPreviewModel): Promise<void> {
        await this.setState({ model });
        await this._modalRef.current!.toggleAsync();
    }
    
    public get isOpen(): boolean {
        return (!!this._modalRef.current) && (this._modalRef.current.isOpen);
    }
    
    public get model(): DocumentPreviewModel {
        return this.state.model;
    }

    public get modal(): Modal {
        return this._modalRef.current!;
    }

    public get title(): string {
        return this.model.title || "Document preview";
    }
    
    public get subtitle(): string | null {
        return (this.model.subtitle)
            ? this.model.subtitle
            : (this.state.data)
                ? this.state.data.name
                : null;
    }

    public canReload(): boolean {
        return (this.isOpen);
    }

    public hasSpinner(): boolean {
        return true;
    }

    public render(): React.ReactNode {
        const documentSize: DocumentSize = this.geDocumentSize();
        
        return (
            <Modal info
                   id={this.id}
                   ref={this._modalRef} 
                   className={styles.documentPreviewModal}
                   bodyClassName={styles.body}
                   title={this.title || DocumentPreviewModalLocalizer.preview}
                   subtitle={this.subtitle || "..."}
                   size={ModalSize.Auto}
                   toolbar={() => this.renderToolbar()}
                   onToggle={(sender: Modal, isOpen) => this.onToggleAsync(isOpen)}
            >
                
                <div className={styles.contentA4}>

                    <iframe allowFullScreen
                            src={documentSize.getSrc(this.state.data)}
                            width={documentSize.width}
                            height={documentSize.height}
                    />

                    {
                        (this.isSpinning()) && (<Spinner noShading />) 
                    }

                </div>
                
            </Modal>
        )
    }
}
