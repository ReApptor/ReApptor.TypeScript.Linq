import React from "react";
import CropperJs from 'cropperjs';
import Cropper, {ReactCropperElement} from 'react-cropper';

import {BaseComponent} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";
import {ImageInputToolbar} from "@weare/athenaeum-react-components";

import {ReactCropperHelpers} from "./CropperHelpers";

import "./CropperOverride.scss";
import styles from "./ImageInputCropperModal.module.scss";

export type ReadyEvent = CropperJs.ReadyEvent<HTMLImageElement>;

export interface IImageInputCropperModalProps {
    visibleOnDefault?: boolean;
    className?: string;
    aspectRatio?: number;
    cropperSource: string;
    dataTestId?: string;
    onReady?: (event: ReadyEvent, fileModel: FileModel, index: number) => void
    onCrop?: (height: number, width: number) => void

    onSaveButtonClickAsync?: (fileModel: FileModel, index: number) => Promise<void>;
    onBackButtonClickAsync?: () => Promise<void>;
    onDeleteButtonClickAsync?: (index: number) => Promise<void>;

}

export interface IImageInputCropperModalState {
    visible: boolean;
    fileModel: FileModel | null;
    index: number | null;
    rotateOnReady: number;
}

export class ImageInputCropperModal extends BaseComponent<IImageInputCropperModalProps, IImageInputCropperModalState> {
    public cropperRef = React.createRef<ReactCropperElement>();

    state: IImageInputCropperModalState = {
        visible: false,
        index: null,
        fileModel: null,
        rotateOnReady: 0
    };

    private get aspectRatio(): number {
        return this.props.aspectRatio ?? 0;
    }

    public async showModal(fileModel: FileModel | null, index: number | null, rotateOnReady: number = 0) {
        if (fileModel && index !== null) {
            await this.setState({visible: true, fileModel, index, rotateOnReady});
        }
    }

    public async closeModal() {
        await this.setState({visible: false, fileModel: null, index: null, rotateOnReady: 0});
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
                                         this.rotateAndFitToScreen(this.state.rotateOnReady);

                                         if (this.props.onReady && this.state.fileModel && this.state.index !== null) {
                                             const clone: FileModel = Object.assign(Object.create(Object.getPrototypeOf(this.state.fileModel)), this.state.fileModel);

                                             clone.src = this.output() || "";

                                             this.props.onReady(event, clone, this.state.index);
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
                                               onRotateButtonClick={async (rotation) => {
                                                   this.rotateAndFitToScreen(rotation);
                                               }}
                                               onSaveButtonClick={async () => {
                                                   if (!this.props.onSaveButtonClickAsync || !this.state.fileModel || this.state.index === null) {
                                                       return;
                                                   }

                                                   const clone: FileModel = Object.assign(Object.create(Object.getPrototypeOf(this.state.fileModel)), this.state.fileModel);

                                                   clone.src = this.output() || "";

                                                   await this.props.onSaveButtonClickAsync(clone, this.state.index);
                                               }}
                                               onBackButtonClick={async () => {
                                                   if (this.props.onBackButtonClickAsync) {
                                                       await this.props.onBackButtonClickAsync();
                                                   }
                                               }}
                                               onDeleteButtonClick={async () => {
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