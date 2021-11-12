import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {AthenaeumComponentsConstants, Button, ButtonType, FileInput} from "@weare/athenaeum-react-components";

export default class FileInputTests extends BaseComponent {

    private readonly _fileInputRef: React.RefObject<FileInput> = React.createRef();
    
    private async openCameraAsync(): Promise<void> {
        if (this._fileInputRef.current) {
            await this._fileInputRef.current.openAsync();
        }
    }

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <FileInput dropZone
                           ref={this._fileInputRef} 
                           id={"photo"}
                           label={"EN: Photo"}
                           placeholder={"Push me!"}
                           fileTypes={AthenaeumComponentsConstants.imageFileTypes}
                />

                <Button label={"Open"}
                        type={ButtonType.Default}
                        onClick={async () => await this.openCameraAsync()}
                />

            </React.Fragment>
        );
    }
}