import React from "react";
import {Utility, FileModel} from "@weare/athenaeum-toolkit";
import BaseInput, { ValidatorCallback, IBaseInputProps, IBaseInputState, FileSizeValidator, FileTypeValidator, FilesSizeValidator } from "../BaseInput";
import { BaseInputType  } from "@/models/Enums";
import Icon from "../../../Icon/Icon";

import styles from "./FileInput.module.scss";

export interface IFileInputProps extends IBaseInputProps<FileModel | FileModel[] | null> {
    forwardedRef?: React.RefObject<HTMLInputElement>;
    dropZone?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    labelClassName?: string;
    maxSize?: number;
    maxTotalSize?: number;
    fileTypes?: string[];
    removeConfirmation?: string;
    
    onClickAsync?(sender: FileInput, value: FileModel): Promise<void>;
    
    onChangeAsync?(sender: FileInput, value: FileModel | FileModel[]): Promise<void>;
    
    onRemoveAsync?(value?: FileModel): Promise<void>;
}

export interface IFileInputState extends IBaseInputState<FileModel | FileModel[] | null> {
    readonly: boolean;
}

export default class FileInput extends BaseInput<FileModel | FileModel[] | null, IFileInputProps, IFileInputState> {
    state: IFileInputState = {
        readonly: this.props.disabled || false,
        model: {
            value: this.props.value || (this.props.model ? this.props.model.value : null)
        },
        edit: true,
        validationError: null
    };
    
    public getValidators(): ValidatorCallback<FileModel | FileModel[] | null>[] {
        return [
            FileSizeValidator.validator(this.props.maxSize),
            FileTypeValidator.validator(this.props.fileTypes),
            FilesSizeValidator.validator(this.props.maxTotalSize)
        ];
    }
    
    protected getType(): BaseInputType {
        return BaseInputType.File;
    }

    protected async valueChangeHandlerAsync(event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>): Promise<void> {
        const changeEvent: React.ChangeEvent<HTMLInputElement> = event as React.ChangeEvent<HTMLInputElement>;

        const fileReferences: FileList | null = changeEvent.target.files;

        await this.fileChangeAsync(fileReferences);
    }
    
    private async onDropHandlerAsync(e: any): Promise<void> {
        this.preventEventDefaultBehavior(e);
        
        const fileReferences: FileList | null = e.nativeEvent.dataTransfer.files;
        
        await this.fileChangeAsync(fileReferences);
    }
    
    private async fileChangeAsync(fileReferences: FileList | null): Promise<void> {
        if (this.props.multiple) {
            const files: FileModel[] = [];

            if (fileReferences) {
                for (let i: number = 0; i < fileReferences.length; i++) {
                    const file: FileModel | null = await Utility.transformFileAsync(fileReferences[i]);

                    if (file) {
                        files.push(file);
                    }
                }
            }

            if (files.length) {
                if (this.value instanceof Array && this.value.length > 0) {
                    const newFiles: FileModel[] = files.filter(file => !(this.value as FileModel[]).map(file => file.name).includes(file.name));
                    const newValue: FileModel[] = this.value.concat(newFiles);

                    if (this.props.onChangeAsync) {
                        await this.props.onChangeAsync(this, newValue)
                    }
                    
                    return await this.updateValueAsync(newValue)
                }
                
                await this.updateValueAsync(files);
            }
        } else {
            const fileReference: File | null = (fileReferences) ? fileReferences[0] : null;

            const file: FileModel | null = await Utility.transformFileAsync(fileReference);

            await this.updateValueAsync(file);
        }
        
        if (this.props.onChangeAsync) {
            await this.props.onChangeAsync(this, this.state.model.value || [])
        }
    }
    
    private async removeSelectedFileAsync(index: number | null = null): Promise<void> {
        let value: FileModel | FileModel[] | null = null;
        let removedValue: FileModel | null = null;
        
        if ((index !== null) && (this.value instanceof Array) && (this.value.length > 0)) {
            const copyValue = [...this.value] as FileModel[];
            removedValue = copyValue.splice(index, 1)[0];
            value = copyValue;
        }

        await this.updateValueAsync(value);
        
        if ((this.props.onRemoveAsync) && (removedValue !== null)) {
            await this.props.onRemoveAsync(removedValue);
        }
    }
    
    private async onClickHandlerAsync(value: FileModel): Promise<void> {
        if (this.props.onClickAsync) {
            await this.props.onClickAsync(this, value);
        }
    }

    private preventEventDefaultBehavior(e: any): void {
        e.preventDefault();
        e.stopPropagation();
    }
    
    private onDragOverHandler(e: any) {
        this.preventEventDefaultBehavior(e);
    }
    
    private get acceptedTypes(): string {
        return (this.props.fileTypes && this.props.fileTypes.length) 
            ? this.props.fileTypes.join(",")
            : "";
    }

    private renderPreview(): React.ReactNode {
        let imagePreviewStyle = {};

        if (!this.props.multiple) {
            imagePreviewStyle = this.state.model.value
                ? { background: `url(${(this.state.model.value as FileModel).src})`}
                : {};
        }
        
        return (
            <div className={styles.preview}>
                <div className={styles.image} style={imagePreviewStyle} />
                {
                    this.localizer.get("Form.Input.File.Preview")
                }
            </div>
        );
    }

    private renderFile(): React.ReactNode {
        if(this.value instanceof Array) {
            return (this.value.length > 0) && this.value.map((file: FileModel, index: number) =>
                <div key={index} className={styles.selectedFile}>
                    <span className={this.css(this.props.onClickAsync && styles.clickable)} 
                          onClick={() => this.onClickHandlerAsync(file)}>{file.name}</span>
                    <Icon name="trash-alt" 
                          onClick={async () => await this.removeSelectedFileAsync(index)} 
                          confirm={(file.id) && this.props.removeConfirmation}/>
                </div>
            )
        } else {
            return (
                <div className={styles.selectedFile}>
                    <span className={this.css(this.props.onClickAsync && styles.clickable)} 
                          onClick={() => this.onClickHandlerAsync(this.value as FileModel)}>{(this.value as FileModel).name}</span>
                    <Icon name="trash-alt" 
                          onClick={async () => await this.removeSelectedFileAsync()} 
                          confirm={(this.value!.id) && this.props.removeConfirmation}/>
                </div>
            );
        }
    }

    public renderInput(): React.ReactNode {
        return (
            <div className={this.css(styles.file, this.readonly && styles.readonly)}>
                {
                    (this.props.dropZone) &&
                    (    
                        <div className={styles.dropZone}
                             onDrop={(e) => this.onDropHandlerAsync(e)}
                             onDragOver={(e) => this.onDragOverHandler(e)}>
                            
                            <label htmlFor={this.getInputId()}>
                                <span>
                                    {
                                        (this.readonly) ? this.localizer.get("Form.Input.File.Readonly") : this.localizer.get("Form.Input.File.DragAndDrop")
                                    }
                                </span>
                                
                                {
                                    (this.state.model.value && this.props.dropZone && !this.props.multiple && (this.state.model.value as FileModel).src.startsWith("data:image")) &&
                                    (
                                        this.renderPreview()
                                    )
                                }
                                    
                            </label>
                            
                        </div>
                    )
                }
                
                {
                    (!this.props.dropZone) &&
                    (
                        <div className="d-flex align-items-center">
                            <label className={this.css("btn m-0", this.props.labelClassName ? this.props.labelClassName : "btn-info")}
                                   htmlFor={this.getInputId()}>
                                {this.localizer.get("Form.Input.File.ChooseFile")} {this.value && (this.value as FileModel[]).length > 0 && `(${(this.value as FileModel[]).length})`}
                            </label>
                        </div>
                    )
                }
                
                <input id={this.getInputId()} hidden
                       type={this.getType()}
                       multiple={this.props.multiple}
                       onChange={async (e: React.FormEvent<HTMLInputElement>) => await this.valueChangeHandlerAsync(e)}
                       onBlur={async () => await this.valueBlurHandlerAsync()}
                       className="form-control-file"
                       ref={this.props.forwardedRef}
                       style={(this.props.dropZone) ? {display: "none"} : {}}
                       disabled={this.readonly}
                       accept={this.acceptedTypes}
                />
                
                {
                    (this.value) &&
                    (
                        this.renderFile()
                    )
                }
                
            </div>
        );
    }
}