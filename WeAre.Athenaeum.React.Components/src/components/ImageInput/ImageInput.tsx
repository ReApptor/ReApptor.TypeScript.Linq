import React, {ChangeEvent, DragEvent, LegacyRef, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";
import Button, {ButtonType} from "../Button/Button";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import Comparator from "../../helpers/Comparator";
import {ReactCropperHelpers} from "./ReactCropperHelpers";
import ImageInputLocalizer from "./ImageInputLocalizer";

import "cropperjs/dist/cropper.css";
import "./ReactCropperOverride.scss";

import styles from "./ImageInput.module.scss";

enum ImageInputView {

    /**
     * If no uploaded files, display nothing.
     * If single-input and uploaded picture, display small preview of the picture.
     * If multi-input and uploaded picture(s), display list of pictures.
     */
    Default,

    /**
     * Display full-screen preview of the selected picture.
     */
    Preview,

    /**
     * Display full-screen editor of the selected picture.
     */
    Edit,
}

interface IImageInputState {
    currentView: ImageInputView;
    isDragOver: boolean;
    previousView: ImageInputView;
    selectedPictureIndex: number | null;
    pictures: FileModel[];
}

interface IImageInputProps {
    pictures: FileModel[] | string;
    className?: string;
    editOnAddInSingleMode?: boolean
    maxImageRequestSizeInBytes?: number;
    minimizeOnEmpty?: boolean;
    multi?: boolean;
    imageUrl?(file: FileModel): string;
    convertImage?(file: FileModel): Promise<FileModel>;
    onChange?(sender: ImageInput, pictures: FileModel[]): Promise<void>;
}

export class ImageInput extends BaseComponent<IImageInputProps, IImageInputState> {

    private fileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    private cameraFileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
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

    private get selectedPictureIndex(): number {
        return Comparator.assertIsNumber(this.state.selectedPictureIndex);
    }

    private get currentView(): ImageInputView {
        return ImageInput.assertIsImageInputView(this.state.currentView);
    }

    private get previousView(): ImageInputView {
        return ImageInput.assertIsImageInputView(this.state.previousView);
    }

    private get isDragOver(): boolean {
        // noinspection PointlessBooleanExpressionJS - there is no knowing what type the value will be in runtime.
        return (this.state.isDragOver === true);
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
            ? this.pictures[this.selectedPictureIndex]
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

            return `/files/images/${this.activePicture.id}`
        }

        return this.activePicture.src;
    }

    private getPreviewName(index: number): string {
        const picture: FileModel | undefined = this.pictures[index];

        if (!picture) {
            return "";
        }

        return picture.name
    }

    private getPreviewSource(index: number): string {
        const picture: FileModel | undefined = this.pictures[index];

        if (!picture) {
            return "";
        }

        if (picture.id) {
            if (this.props.imageUrl) {
                return this.props.imageUrl(picture);
            }

            return `/files/images/${picture.id}`
        }

        return picture.src;
    }

    private get maxImageRequestSizeInBytes(): number {
        return (this.props.maxImageRequestSizeInBytes) || (AthenaeumComponentsConstants.maxImageRequestSizeInBytes);
    }

    //  ViewIfStatements

    private get showEditButton(): boolean {
        return (this.hasSelectedPictureIndex)
            && (this.currentView !== ImageInputView.Edit);
    }

    private get showBackButton(): boolean {
        return (this.isFullscreen);
    }

    private get showPreviewButton(): boolean {
        return (this.hasSelectedPictureIndex)
            && (!this.isFullscreen);
    }

    private get showBrowseButton(): boolean {
        return (this.currentView !== ImageInputView.Edit);
    }

    private get showCameraButton(): boolean {
        return (this.currentView !== ImageInputView.Edit);
    }

    private get showDeleteButton(): boolean {
        return (this.hasSelectedPictureIndex);
    }

    private get showRotateButton(): boolean {
        return (this.currentView === ImageInputView.Edit);
    }

    private get showSaveButton(): boolean {
        return (this.currentView === ImageInputView.Edit);
    }

    private get showMiniRotateButton(): boolean {
        return (this.hasSelectedPictureIndex) && (this.currentView === ImageInputView.Default);
    }

    //  Control panel button Click Events

    private async onBrowseButtonClick(): Promise<void> {
        if (!this.fileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.fileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    private async onCameraButtonClick(): Promise<void> {
        if (!this.cameraFileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.cameraFileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    private async onSaveButtonClick(): Promise<void> {
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

        await this.updatePicture(newFileModel, this.selectedPictureIndex);
        await this.setCurrentView(this.previousView);

    }

    private async onEditButtonClick(): Promise<void> {
        if (!this.hasSelectedPictureIndex) {
            return;
        }

        await this.setCurrentView(ImageInputView.Edit);
    }

    private async onBackButtonClick(): Promise<void> {
        const newView: ImageInputView = (this.currentView === ImageInputView.Edit)
            ? this.previousView
            : ImageInputView.Default;

        await this.setCurrentView(newView);
    }

    private async onPreviewButtonClick(): Promise<void> {
        if (!this.hasSelectedPictureIndex) {
            return;
        }

        await this.setCurrentView(ImageInputView.Preview);
    }

    private async onDeleteButtonClick(): Promise<void> {
        if (!this.hasSelectedPictureIndex) {
            return;
        }

        await this.removePicture(this.selectedPictureIndex)
    }

    private async onRemoveButtonClick(): Promise<void> {

        // TODO: use this method?

        if (!this.hasSelectedPictureIndex) {
            return;
        }
    }

    private async onRotateLeftButtonClick(): Promise<void> {
        if (!this.cropperRef.current) {
            return;
        }

        this.cropperHelper.rotateAndFitToScreen(-90);
    }

    private async onRotateRightButtonClick(): Promise<void> {
        if (!this.cropperRef.current) {
            return;
        }

        this.cropperHelper.rotateAndFitToScreen(90);
    }

    private async onRotateLeftMiniButtonClick(): Promise<void> {
        const selectedPicture = this.pictures[this.selectedPictureIndex];

        let rotated = await ReactCropperHelpers.rotate(selectedPicture, -90, this.getPreviewSource(this.selectedPictureIndex));

        if (this.props.convertImage) {
            rotated = await this.props.convertImage(rotated);

            if (rotated === null || rotated === undefined) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.updatePicture(rotated, this.selectedPictureIndex);
    }

    private async onRotateRightMiniButtonClick(): Promise<void> {

        const selectedPicture = this.pictures[this.selectedPictureIndex];

        let rotated = await ReactCropperHelpers.rotate(selectedPicture, 90, this.getPreviewSource(this.selectedPictureIndex));

        if (this.props.convertImage) {
            rotated = await this.props.convertImage(rotated);

            if (rotated === null || rotated === undefined) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.updatePicture(rotated, this.selectedPictureIndex);
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

    private async onImageInputDragEnter(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    private async onDropDownAreaDragEnter(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    private async onDropDownAreaDragOver(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
    }

    private async onDropDownAreaDragLeave(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (this.isDragOver) {
            await this.setState({ isDragOver: false });
        }
    }

    private async onDropDownAreaDrop(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        event.persist();

        if (this.isDragOver) {
            await this.setState({ isDragOver: false });
        }

        if (!event?.dataTransfer?.files) {
            return;
        }

        await this.addFileList(event.dataTransfer.files)
    }

    private async onFileInputChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        if (!event.target.files) {
            return;
        }

        await this.addFileList(event.target.files)
    }
    
    private async initializePicturesAsync(): Promise<void> {
        const pictures: FileModel[] = (this.props.pictures != null)
            ? Array.isArray(this.props.pictures)
                ? this.props.pictures
                : [new FileModel(this.props.pictures)]
            : [];
        await this.setState({ pictures });
    }

    //  Logic

    public async componentWillReceiveProps(nextProps: IImageInputProps): Promise<void> {
        // if (!this.hasSelectedPictureIndex) {
        //     return;
        // }

        const newPictures: boolean = (!Comparator.isEqual(this.props.pictures, nextProps.pictures));

        // if (this.selectedPictureIndex >= nextProps.pictures.length) {
        //     this.setState({selectedPictureIndex: 0})
        // }
        
        await super.componentWillReceiveProps(nextProps);
        
        if (newPictures) {
            await this.initializePicturesAsync();
        }
    }

    public async initializeAsync(): Promise<void> {
        await this.initializePicturesAsync();
    }

    private async setCurrentView(currentView: ImageInputView): Promise<void> {
        if (this.currentView !== ImageInput.assertIsImageInputView(currentView)) {
            await this.setState({
                previousView: this.currentView,
                currentView
            });
        }
    }

    private async addFileList(fileList: FileList): Promise<void> {
        let fileListAsArray: File[] = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if (!this.multi && fileListAsArray.length > 1) {
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

        await this.addPictures(fileModels)
    }

    private async addPictures(fileModels: FileModel[]): Promise<void> {
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
                        selectedPictureIndex: (this.hasSelectedPictureIndex)
                            ? this.selectedPictureIndex
                            : 0
                    });

                await this.setCurrentView(ImageInputView.Default);
            } else {
                await this.props.onChange(
                    this,
                    (fileModels.length > 0)
                        ? fileModels.slice(0, 1)
                        : []
                );

                const selectedView = (this.editOnAddInSingleMode)
                    ? ImageInputView.Edit
                    : ImageInputView.Default

                await this.setState(
                    {
                        selectedPictureIndex: 0
                    });

                await this.setCurrentView(selectedView);
            }
        }
    }

    private async updatePicture(fileModel: FileModel, index: number): Promise<void> {
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

    private async removePicture(index: number): Promise<void> {
        const pictures = [...this.pictures];
        pictures.splice(index, 1);

        await this.setState(
            {
                selectedPictureIndex: null
            });
        await this.setCurrentView(ImageInputView.Default);

        if (this.props.onChange) {
            await this.props.onChange(this, pictures);
        }
    }

    //  Renders

    private renderControlPanel(): JSX.Element {
        return (
            <React.Fragment>

                {
                    (this.showMiniRotateButton) &&
                    (
                        <div className={styles.controlPanelMiniButtonWrap}>

                            <Button small
                                    icon={{name: "undo"}}
                                    type={ButtonType.Info}
                                    onClick={async () => await this.onRotateLeftMiniButtonClick()}
                            />


                            <Button small
                                    icon={{name: "redo"}}
                                    type={ButtonType.Info}
                                    onClick={async () => await this.onRotateRightMiniButtonClick()}
                            />
                        </div>
                    )
                }


                {
                    (this.showRotateButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "undo"}}
                                type={ButtonType.Light}
                                label={ImageInputLocalizer.rotateLeft}
                                onClick={async () => await this.onRotateLeftButtonClick()}
                        />
                    )
                }

                {
                    (this.showRotateButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "redo"}}
                                type={ButtonType.Light}
                                label={ImageInputLocalizer.rotateRight}
                                onClick={async () => await this.onRotateRightButtonClick()}
                        />
                    )
                }

                {
                    (this.showEditButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "crop"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.edit}
                                onClick={async () => await this.onEditButtonClick()}
                        />
                    )
                }

                {
                    (this.showPreviewButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "eye"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.preview}
                                onClick={async () => await this.onPreviewButtonClick()}
                        />
                    )
                }

                {
                    (this.showBrowseButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "file-import"}}
                                type={ButtonType.Orange}
                                label={ImageInputLocalizer.browse}
                                onClick={async () => await this.onBrowseButtonClick()}
                        />
                    )

                }

                {
                    (this.showCameraButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "camera"}}
                                type={ButtonType.Orange}
                                label={ImageInputLocalizer.camera}
                                onClick={async () => await this.onCameraButtonClick()}
                        />
                    )

                }

                {
                    (this.showSaveButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "save"}}
                                type={ButtonType.Success}
                                label={ImageInputLocalizer.save}
                                onClick={async () => await this.onSaveButtonClick()}
                        />
                    )
                }

                {
                    (this.showBackButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "arrow-left"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.back}
                                onClick={async () => await this.onBackButtonClick()}
                        />
                    )
                }

                {
                    (this.showDeleteButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "trash"}}
                                type={ButtonType.Warning}
                                label={ImageInputLocalizer.delete}
                                onClick={async () => await this.onDeleteButtonClick()}
                        />
                    )
                }
            </React.Fragment>
        );
    }

    private renderListViewItem(fileModel: FileModel, index: number): JSX.Element {
        const activeListViewItemStyle: string | false = (this.hasSelectedPictureIndex) && (this.selectedPictureIndex === index) && styles.activeListViewItem;
        const key: string = `${index}_${fileModel.id}_${fileModel.name}`;

        return (
            <div key={key}
                 className={this.css(styles.listViewItem, activeListViewItemStyle)}
                 onClick={() => this.onListViewItemClick(index)}
            >

                <div className={styles.listViewItemThumbnail}>
                    <img
                        src={this.getPreviewSource(index)}
                        alt={this.getPreviewName(index)}
                    />
                </div>

                {
                    this.getPreviewName(index)
                }

            </div>
        );
    }

    private renderListView(): JSX.Element {
        return (
            <div className={styles.listView}>
                {
                    this.pictures.map((picture, index) => this.renderListViewItem(picture, index))
                }
            </div>

        );
    }

    private renderPreviewPanel(): JSX.Element {
        const index: number = (this.hasSelectedPictureIndex)
            ? this.selectedPictureIndex
            : 0;
        const src: string | undefined = this.getPreviewSource(index);
        const alt: string | undefined = this.getPreviewName(index)

        return (
            <div className={styles.preview}>
                <img src={src}
                     alt={alt}
                />
            </div>
        );
    }

    private renderCropperPanel(): JSX.Element {
        return (
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

    public render(): JSX.Element {
        const minimizeStyle: string | null = (this.minimizeOnEmpty) && (this.pictures.length <= 0)
            ? styles.minimize
            : null;
        const fullScreenStyle: string | null = (this.isFullscreen)
            ? styles.fullScreen
            : null;

        return (
            <div className={this.css(styles.ImageInput, minimizeStyle, fullScreenStyle, this.props.className)}
                 onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnter(event)}
            >

                <input ref={this.fileInputRef}
                       className={styles.fileInput}
                       type="file"
                       accept="image/*"
                       multiple={this.multi}
                       onChange={async (event: ChangeEvent<HTMLInputElement>) => await this.onFileInputChange(event)}
                />

                <input ref={this.cameraFileInputRef}
                       className={styles.fileInput}
                       type="file"
                       accept="image/*"
                       capture="environment"
                       multiple={this.multi}
                       onChange={async (event: ChangeEvent<HTMLInputElement>) => await this.onFileInputChange(event)}
                />

                <div className={styles.controlPanel}>
                    {
                        this.renderControlPanel()
                    }
                </div>

                <div className={styles.viewPanel}>

                    <div className={this.css(styles.dragDropArea, (this.isDragOver) && styles.dragDropAreaActive)}
                         onDrop={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDrop(event)}
                         onDragOver={async(event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragOver(event)}
                         onDragEnter={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragEnter(event)}
                         onDragLeave={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragLeave(event)}
                    >
                        <span className={styles.dragDropAreaOverlay}>
                            {ImageInputLocalizer.dropIt}
                        </span>
                    </div>

                    {
                        (this.currentView === ImageInputView.Edit) &&
                        (
                            this.renderCropperPanel()
                        )
                    }

                    {
                        (this.multi) && (this.currentView === ImageInputView.Default) &&
                        (
                            this.renderListView()
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
}
