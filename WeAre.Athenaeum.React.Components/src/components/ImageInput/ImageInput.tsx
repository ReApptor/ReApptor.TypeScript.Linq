import React, {DragEvent} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import Comparator from "../../helpers/Comparator";
import {ReactCropperHelpers} from "./ReactCropperHelpers";
import {ImageProvider} from "../ImageModal/ImageModal";
import ImageInputLocalizer from "./ImageInputLocalizer";

import "cropperjs/dist/cropper.css";
import "./ReactCropperOverride.scss";

import styles from "./ImageInput.module.scss";
import {IImageInputToolbarOverwriteProps, ImageInputToolbar} from "./ImageInputToolbar/ImageInputToolbar";
import {ImageInputListItem} from "./ImageInputListItem/ImageInputListItem";

export enum ImageInputView {

    /**
     * If no uploaded files, display nothing.
     * If single-input and uploaded picture, display small preview of the picture.
     * If multi-input and uploaded picture(s), display list of pictures.
     */
    Default,

    /** Display full-screen preview of the selected picture. */
    Preview,

    /** Display full-screen editor of the selected picture. */
    Edit,
}

interface IImageInputState {
    currentView: ImageInputView;
    isDragOver: boolean;
    previousView: ImageInputView;
    selectedPictureIndex: number | null;
    pictures: FileModel[];
}

interface IImageInputProps extends IImageInputToolbarOverwriteProps {
    pictures: FileModel[] | string | null;
    className?: string;

    /** Should Edit-mode be enabled immediately after an image is uploaded. Only works if {@link multi} is not set to true. */
    editOnAddInSingleMode?: boolean
    maxImageRequestSizeInBytes?: number;
    minimizeOnEmpty?: boolean;

    /**
     * Does the {@link ImageInput} accept multiple images.
     * @default false
     */
    multi?: boolean;

    /** List of allowed file extensions. */
    fileTypes?: string[];
    
    imageUrl?(file: FileModel): string;
    convertImage?(file: FileModel): Promise<FileModel>;
    
    onChange?(sender: ImageInput, pictures: FileModel[]): Promise<void>;
}

export class ImageInput extends BaseComponent<IImageInputProps, IImageInputState> {

    private cropperRef = React.createRef<ReactCropperElement>();
    private cropperHelper = new ReactCropperHelpers(this.cropperRef);

    public state: IImageInputState = {
        currentView: ImageInputView.Default,
        isDragOver: false,
        previousView: ImageInputView.Default,
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

    private get currentView(): ImageInputView {
        return ImageInput.assertIsImageInputView(this.state.currentView);
    }

    private get previousView(): ImageInputView {
        return ImageInput.assertIsImageInputView(this.state.previousView);
    }

    private get isDragOver(): boolean {
        return this.state.isDragOver;
    }

    private get editOnAddInSingleMode(): boolean {
        return (this.props.editOnAddInSingleMode === true);
    }

    private get isFullscreen(): boolean {
        return (this.currentView === ImageInputView.Preview) || (this.currentView === ImageInputView.Edit);
    }

    private get minimizeOnEmpty(): boolean {
        return (this.props.minimizeOnEmpty === true);
    }

    private get multi(): boolean {
        return (this.props.multi === true);
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
            if (this.props.imageUrl) {
                return this.props.imageUrl(this.activePicture);
            }

            return this.getImageUrl(this.activePicture);
        }

        return this.activePicture.src;
    }

    private getImageUrl(image: FileModel): string {
        return (this.props.imageUrl)
            ? this.props.imageUrl(image)
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
            if (this.props.imageUrl) {
                return this.props.imageUrl(fileModel);
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

    private get showBackButton(): boolean {
        return (this.isFullscreen);
    }

    private get showSaveButton(): boolean {
        return (this.currentView === ImageInputView.Edit);
    }

    private get miniRotateButtons(): boolean {

        // TODO: get from props?

        return (this.hasSelectedPictureIndex) && (this.currentView === ImageInputView.Default);
    }

    //  Control panel button Click Events

    private async onSaveButtonClickAsync(): Promise<void> {
        if ((!this.cropperRef.current)
            || (this.currentView !== ImageInputView.Edit)) {
            return;
        }

        if ((!this.hasSelectedPictureIndex) || (!this.activePicture)) {
            return;
        }

        let newFileModel: FileModel = {...this.activePicture};

        newFileModel.src = this.cropperRef.current?.cropper.getCroppedCanvas().toDataURL() || "";

        if (this.props.convertImage) {
            newFileModel = await this.props.convertImage(newFileModel);

            if (newFileModel === null || newFileModel === undefined) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.updatePictureAsync(newFileModel, this.selectedPictureIndex!);

        await this.setCurrentViewAsync(this.previousView);
    }

    private async onEditButtonClickAsync(): Promise<void> {
        if (!this.hasSelectedPictureIndex) {
            return;
        }

        await this.setCurrentViewAsync(ImageInputView.Edit);
    }

    private async onBackButtonClickAsync(): Promise<void> {
        const newView: ImageInputView = (this.currentView === ImageInputView.Edit)
            ? this.previousView
            : ImageInputView.Default;

        await this.setCurrentViewAsync(newView);
    }

    private async onPreviewButtonClickAsync(): Promise<void> {
        if (!this.hasSelectedPictureIndex) {
            return;
        }

        await this.setCurrentViewAsync(ImageInputView.Preview);
    }

    private async onDeleteButtonClickAsync(): Promise<void> {
        if (!this.hasSelectedPictureIndex) {
            return;
        }

        await this.removePictureAsync(this.selectedPictureIndex!);
    }

    private async onRotateButtonClickAsync(degrees: number): Promise<void> {
        if (!this.cropperRef.current) {
            return;
        }

        this.cropperHelper.rotateAndFitToScreen(degrees);
    }

    private async onRotateMiniButtonClickAsync(degrees: number): Promise<void> {
        const selectedPicture = this.pictures[this.selectedPictureIndex!];

        let rotated = await ReactCropperHelpers.rotate(selectedPicture, degrees, this.getPreviewSource(selectedPicture));

        if (this.props.convertImage) {
            rotated = await this.props.convertImage(rotated);

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

    private async setCurrentViewAsync(currentView: ImageInputView): Promise<void> {
        if (this.currentView !== ImageInput.assertIsImageInputView(currentView)) {
            await this.setState({
                previousView: this.currentView,
                currentView
            });
        }
    }

    private async addFileListAsync(fileList: FileList): Promise<void> {
        let fileListAsArray: File[] = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if ((!this.multi) && (fileListAsArray.length > 1)) {
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
            if (!this.props.convertImage) {
                return fileModel;
            }

            const converted: FileModel | null = await this.props.convertImage(fileModel);

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

        if (this.props.onChange) {
            if (this.multi) {
                await this.props.onChange(
                    this,
                    [...this.state.pictures, ...fileModels]
                );

                await this.setState(
                    {
                        selectedPictureIndex: this.selectedPictureIndex ?? 0
                    });

                await this.setCurrentViewAsync(ImageInputView.Default);
            }
            else
            {
                await this.props.onChange(
                    this,
                    fileModels.slice(0, 1)
                );

                await this.setState(
                    {
                        selectedPictureIndex: 0
                    });

                const selectedView = (this.editOnAddInSingleMode)
                    ? ImageInputView.Edit
                    : ImageInputView.Default

                await this.setCurrentViewAsync(selectedView);
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

        if (this.props.onChange) {
            await this.props.onChange(this, pictures);
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

        await this.setCurrentViewAsync(ImageInputView.Default);

        if (this.props.onChange) {
            await this.props.onChange(this, pictures);
        }
    }

    //  Renders
    private renderPreviewPanel(): JSX.Element {
        const index: number = this.selectedPictureIndex ?? 0;
        const src: string | undefined = this.getPreviewSource(this.pictures[index]);
        const alt: string | undefined = this.getPreviewName(this.pictures[index])

        return (
            <div className={styles.preview}>
                <img src={src}
                     alt={alt}
                />
            </div>
        );
    }

    public render(): JSX.Element {
        const minimizeStyle: string | null = (this.minimizeOnEmpty) && (this.pictures.length <= 0)
            ? styles.minimize
            : null;
        const fullScreenStyle: string | null = (this.isFullscreen)
            ? styles.fullScreen
            : null;

        return (
            <div className={this.css(styles.ImageInput, minimizeStyle, fullScreenStyle, this.props.className)}
                 onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnterAsync(event)}
            >

                <div className={styles.controlPanel}>

                    <ImageInputToolbar currentView={this.currentView}
                                       showSaveButton={this.showSaveButton}
                                       showBackButton={this.showBackButton}
                                       miniRotateButtons={this.miniRotateButtons}
                                       hasSelectedPictureIndex={this.hasSelectedPictureIndex}
                                       editToolbar={this.props.editToolbar}
                                       previewToolbar={this.props.previewToolbar}
                                       selectionToolbar={this.props.selectionToolbar}
                                       noSelectionToolbar={this.props.noSelectionToolbar}
                                       onBrowseForFileClick={async (captureMode) => {
                                           const fileList = await ImageInput.browseForFiles(captureMode, this.multi, this.acceptedTypes);
                                           await this.addFileListAsync(fileList)
                                       }}
                                       onEditButtonClickAsync={async () => await this.onEditButtonClickAsync()}
                                       onSaveButtonClickAsync={async () => await this.onSaveButtonClickAsync()}
                                       onBackButtonClickAsync={async () => await this.onBackButtonClickAsync()}
                                       onRotateButtonClickAsync={async (deg) => await this.onRotateButtonClickAsync(deg)}
                                       onDeleteButtonClickAsync={async () => await this.onDeleteButtonClickAsync()}
                                       onPreviewButtonClickAsync={async () => await this.onPreviewButtonClickAsync()}
                                       onRotateMiniButtonClickAsync={async (deg) => await this.onRotateMiniButtonClickAsync(deg)}
                                       // onMoveDownButtonClickAsync={async () => await this.onMoveDownButtonClickAsync()}
                                       // onMoveUpButtonClickAsync={async () => await this.onMoveUpButtonClickAsync()}
                                       // onMoveToTopButtonClickAsync={async () => await this.onMoveToTopButtonClickAsync()}
                    />

                </div>

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

                    {
                        (this.currentView === ImageInputView.Edit) &&
                        (
                            <div className={styles.cropper}>
                                <Cropper ref={this.cropperRef}
                                         className={styles.reactCropper}
                                         style={{height: "100%", width: "100%"}}
                                         src={this.cropperSource}
                                         viewMode={1} // cannot move box outside image borders
                                         guides={false}
                                         ready={() => this.cropperHelper.setCropAreaToImageFullSize()}
                                />
                            </div>
                        )
                    }

                    {
                        (this.multi) && (this.currentView === ImageInputView.Default) &&
                        (
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
                        )
                    }

                    {
                        ((this.currentView === ImageInputView.Preview) || ((!this.multi) && (this.currentView === ImageInputView.Default) && (this.hasSelectedPictureIndex))) &&
                        (
                            this.renderPreviewPanel()
                        )
                    }

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

    private static assertIsImageInputView(value: any): ImageInputView {
        switch (value) {
            case ImageInputView.Default:
                return ImageInputView.Default;
            case ImageInputView.Preview:
                return ImageInputView.Preview;
            case ImageInputView.Edit:
                return ImageInputView.Edit;
            default:
                throw new TypeError("value is not of type ImageInputView");
        }
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