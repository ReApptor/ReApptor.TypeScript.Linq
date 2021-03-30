import React from "react";
import {Utility, FileModel} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import ImageInputLocalizer from "./ImageInputLocalizer";

interface IImageInputProps {
    id?: string;
    className?: string;
    readonly?: boolean;
    onChange?(file: FileModel): Promise<void>;
    convertImage?(file: FileModel): Promise<FileModel>
}

export default class ImageInput extends BaseComponent<IImageInputProps> {

    private async onFileInputChangeHandlerAsync(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const fileReferences: FileList | null = event.target.files;

        const fileReference: File | null = (fileReferences) ? fileReferences[0] : null;

        let file: FileModel | null = await Utility.transformFileAsync(fileReference);
        
        if ((file) && (this.props.onChange)) {

            if (file.size > AthenaeumComponentsConstants.maxImageRequestSizeInBytes) {
                

                await ch.alertErrorAsync(ImageInputLocalizer.documentTooBig, true);

            } else {

                if (this.props.convertImage) {
                    file = await this.props.convertImage(file);

                    if (file == null) {
                        await ch.alertErrorAsync(ImageInputLocalizer.documentTypeNotSupported, true);
                        return;
                    }
                }

                await ch.hideAlertAsync();

                await this.props.onChange(file);
            }
        }
    }

    render(): React.ReactNode {
        return (
            <input id={this.id}
                   name={this.id}
                   className={this.props.className}
                   disabled={this.props.readonly}
                   readOnly={this.props.readonly}
                   value={[]}
                   type="file"
                   accept="image/*"
                   capture="camera"
                   onChange={async (e) => await this.onFileInputChangeHandlerAsync(e)}
            />
        );
    }
}