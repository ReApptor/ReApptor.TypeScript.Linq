import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {QrWidget, QrWidgetType, WidgetContainer} from "@weare/athenaeum-react-components";

export default class QrWidgetTests extends BaseComponent {
    
    private async onScanAsync(name: string, code: string): Promise<void> {
        await ch.alertMessageAsync("{0} scan result: {1}".format(name, code), true);
    }

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <WidgetContainer>

                    <QrWidget id="QrCode" type={QrWidgetType.QrCode} label="QR" description={"Qr code scanner..."} onQr={(code) => this.onScanAsync("Qr", code)} />
                    
                    <QrWidget id="BarCode" type={QrWidgetType.BarCode} label="Bar" description={"Bar code scanner..."} onQr={(code) => this.onScanAsync("Bar", code)} />

                </WidgetContainer>

            </React.Fragment>
        );
    }
}