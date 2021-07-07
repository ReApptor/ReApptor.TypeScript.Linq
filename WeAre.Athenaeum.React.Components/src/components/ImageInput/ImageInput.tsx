import React, {ChangeEvent, DragEvent, LegacyRef, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";
import Button, {ButtonType} from "../Button/Button";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import ImageInputLocalizer from "./ImageInputLocalizer";
import 'cropperjs/dist/cropper.css';
import './ReactCropperOverride.scss';
import styles from './ImageInput.module.scss';

enum ImageInputView {
    Cropper,
    ListView,
    Preview
}

interface IImageInputState {
    currentView: ImageInputView | null;
    isDragOver: boolean;
    selectedPictureIndex: number | null;
}

interface IImageInputProps {
    multi?: boolean;
    pictures: FileModel[];
    minimizeOnEmpty?: boolean;
    editOnAddInSingleMode?: boolean
    className?: string;
    maxImageRequestSizeInBytes?: number;
    onChange?(sender: ImageInput, pictures: FileModel[]): Promise<void>;
    convertImage?(file: FileModel): Promise<FileModel>;
    imageUrl?(file: FileModel): string;
}

export class ImageInput extends BaseComponent<IImageInputProps, IImageInputState> {
    fileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    cameraFileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    cropperRef = React.createRef<ReactCropperElement>();

    state: IImageInputState = {
        currentView: this.multi ? ImageInputView.ListView : null,
        isDragOver: false,
        selectedPictureIndex: null
    };

    //  Getters

    private get multi(): boolean {
        return this.props.multi || false;
    }

    private get minimizeOnEmpty(): boolean {
        return this.props.minimizeOnEmpty || false;
    }

    private get editOnAddInSingleMode(): boolean {
        return this.props.editOnAddInSingleMode || false;
    }

    private get pictures(): FileModel[] {
        return this.props.pictures;
    }

    private get activePicture(): FileModel | null {
        if (this.state.selectedPictureIndex === null) {
            return null;
        }

        return this.pictures[this.state.selectedPictureIndex];
    }

    private get cropperSource(): string {
        if (this.state.selectedPictureIndex === null || !this.activePicture) {
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
        return this.props.maxImageRequestSizeInBytes || AthenaeumComponentsConstants.maxImageRequestSizeInBytes;
    }

    //  ViewIfStatements

    private get showEditButton(): boolean {
        if (this.state.currentView !== ImageInputView.Preview && this.state.currentView !== ImageInputView.ListView) {
            return false;
        }
        return this.state.selectedPictureIndex !== null && this.state.selectedPictureIndex !== undefined;
    }

    private get showBackButton(): boolean {
        if (this.multi) {
            return this.state.currentView === ImageInputView.Preview || this.state.currentView === ImageInputView.Cropper
        }

        return this.state.currentView === ImageInputView.Cropper;
    }

    private get showPreviewButton(): boolean {
        if (this.state.currentView === ImageInputView.Preview || this.state.currentView === ImageInputView.Cropper || !this.activePicture) {
            return false;
        }
        return this.state.selectedPictureIndex !== null;
    }

    private get showBrowseButton(): boolean {
        return this.state.currentView !== ImageInputView.Cropper;
    }

    private get showCameraButton(): boolean {
        return this.state.currentView !== ImageInputView.Cropper;
    }

    private get showDeleteButton(): boolean {
        return this.state.selectedPictureIndex !== null;
    }

    private get showRotateButton(): boolean {
        return this.state.currentView === ImageInputView.Cropper;
    }

    private get showSaveButton(): boolean {
        return this.state.currentView === ImageInputView.Cropper;
    }

    //  Control panel button Click Events

    async onBrowseButtonClick(): Promise<void> {
        if (!this.fileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.fileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    async onCameraButtonClick(): Promise<void> {
        if (!this.cameraFileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.cameraFileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    async onSaveButtonClick(): Promise<void> {
        if (this.state.currentView !== ImageInputView.Cropper || !this.cropperRef.current) {
            return;
        }

        if (!this.activePicture || this.state.selectedPictureIndex === null) {
            return;
        }

        const cropped: string = this.cropperRef.current?.cropper.getCroppedCanvas().toDataURL() || "";

        let newFileModel: FileModel = {...this.activePicture};

        newFileModel.src = cropped;

        if (this.props.convertImage) {
            newFileModel = await this.props.convertImage(newFileModel);

            if (newFileModel === null || newFileModel === undefined) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.updatePicture(newFileModel, this.state.selectedPictureIndex);

        this.setState({currentView: this.multi ? ImageInputView.ListView : ImageInputView.Preview});
    }

    async onEditButtonClick(): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }

        this.setState({currentView: ImageInputView.Cropper});
    }

    async onBackButtonClick(): Promise<void> {
        if (this.multi) {
            this.setState({currentView: ImageInputView.ListView});
            return;
        }

        this.setState({currentView: ImageInputView.Preview});
    }

    async onPreviewButtonClick(): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }

        this.setState({currentView: ImageInputView.Preview});
    }

    async onDeleteButtonClick(): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }

        await this.removePicture(this.state.selectedPictureIndex)
    }

    async onRemoveButtonClick(): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }
    }

    async onRotateLeftButtonClick(): Promise<void> {
        if (!this.cropperRef.current) {
            return;
        }

        this.cropperRef.current.cropper.rotate(-90);
        this.setCropAreaToImageFullSize();
    }

    async onRotateRightButtonClick(): Promise<void> {
        if (!this.cropperRef.current) {
            return;
        }

        this.cropperRef.current.cropper.rotate(90);
        this.setCropAreaToImageFullSize();
    }

    //  DragAndDrop Functionality Events

    async onImageInputDragEnter(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.state.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    async onDropDownAreaDragEnter(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.state.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    async onDropDownAreaDragOver(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
    }

    async onDropDownAreaDragLeave(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (this.state.isDragOver) {
            await this.setState({ isDragOver: false });
        }
    }

    async onDropDownAreaDrop(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        event.persist();

        if (this.state.isDragOver) {
            await this.setState({ isDragOver: false });
        }

        if (!event?.dataTransfer?.files) {
            return;
        }

        await this.addFileList(event.dataTransfer.files)
    }

    async onFileInputChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        if (!event.target.files) {
            return;
        }

        await this.addFileList(event.target.files)
    }

    //  Logic

    async componentWillReceiveProps(nextProps: IImageInputProps): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }
        if (this.state.selectedPictureIndex >= nextProps.pictures.length) {
            this.setState({selectedPictureIndex: 0})
        }
        return await super.componentWillReceiveProps(nextProps);
    }

    async addFileList(fileList: FileList): Promise<void> {
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

    async addPictures(fileModels: FileModel[]): Promise<void> {
        if (fileModels.length === 0) {
            return;
        }

        if (this.props.onChange && this.multi) {
            await this.props.onChange(this, [...this.props.pictures, ...fileModels]);

            await this.setState({currentView: ImageInputView.ListView, selectedPictureIndex: this.state.selectedPictureIndex});

            return;
        }

        if (this.props.onChange && !this.multi) {
            const selectedView = this.editOnAddInSingleMode ? ImageInputView.Cropper : ImageInputView.Preview

            await this.props.onChange(this, fileModels.length > 0 ? fileModels.slice(0, 1) : []);

            await this.setState({currentView: selectedView, selectedPictureIndex: 0});

            return;
        }
    }

    async updatePicture(fileModel: FileModel, index: number): Promise<void> {
        const pictures = this.pictures.map((picture: FileModel, i) => {
            if (index === i) {
                return fileModel;
            }
            return picture;
        });

        if (this.props.onChange) {
            await this.props.onChange(this, pictures);

            this.setState({currentView: this.multi ? ImageInputView.ListView : ImageInputView.Preview});
        }
    }

    async removePicture(index: number): Promise<void> {
        const pictures = [...this.pictures];
        pictures.splice(index, 1);

        if (this.props.onChange) {
            await this.props.onChange(this, pictures);
            await this.setState({currentView: this.multi ? ImageInputView.ListView : null, selectedPictureIndex: null});
        }
    }

    //  Helpers

    async invokeOnChange(): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, this.pictures);
        }
    }

    async onChangePicture(file: FileModel | null, index: number): Promise<void> {
        if (file != null) {
            if (index > this.pictures.length) {
                //add new
                this.pictures.push(file);
            } else {
                //update existing
                this.pictures[index] = file;
            }
        } else {
            //delete existing
            this.pictures.splice(index, 1);
        }

        await this.invokeOnChange();

        //rerender page
        await this.reRenderAsync();
    }

    setCropAreaToImageFullSize(): void {
        if (!this.cropperRef.current) {
            return;
        }

        const canvasData = this.cropperRef.current.cropper.getCanvasData();
        this.cropperRef.current.cropper.setCropBoxData({
            left: canvasData.left,
            top: canvasData.top,
            width: canvasData.width,
            height: canvasData.height
        });
    }

    onListViewItemClick(index: number): void {
        if (this.state.selectedPictureIndex === index) {
            this.setState({selectedPictureIndex: null});
            return;
        }

        this.setState({selectedPictureIndex: index})
    }

    //  Renders

    renderControlPanel(): JSX.Element {
        return (
            <React.Fragment>

                {
                    (this.showRotateButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "undo"}}
                            type={ButtonType.Light}
                            label={ImageInputLocalizer.rotateLeft}
                            onClick={() => this.onRotateLeftButtonClick()}
                        />
                    )
                }

                {
                    (this.showRotateButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "redo"}}
                            type={ButtonType.Light}
                            label={ImageInputLocalizer.rotateRight}
                            onClick={() => this.onRotateRightButtonClick()}
                        />
                    )
                }

                {
                    (this.showEditButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "crop"}}
                            type={ButtonType.Info}
                            label={ImageInputLocalizer.edit}
                            onClick={() => this.onEditButtonClick()}
                        />
                    )
                }

                {
                    (this.showPreviewButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "eye"}}
                            type={ButtonType.Info}
                            label={ImageInputLocalizer.preview}
                            onClick={() => this.onPreviewButtonClick()}
                        />
                    )
                }

                {
                    (this.showBrowseButton) &&
                    (
                        <Button
                            small
                            right
                            className={styles.controlPanelButton}
                            icon={{name: "file-import"}}
                            type={ButtonType.Orange}
                            label={ImageInputLocalizer.browse}
                            onClick={() => this.onBrowseButtonClick()}
                        />
                    )

                }

                {
                    (this.showCameraButton) &&
                    (
                        <Button
                            small
                            right
                            className={styles.controlPanelButton}
                            icon={{name: "camera"}}
                            type={ButtonType.Orange}
                            label={ImageInputLocalizer.camera}
                            onClick={() => this.onCameraButtonClick()}
                        />
                    )

                }

                {
                    (this.showSaveButton) &&
                    (
                        <Button
                            small
                            right
                            className={styles.controlPanelButton}
                            icon={{name: "save"}}
                            type={ButtonType.Success}
                            label={ImageInputLocalizer.save}
                            onClick={() => this.onSaveButtonClick()}
                        />
                    )
                }

                {
                    (this.showBackButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "arrow-left"}}
                            type={ButtonType.Info}
                            label={ImageInputLocalizer.back}
                            onClick={() => this.onBackButtonClick()}
                        />
                    )
                }

                {
                    (this.showDeleteButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "trash"}}
                            type={ButtonType.Warning}
                            label={ImageInputLocalizer.delete}
                            onClick={() => this.onDeleteButtonClick()}
                        />
                    )
                }
            </React.Fragment>
        );
    }

    renderListViewItem(fileModel: FileModel, index: number): JSX.Element {
        const activeListViewItemStyle = this.state.selectedPictureIndex === index && styles.activeListViewItem;
        const key = `${index}_${fileModel.id}_${fileModel.name}`;

        return (
            <div
                className={this.css(styles.listViewItem, activeListViewItemStyle)}
                key={key}
                onClick={() => this.onListViewItemClick(index)}
            >
                <div className={styles.listViewItemThumbnail}>
                    <img
                        src={this.getPreviewSource(index)}
                        alt={this.getPreviewName(index)}
                    />
                </div>
                {this.getPreviewName(index)}
            </div>
        );
    }

    renderListView(): JSX.Element {
        return (
            <div
                className={styles.listView}
            >

                {
                    this.pictures.map((picture, index) => this.renderListViewItem(picture, index))
                }
            </div>

        );
    }

    renderPreviewPanel(): JSX.Element {
        return (
            <div className={styles.preview}>
                <img src={this.getPreviewSource(this.state.selectedPictureIndex || 0)} alt={this.getPreviewName(this.state.selectedPictureIndex || 0)}/>
            </div>
        );
    }

    renderCropperPanel(): JSX.Element {
        return (
            <div
                className={styles.cropper}
            >
                <Cropper
                    ref={this.cropperRef}
                    src={this.cropperSource}
                    style={{height: "100%", width: "100%"}}
                    className={styles.reactCropper}
                    guides={false}
                    ready={() => this.setCropAreaToImageFullSize()}
                />
            </div>
        )
    }

    render(): JSX.Element {
        const minimizeStyle = this.minimizeOnEmpty ? this.state.currentView === null ? styles.minimize : null : null;
        return (
            <div
                className={this.css(styles.ImageInput, minimizeStyle, this.props.className)}
                onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnter(event)}
            >
                <input
                    ref={this.fileInputRef}
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    multiple={this.multi}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => this.onFileInputChange(event)}
                />

                <input
                    ref={this.cameraFileInputRef}
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple={this.multi}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => this.onFileInputChange(event)}
                />

                <div className={styles.controlPanel}> {this.renderControlPanel()} </div>

                <div className={styles.viewPanel}>
                    <div
                        className={this.css(styles.dragDropArea, this.state.isDragOver && styles.dragDropAreaActive)}
                        onDrop={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDrop(event)}
                        onDragOver={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragOver(event)}
                        onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragEnter(event)}
                        onDragLeave={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragLeave(event)}
                    >
                        <span className={styles.dragDropAreaOverlay}>{ImageInputLocalizer.dropIt}</span>
                    </div>

                    {
                        (this.state.currentView === ImageInputView.Cropper) &&
                        (this.renderCropperPanel())
                    }

                    {
                        (this.state.currentView === ImageInputView.ListView) &&
                        (this.renderListView())
                    }

                    {
                        (
                            this.state.currentView === ImageInputView.Preview &&
                            this.state.selectedPictureIndex !== null
                        ) &&
                        (this.renderPreviewPanel())
                    }
                </div>
            </div>
        );
    }

    //  Statics

    static async fileToFileModel(file: File): Promise<FileModel> {
        const fileData = await ImageInput.readFile(file);
        const fileModel = new FileModel(fileData);
        fileModel.type = file.type;
        fileModel.name = file.name;
        fileModel.lastModified = new Date(file.lastModified);
        fileModel.size = file.size;
        return fileModel;
    }

    static readFile(file: File): Promise<string | null> {
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
}