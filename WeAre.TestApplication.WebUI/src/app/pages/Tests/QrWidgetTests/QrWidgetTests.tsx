import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {Checkbox, InlineType, NumberInput, QrWidget, QrWidgetType, ThreeColumns, WidgetContainer} from "@weare/reapptor-react-components";

interface QrWidgetTestsState {
    scale: number;
    border: number;
    extended: boolean;
    autoZoom: boolean;
    stretchContent: boolean;
    noAutoCollapse: boolean;
    debug: boolean;
}

export default class QrWidgetTests extends BaseComponent<{}, QrWidgetTestsState> {
    
    state: QrWidgetTestsState = {
        scale: 1.0,
        border: 50,
        extended: true,
        stretchContent: false,
        noAutoCollapse: true,
        autoZoom: false,
        debug: false,
    }
    
    private async onScanAsync(name: string, code: string): Promise<void> {
        await ch.alertMessageAsync("{0} scan result: {1}".format(name, code), true);
    }

    public render(): React.ReactNode {        
        return (
            <React.Fragment>
                
                <div style={{minHeight: "200px"}} />

                <ThreeColumns>

                    <div className={"mb-3"} style={{maxWidth: "300px"}}>

                        <NumberInput label={"Scale"}
                                     min={1}
                                     max={5}
                                     value={this.state.scale}
                                     step={0.1}
                                     readonly={this.state.autoZoom}
                                     onChange={async (sender, scale) => await this.setState({ scale })}
                        />

                        <NumberInput label={"Border"}
                                     min={1}
                                     max={50}
                                     value={this.state.border}
                                     step={1}
                                     onChange={async (sender, border) => await this.setState({ border })}
                        />

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label={"Extended"}
                                  value={this.state.extended}
                                  onChange={async (sender, extended) => await this.setState({ extended })}
                        />

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label={"StretchContent"}
                                  value={this.state.stretchContent}
                                  onChange={async (sender, stretchContent) => await this.setState({ stretchContent })}
                        />

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label={"NoAutoCollapse"}
                                  value={this.state.noAutoCollapse}
                                  onChange={async (sender, noAutoCollapse) => await this.setState({ noAutoCollapse })}
                        />

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label={"autoZoom"}
                                  value={this.state.autoZoom}
                                  onChange={async (sender, autoZoom) => await this.setState({ autoZoom })}
                        />

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label={"DEBUG"}
                                  value={this.state.debug}
                                  onChange={async (sender, debug) => await this.setState({ debug })}
                        />

                    </div>

                </ThreeColumns>

                <WidgetContainer>

                    <QrWidget id="QrCode"
                              autoZoom={this.state.autoZoom}
                              debug={this.state.debug}
                              noAutoCollapse={this.state.noAutoCollapse}
                              extended={this.state.extended}
                              stretchContent={this.state.stretchContent}
                              type={QrWidgetType.QrCode}
                              label="QR"
                              scale={this.state.scale}
                              width={"100%"}
                              borderWidth={this.state.border}
                              description={"Qr code scanner..."}
                              onQr={(code) => this.onScanAsync("Qr", code)}
                    />
                    
                    {/*<QrWidget id="BarCode"*/}
                    {/*          type={QrWidgetType.BarCode}*/}
                    {/*          label="Bar"*/}
                    {/*          description={"Bar code scanner..."}*/}
                    {/*          onQr={(code) => this.onScanAsync("Bar", code)}*/}
                    {/*/>*/}

                </WidgetContainer>

            </React.Fragment>
        );
    }
}