import React, {ChangeEvent, DragEvent, LegacyRef, MouseEvent, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";

import Button, {ButtonType} from "../Button/Button";

import ImageInputLocalizer from "../ImageInput/ImageInputLocalizer";
import 'cropperjs/dist/cropper.css';
import styles from './ImageEditor.module.scss';

enum ImageEditorView {
    Cropper,
    ListView,
    Preview
}

interface IImageEditorState {
    currentView: ImageEditorView | null;
    isDragOver: boolean;
    selectedPictureIndex: number | null;
}

interface IImageEditorProps {
    multi?: boolean;
    pictures: FileModel[];
    className?: string;
    onChange?(sender: ImageEditor, pictures: FileModel[]): Promise<void>;
    convertImage?(file: FileModel): Promise<FileModel>;
    imageUrl?(file: FileModel): string;
}

export class ImageEditor extends BaseComponent<IImageEditorProps, IImageEditorState> {
    fileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    cropperRef = React.createRef<ReactCropperElement>();

    state: IImageEditorState = {
        currentView: this.multi ? ImageEditorView.ListView : null,
        isDragOver: false,
        selectedPictureIndex: null
    };

    //  Getters

    private get multi(): boolean {
        return this.props.multi || false;
    }

    private get pictures(): FileModel[] {
        return this.props.pictures;
    }

    private get activePicture(): FileModel | null {
        if (!this.state.selectedPictureIndex) {
            return null;
        }

        return this.pictures[this.state.selectedPictureIndex];
    }

    private get previewSource(): string {
        if (!this.activePicture) {
            return "";
        }

        if (this.activePicture.src) {
            return this.activePicture.src;
        }

        if (this.activePicture.id) {
            return this.props.imageUrl ? this.props.imageUrl(this.activePicture) : `/files/images/${this.activePicture.id}`
        }

        return "";
    }

    private get previewName(): string {
        if (this.state.selectedPictureIndex === null) {
            return "";
        }
        if (!this.activePicture) {
            return "";
        }

        return this.activePicture.name
    }

    //  ViewIfStatements

    private get showEditButton(): boolean {
        if (this.state.currentView !== ImageEditorView.Preview && this.state.currentView !== ImageEditorView.ListView) {
            return false;
        }
        return this.state.selectedPictureIndex !== null && this.state.selectedPictureIndex !== undefined;
    }

    private get showDeleteButton(): boolean {
        if (this.state.currentView !== ImageEditorView.Preview && this.state.currentView !== ImageEditorView.ListView) {
            return false;
        }
        return this.state.selectedPictureIndex !== null && this.state.selectedPictureIndex !== undefined;
    }

    private get showRotateButton(): boolean {
        return this.state.currentView === ImageEditorView.Cropper;
    }

    private get showSaveButton(): boolean {
        return this.state.currentView === ImageEditorView.Cropper;
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

    async onSaveButtonClick(): Promise<void> {
        if (this.state.currentView !== ImageEditorView.Cropper || !this.cropperRef.current) {
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

            if (newFileModel == null) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.addPictures(newFileModel);

        this.setState({currentView: this.multi ? ImageEditorView.ListView : ImageEditorView.Preview});
    }

    async onEditButtonClick(): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }

        this.setState({currentView: ImageEditorView.Cropper});
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

        await this.addPictures(event.dataTransfer.files)
    }

    async onFileInputChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        if (!event.target.files) {
            return;
        }

        await this.addPictures(event.target.files)
    }

    //  Logic

    async componentWillReceiveProps(nextProps: IImageEditorProps): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }
        if (this.state.selectedPictureIndex >= nextProps.pictures.length) {
            this.setState({selectedPictureIndex: 0})
        }
        return await super.componentWillReceiveProps(nextProps);
    }

    async addPictures(fileList: FileList): Promise<void> {
        let fileListAsArray: File[] = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if (!this.multi && fileListAsArray.length > 1) {
            fileListAsArray = [fileListAsArray[0]];
        }

        let fileModels: FileModel[] = await Promise.all(fileListAsArray.map(async (file: File): Promise<FileModel> => {
            return await ImageEditor.fileToFileModel(file);
        }));

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

        if (this.props.onChange) {
            await this.props.onChange(this, fileModels);
        }

        await this.setState({currentView: this.multi ? ImageEditorView.ListView : ImageEditorView.Cropper, selectedPictureIndex: this.multi ? this.state.selectedPictureIndex : 0});

        return;
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

            this.setState({currentView: this.multi ? ImageEditorView.ListView : ImageEditorView.Preview});
        }
    }

    async removePicture(index: number): Promise<void> {
        const pictures = [...this.pictures];
        pictures.splice(index, 1);

        if (this.props.onChange) {
            await this.props.onChange(this, pictures);
            await this.setState({currentView: ImageEditorView.ListView});
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

    //  SubRenders
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
                            icon={{name: "edit"}}
                            type={ButtonType.Orange}
                            onClick={() => this.onEditButtonClick()}
                        />
                    )
                }

                {
                    (this.showDeleteButton) &&
                    (
                        <Button
                            small
                            className={styles.controlPanelButton}
                            icon={{name: "delete"}}
                            type={ButtonType.Orange}
                            onClick={() => this.onDeleteButtonClick()}
                        />
                    )
                }

                <Button
                    small
                    right
                    className={styles.controlPanelButton}
                    icon={{name: "file-import"}}
                    type={ButtonType.Info}
                    onClick={() => this.onBrowseButtonClick()}
                />

                {
                    (this.showSaveButton) &&
                    (
                        <Button
                            small
                            right
                            className={styles.controlPanelButton}
                            icon={{name: "save"}}
                            type={ButtonType.Orange}
                            onClick={() => this.onSaveButtonClick()}
                        />
                    )
                }
            </React.Fragment>
        );
    }

    renderListViewItem(fileModel: FileModel, index: number): JSX.Element {
        const activeListViewItemStyle = this.state.selectedPictureIndex === index && styles.activeListViewItem;

        return (
            <div
                className={this.css(styles.listViewItem, activeListViewItemStyle)}
                key={`${index}_${fileModel.id}_${fileModel.name}`}
                onClick={() => {
                    this.onListViewItemClick(index)
                }}
            >
                <div className={styles.listViewItemThumbnail}>
                    <img
                        src={this.previewSource}
                        alt={this.previewName}
                    />
                </div>
                {this.previewName}
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
                <img src={this.previewSource} alt={this.previewName}/>
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
                    src={this.pictures[this.state.selectedPictureIndex!].src}
                    style={{height: "100%", width: "100%"}}
                    guides={false}
                    ready={() => this.setCropAreaToImageFullSize()}
                />
            </div>
        )
    }

    render(): JSX.Element {
        return (
            <div
                className={this.css(styles.ImageInput, this.props.className)}
                onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onImageInputDragEnter(event)}
            >
                <input
                    ref={this.fileInputRef}
                    className={styles.fileInput}
                    type="file"
                    multiple={this.multi}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => this.onFileInputChange(event)}
                />

                <div className={styles.controlPanel}> {this.renderControlPanel()} </div>

                <div className={styles.viewPanel}>
                    {
                        (
                            <div
                                className={this.css(styles.dragDropArea, this.state.isDragOver && styles.dragDropAreaActive)}
                                onDrop={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDrop(event)}
                                onDragOver={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragOver(event)}
                                onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragEnter(event)}
                                onDragLeave={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragLeave(event)}
                            >
                                <span className={styles.dragDropAreaOverlay}>DropIt</span>
                            </div>
                        )
                    }

                    {
                        (
                            this.state.currentView === ImageEditorView.Cropper &&
                            this.state.selectedPictureIndex !== null &&
                            this.activePicture
                        ) &&
                        (this.renderCropperPanel())
                    }

                    {
                        (this.state.currentView === ImageEditorView.ListView) &&
                        (this.renderListView())
                    }

                    {
                        (
                            this.state.currentView === ImageEditorView.Preview &&
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
        const fileData = await ImageEditor.readFile(file);
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