import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {AthenaeumComponentsConstants, Button, ButtonType, FileInput, TextInput, ThreeColumns} from "@weare/athenaeum-react-components";
import {FileModel} from "@weare/athenaeum-toolkit";

export interface IFileInputTestsState {
    font: FileModel | null;
    file: FileModel | null;
    files: FileModel[];
}
export default class FileInputTests extends BaseComponent {
    
    public state: IFileInputTestsState = {
        file: null,
        files: [],
        font: null,
    }
    
    private readonly _fileInputRef: React.RefObject<FileInput> = React.createRef();
    private readonly _pdfFileInputRef: React.RefObject<FileInput> = React.createRef();
    private readonly _pdfsFileInputRef: React.RefObject<FileInput> = React.createRef();
    
    private async openCameraAsync(): Promise<void> {
        if (this._fileInputRef.current) {
            await this._fileInputRef.current.openAsync();
        }
    }
    
    private async onRemoveFileAsync(): Promise<void> {
        await this.setState({file: null});
    }

    private async onRemoveFontFileAsync(): Promise<void> {
        await this.setState({font: null});
    }
    
    private async onRemoveFilesAsync(file: FileModel): Promise<void> {
        this.state.files.remove(file);
        await this.setState({files: this.state.files})
    }
    
    private async onChangeFileAsync(file: FileModel): Promise<void> {
        await this.setState({file: file});
    }

    private async onChangeFontFileAsync(file: FileModel): Promise<void> {
        await this.setState({font: file});
    }
    
    private async onChangeFilesAsync(values: FileModel[]): Promise<void> {
        let files: FileModel[] = this.state.files.concat(values);
        await this.setState({files: files})
    }

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <ThreeColumns>
                    
                    <div>

                        <FileInput dropZone
                                   ref={this._fileInputRef}
                                   id={"photo"}
                                   label={"EN: Open camera test (image)."}
                                   placeholder={"Push me!"}
                                   fileTypes={AthenaeumComponentsConstants.imageFileTypes}
                        />

                        <Button block
                                label={"Open"}
                                type={ButtonType.Default}
                                onClick={async () => await this.openCameraAsync()}
                        />
                        
                    </div>
                    
                    <div>

                        <FileInput dropZone
                                   id={"pdf"}
                                   ref={this._pdfFileInputRef}
                                   label={"EN: Upload/Remove file test (pdf)."}
                                   placeholder={"Push me!"}
                                   fileTypes={["application/pdf"]}
                                   value={this.state.file}
                                   onRemove={async () => await this.onRemoveFileAsync()}
                                   onChange={async (sender, file: FileModel) => await this.onChangeFileAsync(file)}
                        />
                        
                        <TextInput readonly
                                   value={(this.state.file != null) ? "File exists!" : "File does not exist!"}/>
                        
                    </div>
                    
                    <div>

                        <FileInput dropZone multiple
                                   ref={this._pdfsFileInputRef}
                                   id={"pdfs"}
                                   label={"EN: Upload/Remove files test (pdf)."}
                                   placeholder={"Push me!"}
                                   fileTypes={["application/pdf"]}
                                   value={this.state.files}
                                   onRemove={async (value: FileModel) => await this.onRemoveFilesAsync(value)}
                                   onChange={async (sender, value: FileModel[]) => await this.onChangeFilesAsync(value)}
                        />
                        
                        <TextInput readonly
                                   value={((this.state.files != null) && (this.state.files.length > 0)) ? "Files exist!" : "Files do not exist!"}/>
                        
                    </div>
                    
                </ThreeColumns>
                <ThreeColumns>

                    <div>

                        <FileInput dropZone
                                   label={"EN: Font"}
                                   placeholder={"Push me!"}
                                   value={this.state.font}
                                   fileTypes={[".otf", ".woff2", ".ttf", ".woff"]}
                                   onRemove={async () => await this.onRemoveFontFileAsync()}
                                   onChange={async (sender, file: FileModel) => await this.onChangeFontFileAsync(file)}
                        />

                        <TextInput readonly
                                   value={(this.state.font != null) ? "Font exists!" : "Font does not exist!"}/>

                    </div>

                </ThreeColumns>

            </React.Fragment>
        );
    }
}