import React from "react";
import {BaseComponent, ch, IGlobalClick} from "@weare/reapptor-react-common";
import QrReader from "react-qr-reader";
import QrWidgetLocalizer from "../QrWidget/QrWidgetLocalizer";
import {Button, ButtonType, IIconProps} from "@weare/reapptor-react-components";
import styles from "./QrInput.module.scss";
import {Utility} from "@weare/reapptor-toolkit";
import QrInputLocalizer from "./QrInputLocalizer";

export interface IQrInputProps {
   
    className?: string;
    buttonClassName?: string;
    
    /** 
     * Displayed on the QR input when reader is not open.
     * @see IButtonProps.label
     */
    label?: string;

    /**
     * @see IButtonProps.type
     */
    buttonType?: ButtonType;
    
    icon?: IIconProps
    
    /**
     * Should the {@link QrInput} close when a click happens outside of it.
     *
     * @default false
     */
    autoClose?: boolean;

    /**
     * If set true, {@link QrInput} will close when QR code is read successfully.
     * @default false
     */
    closeOnQr?: boolean;

    /**
     * Called when QR code is found.
     * @param code The found QR code.
     */
    onQr?(code: string): Promise<void>;
}

interface IQrInputState {
    showQrReader: boolean
}

/**
 * Qr input that can be used without {@link WidgetContainer}.
 */
export default class QrInput extends BaseComponent<IQrInputProps, IQrInputState> implements IGlobalClick {
    
   public state = {
        showQrReader: false
    }
    
    public get IsQrReaderVisible(): boolean {
       return this.state.showQrReader;
    }

    private async onScanAsync(code: string | null): Promise<void> {
        if (code && this.props.onQr) {
            if (this.props.closeOnQr) {
                await this.setState({showQrReader: false});
            }
            await this.props.onQr(code);
        }
    }

    private static async onScanErrorAsync(): Promise<void> {
        await ch.alertErrorAsync(QrWidgetLocalizer.scanError, true, true);
    }
    
    private async toggleQrReaderAsync(): Promise<void> {
       await this.setState({showQrReader: !this.state.showQrReader})
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
 
        if ((this.IsQrReaderVisible) && (this.props.autoClose)) {
            
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id);

            if(outside) {
                await this.setState({showQrReader: false});
            }
        }
    }
    

    public render(): React.ReactNode {
           return (
            <div id={this.id} className={this.css(styles.qrInputContainer, this.props.className)}>
                
                <Button block
                        icon={this.props.icon ?? {name: "fa-qrcode"}}
                        className={this.props.buttonClassName ?? styles.qrInputButton}
                        type={this.props.buttonType}
                        label={!this.IsQrReaderVisible 
                            ? this.props.label ?? QrInputLocalizer.buttonLabel
                            : QrInputLocalizer.buttonClose
                            }
                        onClick={async () => await this.toggleQrReaderAsync()}
                />
                
                {
                    (this.IsQrReaderVisible) &&
                    (
                        <QrReader delay={300}
                                  onScan={async (data) => await this.onScanAsync(data)}
                                  onError={async () => await QrInput.onScanErrorAsync()}
                        />
                    )
                }
                
            </div>
        );
    }
}