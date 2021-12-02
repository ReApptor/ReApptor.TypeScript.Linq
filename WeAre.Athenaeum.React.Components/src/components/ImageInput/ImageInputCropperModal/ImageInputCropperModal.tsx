import React from "react";

import Cropper, {ReactCropperElement} from 'react-cropper';
import CropperJs from 'cropperjs';

import {BaseComponent} from "@weare/athenaeum-react-common";

import "./CropperOverride.scss";
import styles from "./ImageInputCropperModal.module.scss";
import {ImageInputToolbar} from "@weare/athenaeum-react-components";
import {FileModel} from "@weare/athenaeum-toolkit";
import {ReactCropperHelpers} from "./CropperHelpers";

export type ReadyEvent = CropperJs.ReadyEvent<HTMLImageElement>;

export interface IImageInputCropperModalProps {
    visibleOnDefault?: boolean;
    className?: string;
    aspectRatio?: number;
    cropperSource: string;
    dataTestId?: string;
    onReady?: (event: ReadyEvent) => void
    onCrop?: (height: number, width: number) => void

    onSaveButtonClickAsync?: (fileModel: FileModel, index: number) => Promise<void>;
    onBackButtonClickAsync?: () => Promise<void>;
    onDeleteButtonClickAsync?: (index: number) => Promise<void>;

}

export interface IImageInputCropperModalState {
    visible: boolean;
    fileModel: FileModel | null;
    index: number | null;
}

export class ImageInputCropperModal extends BaseComponent<IImageInputCropperModalProps, IImageInputCropperModalState> {
    public cropperRef = React.createRef<ReactCropperElement>();

    state: IImageInputCropperModalState = {
        visible: false,
        index: null,
        fileModel: null
    };

    private get aspectRatio(): number {
        return this.props.aspectRatio ?? 0;
    }

    public async showModal(fileModel: FileModel | null, index: number | null) {
        if (fileModel && index !== null) {
            await this.setState({visible: true, fileModel, index});
        }
    }

    public async closeModal() {
        await this.setState({visible: false, fileModel: null, index: null});
    }

    public output(type?: string, quality?: any) {
        return this.cropperRef.current?.cropper.getCroppedCanvas().toDataURL(type, quality)
    }

    public rotateAndFitToScreen(degrees: number) {
        const cropperHelper = new ReactCropperHelpers(this.cropperRef);
        cropperHelper.rotateAndFitToScreen(degrees);
    }

    async componentDidMount(): Promise<void> {
        if (this.props.visibleOnDefault) {
            this.setState({visible: true});
        }
        return super.componentDidMount();
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                {
                    (this.state.visible) &&
                    (
                        <div className={this.css(this.props.className, styles.fullScreen)}>
                            <Cropper ref={this.cropperRef}
                                     className={styles.cropper}
                                     aspectRatio={this.aspectRatio}
                                     data-testid={this.props.dataTestId}
                                     src={this.props.cropperSource}
                                     viewMode={1} // cannot move box outside image borders
                                     guides={false}
                                     ready={(event) => {
                                         this.rotateAndFitToScreen(0);

                                         if (this.props.onReady) {
                                             this.props.onReady(event);
                                         }
                                     }}
                                     crop={(e) => {
                                         if (this.props.onCrop) {
                                             this.props.onCrop(e.detail.height, e.detail.width)
                                         }
                                     }}
                            />

                            <ImageInputToolbar className={styles.toolbar}
                                               toolbar={ImageInputToolbar.defaultEditToolbar}
                                               onRotateButtonClickAsync={async (rotation) => {
                                                   this.rotateAndFitToScreen(rotation);
                                               }}
                                               onSaveButtonClickAsync={async () => {
                                                   if (!this.props.onSaveButtonClickAsync || !this.state.fileModel || this.state.index === null) {
                                                       return;
                                                   }

                                                   const clone: FileModel = Object.assign(Object.create(Object.getPrototypeOf(this.state.fileModel)), this.state.fileModel);

                                                   clone.src = this.output() || "";

                                                   await this.props.onSaveButtonClickAsync(clone, this.state.index);
                                               }}
                                               onBackButtonClickAsync={async () => {
                                                   if (this.props.onBackButtonClickAsync) {
                                                       await this.props.onBackButtonClickAsync();
                                                   }
                                               }}
                                               onDeleteButtonClickAsync={async () => {
                                                   if (!this.props.onDeleteButtonClickAsync || this.state.index === null) {
                                                       return;
                                                   }

                                                   await this.props.onDeleteButtonClickAsync(this.state.index);
                                               }}
                            />
                        </div>
                    )
                }
            </React.Fragment>

        );
    }
}