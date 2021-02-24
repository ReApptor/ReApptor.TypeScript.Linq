import React from "react";
import {ch} from "@weare/athenaeum-react-common";
import QrReader from "react-qr-reader";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../BaseExpandableWidget";

import styles from "../WidgetContainer.module.scss";
import WidgetContainerLocalizer from "@/components/WidgetContainer/WidgetContainerLocalizer";

export interface IQrWidgetProps extends IBaseExpandableWidgetProps {
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
        await ch.alertErrorAsync(WidgetContainerLocalizer.qrWidgetScanError, true);
        await super.hideContentAsync();
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        this.setState({icon: { name: "far camera" }});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IQrWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        this.setState({icon: { name: "far camera" }});
    }
    
    protected renderExpanded(): React.ReactNode {
        const qrStyle = this.mobile ? { width: "100%"} : { width: "50%"};
        
        return (
            <div className={styles.qr}>
                <QrReader delay={300}
                          onScan={async (data: string | null) => await this.onScanAsync(data)}
                          onError={async (error: string) => await this.onScanErrorAsync(error)}
                          style={qrStyle}/>
            </div>
        );
    }
}