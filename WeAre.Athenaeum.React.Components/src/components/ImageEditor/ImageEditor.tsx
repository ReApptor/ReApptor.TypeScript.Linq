import React, {ChangeEvent, LegacyRef, DragEvent, MouseEvent, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {BaseComponent} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";

import Button, {ButtonType} from "../Button/Button";

import styles from './ImageEditor.module.scss';
import 'cropperjs/dist/cropper.css';

enum ImageEditorView {
    Cropper,
    ListView,
    Preview
}

interface IImageEditorState {
    currentView: ImageEditorView | null;
    isDragOver: boolean;
    imageList: FileModel[];
    selectedImageListItemIndex: number | null;
}

interface IImageEditorProps {
    multi?: boolean;
}

export class ImageEditor extends BaseComponent<IImageEditorProps, IImageEditorState> {
    fileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    cropperRef = React.createRef<ReactCropperElement>();

    state: IImageEditorState = {
        currentView: null,
        isDragOver: false,
        imageList: [],
        selectedImageListItemIndex: null
    };

    get multi(): boolean {
        return this.props.multi || false;
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

        const updatedImageList = this.state.imageList.reduce((prev: FileModel[], curr: FileModel, index: number): FileModel[] => {

            if (index === this.state.selectedImageListItemIndex) {
                const cropped: string = this.cropperRef.current?.cropper.getCroppedCanvas().toDataURL() || "";

                return [
                    ...prev,
                    {
                        ...curr,
                        src: cropped
                    }
                ]
            }
                return [
                    ...prev,
                    curr
                ];
        }, []);

        if (this.multi) {
            this.setState({currentView: ImageEditorView.ListView, imageList: updatedImageList});
            return;
        }

        this.setState({currentView: ImageEditorView.Preview, imageList: updatedImageList});
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
        if (this.state.selectedImageListItemIndex === null) {
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

            await this.setState({imageList: [fileModel], currentView: ImageEditorView.Cropper, selectedImageListItemIndex: 0 });
            return;
        }

        const fileListItems: FileModel[] = await Promise.all(fileListAsArray.map(async (file: File): Promise<FileModel> => {
            return  await ImageEditor.fileToFileModel(file);
        }));


        await this.setState({ imageList: [...this.state.imageList, ...fileListItems], currentView: ImageEditorView.ListView });
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
        if (this.state.selectedImageListItemIndex === index) {
            this.setState({selectedImageListItemIndex: null});
            return;
        }

        this.setState({selectedImageListItemIndex: index})
    }

    renderListViewItems(): JSX.Element[] {
        return this.state.imageList.map((fileModel: FileModel, index: number) => {
            const activeListViewItemStyle = this.state.selectedImageListItemIndex === index && styles.activeListViewItem;

            return (
                <div
                    className={this.css(styles.listViewItem, activeListViewItemStyle)}
                    onClick={() => {this.onListViewItemClick(index)}}
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
        });
    }

    render(): JSX.Element {
        return (
            <div
                className={styles.ImageInput}
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
                            this.state.selectedImageListItemIndex !== null &&
                            this.state.selectedImageListItemIndex !== undefined
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
                            this.state.selectedImageListItemIndex !== null &&
                            this.state.selectedImageListItemIndex !== undefined
                        ) &&
                        (
                            <div
                                className={styles.cropper}
                            >
                                <Cropper
                                    ref={this.cropperRef}
                                    src={this.state.imageList[this.state.selectedImageListItemIndex].src}
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
                                {this.renderListViewItems()}
                            </div>
                        )
                    }

                    {
                        (
                            this.state.currentView === ImageEditorView.Preview &&
                            this.state.selectedImageListItemIndex !== null &&
                            this.state.selectedImageListItemIndex !== undefined
                        ) &&
                        (
                            <div
                                className={styles.preview}
                            >
                                <img
                                    src={this.state.imageList[this.state.selectedImageListItemIndex].src || ""}
                                    alt={this.state.imageList[this.state.selectedImageListItemIndex].name}
                                />
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