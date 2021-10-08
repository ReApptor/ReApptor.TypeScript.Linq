import React, {ChangeEvent, DragEvent, LegacyRef, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {assert, FileModel} from "@weare/athenaeum-toolkit";
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

export interface IIMageInputToolbar {

    /**
     * Should an "Upload file"-button be shown.
     */
    uploadButton?: boolean;

    /**
     * Should a "Take a picture"-button be shown.
     */
    takePictureButton?: boolean;

    /**
     * Should a "Remove"-button be shown.
     */
    deleteButton?: boolean;

    /**
     * Should a "Preview"-button be shown.
     */
    previewButton?: boolean;

    /**
     * Should an "Edit"-button be shown.
     */
    editButton?: boolean;

    /**
     * Should a "Rotate left"-button be shown.
     */
    rotateLeftButton?: boolean;

    /**
     * Should a "Rotate right"-button be shown.
     */
    rotateRightButton?: boolean;

    /**
     * Should a "Move up"-button be shown.
     */
    moveUpButton?: boolean;

    /**
     * Should a "Move down"-button be shown.
     */
    moveDownButton?: boolean;

    /**
     * Should a "Move to top"-button be shown.
     */
    moveToTopButton?: boolean;
}

interface IImageInputState {
    currentView: ImageInputView;
    isDragOver: boolean;
    previousView: ImageInputView;
    selectedPictureIndex: number | null;
    pictures: FileModel[];
}

interface IImageInputProps {
    pictures: FileModel[] | string | null;
    className?: string;

    /**
     * Should Edit-mode be enabled immediately after an image is uploaded. Only works if {@link multi} is not set to true.
     */
    editOnAddInSingleMode?: boolean
    maxImageRequestSizeInBytes?: number;
    minimizeOnEmpty?: boolean;

    /**
     * Does the {@link ImageInput} accept multiple images.
     * @default false
     */
    multi?: boolean;

    /**
     * Displayed when {@link pictures} is empty or when no image is selected.
     */
    noSelectionToolbar?: IIMageInputToolbar;

    /**
     * Displayed when an image has been selected.
     * @default {@link IIMageInputToolbar.rotateLeftButton} {@link IIMageInputToolbar.rotateRightButton} {@link IIMageInputToolbar.editButton} {@link IIMageInputToolbar.previewButton} {@link IIMageInputToolbar.uploadButton} {@link IIMageInputToolbar.takePictureButton} {@link IIMageInputToolbar.deleteButton}
     */
    selectionToolbar?: IIMageInputToolbar;

    /**
     * Displayed when an image is being previewed in full-screen.
     */
    previewToolbar?: IIMageInputToolbar;

    /**
     * Displayed when an image is being edited.
     */
    editToolbar?: IIMageInputToolbar;

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

    private get toolbar(): IIMageInputToolbar {
        switch (this.currentView){
            case ImageInputView.Default:
                return (this.hasSelectedPictureIndex)
                    ? this.props.selectionToolbar ?? ImageInput.defaultSelectionToolbar
                    : this.props.noSelectionToolbar ?? ImageInput.defaultNoSelectionToolbar;
            case ImageInputView.Preview:
                return this.props.previewToolbar ?? ImageInput.defaultPreviewToolbar;
            case ImageInputView.Edit:
                return this.props.editToolbar ?? ImageInput.defaultEditToolbar;
            default:
                throw new TypeError(`Non-existing enum value '${this.currentView}'`);
        }
    }

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

    private async onBrowseButtonClickAsync(): Promise<void> {
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

        let rotated = await ReactCropperHelpers.rotate(selectedPicture, degrees, this.getPreviewSource(this.selectedPictureIndex!));

        if (this.props.convertImage) {
            rotated = await this.props.convertImage(rotated);

            if (rotated === null || rotated === undefined) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.updatePictureAsync(rotated, this.selectedPictureIndex!);
    }

    private async onMoveToTopButtonClickAsync(): Promise<void> {
        if ((!this.hasSelectedPictureIndex) || (this.selectedPictureIndex! <= 0)) {
            return;
        }

        await this.moveSelectedImageToTopAsync()
    }

    private async onMoveUpButtonClickAsync(): Promise<void> {
        if ((!this.hasSelectedPictureIndex) || (this.selectedPictureIndex! <= 0)) {
            return;
        }

        await this.moveSelectedImageUpDownAsync(true);
    }

    private async onMoveDownButtonClickAsync(): Promise<void> {
        if ((!this.hasSelectedPictureIndex) || (this.selectedPictureIndex! >= this.pictures.length)) {
            return;
        }

        await this.moveSelectedImageUpDownAsync(false);
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

    private async onFileInputChangeAsync(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        if (!event.target.files) {
            return;
        }

        await this.addFileListAsync(event.target.files)
    }

    private async initializePicturesAsync(): Promise<void> {

        let pictures: FileModel[];
        let selectedPictureIndex: number | null;

        if ((Array.isArray(this.props.pictures)) && (this.props.pictures.length > 0)) {
            pictures = this.props.pictures;
            selectedPictureIndex = (typeof this.selectedPictureIndex === "number")
                ? this.selectedPictureIndex
                : 0;
        }
        else if (assert(this.props.pictures).isString.isNotEmpty.isNotWhitespace.getIsSuccess) {
            pictures = [new FileModel(this.props.pictures as string)];
            selectedPictureIndex = 0;
        }
        else {
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

    private async moveSelectedImageToTopAsync(): Promise<void> {
        if ((!this.hasSelectedPictureIndex)
            || (this.selectedPictureIndex === 0)) {
            return;
        }

        const oldImage: FileModel = this.pictures[this.selectedPictureIndex!];
        const imagesAfter: FileModel[] = this.pictures.slice();
        imagesAfter.remove(oldImage);

        await this.setState({
            pictures: [oldImage, ...imagesAfter],
            selectedPictureIndex: 0,
        });

        if (this.props.onChange) {
            await this.props.onChange(this, this.pictures);
        }
    }

    private async moveSelectedImageUpDownAsync(up: boolean): Promise<void> {
        if ((!this.hasSelectedPictureIndex)
            || ((up) && (this.selectedPictureIndex === 0))
            || ((!up) && (this.selectedPictureIndex === this.pictures.length - 1))) {
            return;
        }

        const oldIndex: number = this.selectedPictureIndex!;
        const oldImage: FileModel = this.pictures[oldIndex];
        let newIndex: number = (up)
            ? oldIndex - 1
            : oldIndex + 1;

        this.pictures[oldIndex] = this.pictures[newIndex];
        this.pictures[newIndex] = oldImage;

        if (this.props.onChange) {
            await this.props.onChange(this, this.pictures);
        }

        await this.setState({
            selectedPictureIndex: newIndex,
        });
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

    private renderControlPanel(): JSX.Element {
        return (
            <React.Fragment>

                {
                    ((this.toolbar.rotateLeftButton) || (this.toolbar.rotateRightButton)) &&
                    (
                        (this.miniRotateButtons)
                            ?
                            (
                                <div className={styles.controlPanelMiniButtonWrap}>

                                    {
                                        (this.toolbar.rotateLeftButton) &&
                                        (
                                            <Button small
                                                    icon={{name: "undo"}}
                                                    type={ButtonType.Info}
                                                    onClick={async () => await this.onRotateMiniButtonClickAsync(-90)}
                                            />
                                        )
                                    }

                                    {
                                        (this.toolbar.rotateRightButton) &&
                                        (
                                            <Button small
                                                    icon={{name: "redo"}}
                                                    type={ButtonType.Info}
                                                    onClick={async () => await this.onRotateMiniButtonClickAsync(90)}
                                            />
                                        )
                                    }

                                </div>
                            )
                            :
                            (
                                <>
                                    {
                                        (this.toolbar.rotateLeftButton) &&
                                        (
                                            <Button small
                                                    className={styles.controlPanelButton}
                                                    icon={{name: "undo"}}
                                                    type={ButtonType.Light}
                                                    label={ImageInputLocalizer.rotateLeft}
                                                    onClick={async () => await this.onRotateButtonClickAsync(-90)}
                                            />
                                        )
                                    }

                                    {
                                        (this.toolbar.rotateRightButton) &&
                                        (
                                            <Button small
                                                    className={styles.controlPanelButton}
                                                    icon={{name: "redo"}}
                                                    type={ButtonType.Light}
                                                    label={ImageInputLocalizer.rotateRight}
                                                    onClick={async () => await this.onRotateButtonClickAsync(90)}
                                            />
                                        )
                                    }
                                </>
                            )
                    )
                }

                {
                    (this.toolbar.moveToTopButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "level-up"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.moveToTop}
                                onClick={async () => await this.onMoveToTopButtonClickAsync()}
                        />
                    )
                }

                {
                    (this.toolbar.moveUpButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "arrow-up"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.moveUp}
                                onClick={async () => await this.onMoveUpButtonClickAsync()}
                        />
                    )
                }

                {
                    (this.toolbar.moveDownButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "arrow-down"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.moveDown}
                                onClick={async () => await this.onMoveDownButtonClickAsync()}
                        />
                    )
                }

                {
                    (this.toolbar.editButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "crop"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.edit}
                                onClick={async () => await this.onEditButtonClickAsync()}
                        />
                    )
                }

                {
                    (this.toolbar.previewButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "eye"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.preview}
                                onClick={async () => await this.onPreviewButtonClickAsync()}
                        />
                    )
                }

                {
                    (this.toolbar.uploadButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "file-import"}}
                                type={ButtonType.Orange}
                                label={ImageInputLocalizer.browse}
                                onClick={async () => await this.onBrowseButtonClickAsync()}
                        />
                    )

                }

                {
                    (this.toolbar.takePictureButton) &&
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
                                onClick={async () => await this.onSaveButtonClickAsync()}
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
                                onClick={async () => await this.onBackButtonClickAsync()}
                        />
                    )
                }

                {
                    (this.toolbar.deleteButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "trash"}}
                                type={ButtonType.Warning}
                                label={ImageInputLocalizer.delete}
                                onClick={async () => await this.onDeleteButtonClickAsync()}
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
        const index: number = this.selectedPictureIndex ?? 0;
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
                 onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnterAsync(event)}
            >

                <input ref={this.fileInputRef}
                       className={styles.fileInput}
                       type="file"
                       accept="image/*"
                       multiple={this.multi}
                       onChange={async (event: ChangeEvent<HTMLInputElement>) => await this.onFileInputChangeAsync(event)}
                />

                <input ref={this.cameraFileInputRef}
                       className={styles.fileInput}
                       type="file"
                       accept="image/*"
                       capture="environment"
                       multiple={this.multi}
                       onChange={async (event: ChangeEvent<HTMLInputElement>) => await this.onFileInputChangeAsync(event)}
                />

                <div className={styles.controlPanel}>
                    {
                        this.renderControlPanel()
                    }
                </div>

                <div className={styles.viewPanel}>

                    <div className={this.css(styles.dragDropArea, (this.isDragOver) && styles.dragDropAreaActive)}
                         onDrop={async (event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDropAsync(event)}
                         onDragOver={async(event: DragEvent<HTMLDivElement>) => await this.onDropDownAreaDragOverAsync(event)}
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

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.uploadButton}
     * {@link IIMageInputToolbar.takePictureButton}
     */
    public static get defaultNoSelectionToolbar(): IIMageInputToolbar {
        return {
            takePictureButton: true,
            uploadButton: true,
        };
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.rotateLeftButton}
     * {@link IIMageInputToolbar.rotateRightButton}
     * {@link IIMageInputToolbar.editButton}
     * {@link IIMageInputToolbar.previewButton}
     * {@link IIMageInputToolbar.uploadButton}
     * {@link IIMageInputToolbar.takePictureButton}
     * {@link IIMageInputToolbar.deleteButton}
     */
    public static get defaultSelectionToolbar(): IIMageInputToolbar {
        return {
            deleteButton: true,
            editButton: true,
            previewButton: true,
            rotateLeftButton: true,
            rotateRightButton: true,
            takePictureButton: true,
            uploadButton: true,
        }
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.editButton}
     * {@link IIMageInputToolbar.uploadButton}
     * {@link IIMageInputToolbar.takePictureButton}
     * {@link IIMageInputToolbar.deleteButton}.
     *
     * A "Back"-button which returns the user back to the previous view is also displayed.
     */
    public static get defaultPreviewToolbar(): IIMageInputToolbar {
        return {
            deleteButton: true,
            editButton: true,
            uploadButton: true,
            takePictureButton: true,
        };
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.rotateLeftButton}
     * {@link IIMageInputToolbar.rotateRightButton}
     * {@link IIMageInputToolbar.deleteButton}.
     *
     * A "Save"-button which saves the changes and a "Back"-button which returns the user back to the previous view are also displayed.
     */
    public static get defaultEditToolbar(): IIMageInputToolbar {
        return {
            rotateLeftButton: true,
            rotateRightButton: true,
            deleteButton: true,
        };
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
}