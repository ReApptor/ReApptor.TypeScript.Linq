import React, {ChangeEvent, DragEvent, LegacyRef, MouseEvent, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";

import Button, {ButtonType} from "../Button/Button";

import styles from './ImageEditor.module.scss';
import 'cropperjs/dist/cropper.css';
import ImageInputLocalizer from "../ImageInput/ImageInputLocalizer";
import ImageModal from "../ImageModal/ImageModal";
import {ModalSize} from "../Modal/Modal";

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
}

export class ImageEditor extends BaseComponent<IImageEditorProps, IImageEditorState> {
    fileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    cropperRef = React.createRef<ReactCropperElement>();

    state: IImageEditorState = {
        currentView: null,
        isDragOver: false,
        selectedPictureIndex: null
    };

    get multi(): boolean {
        return this.props.multi || false;
    }

    get selectedIndex(): number | null {
        if (this.state.selectedPictureIndex === null) {
            return null;
        }
        if (this.state.selectedPictureIndex >= this.pictures.length) {
            return null;
        }

        return this.state.selectedPictureIndex;
    }

    private get pictures(): FileModel[] {
        return this.props.pictures;
    }

    get previewSource(): string {
        if (this.state.selectedPictureIndex === null) {
            return "";
        }
        if (!this.pictures[this.state.selectedPictureIndex]) {
            return "";
        }

       return  this.pictures[this.state.selectedPictureIndex].src
    }

    get previewName(): string {
        if (this.state.selectedPictureIndex === null) {
            return "";
        }
        if (!this.pictures[this.state.selectedPictureIndex]) {
            return "";
        }

       return this.pictures[this.state.selectedPictureIndex].name
    }

    private async invokeOnChange(): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, this.pictures);
        }
    }

    private async onChangePicture(file: FileModel | null, index: number): Promise<void> {
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

    async onDropDownAreaClick(event: MouseEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();

        if (!this.fileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.fileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    async onSwitchToDropDownAreaViewButtonClick(): Promise<void> {
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

        if (this.state.selectedPictureIndex === undefined || this.state.selectedPictureIndex === null) {
            return;
        }

        const cropped: string = this.cropperRef.current?.cropper.getCroppedCanvas().toDataURL() || "";

        let newFileModel: FileModel = {...this.pictures[this.state.selectedPictureIndex]};

        newFileModel.src = cropped;

        if (this.props.convertImage) {
            newFileModel = await this.props.convertImage(newFileModel);

            if (newFileModel == null) {
                await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                return;
            }
        }

        await this.onChangePicture(newFileModel, this.state.selectedPictureIndex);

        this.setState({currentView: this.multi ? ImageEditorView.ListView : ImageEditorView.Preview});
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

    async onEditButtonClick(): Promise<void> {
        if (this.state.selectedPictureIndex === null) {
            return;
        }

        this.setState({currentView: ImageEditorView.Cropper});
    }

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

        await this.updateFileList(event.dataTransfer.files)
    }

    async onFileInputChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        if (!event.target.files) {
            return;
        }

        await this.updateFileList(event.target.files)
    }

    async updateFileList(fileList: FileList): Promise<void> {
        const fileListAsArray = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if (!this.multi) {
            const fileModel: FileModel = await ImageEditor.fileToFileModel(fileListAsArray[0]);

            if (this.props.onChange) {
                await this.props.onChange(this, [fileModel]);
                await this.setState({currentView: ImageEditorView.Cropper, selectedPictureIndex: 0 });
            }

            return;
        }

        const fileListItems: FileModel[] = await Promise.all(fileListAsArray.map(async (file: File): Promise<FileModel> => {
            return  await ImageEditor.fileToFileModel(file);
        }));

        if (this.props.onChange) {
            await this.props.onChange(this, [...this.pictures, ...fileListItems]);
            await this.setState({currentView: ImageEditorView.ListView});
        }
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

    renderListViewItem(fileModel: FileModel, index: number): JSX.Element {
        const activeListViewItemStyle = this.state.selectedPictureIndex === index && styles.activeListViewItem;

        return (
            <div
                className={this.css(styles.listViewItem, activeListViewItemStyle)}
                onClick={() => {
                    this.onListViewItemClick(index)
                }}
                key={JSON.stringify(fileModel)}
            >
                <div className={styles.listViewItemThumbnail}>
                    <img
                        src={fileModel.src}
                        alt={fileModel.name}
                    />
                </div>
                {fileModel.name}
            </div>
        );
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

                <div
                    className={styles.controlPanel}
                >
                    {
                        (this.state.currentView === ImageEditorView.Cropper) &&
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
                        (this.state.currentView === ImageEditorView.Cropper) &&
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
                        (
                            (
                                this.state.currentView === ImageEditorView.Preview ||
                                this.state.currentView === ImageEditorView.ListView
                            ) &&
                            this.state.selectedPictureIndex !== null &&
                            this.state.selectedPictureIndex !== undefined
                        ) &&
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

                    <Button
                        small
                        right
                        className={styles.controlPanelButton}
                        icon={{name: "file-import"}}
                        type={ButtonType.Info}
                        onClick={() => this.onSwitchToDropDownAreaViewButtonClick()}
                    />

                    {
                        (this.state.currentView === ImageEditorView.Cropper) &&
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

                </div>

                <div className={styles.viewPanel}>
                    {
                        (
                            <div
                                className={this.css(styles.dragDropArea, this.state.isDragOver && styles.dragDropAreaActive)}
                                onDrop={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDrop(event)}
                                onClick={(event: MouseEvent<HTMLDivElement>) => this.onDropDownAreaClick(event)}
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
                            this.state.selectedPictureIndex !== undefined &&
                            this.pictures[this.state.selectedPictureIndex]
                        ) &&
                        (
                            <div
                                className={styles.cropper}
                            >
                                <Cropper
                                    ref={this.cropperRef}
                                    src={this.pictures[this.state.selectedPictureIndex].src}
                                    style={{height: "100%", width: "100%"}}
                                    guides={false}
                                    ready={() => this.setCropAreaToImageFullSize()}
                                />
                            </div>
                        )
                    }

                    {
                        (this.state.currentView === ImageEditorView.ListView) &&
                        (
                            <div
                                className={styles.listView}
                            >

                                {
                                    this.pictures.map((picture, index) => this.renderListViewItem(picture, index))
                                }
                            </div>

                        )
                    }

                    {
                        (
                            this.state.currentView === ImageEditorView.Preview &&
                            this.state.selectedPictureIndex !== null &&
                            this.state.selectedPictureIndex !== undefined
                        ) &&
                        (
                            <div
                                className={styles.preview}
                            >
                                <img src={this.previewSource} alt={this.previewName}/>
                            </div>
                        )
                    }
                </div>

            </div>
        );
    }

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