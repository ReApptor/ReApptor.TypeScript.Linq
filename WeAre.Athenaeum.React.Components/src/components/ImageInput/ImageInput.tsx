import React, {DragEvent} from 'react';
import {ch, IGlobalKeydown} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import Comparator from "../../helpers/Comparator";
import {ImageProvider} from "../ImageModal/ImageModal";
import {IIMageInputToolbar, IImageInputToolbarOverwriteProps, ImageInputToolbar} from "./ImageInputToolbar/ImageInputToolbar";
import {ImageInputListItem} from "./ImageInputListItem/ImageInputListItem";
import {ImageInputPreviewModal} from "./ImageInputPreviewModal/ImageInputPreviewModal";
import {ImageInputCropperModal, ReadyEvent} from "./ImageInputCropperModal/ImageInputCropperModal";
import BaseInput, {IBaseInputProps, IBaseInputState, IImageInputInputType, ValidatorCallback} from "../BaseInput/BaseInput";

import ImageInputLocalizer from "./ImageInputLocalizer";

import "cropperjs/dist/cropper.css";
import styles from "./ImageInput.module.scss";

interface IImageInputState extends IBaseInputState<IImageInputInputType> {
    activeImageDragOverDropZone: boolean;
    selectedPictureIndex: number | null;
}

interface IImageInputProps extends IImageInputToolbarOverwriteProps, IBaseInputProps<IImageInputInputType> {
    className?: string;
    disabled?: boolean;
    readonly?: boolean;

    /** Should Edit-mode be enabled immediately after an image is uploaded. Only works if {@link multiple} is not set to true. */
    editOnAddInSingleMode?: boolean
    maxImageRequestSizeInBytes?: number;
    minimizeOnEmpty?: boolean;
    cropperDebugMode?: boolean;

    /**
     * Does the {@link ImageInput} accept multiple images.
     * @default false
     */
    multiple?: boolean;

    /** List of allowed file extensions. */
    fileTypes?: string[];

    previewUrlBuilder?(file: FileModel): string;
    onDelete?(file: FileModel): Promise<void>;
    onUpload?(file: FileModel): Promise<FileModel>;
    onChange?(sender: ImageInput, value: IImageInputInputType): Promise<void>;
}

export class ImageInput extends BaseInput<IImageInputInputType, IImageInputProps, IImageInputState> implements IGlobalKeydown{

    private previewModalRef = React.createRef<ImageInputPreviewModal>();
    private cropperModalRef = React.createRef<ImageInputCropperModal>();
    private cropperHiddenModalRef = React.createRef<ImageInputCropperModal>();

    public state: IImageInputState = {
        readonly: this.props.disabled || false,
        model: {
            value: this.props.value || (this.props.model ? this.props.model.value : null)
        },
        edit: true,
        activeImageDragOverDropZone: false,
        selectedPictureIndex: null,
        validationError: null
    };

    async onGlobalKeydown(event: React.SyntheticEvent): Promise<void> {
        const keyboardEvent = event as unknown as KeyboardEvent;

        if (keyboardEvent && keyboardEvent.code === 'Escape') {
            await this.onEscapeKeyPressAsync();
            return;
        }
    }

    /**
     * @description emitted fileModel should be uploaded before calling this method
     * @description use this to emit new values to outside world
     * @description It will handle updating selectedPictureIndex
     * @description It will handle array value for single mode
     * @description It will handle single value for multiple mode
     * @param newValue new output to emit
     */
    private async onInternalChangeAsync(newValue: IImageInputInputType): Promise<void> {
        //  Handling if it's in single mode

        await this.updateSelectedPictureIndexBasedOnNewValueAsync(newValue);

        if (!this.multiple) {

            if (!newValue){
                await this.updateValueAsync(null, false);
                await this.emitOnChangePropAsync();
                return;
            }

            if (newValue instanceof FileModel){
                await this.updateValueAsync(newValue, false);
                await this.emitOnChangePropAsync();
                return;
            }

            if (Array.isArray(newValue)){
                await this.updateValueAsync(newValue.length > 0 ? newValue[0] : null, false);
                await this.emitOnChangePropAsync();
                return;
            }

            return;
        }

        //  Handling if it's in multiple mode

        if (!newValue) {
            await this.updateValueAsync([], false);
            await this.emitOnChangePropAsync();
            return;
        }

        if (newValue instanceof FileModel){
            await this.updateValueAsync([newValue], false);
            await this.emitOnChangePropAsync();
            return;
        }

        if (Array.isArray(newValue)){
            await this.updateValueAsync(newValue, false);
            await this.emitOnChangePropAsync();
            return;
        }

        return;
    }

    /** @description Helper function to invoke onChangeAsync prop */
    private async emitOnChangePropAsync() {
        if (!this.props.onChange) {
            return;
        }

        await this.props.onChange(this, this.value);
    }

    public getValidators(): ValidatorCallback<IImageInputInputType>[] {
        return [
        ];
    }

    /**  @description needs to be arrow function. In initializeAsync it's passed to eventListener. */
    public keyboardKeyPressHandlerAsync = async (event: KeyboardEvent): Promise<void> => {
        if (event.code === 'Escape') {
            await this.onEscapeKeyPressAsync();
            return;
        }
    }

    //  Keyboard Keys listeners

    private async onEscapeKeyPressAsync(): Promise<void> {
        this.cropperModalRef.current?.closeModal();
        this.previewModalRef.current?.closeModal();
    }

    //  Getters

    private get hasSelectedPictureIndex(): boolean {
        return Comparator.isNumber(this.state.selectedPictureIndex);
    }

    private get selectedPictureIndex(): number | null {
        return this.state.selectedPictureIndex;
    }

    private get activeImageDragOverDropZone(): boolean {
        return this.state.activeImageDragOverDropZone;
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

    /** @description use this only to iterate the view */
    private get viewImageListItems(): FileModel[] {
        if (!this.value) {
            return [];
        }

        if (this.value instanceof FileModel) {
            return [this.value];
        }

        if (Array.isArray(this.value)) {
            return this.value;
        }

        //  if it's base64 string

        const fileModel = new FileModel();

        fileModel.src = this.value;

        return [fileModel];
    }

    private get activePicture(): FileModel | null {
        return (this.hasSelectedPictureIndex)
            ? this.viewImageListItems[this.selectedPictureIndex!]
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

    private onListViewItemClick(index: number): void {
        if (this.multiple) {
            this.setState(
                {
                    selectedPictureIndex: (this.hasSelectedPictureIndex) && (this.selectedPictureIndex === index)
                        ? null
                        : index
                });
            return;
        }

        this.setState(
            {
                selectedPictureIndex: this.value
                    ? 0
                    : null
            });
    }

    /** @description DragAndDrop Functionality*/
    private async onImageInputDragEnterAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.activeImageDragOverDropZone) {
            await this.setState({ activeImageDragOverDropZone: true });
        }
    }

    /** @description DragAndDrop Functionality*/
    private async onDropDownAreaDragEnterAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.activeImageDragOverDropZone) {
            await this.setState({ activeImageDragOverDropZone: true });
        }
    }

    /** @description DragAndDrop Functionality*/
    private async onDropDownAreaDragOverAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
    }

    /** @description DragAndDrop Functionality*/
    private async onDropDownAreaDragLeaveAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (this.activeImageDragOverDropZone) {
            await this.setState({ activeImageDragOverDropZone: false });
        }
    }

    /** @description DragAndDrop Functionality*/
    private async onDropDownAreaDropAsync(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        event.persist();

        if (this.activeImageDragOverDropZone) {
            await this.setState({ activeImageDragOverDropZone: false });
        }

        if (!event?.dataTransfer?.files) {
            return;
        }

        await this.addInternalAsync(event.dataTransfer.files)
    }

    /** @description Trigger this on input data when selecting new files. Responsible for uploading, appending to current data and calling @link onInternalChangeAsync */
    private async addInternalAsync(fileList: FileList): Promise<void> {
        let fileListAsArray: File[] = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if ((!this.multiple) && (fileListAsArray.length > 1)) {
            fileListAsArray = [fileListAsArray[0]];
        }

        const fileModels: FileModel[] = await Promise.all(fileListAsArray.map(async (file: File): Promise<FileModel> => {
            return await ImageInput.fileToFileModel(file);
        }));

        const filteredFileModels = fileModels.filter(fileModel => {
            if (fileModel.size < this.maxImageRequestSizeInBytes) {
                return true;
            }

            ch.alertErrorAsync(ImageInputLocalizer.documentTooBig, true);
            return false;
        });

        const uploadedFileModels = await Promise.all(filteredFileModels.map(async (fileModel): Promise<FileModel> => {
            if (!this.props.onUpload) {
                return fileModel;
            }

            const uploaded: FileModel | null = await this.props.onUpload(fileModel);

            if (uploaded === null) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return fileModel;
            }

            return uploaded;
        }));

        if (!this.multiple && (uploadedFileModels.length > 0)) {
            await this.onInternalChangeAsync(uploadedFileModels);
            return;
        }

        else if (this.multiple && Array.isArray(this.value)) {
            await this.onInternalChangeAsync([...this.value, ...uploadedFileModels]);
            return;

        }

        else if (this.multiple && !this.value) {
            await this.onInternalChangeAsync(uploadedFileModels);
            return;
        }

    }

    /** @description Trigger this on updating. Responsible for multipleMode and uploading and calling @link onInternalChangeAsync */
    private async updateInternalAsync(fileModel: FileModel, index: number): Promise<void> {

        if (this.multiple) {
            if (!Array.isArray(this.value)) {
                console.error("multiple mode is on and value is not array.");
                return;
            }

            const valueToUpdate = [...this.value];

            valueToUpdate[index] = fileModel;

            if (!this.props.onUpload) {
                await this.onInternalChangeAsync(valueToUpdate);
                return;
            }

            const uploadedFileModel: FileModel | null = await this.props.onUpload(fileModel);

            if (uploadedFileModel === null) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }

            valueToUpdate[index] = uploadedFileModel;

            await this.onInternalChangeAsync(valueToUpdate);

            return;

        } else {

            if (!(this.value instanceof FileModel)) {
                console.error("multiple mode is off while value is not instanceof FileModel");
                return;
            }

            if (!this.props.onUpload) {
                await this.onInternalChangeAsync(fileModel);
                return;
            }

            const uploadedFileModel: FileModel | null = await this.props.onUpload(fileModel);

            if (uploadedFileModel === null) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }

            await this.onInternalChangeAsync(uploadedFileModel);
        }
    }

    /** @description Trigger this on deleting. Responsible for deleting and calling @link onInternalChangeAsync */
    private async deleteInternalAsync(index: number | null = this.state.selectedPictureIndex): Promise<void> {

        if (index === null) {
            return;
        }

        if (this.multiple) {
            if (!Array.isArray(this.value)) {
                console.error("multiple mode is on and value is not array.");
                return;
            }

            const valueToUpdate = [...this.value];

            const fileModelToDelete = this.value[index];

            valueToUpdate.splice(index, 1);

            if (this.props.onDelete) {
                await this.props.onDelete(fileModelToDelete);
            }

            await this.onInternalChangeAsync(valueToUpdate);

            return;

        } else {
            const fileModelToDelete = this.value;

            if (!(fileModelToDelete instanceof FileModel)) {
                console.error("multiple mode is off while value is not instanceof FileModel");
                return
            }


            if (this.props.onDelete) {
                await this.props.onDelete(fileModelToDelete);
            }

            await this.onInternalChangeAsync(null);

            return;
        }
    }

    /** @description responsible for updating selectedPictureIndex with new coming state */
    private async updateSelectedPictureIndexBasedOnNewValueAsync(newValue: IImageInputInputType) {
        if (this.state.selectedPictureIndex === null) {
            if (!this.multiple && newValue) {
                await this.setState({selectedPictureIndex: 0});
            }
            return;
        }

        if (!newValue) {
            await this.setState({selectedPictureIndex: null});
            return;
        }

        if (!this.multiple && newValue instanceof FileModel) {
            if (this.state.selectedPictureIndex > 0) {
                await this.setState({selectedPictureIndex: 0});
                return;
            }

            return;
        }

        if (this.multiple && Array.isArray(newValue) && this.state.selectedPictureIndex >= newValue.length) {
            await this.setState({selectedPictureIndex: newValue.length > 0 ? newValue.length - 1 : null});
            return;
        }
    }

    private get toolbar(): IIMageInputToolbar {
        const propsSelectionToolbar: IIMageInputToolbar = {...ImageInputToolbar.defaultSelectionToolbar, ...(this.props.selectionToolbar || {})};

        const propsNoSelectionToolbar: IIMageInputToolbar = {...ImageInputToolbar.defaultNoSelectionToolbar, ...(this.props.noSelectionToolbar || {})};

        if (this.hasSelectedPictureIndex) {
            return propsSelectionToolbar;
        } else {
            return propsNoSelectionToolbar;
        }
    }

    public renderInput(): JSX.Element {
        const minimizeStyle: string | null = (this.minimizeOnEmpty) && (this.viewImageListItems.length <= 0)
            ? styles.minimize
            : null;

        return (
            <div className={this.css(styles.ImageInput, minimizeStyle, this.props.className)}
                 onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnterAsync(event)}
            >

                <div className={styles.viewPanel}>
                    <div className={this.css(styles.dragDropArea, (this.activeImageDragOverDropZone) && styles.dragDropAreaActive)}
                         onDrop={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDropAsync(event)}
                         onDragOver={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragOverAsync(event)}
                         onDragEnter={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragEnterAsync(event)}
                         onDragLeave={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragLeaveAsync(event)}
                    >
                        <span className={styles.dragDropAreaOverlay}>
                            {ImageInputLocalizer.dropIt}
                        </span>
                    </div>

                    <div className={styles.listView}
                         app-multiple={String(this.multiple)}

                    >
                        {
                            this.viewImageListItems.map((fileModel, index) =>
                                (
                                    <ImageInputListItem key={index}
                                                        fileModel={fileModel}
                                                        multiple={this.multiple}
                                                        selected={this.selectedPictureIndex === index}
                                                        previewName={this.getPreviewName(fileModel)}
                                                        previewSource={this.getPreviewSource(fileModel)}
                                                        onListViewItemClick={() => this.onListViewItemClick(index)}
                                    />
                                )
                            )
                        }
                    </div>

                    <ImageInputCropperModal ref={this.cropperModalRef}
                                            cropperSource={this.cropperSource}
                                            cropperDebugMode={this.props.cropperDebugMode}
                                            onCrop={(height: number, width: number) => {

                                            }}
                                            onBackButtonClick={async () => {
                                                this.cropperModalRef.current?.closeModal();
                                            }}
                                            onSaveButtonClick={async (fileModel: FileModel, index: number) => {
                                                this.cropperModalRef.current?.closeModal();
                                                await this.updateInternalAsync(fileModel, index);
                                            }}
                                            onDeleteButtonClick={async (index: number) => {
                                                this.cropperModalRef.current?.closeModal();
                                                await this.deleteInternalAsync(index);
                                            }}
                    />


                    <ImageInputCropperModal ref={this.cropperHiddenModalRef}
                                            className="d-none"
                                            cropperSource={this.cropperSource}
                                            onReady={async (event: ReadyEvent, fileModel: FileModel, index: number) => {
                                                this.cropperHiddenModalRef.current?.closeModal();
                                                await this.updateInternalAsync(fileModel, index);
                                            }}
                    />

                    <ImageInputPreviewModal ref={this.previewModalRef}
                                            previewUrlBuilder={this.props.previewUrlBuilder}
                                            toolbarOverwrite={this.props.previewToolbar}
                                            onBackButtonClick={async () => {
                                                this.previewModalRef.current?.closeModal();
                                            }}
                                            onEditButtonClick={async (fileModel, index) => {
                                                this.previewModalRef.current?.closeModal();
                                                this.cropperModalRef.current?.showModal(fileModel, index);
                                            }}
                                            onDeleteButtonClick={async (index: number) => {
                                                this.previewModalRef.current?.closeModal();
                                                await this.deleteInternalAsync(index);
                                            }}
                    />

                </div>

                <ImageInputToolbar toolbar={this.toolbar}
                                   onRotateMiniButtonClick={async (degree) => {
                                       if (this.activePicture && Comparator.isNumber(this.state.selectedPictureIndex)) {
                                           this.cropperHiddenModalRef.current?.showModal(this.activePicture, this.state.selectedPictureIndex, degree);
                                       }
                                   }}
                                   onBrowseForFileClick={async (captureMode) => {
                                       const fileList = await ImageInput.browseForFiles(captureMode, this.multiple, this.acceptedTypes);
                                       await this.addInternalAsync(fileList)
                                   }}
                                   onEditButtonClick={async () => {
                                       this.cropperModalRef.current?.showModal(this.activePicture, this.selectedPictureIndex);
                                   }}
                                   onDeleteButtonClick={async () => {
                                       await this.deleteInternalAsync();
                                   }}
                                   onPreviewButtonClick={async () => {
                                       await this.previewModalRef.current?.showModal(this.activePicture, this.selectedPictureIndex);
                                   }}
                />
            </div>
        );
    }

    //  Statics



    /**
     * @description It will get the files from input event
     * @link addInternalAsync
     * @param captureMode if image needs to be taken from camera.
     * @param multiple multiple image select.
     * @param acceptedTypes file formats to allow.
     * @return FileList
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