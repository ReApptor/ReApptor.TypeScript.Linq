import React from "react";
import {FileModel} from "@weare/reapptor-toolkit";
import {BaseAsyncComponent, IBaseAsyncComponentState, IBaseComponent, Justify} from "@weare/reapptor-react-common";
import Popover from "../Popover/Popover";
import Spinner from "../Spinner/Spinner";

import styles from "./DocumentPreview.module.scss";

interface IDocumentPreviewProps {
    endpoint: string;
    documentId?: string;
}

interface IDocumentPreviewState<FileModel> extends IBaseAsyncComponentState<FileModel> {
    documentId: string
}

export default class DocumentPreview extends BaseAsyncComponent<IDocumentPreviewProps, IDocumentPreviewState<FileModel>> {
    
    state: IDocumentPreviewState<FileModel> = {
        isLoading: false,
        data: null,
        documentId: this.props.documentId || ""
    };

    private readonly _popoverRef: React.RefObject<Popover> = React.createRef();
    
    private async onToggleAsync(isOpen: boolean): Promise<void> {
        if (isOpen) {
            await this.reloadAsync();
        } else {
            await this.setState({ data: null });
        }
    }

    protected getEndpoint(): string {
        return this.props.endpoint || "";
    }

    protected async fetchDataAsync(): Promise<{}> {
        const endpoint: string = this.getEndpoint();
        const documentId = this.state.documentId;        
        return await this.postAsync<FileModel>(endpoint, documentId);
    }

    public async toggleAsync(sender: IBaseComponent, documentId: string | null = null): Promise<void> {
        if (documentId) {
            await this.setState({ documentId });
        }
        await this._popoverRef.current!.toggleAsync(sender.id);
    }

    public get isOpen(): boolean {
        return (!!this._popoverRef.current) && (this._popoverRef.current.isOpen);
    }

    public canReload(): boolean {
        return (this.isOpen);
    }

    public hasSpinner(): boolean {
        return true;
    }

    render() {
        return (
            <Popover ref={this._popoverRef} className={styles.documentPreview} onToggle={async (sender, isOpen) => await this.onToggleAsync(isOpen)} justify={Justify.Right}>
                <div className={styles.contentA4}>
                    
                    { (this.state.data) && (<iframe src={this.state.data!.src} width="560" height="832" />) }
                    
                    { (this.isSpinning()) && (<Spinner noShading />) }
                    
                </div>
            </Popover>
        )
    }
}