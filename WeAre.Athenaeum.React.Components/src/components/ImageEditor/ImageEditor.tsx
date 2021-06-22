import React, {ChangeEvent, LegacyRef, DragEvent, MouseEvent, RefObject} from 'react';
import Cropper, {ReactCropperElement} from 'react-cropper';
import {FileModel} from "@weare/athenaeum-toolkit";
import styles from './ImageEditor.module.scss';
import 'cropperjs/dist/cropper.css';
import {BaseComponent} from "@weare/athenaeum-react-common";
import Button, {ButtonType} from "../Button/Button";
import Spinner from "../Spinner/Spinner";

type CropEvent = Cropper.CropEvent<HTMLImageElement>;
type ReadyEvent = Cropper.ReadyEvent<HTMLImageElement>;

enum ImageEditorView {
    Cropper,
    ListView,
    Preview
}

interface ImageListItem {
    original: File;
    fileModel: FileModel;
    cropped: string | null
}


interface IImageEditorState {
    currentView: ImageEditorView | null;
    isDragOver: boolean;
    preview: string;
    imageList: ImageListItem[];
    multi: boolean;
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
        preview: '',
        multi: false,
        isDragOver: false,
        imageList: [],
        selectedImageListItemIndex: null
    };

    get multi(): boolean {
        return this.props.multi || false;
    }

    async onDropDownAreaClick(event: MouseEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        console.log('onClick: ', event);

        if (!this.fileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.fileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    async onSwitchToListViewButtonClick() {

    }

    async onSwitchToDropDownAreaViewButtonClick() {
        if (!this.fileInputRef) {
            return;
        }

        const ref: RefObject<HTMLInputElement> = this.fileInputRef as RefObject<HTMLInputElement>;

        if (!ref.current) {
            return
        }

        ref.current.click();
    }

    async onSaveButtonClick() {
        if (this.state.currentView !== ImageEditorView.Cropper || !this.cropperRef.current) {
            return;
        }

        const cropped = this.cropperRef.current.cropper.getCroppedCanvas().toDataURL();

        const updatedImageList = this.state.imageList.reduce((prev: ImageListItem[], curr: ImageListItem, index: number): ImageListItem[] => {

            if (index === this.state.selectedImageListItemIndex) {
                return [
                    ...prev,
                    {
                        ...curr,
                        cropped
                    }
                ]
            }
                return [
                    ...prev
                ];
        }, []);

        await this.setState({currentView: ImageEditorView.Preview, imageList: updatedImageList})
    }

    async onRotateLeftButtonClick() {
        if (!this.cropperRef.current) {
            console.log('Cropper ref is null')
            return;
        }
        this.cropperRef.current.cropper.rotate(-90);
    }

    async onRotateRightButtonClick() {
        if (!this.cropperRef.current) {
            console.log('Cropper ref is null')
            return;
        }
        this.cropperRef.current.cropper.rotate(90);
    }

    async onEditButtonClick() {

    }

    async onImageInputDragEnter(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        if (!this.state.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    async onDropDownAreaDragEnter(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        console.log('dragEnter: ', event);
        if (!this.state.isDragOver) {
            await this.setState({ isDragOver: true });
        }
    }

    async onDropDownAreaDragOver(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
    }

    async onDropDownAreaDragLeave(event: DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        console.log('dragLeave: ', event);
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
        console.log('fileInputOnChange: ', event);
        if (!event.target.files) {
            return;
        }

        await this.updateFileList(event.target.files)
    }

    async onCropperCrop(event: CropEvent): Promise<void> {
        // console.log('onCrop: ', event);
        // const imageElement: any = this.cropperRef?.current;
        // const cropper: any = imageElement?.cropper;
        // console.log(cropper.getCroppedCanvas().toDataURL());
    }

    async updateFileList(fileList: FileList): Promise<void> {
        const fileListAsArray = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if (!this.multi) {
            const fileModel = await ImageEditor.fileToFileModel(fileListAsArray[0]);

            const fileListItem: ImageListItem = {
                fileModel,
                original: fileListAsArray[0],
                cropped: null
            }

            await this.setState({imageList: [fileListItem], currentView: ImageEditorView.Cropper, selectedImageListItemIndex: 0 });
            return;
        }

        const fileListItems: ImageListItem[] = await Promise.all(fileListAsArray.map(async (file: File): Promise<ImageListItem> => {
            const fileModel = await ImageEditor.fileToFileModel(file);
            return {
                fileModel,
                original: file,
                cropped: null
            }
        }));


        await this.setState({ imageList: [...this.state.imageList, ...fileListItems], currentView: ImageEditorView.ListView });
    }

    renderListViewItems(): JSX.Element[] {
        return this.state.imageList.map(fileListItem => {
            return (
                <div className={styles.listViewItem}>
                    <div className={styles.listViewItemThumbnail}>
                        <img src={fileListItem.cropped || fileListItem.fileModel.src} alt={fileListItem.fileModel.name}/>
                    </div>
                    {fileListItem.fileModel.name}
                </div>
            );
        });
    }

    render() {
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
                        (this.multi && this.state.currentView !== ImageEditorView.ListView) &&
                        (
                            <Button
                                small
                                className={styles.controlPanelButton}
                                icon={{name: "list"}}
                                type={ButtonType.Orange}
                                onClick={() => this.onSwitchToListViewButtonClick()}
                            />
                        )
                    }


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
                            this.state.currentView === ImageEditorView.ListView &&
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
                        (this.state.currentView === ImageEditorView.Cropper && this.state.selectedImageListItemIndex !== null && this.state.selectedImageListItemIndex !== undefined) &&
                        (
                            <div
                                className={styles.cropper}
                            >
                                <Cropper
                                    ref={this.cropperRef}
                                    src={this.state.imageList[this.state.selectedImageListItemIndex].fileModel.src}
                                    style={{height: "100%", width: "100%"}}
                                    guides={false}
                                    crop={(event: CropEvent) => this.onCropperCrop(event)}
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
                                    src={this.state.imageList[this.state.selectedImageListItemIndex].cropped || ""}
                                    alt={this.state.imageList[this.state.selectedImageListItemIndex].fileModel.name}
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