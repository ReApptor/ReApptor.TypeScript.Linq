import React from "react";
import {ch} from "@weare/reapptor-react-common";
import QrReader from "react-qr-reader";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../WidgetContainer/BaseExpandableWidget";
import {BrowserCodeReader, BrowserQRCodeReader, IScannerControls} from "@zxing/browser";
import {Exception, Result} from "@zxing/library";
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
    resolution?: number;
    extended?: boolean;
    debug?: boolean;
    maximizeZoom?: boolean;
    onQr?(code: string): Promise<void>;
}

export default class QrWidget extends BaseExpandableWidget<IQrWidgetProps> {

    private static _camera: MediaDeviceInfo | null | false;
    private readonly _ref: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _videoRef: React.RefObject<HTMLVideoElement> = React.createRef();
    private _logsRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
    private _logs: string = "";
    private _qrCodeReader: BrowserQRCodeReader = new BrowserQRCodeReader();
    private _qrCodeReaderControls: IScannerControls | null = null;

    private static async getCameraAsync(): Promise<MediaDeviceInfo | false> {
        if (QrWidget._camera == null) {
            const cameras: MediaDeviceInfo[] = await BrowserCodeReader.listVideoInputDevices();
            const camera: MediaDeviceInfo | null = cameras.firstOrDefault(device => /back|rear|environment/gi.test(device.label));
            QrWidget._camera = camera ?? cameras.firstOrDefault() ?? false;
        }
        return QrWidget._camera!
    }

    protected async setContentAsync(visible: boolean): Promise<void> {
        await this.stopReaderAsync();
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

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        await this.setState({icon: {name: "far camera"}});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IQrWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        
        await this.setState({icon: {name: "far camera"}});
    }

    public async componentWillUnmount(): Promise<void> {
        await this.stopReaderAsync();
        await super.componentWillUnmount();
    }

    public get type(): QrWidgetType {
        return this.props.type ?? QrWidgetType.QrCode;
    }
    
    public get scale(): number {
        return ((this.props.scale) && (this.props.scale > 1))
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
    
    public get maximizeZoom(): boolean {
        return (this.props.maximizeZoom == true);
    }
    
    private async autoZoomAsync(video: HTMLVideoElement): Promise<void> {
        const mediaStream = video.srcObject as MediaStream;

        if (this.debug) {
            await this.logAsync("autoZoomAsync: hasMediaStream=" + (mediaStream != null));
        }

        if (mediaStream) {

            const tracks: MediaStreamTrack[] = mediaStream.getVideoTracks();

            const zoomableTrack: MediaStreamTrack | null = tracks.firstOrDefault(track => "zoom" in track.getCapabilities());

            if (this.debug) {
                //await this.logAsync("tracks: " + tracks.length);
                await this.logAsync("zoomableTrack: " + zoomableTrack ?? "NULL");
            }

            if (zoomableTrack) {
                const max: number = (zoomableTrack.getCapabilities() as any).zoom?.max || 0;
                
                if (this.debug) {
                    await this.logAsync("zoom.max: ", zoomableTrack);
                }

                if (max) {
                    const constraints: MediaTrackConstraints = {
                        advanced: [{zoom: max} as MediaTrackConstraintSet]
                    };
                    await zoomableTrack.applyConstraints(constraints);
                }
            }
        }
    }
    
    private async assignAutoZoomAsync(video: HTMLVideoElement): Promise<void> {
        if (this.maximizeZoom) {
            video.addEventListener("loadedmetadata", () => this.autoZoomAsync(video));
        }
    }
    
    private async onReaderDecodeAsync(result: Result | undefined, error: Exception | undefined, controls: IScannerControls): Promise<void> {
        if (result) {
            const text: string = result.getText();
            await this.onScanAsync(text);
            controls.stop();
        }
    }
    
    private async stopReaderAsync(): Promise<void> {
        if (this._qrCodeReaderControls) {
            this._qrCodeReaderControls.stop();
            this._qrCodeReaderControls = null;
        }
    }

    private async initializeReaderAsync(): Promise<void> {

        if (this._qrCodeReaderControls == null) {
            
            const video: HTMLVideoElement | null = this._videoRef.current;

            if (video) {

                //const camera: MediaDeviceInfo | false = await QrWidget.getCameraAsync();

                // if (!camera) {
                //     await this.onScanErrorAsync();
                //     return;
                // }

                await this.assignAutoZoomAsync(video);

                const constraints: MediaStreamConstraints = {
                    video: {
                        facingMode: "environment",
                    }
                };

                try {
                    this._qrCodeReaderControls = await this._qrCodeReader.decodeFromConstraints(
                        constraints,
                        video,
                        async (result, error, controls) => this.onReaderDecodeAsync(result, error, controls)
                    );

                    // this._qrCodeReaderControls = await this._qrCodeReader.decodeFromVideoDevice(
                    //     camera.deviceId,
                    //     video,
                    //     async (result, error, controls) => this.onReaderDecodeAsync(result, error, controls)
                    // );
                }
                catch (e) {
                    await this.onScanErrorAsync(e.message);
                    return;
                }
            }
            
        }
    }

    protected renderExpanded(): React.ReactNode {

        const qrStyle: React.CSSProperties = {};

        if (this.extended) {
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
                                
                                <div className={styles.container}>
                                    <video id="video" ref={this._videoRef}></video>
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
                                          resolution={this.props.resolution}
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