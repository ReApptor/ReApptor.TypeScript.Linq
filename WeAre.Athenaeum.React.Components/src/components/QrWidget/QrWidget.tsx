import React from "react";
import {ch} from "@weare/athenaeum-react-common";
import QrReader from "react-qr-reader";
import BarcodeReader from "react-barcode-reader";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../WidgetContainer/BaseExpandableWidget";
import QrWidgetLocalizer from "./QrWidgetLocalizer";

import styles from "../WidgetContainer/WidgetContainer.module.scss";

export enum QrWidgetType {
    QrCode,
    
    BarCode
}

export interface IQrWidgetProps extends IBaseExpandableWidgetProps {
    type?: QrWidgetType;
    onQr?(qr: string): Promise<void>;
}

export default class QrWidget extends BaseExpandableWidget<IQrWidgetProps> {

    private async onScanAsync(qr: string | null): Promise<void> {
        if (qr) {
            if (this.props.onQr) {
                await this.props.onQr(qr);
            }

            await super.hideContentAsync();
        }
    }

    private async onScanErrorAsync(error: string): Promise<void> {
        await ch.alertErrorAsync(QrWidgetLocalizer.scanError, true);
        await super.hideContentAsync();
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        this.setState({icon: {name: "far camera"}});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IQrWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        this.setState({icon: {name: "far camera"}});
    }

    public get type(): QrWidgetType {
        return this.props.type ?? QrWidgetType.QrCode;
    }

    protected renderExpanded(): React.ReactNode {
        const qrStyle = this.mobile ? {width: "100%"} : {width: "50%"};

        return (
            <div className={styles.qr}>
                {
                    (this.type)
                        ?
                        (
                            <QrReader delay={300}
                                      onScan={async (data) => await this.onScanAsync(data)}
                                      onError={async (error) => await this.onScanErrorAsync(error)}
                                      style={qrStyle}/>
                        )
                        :
                        (
                            <BarcodeReader delay={300}
                                           onScan={async (data) => await this.onScanAsync(data)}
                                           onError={async (error) => await this.onScanErrorAsync(error)}
                                           style={qrStyle}/>
                        )
                }
            </div>
        );
    }
}