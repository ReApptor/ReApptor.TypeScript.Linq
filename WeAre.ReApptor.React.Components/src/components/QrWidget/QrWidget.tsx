import React from "react";
import {ch} from "@weare/reapptor-react-common";
import QrReader from "react-qr-reader";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../WidgetContainer/BaseExpandableWidget";
import LqCodeReader from "./LqCodeReader";
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
    onQr?(code: string): Promise<void>;
}

export default class QrWidget extends BaseExpandableWidget<IQrWidgetProps> {
    
    private readonly _ref: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _reader: LqCodeReader = new LqCodeReader();
    private _logsRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
    private _logs: string = "";
    
    private async onScanAsync(code: string | null): Promise<void> {
        if (code) {
            if (this.props.onQr) {
                await this.props.onQr(code);
            }

            await super.hideContentAsync();
        }
    }

    private async onScanErrorAsync(error: string): Promise<void> {
        await ch.alertErrorAsync(QrWidgetLocalizer.scanError, true);
        await super.hideContentAsync();
    }
    
    private setCustomerStyles(): void {
        if (this._ref.current) {
            
            const node: JQuery = this.JQuery(this._ref.current);

            const container: JQuery = node.find("div");
            
            if (this.props.scale) {
                const video: JQuery = node.find("video");

                video.css("transform", `scale(${this.props.scale})`);
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

    private async initializeReaderAsync(): Promise<void> {

        if (this._ref.current) {
            const node: JQuery = this.JQuery(this._ref.current);

            const viewportNode: JQuery = node.find("." + styles.viewport);

            const videoContainerNode: JQuery = viewportNode.find("." + styles.container);

            const videoNode: JQuery = videoContainerNode.find("video");

            const viewportWidth: number = viewportNode.width()!;

            const viewportHeight: number = viewportNode.height()!;

            const scale: number = this.scale;

            const videoWidth: number = scale * viewportWidth;

            const videoHeight: number = scale * viewportHeight;

            const dx: number = (videoWidth - viewportWidth) / 2;

            const dy: number = (videoHeight - viewportHeight) / 2;

            videoContainerNode.css("width", videoWidth);
            videoContainerNode.css("height", videoHeight);
            videoContainerNode.css("left", `-${dx}px`);
            videoContainerNode.css("top", `-${dy}px`);

            const qrCanvasNode: JQuery = node.find("#qr-canvas");

            const videoCanvasNode: JQuery = node.find("#video-canvas");

            const video: HTMLVideoElement = videoNode.get(0) as HTMLVideoElement;

            video.width = videoWidth;
            video.height = videoHeight;

            const qrCanvas: HTMLCanvasElement = qrCanvasNode.get(0) as HTMLCanvasElement;
            const videoCanvas: HTMLCanvasElement = videoCanvasNode.get(0) as HTMLCanvasElement;

            await this._reader.initializeAsync(video,
                qrCanvas, videoCanvas,
                dx, dy, viewportWidth, viewportHeight, 
                (code) => this.onScanAsync((code as any) as string),
                this.delay,
                this.debug,
                async (message, param) => this.logAsync(message, param)
            );
        }
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        
        console.log("supported: ", navigator.mediaDevices.getSupportedConstraints());
        
        await this.setState({icon: {name: "far camera"}});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IQrWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        
        await this.setState({icon: {name: "far camera"}});
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

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
    }

    protected renderExpanded(): React.ReactNode {

        const qrStyle: React.CSSProperties = {};

        if (this.extended) {
            setTimeout(async () => await this.initializeReaderAsync(), 0);
        } else {
            qrStyle.width = this.props.width || (this.mobile ? "100%" : "50%");

            setTimeout(() => this.setCustomerStyles(), 0);
        }
        
        return (
            <div ref={this._ref} className={this.css(widgetStyles.qr, styles.qrWidget)}>

                {
                    (this.extended) &&
                    (
                        <div id="main" className={styles.extended}>

                            <div className={styles.viewport}>
                                
                                <div className={styles.container}>
                                    <video id="video"></video>
                                </div>

                                <canvas id="qr-canvas" className={this.css(styles.canvas)} />

                                <canvas id="video-canvas" className={this.css(styles.canvas)} />

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
                

            </div>
        );
    }
}