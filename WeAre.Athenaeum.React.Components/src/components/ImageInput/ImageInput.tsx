import React, {DragEvent} from 'react';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import Comparator from "../../helpers/Comparator";
import {ImageProvider} from "../ImageModal/ImageModal";
import ImageInputLocalizer from "./ImageInputLocalizer";

import "cropperjs/dist/cropper.css";

import styles from "./ImageInput.module.scss";
import {IIMageInputToolbar, IImageInputToolbarOverwriteProps, ImageInputToolbar} from "./ImageInputToolbar/ImageInputToolbar";
import {ImageInputListItem} from "./ImageInputListItem/ImageInputListItem";
import {ImageInputPreviewModal} from "./ImageInputPreviewModal/ImageInputPreviewModal";
import {ImageInputCropperModal} from "./ImageInputCropperModal/ImageInputCropperModal";
import {ReactCropperHelpers} from "./ImageInputCropperModal/CropperHelpers";

interface IImageInputState {
    isDragOver: boolean;
    selectedPictureIndex: number | null;
    pictures: FileModel[];
}

interface IImageInputProps extends IImageInputToolbarOverwriteProps {
    pictures: FileModel[] | string | null;
    className?: string;

    /** Should Edit-mode be enabled immediately after an image is uploaded. Only works if {@link multiple} is not set to true. */
    editOnAddInSingleMode?: boolean
    maxImageRequestSizeInBytes?: number;
    minimizeOnEmpty?: boolean;

    /**
     * Does the {@link ImageInput} accept multiple images.
     * @default false
     */
    multiple?: boolean;

    /** List of allowed file extensions. */
    fileTypes?: string[];

    previewUrlBuilder?(file: FileModel): string;
    onUploadAsync?(file: FileModel): Promise<FileModel>;
    onChangeAsync?(sender: ImageInput, pictures: FileModel[]): Promise<void>;
}

export class ImageInput extends BaseComponent<IImageInputProps, IImageInputState> {

    private previewModalRef = React.createRef<ImageInputPreviewModal>();
    private cropperModalRef = React.createRef<ImageInputCropperModal>();
    // private cropperHelper = new ReactCropperHelpers(this.cropperModalRef);

    public state: IImageInputState = {
        isDragOver: false,
        selectedPictureIndex: null,
        pictures: []
    };

    //  Getters

    private get hasSelectedPictureIndex(): boolean {
        return Comparator.isNumber(this.state.selectedPictureIndex);
    }

    private get selectedPictureIndex(): number | null {
        return this.state.selectedPictureIndex;
    }

    private get isDragOver(): boolean {
        return this.state.isDragOver;
    }

    private get editOnAddInSingleMode(): boolean {
        return (this.props.editOnAddInSingleMode === true);
    }

    private get minimizeOnEmpty(): boolean {
        return (this.props.minimizeOnEmpty === true);
    }

    private get multiple(): boolean {
        return (this.props.multiple === true);
    }

    private get pictures(): FileModel[] {
        return this.state.pictures;
    }

    private get activePicture(): FileModel | null {
        return (this.hasSelectedPictureIndex)
            ? this.pictures[this.selectedPictureIndex!]
            : null;
    }

    private get cropperSource(): string {
        if ((!this.hasSelectedPictureIndex) || (!this.activePicture)) {
            return "";
        }

        if (this.activePicture.id) {
            if (this.props.previewUrlBuilder) {
                return this.props.previewUrlBuilder(this.activePicture);
            }

            return this.getImageUrl(this.activePicture);
        }

        return this.activePicture.src;
    }

    private getImageUrl(image: FileModel): string {
        return (this.props.previewUrlBuilder)
            ? this.props.previewUrlBuilder(image)
            : ImageProvider.getImageUrl(image);
    }

    private getPreviewName(fileModel: FileModel | null): string {
        if (!fileModel) {
            return "";
        }

        return fileModel.name
    }

    private getPreviewSource(fileModel: FileModel | null): string {

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

    private get maxImageRequestSizeInBytes(): number {
        return (this.props.maxImageRequestSizeInBytes) || (AthenaeumComponentsConstants.maxImageRequestSizeInBytes);
    }

    private get acceptedTypes(): string {
        return (this.props.fileTypes && this.props.fileTypes.length)
            ? this.props.fileTypes.join(",")
            : "image/*";
    }

    //  ViewIfStatements

    //  Control panel button Click Events

    private async onSaveButtonClickAsync(fileModel: FileModel, index: number): Promise<void> {

        if (!this.cropperModalRef.current) {
            return;
        }

        if (!this.props.onUploadAsync) {
            await this.updatePictureAsync(fileModel, index);
            return;
        }

        const uploadedFileModel = await this.props.onUploadAsync(fileModel);

        if (uploadedFileModel === null || uploadedFileModel === undefined) {
            await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
            return;
        }

        await this.updatePictureAsync(uploadedFileModel, index);
    }

    private async onPreviewButtonClickAsync(): Promise<void> {
        if (!this.previewModalRef.current) {
            return;
        }

        await this.previewModalRef.current.showModal(this.activePicture, this.selectedPictureIndex);
    }

    private async onDeleteButtonClickAsync(index: number | null = this.selectedPictureIndex): Promise<void> {
        if (index === null) {
            return;
        }

        await this.removePictureAsync(index);
    }

    private async onRotateMiniButtonClickAsync(degrees: number): Promise<void> {
        const selectedPicture = this.pictures[this.selectedPictureIndex!];

        let rotated = await ReactCropperHelpers.rotate(selectedPicture, degrees, this.getPreviewSource(selectedPicture));

        if (this.props.onUploadAsync) {
            rotated = await this.props.onUploadAsync(rotated);

            if (rotated === null || rotated === undefined) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.updatePictureAsync(rotated, this.selectedPictureIndex!);
    }

    private onListViewItemClick(index: number): void {
        this.setState(
            {
                selectedPictureIndex: (this.hasSelectedPictureIndex) && (this.selectedPictureIndex === index)
                    ? null
                    : index
            });
    }

    //  DragAndDrop Functionality Events

    private async onImageInputDragEnterAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    private async onDropDownAreaDragEnterAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    private async onDropDownAreaDragOverAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
    }

    private async onDropDownAreaDragLeaveAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (this.isDragOver) {
            await this.setState({ isDragOver: false });
        }
    }

    private async onDropDownAreaDropAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        event.persist();

        if (this.isDragOver) {
            await this.setState({ isDragOver: false });
        }

        if (!event?.dataTransfer?.files) {
            return;
        }

        await this.addFileListAsync(event.dataTransfer.files)
    }

    private async initializePicturesAsync(): Promise<void> {

        let pictures: FileModel[];
        let selectedPictureIndex: number | null;

        if ((Array.isArray(this.props.pictures)) && (this.props.pictures.length > 0)) {
            pictures = this.props.pictures;
            selectedPictureIndex = (typeof this.selectedPictureIndex === "number")
                ? this.selectedPictureIndex
                : 0;
        } else if (typeof this.props.pictures === "string") {
            pictures = [new FileModel(this.props.pictures as string)];
            selectedPictureIndex = 0;
        } else {
            pictures = [];
            selectedPictureIndex = null;
        }

        await this.setState({
            pictures,
            selectedPictureIndex
        });
    }

    //  Logic

    public async componentWillReceiveProps(nextProps: IImageInputProps): Promise<void> {

        const newPictures: boolean = (!Comparator.isEqual(this.props.pictures, nextProps.pictures));

        await super.componentWillReceiveProps(nextProps);

        if (newPictures) {
            await this.initializePicturesAsync();
        }
    }

    public async initializeAsync(): Promise<void> {
        await this.initializePicturesAsync();
    }

    private async addFileListAsync(fileList: FileList): Promise<void> {
        let fileListAsArray: File[] = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if ((!this.multiple) && (fileListAsArray.length > 1)) {
            fileListAsArray = [fileListAsArray[0]];
        }

        let fileModels: FileModel[] = await Promise.all(fileListAsArray.map(async (file: File): Promise<FileModel> => {
            return await ImageInput.fileToFileModel(file);
        }));

        fileModels = fileModels.filter(fileModel => {
            if (fileModel.size < this.maxImageRequestSizeInBytes) {
                return true;
            }

            ch.alertErrorAsync(ImageInputLocalizer.documentTooBig, true);
            return false;
        });

        fileModels = await Promise.all(fileModels.map(async (fileModel): Promise<FileModel> => {
            if (!this.props.onUploadAsync) {
                return fileModel;
            }

            const converted: FileModel | null = await this.props.onUploadAsync(fileModel);

            if (converted === null) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return fileModel;
            }

            return converted;
        }));

        await this.addPicturesAsync(fileModels)
    }

    private async addPicturesAsync(fileModels: FileModel[]): Promise<void> {
        if (fileModels.length === 0) {
            return;
        }

        if (this.props.onChangeAsync) {
            if (this.multiple) {
                await this.props.onChangeAsync(
                    this,
                    [...this.state.pictures, ...fileModels]
                );

                await this.setState(
                    {
                        selectedPictureIndex: this.selectedPictureIndex ?? 0
                    });
            }
            else
            {
                await this.props.onChangeAsync(
                    this,
                    fileModels.slice(0, 1)
                );

                await this.setState(
                    {
                        selectedPictureIndex: 0
                    });
            }
        }
    }

    private async updatePictureAsync(fileModel: FileModel, index: number): Promise<void> {
        const pictures = this.pictures.map((picture: FileModel, i) => {
            if (index === i) {
                return fileModel;
            }
            return picture;
        });

        if (this.props.onChangeAsync) {
            await this.props.onChangeAsync(this, pictures);
        }
    }

    private async removePictureAsync(index: number): Promise<void> {
        const pictures = [...this.pictures];
        pictures.splice(index, 1);

        const newIndex: number | null = (pictures.length <= 0)
            ? null
            : (index <= 0)
                ? 0
                : index - 1;

        await this.setState({selectedPictureIndex: newIndex});

        if (this.props.onChangeAsync) {
            await this.props.onChangeAsync(this, pictures);
        }
    }

    private get toolbar(): IIMageInputToolbar {
        const propsSelectionToolbar: IIMageInputToolbar = {...ImageInputToolbar.defaultNoSelectionToolbar, ...(this.props.selectionToolbar || {})};

        const propsNoSelectionToolbar: IIMageInputToolbar = {...ImageInputToolbar.defaultNoSelectionToolbar, ...(this.props.noSelectionToolbar || {})};

        if (this.hasSelectedPictureIndex) {
            return propsSelectionToolbar;
        } else {
            return propsNoSelectionToolbar;
        }
    }

    public render(): JSX.Element {
        const minimizeStyle: string | null = (this.minimizeOnEmpty) && (this.pictures.length <= 0)
            ? styles.minimize
            : null;

        return (
            <div className={this.css(styles.ImageInput, minimizeStyle, this.props.className)}
                 onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnterAsync(event)}
            >

                <ImageInputToolbar toolbar={this.toolbar}
                                   onRotateMiniButtonClickAsync={async (deg) => {
                                       await this.onRotateMiniButtonClickAsync(deg);
                                   }}

                                   onBrowseForFileClick={async (captureMode) => {
                                       const fileList = await ImageInput.browseForFiles(captureMode, this.multiple, this.acceptedTypes);
                                       await this.addFileListAsync(fileList)
                                   }}
                                   onEditButtonClickAsync={async () => {
                                       this.cropperModalRef.current?.showModal(this.activePicture, this.selectedPictureIndex);
                                   }}
                                   onDeleteButtonClickAsync={async () => await this.onDeleteButtonClickAsync()}
                                   onPreviewButtonClickAsync={async () => await this.onPreviewButtonClickAsync()}
                />

                <div className={styles.viewPanel}>

                    <div className={this.css(styles.dragDropArea, (this.isDragOver) && styles.dragDropAreaActive)}
                         onDrop={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDropAsync(event)}
                         onDragOver={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragOverAsync(event)}
                         onDragEnter={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragEnterAsync(event)}
                         onDragLeave={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragLeaveAsync(event)}
                    >
                        <span className={styles.dragDropAreaOverlay}>
                            {ImageInputLocalizer.dropIt}
                        </span>
                    </div>

                    <div className={styles.listView}>
                        {
                            this.pictures.map((fileModel, index) =>
                                (
                                    <ImageInputListItem index={index}
                                                        fileModel={fileModel}
                                                        onListViewItemClick={(index: number) => this.onListViewItemClick(index)}
                                                        hasSelectedPictureIndex={this.hasSelectedPictureIndex}
                                                        getPreviewName={(index: number) => this.getPreviewName(fileModel)}
                                                        getPreviewSource={(index: number) => this.getPreviewSource(fileModel)}
                                                        selectedPictureIndex={this.selectedPictureIndex}
                                    />
                                )
                            )
                        }
                    </div>

                    <ImageInputCropperModal ref={this.cropperModalRef}
                                            cropperSource={this.cropperSource}
                                            onCrop={(height: number, width: number) => {

                                            }}
                                            onSaveButtonClickAsync={async (fileModel: FileModel, index: number) => {
                                                this.cropperModalRef.current?.closeModal();
                                                await this.onSaveButtonClickAsync(fileModel, index);
                                            }}
                                            onBackButtonClickAsync={async () => {
                                                this.cropperModalRef.current?.closeModal();

                                            }}
                                            onDeleteButtonClickAsync={async (index: number) => {
                                                this.cropperModalRef.current?.closeModal();
                                                await this.onDeleteButtonClickAsync(index);
                                            }}

                    />

                    <ImageInputPreviewModal ref={this.previewModalRef}
                                            previewUrlBuilder={this.props.previewUrlBuilder}
                                            toolbarOverwrite={this.props.previewToolbar}
                                            onBackButtonClickAsync={async () => {
                                                this.previewModalRef.current?.closeModal();
                                            }}
                                            onEditButtonClickAsync={async (fileModel, index) => {
                                                this.previewModalRef.current?.closeModal();
                                                this.cropperModalRef.current?.showModal(fileModel, index);
                                            }}
                                            onDeleteButtonClickAsync={async () => {
                                                this.previewModalRef.current?.closeModal();

                                            }}
                    />

                </div>

            </div>
        );
    }

    //  Statics



    /**
     * @description It will get the files from input event and calls addFileListAsync method
     * @link addFileListAsync
     * @param captureMode if image needs to be taken from camera.
     * @param multiple multiple image select.
     * @param acceptedTypes file formats to allow.
     * @private
     */
    private static async browseForFiles(captureMode: boolean = false, multiple: boolean = false, acceptedTypes: string = "image/*"): Promise<FileList> {
        return new Promise(resolve => {
            const input = document.createElement('input') as HTMLInputElement;
            input.type = 'file';
            input.style.display = "none";

            if (captureMode) {
                // @ts-ignore
                input.capture = "environment";
            }

            input.multiple = multiple;

            input.accept = acceptedTypes;

            input.onchange = async (event: Event) => {
                event.preventDefault();

                if (!input.files) {
                    return;
                }

                const fileList: FileList = input.files;

                resolve(fileList);

                input.remove();
            }

            input.click();
        })
    }

    private static async fileToFileModel(file: File): Promise<FileModel> {
        const fileData = await ImageInput.readFile(file);
        const fileModel = new FileModel(fileData);
        fileModel.type = file.type;
        fileModel.name = file.name;
        fileModel.lastModified = new Date(file.lastModified);
        fileModel.size = file.size;
        return fileModel;
    }

    private static readFile(file: File): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function (e) {
                if (e.target?.result) {
                    resolve(e.target?.result as string);
                }
            };

            reader.onerror = function (e) {
                resolve(null);
            };
        });
    }

    // private async moveSelectedImageToTopAsync(): Promise<void> {
    //     if ((!this.hasSelectedPictureIndex)
    //         || (this.selectedPictureIndex === 0)) {
    //         return;
    //     }
    //
    //     const oldImage: FileModel = this.pictures[this.selectedPictureIndex!];
    //     const imagesAfter: FileModel[] = this.pictures.slice();
    //     imagesAfter.remove(oldImage);
    //
    //     await this.setState({
    //         pictures: [oldImage, ...imagesAfter],
    //         selectedPictureIndex: 0,
    //     });
    //
    //     if (this.props.onChange) {
    //         await this.props.onChange(this, this.pictures);
    //     }
    // }
    // private async onMoveDownButtonClickAsync(): Promise<void> {
    //     if ((!this.hasSelectedPictureIndex) || (this.selectedPictureIndex! >= this.pictures.length)) {
    //         return;
    //     }
    //
    //     await this.moveSelectedImageUpDownAsync(false);
    // }
    //
    //
    // private async onMoveUpButtonClickAsync(): Promise<void> {
    //     if ((!this.hasSelectedPictureIndex) || (this.selectedPictureIndex! <= 0)) {
    //         return;
    //     }
    //
    //     await this.moveSelectedImageUpDownAsync(true);
    // }
    //
    //
    // private async onMoveToTopButtonClickAsync(): Promise<void> {
    //     if ((!this.hasSelectedPictureIndex) || (this.selectedPictureIndex! <= 0)) {
    //         return;
    //     }
    //
    //     await this.moveSelectedImageToTopAsync()
    // }
    //
    //
    // private async moveSelectedImageUpDownAsync(up: boolean): Promise<void> {
    //     if ((!this.hasSelectedPictureIndex)
    //         || ((up) && (this.selectedPictureIndex === 0))
    //         || ((!up) && (this.selectedPictureIndex === this.pictures.length - 1))) {
    //         return;
    //     }
    //
    //     const oldIndex: number = this.selectedPictureIndex!;
    //     const oldImage: FileModel = this.pictures[oldIndex];
    //     let newIndex: number = (up)
    //         ? oldIndex - 1
    //         : oldIndex + 1;
    //
    //     this.pictures[oldIndex] = this.pictures[newIndex];
    //     this.pictures[newIndex] = oldImage;
    //
    //     if (this.props.onChange) {
    //         await this.props.onChange(this, this.pictures);
    //     }
    //
    //     await this.setState({
    //         selectedPictureIndex: newIndex,
    //     });
    // }

}