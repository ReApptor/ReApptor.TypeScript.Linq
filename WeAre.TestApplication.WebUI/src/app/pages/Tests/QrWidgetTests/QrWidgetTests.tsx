import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {NumberInput, QrWidget, QrWidgetType, WidgetContainer} from "@weare/reapptor-react-components";

interface QrWidgetTestsState {
    scale: number;
    border: number;
}

export default class QrWidgetTests extends BaseComponent<{}, QrWidgetTestsState> {
    
    state: QrWidgetTestsState = {
        scale: 1.0,
        border: 50,
    }
    
    private async onScanAsync(name: string, code: string): Promise<void> {
        await ch.alertMessageAsync("{0} scan result: {1}".format(name, code), true);
    }

    public render(): React.ReactNode {        
        return (
            <React.Fragment>
                
                <NumberInput min={1}
                             max={5}
                             value={this.state.scale}
                             step={0.1}
                             onChange={async (sender, scale) => await this.setState({ scale })}
                />
                
                <NumberInput min={1}
                             max={50}
                             value={this.state.border}
                             step={1}
                             onChange={async (sender, border) => await this.setState({ border })}
                />

                <WidgetContainer>

                    <QrWidget id="QrCode" noAutoCollapse
                              type={QrWidgetType.QrCode}
                              label="QR"
                              scale={this.state.scale}
                              width={"100%"}
                              borderWidth={this.state.border}
                              description={"Qr code scanner..."}
                              onQr={(code) => this.onScanAsync("Qr", code)}
                    />
                    
                    <QrWidget id="BarCode"
                              type={QrWidgetType.BarCode}
                              label="Bar"
                              description={"Bar code scanner..."}
                              onQr={(code) => this.onScanAsync("Bar", code)}
                    />

                </WidgetContainer>

            </React.Fragment>
        );
    }
}