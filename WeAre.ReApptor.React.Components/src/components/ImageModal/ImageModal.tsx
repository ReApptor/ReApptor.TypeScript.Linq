import React from "react";
import {FileModel} from "@weare/reapptor-toolkit";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import Modal, {ModalSize} from "../Modal/Modal";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import Button, {ButtonType} from "../Button/Button";
import ImageModalLocalizer from "./ImageModalLocalizer";

import styles from "./ImageModal.module.scss";

interface IImageModalProps {
    id?: string;
    title?: string;
    subtitle?: string;
    picture?: FileModel;
    size?: ModalSize;
    download?: boolean;
    
    imageUrl?(file: FileModel): string;
}

interface IImageModalState {
    picture: FileModel | null;
}

export class ImageProvider {
    public static getImageUrl(image: FileModel): string {
        return (image.src)
            ? image.src
            : `/files/images/${image.id}`;
    }

    public static getImageStyle(image: FileModel | string): object {
        const url: string = (typeof image === "string")
            ? image
            : ImageProvider.getImageUrl(image);
        return {background: `url(${url})`};
    }
}

export default class ImageModal extends BaseComponent<IImageModalProps, IImageModalState> {
    
    state: IImageModalState = {
        picture: this.props.picture || null
    };
    
    private readonly _modalRef: React.RefObject<Modal> = React.createRef();
    
    private getImageUrl(image: FileModel): string {
        return (this.props.imageUrl)
            ? this.props.imageUrl(image)
            : ImageProvider.getImageUrl(image);
    }
    
    private getImageStyle(image: FileModel): object {
        const url: string = this.getImageUrl(image);
        return ImageProvider.getImageStyle(url);
    }
    
    private get picture(): FileModel | null {
        return this.state.picture;
    }
    
    private get subtitle(): string {
        return (this.props.subtitle) 
            ? this.props.subtitle
            : (this.picture)
                ? this.picture.name 
                : "";
    }
    
    private get previewSupported(): boolean {
        return (this.picture) 
            ? (AthenaeumComponentsConstants.imageFileTypes.includes(this.picture.type))
            : false;
    }

    private async download(): Promise<void> {
        if (this.picture) {
            if (!this.picture.src) {
                this.picture.src = `/files/images/${this.picture.id}`;
            }

            ch.download(this.picture);
        }
    }

    public async openAsync(picture: FileModel | null = null): Promise<void> {
        if (picture) {
            await this.setState({picture});
        }

        await this._modalRef.current!.openAsync();
    }

    public async componentWillReceiveProps(nextProps: IImageModalProps): Promise<void> {
        if(nextProps.picture && (nextProps.picture !== this.props.picture)) {
            await this.setState({picture: nextProps.picture});
        }
    }
    
    public render() {        
        const mobileStyle = (this.mobile) && (styles.mobile);
        const biggerStyle = (this.props.size !== undefined)
                            && (this.props.size !== ModalSize.Default)
                            && (this.props.size !== ModalSize.Small)
                            && (styles.bigger);
        
        return (
            <Modal id={this.id}
                   ref={this._modalRef}
                   bodyClassName={styles.imageModal}
                   title={this.props.title}
                   subtitle={this.subtitle}
                   size={this.props.size}
            >
                <div>
                    {
                        (this.picture && this.previewSupported) &&
                        (
                            <div className={this.css(styles.image, mobileStyle, biggerStyle)} style={this.getImageStyle(this.picture)} />
                        )
                    }
                    {
                        (this.picture && !this.previewSupported) && 
                        (
                            <span>{ImageModalLocalizer.previewNotSupported}</span>
                        )
                    }
                </div>

                {
                    (this.props.download && this.picture) &&
                    (
                        <Button type={ButtonType.Orange} onClick={async () => await this.download()} label={ImageModalLocalizer.download} />
                    )
                }
                
            </Modal>
        )
    }
}