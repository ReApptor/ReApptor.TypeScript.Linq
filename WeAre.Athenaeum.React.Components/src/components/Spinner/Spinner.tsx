import React, {CSSProperties} from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "./Spinner.module.scss";

const SPINNER_CURSOR_DELAY: number = 150;
const SPINNER_BACKGROUND_DELAY: number = 1000;

interface ISpinnerProps {
    noShading?: boolean;
    global?: boolean;
    onDelay?(): Promise<void>;
}

interface ISpinnerState {
    showCursor: boolean;
    showSpinner: boolean;
}

export default class Spinner extends BaseComponent<ISpinnerProps, ISpinnerState> {
    public state: ISpinnerState = {
        showCursor: false,
        showSpinner: false
    };

    public get opacity(): number {
        return (this.props.noShading)
            ? 0.00
            : (this.props.global)
                ? 0.30
                : 0.15;
    }
    
    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        await this.showSpinnerDelayAsync();
    }

    private async showSpinnerDelayAsync() {
        await Utility.wait(SPINNER_CURSOR_DELAY);

        if (this.isMounted) {
            await this.setState({ showCursor: true });
        }
        
        await Utility.wait(SPINNER_BACKGROUND_DELAY);

        if (this.isMounted) {
            await this.setState({ showSpinner: true });

            if (this.props.onDelay) {
                await this.props.onDelay();
            }
        }
    }

    render(): React.ReactNode {
        if (this.state.showCursor) {

            const localStyle: any = (!this.props.global) && (styles.local);

            const overlayStyle: CSSProperties = {};
            const containerStyle: CSSProperties = {};
            if (this.state.showSpinner) {
                overlayStyle.opacity = this.opacity;
                containerStyle.display = "flex";
            }

            return (
                <div className={styles.spinner}>

                    <div className={this.css(styles.overlay, localStyle)} style={overlayStyle}/>

                    <div className={styles.container} style={containerStyle}>
                        <span className={styles.background}/>
                        <span className={styles.circle}/>
                    </div>

                </div>
            )
        } else {
            return null;
        }
    }
}