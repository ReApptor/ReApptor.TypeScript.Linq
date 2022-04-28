import React, {ChangeEvent} from "react";
import {BaseComponent, CameraType} from "@weare/reapptor-react-common";
import {FileModel, Utility} from "@weare/reapptor-toolkit";

export default class TakePicture extends BaseComponent {

    private readonly _imageInputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private readonly _cameraUserInputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private readonly _cameraEnvironmentInputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private _imageInputResolver: ((file: FileModel | null) => void) | null = null;
    private _bodyOnFocusCallback: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
    
    private subscribeOnFocusEvent(): void {
        // store current callback
        this._bodyOnFocusCallback = document.body.onfocus;

        // subscribe to new callback
        document.body.onfocus = () => this.onFocusCallbackAsync();
    }
    
    private unsubscribeOnFocusEvent(): void {
        // restore original callback
        document.body.onfocus = this._bodyOnFocusCallback;

        // clear current callback
        this._bodyOnFocusCallback = null;
    }

    private async onImageInputChangeAsync(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        if (this._imageInputResolver) {
            const fileModel: FileModel | null = ((event.target.files) && (event.target.files.length > 0))
                ? await Utility.transformFileAsync(event.target.files[0])
                : null;

            this._imageInputResolver(fileModel);
            this._imageInputResolver = null;
        }
    }

    private async onFocusCallbackAsync(): Promise<void> {

        this.unsubscribeOnFocusEvent();

        if (this._imageInputResolver) {
            // wait 5*100 mlsec for "onImageInputChange" event
            
            for (let i: number = 0; i < 5; i++) {

                await Utility.wait(100);

                if (this._imageInputResolver == null) {
                    return;
                }
            }
            
            // resolve promise with no file ("cancel");

            this._imageInputResolver(null);
            this._imageInputResolver = null;
        }
    }

    public takePictureAsync(camera: boolean | CameraType = true): Promise<FileModel | null> {

        this.subscribeOnFocusEvent();

        const cameraType: CameraType | null = (typeof camera === "boolean")
            ? (camera)
                ? CameraType.OutwardFacingCamera
                : null
            : camera;
        
        const input: HTMLInputElement | null = (cameraType != null)
            ? (cameraType == CameraType.OutwardFacingCamera)
                ? this._cameraEnvironmentInputRef.current
                : this._cameraUserInputRef.current
            : this._imageInputRef.current;

        if (input) {
            input.value = "";
            input.click();

            return new Promise((resolve) => {
                this._imageInputResolver = resolve;
            });
        }

        return new Promise(() => null);
    }
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <input ref={this._imageInputRef}
                       id={`${this.id}_imageInput`}
                       style={{display: "none"}}
                       type="file"
                       accept="image/*"
                       capture={false}
                       multiple={false}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => this.onImageInputChangeAsync(event)}
                />

                <input ref={this._cameraUserInputRef}
                       id={`${this.id}_cameraUserInput`}
                       style={{display: "none"}}
                       type="file"
                       accept="image/*"
                       capture="user"
                       multiple={false}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => this.onImageInputChangeAsync(event)}
                />

                <input ref={this._cameraEnvironmentInputRef}
                       id={`${this.id}_cameraEnvironmentInput`}
                       style={{display: "none"}}
                       type="file"
                       accept="image/*"
                       capture="environment"
                       multiple={false}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => this.onImageInputChangeAsync(event)}
                />

            </React.Fragment>
        );
    }
};