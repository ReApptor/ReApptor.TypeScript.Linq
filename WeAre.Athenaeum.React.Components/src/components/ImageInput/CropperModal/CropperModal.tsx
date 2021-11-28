import React from "react";

import Cropper, {ReactCropperElement} from 'react-cropper';
import CropperJs from 'cropperjs';

import {BaseComponent} from "@weare/athenaeum-react-common";

import "./CropperOverride.scss";
import styles from "./CropperModal.module.scss";

export type ReadyEvent = CropperJs.ReadyEvent<HTMLImageElement>;

export interface ICropperModalProps {
    visibleOnDefault?: boolean;
    className?: string;
    aspectRatio?: number;
    cropperSource: string;
    dataTestId?: string;
    onReady?: (event: ReadyEvent) => void
    onCrop?: (height: number, width: number) => void
}

export interface ICropperModalState {
    visible: boolean
}

export class CropperModal extends BaseComponent<ICropperModalProps, ICropperModalState> {
    public cropperRef = React.createRef<ReactCropperElement>();

    state: ICropperModalState = {
        visible: false
    };

    private get aspectRatio(): number {
        return this.props.aspectRatio ?? 0;
    }

    public async showModal() {
        await this.setState({visible: true});
    }

    public async closeModal() {
        await this.setState({visible: false});
    }

    public output(type?: string, quality?: any) {
        return this.cropperRef.current?.cropper.getCroppedCanvas().toDataURL(type, quality)
    }

    public rotateAndFitToScreen(degrees: number) {

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
                        <div className={this.css(this.props.className, styles.cropper)}>
                            <Cropper ref={this.cropperRef}
                                     className={styles.reactCropper}
                                     aspectRatio={this.aspectRatio}
                                     data-testid={this.props.dataTestId}
                                     style={{height: "100%", width: "100%"}}
                                     src={this.props.cropperSource}
                                     viewMode={1} // cannot move box outside image borders
                                     guides={false}
                                     ready={(event) => {
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
                        </div>
                    )
                }
            </React.Fragment>

        );
    }
}