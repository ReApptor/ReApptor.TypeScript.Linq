import React from "react";
import CropperJs from "cropperjs";
import Cropper, {ReactCropperElement} from "react-cropper";
import {FileModel} from "@weare/athenaeum-toolkit";

export class ReactCropperHelpers {

    constructor(private cropperOrRefObject: CropperJs | React.RefObject<ReactCropperElement>) {}

    get cropper(): CropperJs {
        if (this.cropperOrRefObject instanceof CropperJs) {
            return this.cropperOrRefObject;
        }

        if (!this.cropperOrRefObject.current?.cropper) {
            throw new TypeError("Passed reference React.RefObject<ReactCropperElement> is null or undefined");

        }
        return this.cropperOrRefObject.current.cropper;

    }

    get containerWidth(): number {
        return this.cropper.getContainerData().width;
    }

    get containerHeight(): number {
        return this.cropper.getContainerData().height;
    }

    get canvasWidth(): number {
        return this.cropper.getCanvasData().width;
    }

    get canvasHeight(): number {
        return this.cropper.getCanvasData().height;
    }

    get canvasImageWidth(): number {
        return this.cropper.getCanvasData().naturalWidth;
    }

    get canvasImageHeight(): number {
        return this.cropper.getCanvasData().naturalHeight;
    }

    private get isImagePortrait(): boolean {
        return this.canvasImageHeight >= this.canvasImageWidth;
    }

    private get isImageLandscape(): boolean {
        return !this.isImagePortrait;
    }

    private get isImageHorizontallyOverflowed(): boolean {
        return this.canvasWidth > this.containerWidth
    }

    private get isImageHorizontallySmaller(): boolean {
        return this.containerWidth > this.canvasWidth;
    }

    private get isImageVerticallyOverflowed(): boolean {
        return this.canvasHeight > this.containerHeight
    }

    private get isImageVerticallySmaller(): boolean {
        return this.containerHeight > this.canvasHeight
    }

    /**
     * @description this will try to set the cropping area to center
     * of container but if image is not covering the center it
     * will be set to the closest corner to the center
     */
    setCroppingAreaToCenterOfContainerAndMinimize(): void {
        this.cropper.setCropBoxData({left: this.containerWidth / 2, top: this.containerHeight / 2, width: 0, height: 0});
    }

    /**
     * @description It will set the location of image based on container.
     * Will not effect in viewMode 1 if cropping area is blocking it.
     * When viewMode is on 1 it will set the location of image based on cropping area.
     * height and width dont effect
     */
    setImageToCenterOfContainer(): void {

        const left = (this.containerWidth / 2) - (this.canvasWidth / 2);
        const top = (this.containerHeight / 2) - (this.canvasHeight / 2);

        this.cropper.setCanvasData({left, top});
    }

    /**
     * @description When viewMode is on 1  and cropping area is covering the image it will be blocked
     */
    setZoomToFit(): void {
        if (this.isImageLandscape) {
            if (this.isImageHorizontallyOverflowed) {
                const ratio = (this.containerWidth / this.canvasImageWidth);
                this.cropper.zoomTo(ratio);

            } else if (this.isImageHorizontallySmaller) {
                const ratio = (this.canvasImageWidth / this.containerWidth);
                this.cropper.zoomTo(ratio);
            }

            return;
        }

        if (this.isImageVerticallyOverflowed) {
            const ratio = (this.containerHeight / this.canvasImageHeight);
            this.cropper.zoomTo(ratio);

        } else if (this.isImageVerticallySmaller) {
            const ratio = (this.canvasImageHeight / this.containerHeight);
            this.cropper.zoomTo(ratio);
        }

        return;
    }

    setCropAreaToImageFullSize(): void {
        if (!this.cropper) {
            return;
        }

        const canvasData = this.cropper.getCanvasData();

        this.cropper.setCropBoxData({
            left: canvasData.left,
            top: canvasData.top,
            width: this.canvasWidth,
            height: this.canvasHeight
        });
    }

    rotateAndFitToScreen(degree: number) {
        this.cropper.rotate(degree);
        this.setZoomToFit();
        this.setCroppingAreaToCenterOfContainerAndMinimize();
        this.setImageToCenterOfContainer();
        this.setZoomToFit();
        this.setCropAreaToImageFullSize()
    }

    /**
     * @description this is for situations where image rotation is needed without opening the editor
     * it will create a cropperjs instance and attach it to root element (hidden) and after rotation will return the data
     *
     * @param image image to rotate. Checks for src and if it doesnt exists uses cropperSource param
     * @param degree rotation degree
     * @param cropperSource url for the image, convert the image.id to url and pass it here
     */
    static rotate(image: FileModel, degree: number, cropperSource: string = ''): Promise<FileModel> {
        return new Promise<FileModel>(resolve => {

            const instaCropperWrapper: HTMLDivElement = document.createElement('div');

            const instaCropper: HTMLImageElement = document.createElement('img');

            instaCropper.style.display = 'block';
            instaCropper.style.maxWidth = '100%';
            instaCropper.style.maxHeight = '100%';
            instaCropperWrapper.style.opacity = "0";
            instaCropperWrapper.style.zIndex = '-1000';
            instaCropperWrapper.style.pointerEvents = 'none';
            instaCropperWrapper.style.position = 'fixed';

            document.getElementById("root")!.appendChild(instaCropperWrapper);

            instaCropperWrapper.appendChild(instaCropper);

            instaCropper.src = image.src || cropperSource;

            const cropper = new CropperJs(instaCropper, {
                viewMode: 1,
                scalable: false,
                ready(event: Cropper.ReadyEvent<HTMLImageElement>) {
                    const helper = new ReactCropperHelpers(cropper);

                    helper.rotateAndFitToScreen(degree);

                    const src = cropper.getCroppedCanvas().toDataURL(image.type) || "";

                    cropper.destroy();

                    instaCropperWrapper.remove();

                    resolve({...image, src});
                }
            });
        })
    }

}