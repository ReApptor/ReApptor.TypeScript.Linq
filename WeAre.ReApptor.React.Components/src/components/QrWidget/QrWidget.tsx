import React from "react";
import {ch} from "@weare/reapptor-react-common";
import QrReader from "react-qr-reader";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../WidgetContainer/BaseExpandableWidget";
import QrWidgetLocalizer from "./QrWidgetLocalizer";

import styles from "../WidgetContainer/WidgetContainer.module.scss";

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
    onQr?(code: string): Promise<void>;
}

export default class QrWidget extends BaseExpandableWidget<IQrWidgetProps> {
    
    private readonly _ref: React.RefObject<HTMLDivElement> = React.createRef();

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

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        await this.setState({icon: {name: "far camera"}});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IQrWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        
        await this.setState({icon: {name: "far camera"}});
    }

    public get type(): QrWidgetType {
        return this.props.type ?? QrWidgetType.QrCode;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
    }

    protected renderExpanded(): React.ReactNode {
        const qrStyle: React.CSSProperties = {};

        qrStyle.width = this.props.width || (this.mobile ? "100%" : "50%");

        setTimeout(() => this.setCustomerStyles(), 0);
        
        return (
            <div ref={this._ref} className={styles.qr}>
                {
                    (this.type == QrWidgetType.QrCode)
                        ?
                        (
                            <QrReader style={qrStyle}
                                      delay={this.props.delay || 300}
                                      resolution={this.props.resolution}
                                      onScan={(data) => this.onScanAsync(data)}
                                      onError={(error) => this.onScanErrorAsync(error)}
                            />
                        )
                        :
                        (
                            <div>NOT SUPPORTED</div>
                        )
                }
            </div>
        );
    }
}