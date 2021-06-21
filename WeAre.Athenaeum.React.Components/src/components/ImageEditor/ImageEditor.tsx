import React, {ChangeEvent, LegacyRef, DragEvent, MouseEvent, RefObject} from 'react';
import Cropper from 'react-cropper';
import {FileModel} from "@weare/athenaeum-toolkit";
import styles from './ImageEditor.module.scss';
import 'cropperjs/dist/cropper.css';

type CropEvent = Cropper.CropEvent<HTMLImageElement>;
type ReadyEvent = Cropper.ReadyEvent<HTMLImageElement>;

enum ImageEditorView {
    Cropper,
    ListView,
    Preview,
    DragDropArea
}

interface State {
    currentView: ImageEditorView;
    isDragOver: boolean;
    preview: string;
    fileList: FileModel[];
    cropperSource: string;
    multi: boolean;
    ready: boolean;
    showEditButton: boolean;
    showRotateButtons: boolean;
    showSaveButton: boolean;
}

interface Props {
    multi?: boolean;
}

export class ImageEditor extends React.Component<Props, State> {
    fileInputRef: LegacyRef<HTMLInputElement> | undefined = React.createRef();
    cropperRef = React.createRef<HTMLImageElement>();

    state: State = {
        currentView: ImageEditorView.DragDropArea,
        preview: '',
        cropperSource: '',
        ready: false,
        multi: false,
        isDragOver: false,
        fileList: [],
        showEditButton: true,
        showRotateButtons: true,
        showSaveButton: true,
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
        console.log('onCrop: ', event);
    }

    async onCropperReady(event: ReadyEvent): Promise<void> {
        console.log('onReady: ', event);
    }

    async updateFileList(fileList: FileList): Promise<void> {
        const fileListAsArray = Array.from(fileList);

        if (fileListAsArray.length === 0) {
            return;
        }

        if (!this.multi) {
            const fileModel = await ImageEditor.fileToFileModel(fileListAsArray[0]);
            await this.setState({fileList: [fileModel], currentView: ImageEditorView.Cropper });
            return;
        }

        const fileModels: FileModel[] = await Promise.all(fileListAsArray.map(async (file: File) => await ImageEditor.fileToFileModel(file)));

        await this.setState({ fileList: [...this.state.fileList, ...fileModels], currentView: ImageEditorView.ListView });
    }

    renderListViewItems(): JSX.Element {
        return (<div></div>)

    }
    render() {
        return (
            <div className={styles.ImageInput}>
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
                    <span className={styles.controlPanelButton} onClick={()=> this.onSwitchToListViewButtonClick()}>list</span>
                    <span className={styles.controlPanelButton} onClick={()=> this.onSwitchToDropDownAreaViewButtonClick()}>drop</span>
                </div>

                <div className={styles.viewPanel}>
                    {
                        (this.state.currentView === ImageEditorView.DragDropArea) &&
                        (
                            <div
                                className={styles.dragDropArea}
                                onDragOver={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragOver(event)}
                                onDragEnter={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragEnter(event)}
                                onDragLeave={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDragLeave(event)}
                                onDrop={(event: DragEvent<HTMLDivElement>) => this.onDropDownAreaDrop(event)}
                                onClick={(event: MouseEvent<HTMLDivElement>) => this.onDropDownAreaClick(event)}
                            >
                                {
                                    (this.state.isDragOver) ?
                                        (
                                            <span className={styles.dragDropAreaOverlay}>DropIt</span>
                                        ) : (
                                            <span className={styles.dragDropAreaStaticText}>Click/Drop here</span>
                                        )
                                }
                            </div>
                        )
                    }

                    {
                        (this.state.currentView === ImageEditorView.Cropper) &&
                        (
                            <Cropper
                                className={styles.cropper}
                                ref={this.cropperRef}
                                src={this.state.cropperSource}
                                guides={false}
                                crop={(event: CropEvent) => this.onCropperCrop(event)}
                                ready={(event: ReadyEvent) => this.onCropperReady(event)}
                            />
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