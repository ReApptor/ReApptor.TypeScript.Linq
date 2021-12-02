import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import styles from "./ImageInputPreviewModal.module.scss";
import {IIMageInputToolbar, ImageInputToolbar, ImageProvider} from "@weare/athenaeum-react-components";
import {FileModel} from "@weare/athenaeum-toolkit";

export interface IImageInputPreviewModalProps {
    toolbarOverwrite?: Partial<IIMageInputToolbar>;
    previewUrlBuilder?(file: FileModel): string;
    onEditButtonClickAsync?: (fileModel: FileModel, index: number) => Promise<void>;
    onBackButtonClickAsync?: () => Promise<void>;
    onDeleteButtonClickAsync?: (index: number) => Promise<void>;
}

export interface IImageInputPreviewModalState {
    visible: boolean,
    fileModel: FileModel | null,
    index: number | null,
}

export class ImageInputPreviewModal extends BaseComponent<IImageInputPreviewModalProps, IImageInputPreviewModalState> {
    state: IImageInputPreviewModalState = {
        visible: false,
        fileModel: null,
        index: null
    };

    public async showModal(fileModel: FileModel | null, index: number | null) {
        if (fileModel && index !== null) {
            await this.setState({visible: true, fileModel, index});
        }
    }

    public async closeModal() {
        await this.setState({visible: false, fileModel: null});
    }

    private get toolbar(): IIMageInputToolbar {
        return {...ImageInputToolbar.defaultPreviewToolbar, ...(this.props.toolbarOverwrite || {})};
    }

    private getImageUrl(image: FileModel): string {
        return (this.props.previewUrlBuilder)
            ? this.props.previewUrlBuilder(image)
            : ImageProvider.getImageUrl(image);
    }

    private getPreviewSource(fileModel: FileModel | null = this.state.fileModel): string {

        if (!fileModel) {
            return "";
        }

        if (fileModel.id) {
            if (this.props.previewUrlBuilder) {
                return this.props.previewUrlBuilder(fileModel);
            }

            return this.getImageUrl(fileModel);
        }

        return fileModel.src;
    }

    render(): JSX.Element {
        const src: string | undefined = this.getPreviewSource();

        return (
            <React.Fragment>
                {
                    (this.state.visible) &&
                    (
                        <div className={this.css(styles.fullScreen)}>
                            <div className={styles.preview} style={{backgroundImage: `url(${src})`}}>
                            </div>
                            <ImageInputToolbar toolbar={this.toolbar}
                                               className={styles.toolbar}
                                               onDeleteButtonClickAsync={async () => {
                                                   if (this.props.onDeleteButtonClickAsync && this.state.index !== null) {
                                                       await this.props.onDeleteButtonClickAsync(this.state.index);
                                                   }
                                               }}
                                               onBackButtonClickAsync={async () => {
                                                   if (this.props.onBackButtonClickAsync) {
                                                       await this.props.onBackButtonClickAsync();
                                                   }
                                               }}
                                               onEditButtonClickAsync={async () => {
                                                   if (this.props.onEditButtonClickAsync && this.state.fileModel && this.state.index !== null) {
                                                       await this.props.onEditButtonClickAsync(this.state.fileModel, this.state.index);
                                                   }
                                               }}
                            />
                        </div>
                    )
                }
            </React.Fragment>

        );
    }


    static TestIds = {

    };
}
