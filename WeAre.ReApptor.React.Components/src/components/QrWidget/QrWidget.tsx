import React from "react";
import {ch} from "@weare/reapptor-react-common";
import QrReader from "react-qr-reader";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../WidgetContainer/BaseExpandableWidget";
import {BrowserCodeReader, BrowserQRCodeReader, HTMLVisualMediaElement, IScannerControls} from "@zxing/browser";
import {ArgumentException, Exception, Result} from "@zxing/library";
import {Utility} from "@weare/reapptor-toolkit";
import {IBrowserCodeReaderOptions} from "@zxing/browser/esm/readers/IBrowserCodeReaderOptions";
import QrWidgetLocalizer from "./QrWidgetLocalizer";

import widgetStyles from "../WidgetContainer/WidgetContainer.module.scss";
import styles from "./QrWidget.module.scss";

export enum QrWidgetType {
    QrCode,

    BarCode
}

export interface IQrWidgetProps extends IBaseExpandableWidgetProps {
    type?: QrWidgetType;
    width?: string;
    scale?: number;
    borderWidth?: number;
    delay?: number;
    extended?: boolean;
    debug?: boolean;
    autoZoom?: boolean;
    onQr?(code: string): Promise<void>;
    onAutoZoom?(supported: boolean, zoom: number): Promise<void>;
}

export default class QrWidget extends BaseExpandableWidget<IQrWidgetProps> {

    private readonly _ref: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _videoRef: React.RefObject<HTMLVideoElement> = React.createRef();
    private _initializing: boolean = false;
    private _logsRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
    private _logs: string = "";
    private _qrCodeReader: BrowserQRCodeReader = new BrowserQRCodeReader(undefined, { delayBetweenScanAttempts: this.delay } as IBrowserCodeReaderOptions);
    private _qrCodeReaderControls: IScannerControls | null = null;

    private async invokeOnAutoZoomAsync(zoom?: number): Promise<void> {
        if ((this.props.onAutoZoom) && (this.autoZoom)) {
            const supported: boolean = (zoom != null) && (zoom > 1);
            zoom = (supported) ? zoom : 1;
            await this.props.onAutoZoom(supported, zoom!);
        }
    }

    protected async setContentAsync(visible: boolean): Promise<void> {
        if (!visible) {
            await this.stopReaderAsync();
        }
        
        await super.setContentAsync(visible);
    }
    
    private async onScanAsync(code: string | null): Promise<void> {
        if (code) {
            if (this.props.onQr) {
                await this.props.onQr(code);
            }

            await super.hideContentAsync();
        }
    }

    private async onScanErrorAsync(error?: string): Promise<void> {
        if ((error) && (this.debug)) {
            await this.logAsync("onScanErrorAsync", error);
        }
        
        await ch.alertErrorAsync(QrWidgetLocalizer.scanError, true);
        
        await super.hideContentAsync();
    }
    
    private async setCustomerStylesAsync(): Promise<void> {
        if (this._ref.current) {

            const node: JQuery = this.JQuery(this._ref.current);

            const container: JQuery = node.find("div");

            const videoNode: JQuery = node.find("video");

            const video = videoNode.get(0) as HTMLVideoElement;

            if (this.props.scale) {
                videoNode.css("transform", `scale(${this.props.scale})`);
            }

            if (this.props.borderWidth) {
                container.css("border-width", `${this.props.borderWidth}px`);

                const width: number = container.width() ?? 0;
                const height: number = container.height() ?? 0;

                if (width != height) {
                    if (height > width) {
                        const delta = (height - width) / 2;
                        const border: number = this.props.borderWidth + delta;

                        container.css("border-top-width", `${border}px`);
                        container.css("border-bottom-width", `${border}px`);
                    } else {
                        const delta = (width - height) / 2;
                        const border: number = this.props.borderWidth + delta;

                        container.css("border-left-width", `${border}px`);
                        container.css("border-right-width", `${border}px`);
                    }
                }
            }

            await this.assignAutoZoomAsync(video);
        }
    }
    
    private async logAsync(message: string, param?: any): Promise<void> {
        if (param != null) {
            message = message + " " + JSON.stringify(param);
        }
        this._logs = message + "\n" + this._logs;
        if (this._logsRef.current) {
            this._logsRef.current.value = this._logs;
        }
    }
    
    private async setInitializingAsync(initializing: boolean): Promise<void> {
        if (this._initializing != initializing) {
            this._initializing = initializing;
            await this.reRenderAsync();
        }
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        await this.setState({icon: {name: "far camera"}});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IQrWidgetProps>): Promise<void> {

        const newType: boolean = (this.props.type !== nextProps.type);
        const newAutoZoom: boolean = (this.props.autoZoom !== nextProps.autoZoom);
        const newExtended: boolean = (this.props.extended !== nextProps.extended);
        const newDelay: boolean = (this.props.delay !== nextProps.delay);
        const newDebug: boolean = (this.props.debug !== nextProps.debug);
        const newScale: boolean = (this.props.scale !== nextProps.scale);
        const newBorderWidth: boolean = (this.props.borderWidth !== nextProps.borderWidth);
        
        const newProps: boolean = (newType || newAutoZoom || newExtended || newDelay || newDebug || newScale || newBorderWidth);
        
        const newStopReader: boolean = (newType || newAutoZoom || newExtended);

        if (newStopReader) {
            await this.stopReaderAsync();
        }

        await super.componentWillReceiveProps(nextProps);
        
        await this.setState({icon: {name: "far camera"}});
        
        if (newProps) {
            await this.reRenderAsync();
        }
    }

    public async componentWillUnmount(): Promise<void> {
        await this.stopReaderAsync();
        await super.componentWillUnmount();
    }

    public get type(): QrWidgetType {
        return this.props.type ?? QrWidgetType.QrCode;
    }
    
    public get scale(): number {
        return ((this.props.scale) && (this.props.scale > 1) && (!this.autoZoom))
            ? this.props.scale
            : 1;
    }
    
    public get delay(): number {
        return this.props.delay || 300;
    }
    
    public get extended(): boolean {
        return (this.props.extended == true);
    }
    
    public get debug(): boolean {
        return (this.props.debug == true);
    }
    
    public get autoZoom(): boolean {
        return (this.props.autoZoom == true);
    }
    
    private async autoZoomAsync(video: HTMLVideoElement): Promise<void> {
        let max: number = 0;
        
        const mediaStream = video.srcObject as MediaStream;

        if (mediaStream) {

            const tracks: MediaStreamTrack[] = mediaStream.getVideoTracks();

            const zoomableTrack: MediaStreamTrack | null = tracks.firstOrDefault(track => "zoom" in track.getCapabilities());

            if (zoomableTrack) {
                max = ((zoomableTrack.getCapabilities() as any).zoom?.max) || 0;

                if (max > 1) {
                    const constraints: MediaTrackConstraints = {
                        advanced: [{zoom: max} as MediaTrackConstraintSet]
                    };
                    await zoomableTrack.applyConstraints(constraints);
                }
            }
        }
        
        await this.invokeOnAutoZoomAsync(max);
    }
    
    private async assignAutoZoomAsync(video: HTMLVideoElement): Promise<void> {
        if (this.autoZoom) {
            video.addEventListener("loadedmetadata", () => this.autoZoomAsync(video));
        }
    }
    
    private async onReaderDecodeAsync(result: Result | undefined): Promise<void> {
        if (result) {
            const text: string = result.getText();
            
            await this.onScanAsync(text);
        }
    }
    
    private async stopReaderAsync(): Promise<void> {
        this._initializing = false;
        if (this._qrCodeReaderControls) {
            this._qrCodeReaderControls.stop();
            this._qrCodeReaderControls = null;
        }
    }

    /**
     * 🖌 Prepares the canvas for capture and scan frames.
     */
    private static createCaptureCanvas(mediaElement: HTMLVisualMediaElement): HTMLCanvasElement {

        if (!mediaElement) {
            throw new ArgumentException("Cannot create a capture canvas without a media element.");
        }

        if (typeof document === "undefined") {
            throw new Error("The page \"Document\" is undefined, make sure you're running in a browser.");
        }

        const canvasElement = document.createElement("canvas");
        
        const { width, height } = BrowserCodeReader.getMediaElementDimensions(mediaElement);

        canvasElement.style.width = width + "px";
        canvasElement.style.height = height + "px";
        canvasElement.width = width;
        canvasElement.height = height;

        /**
         * The HTML canvas element context.
         */

        const options = {
            willReadFrequently: true
        } as CanvasRenderingContext2DSettings;
        
        const context = canvasElement.getContext("2d", options);

        (canvasElement as any).getContext = () => context;

        return canvasElement;
    }

    private static drawImageOnCanvas(canvasElementContext: CanvasRenderingContext2D, srcElement: HTMLVisualMediaElement, video: HTMLVideoElement, scale: number) {
        const dw: number = canvasElementContext.canvas.width;
        const dh: number = canvasElementContext.canvas.height;
        
        if (scale > 1) {
            let sw: number = video.videoWidth;
            let sh: number = video.videoHeight;

            if ((sw > 0) && (sh > 0)) {
                
                const croppedWidth: number = Math.trunc(sw / scale);
                const croppedHeight: number = Math.trunc(sh / scale);

                const sx: number = Math.trunc((sw - croppedWidth) / 2);
                const sy: number = Math.trunc((sh - croppedHeight) / 2);
                
                sw = croppedWidth;
                sh = croppedHeight;

                canvasElementContext.drawImage(srcElement, sx, sy, sw, sh, 0, 0, dw, dh);
                
                return;
            }
        }
        
        canvasElementContext.drawImage(srcElement, 0, 0, dw, dh);
    }

    private async initializeReaderAsync(): Promise<void> {

        if ((this._qrCodeReaderControls == null) && (!this._initializing)) {

            const video: HTMLVideoElement | null = this._videoRef.current;

            if (video) {

                await this.setInitializingAsync(true);

                BrowserCodeReader.createCaptureCanvas = (mediaElement: HTMLVisualMediaElement) => QrWidget.createCaptureCanvas(mediaElement);
                BrowserCodeReader.drawImageOnCanvas = (canvasElementContext: CanvasRenderingContext2D, srcElement: HTMLVisualMediaElement) => QrWidget.drawImageOnCanvas(canvasElementContext, srcElement, video, this.scale);

                // WebRTC is currently limited to 640x480
                const constraints: MediaStreamConstraints = {
                    video: {
                        facingMode: "environment",
                        width: {min: 640, ideal: 1080, max: 1920},
                        height: {min: 480, ideal: 1080, max: 1920},
                    }
                };

                try {
                    const controls: IScannerControls = await this._qrCodeReader.decodeFromConstraints(
                        constraints,
                        video,
                        (result) => this.onReaderDecodeAsync(result)
                    );

                    if (this.autoZoom) {

                        let max: number = 0;

                        if ((controls.streamVideoCapabilitiesGet) && (controls.streamVideoConstraintsApply)) {
                            const capabilities: MediaTrackCapabilities = controls.streamVideoCapabilitiesGet((track: MediaStreamTrack) => [track]);

                            max = ((capabilities as any).zoom?.max) || 0;

                            if (max > 1) {
                                const constraints: MediaTrackConstraints = {
                                    advanced: [{zoom: max} as MediaTrackConstraintSet]
                                };

                                await controls.streamVideoConstraintsApply(constraints);
                            }
                        }

                        await this.invokeOnAutoZoomAsync(max);
                    }

                    this._qrCodeReaderControls = controls;

                    await Utility.wait(300);
                    
                } catch (e) {
                    await this.onScanErrorAsync(e.message);
                    return;
                } finally {
                    await this.setInitializingAsync(false);
                }
            }
        }
    }

    protected renderExpanded(): React.ReactNode {

        const qrStyle: React.CSSProperties = {};

        if (this.extended) {
            if (this.scale > 1) {
                qrStyle.transform = `scale(${this.scale.toFixed(1)})`;
            }
            
            setTimeout(() => this.initializeReaderAsync(), 0);
        } else {
            qrStyle.width = this.props.width || (this.mobile ? "100%" : "50%");

            setTimeout(() => this.setCustomerStylesAsync(), 0);
        }
        
        return (
            <div ref={this._ref} className={this.css(widgetStyles.qr, styles.qrWidget)}>

                {
                    (this.extended) &&
                    (
                        <div id="main" className={styles.extended}>

                            <div className={styles.viewport}>
                                
                                <div className={this.css(styles.container, this._initializing && styles.initializing)}>
                                    <video id="video" ref={this._videoRef} style={qrStyle}></video>
                                </div>
                                
                            </div>

                        </div>
                    )
                }

                {
                    (!this.extended) &&
                    (
                        (this.type == QrWidgetType.QrCode)
                            ?
                            (
                                <QrReader style={qrStyle}
                                          delay={this.delay}
                                          onScan={(data) => this.onScanAsync(data)}
                                          onError={(error) => this.onScanErrorAsync(error)}
                                />
                            )
                            :
                            (
                                <div>NOT SUPPORTED</div>
                            )
                    )
                }

                {
                    (this.debug) &&
                    (
                        <textarea readOnly
                                  ref={this._logsRef}
                                  className={styles.logs}
                                  value={this._logs}
                        />
                    )
                }                

            </div>
        );
    }
}