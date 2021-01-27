import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Icon, {IconSize} from "../../../components/Icon/Icon";

import styles from "./LeftPanel.module.scss";

interface ILeftPanelProps {
    className?: string;
}

interface ILeftPanelState  {
    minimized: boolean;
}

export default class LeftPanel extends BaseComponent<ILeftPanelProps, ILeftPanelState> {

    state: ILeftPanelState = {
        minimized: false
    };

    private async toggleAsync(): Promise<void> {
        await this.setState({ minimized: !this.state.minimized });
    }

    private get iconName(): string {
        return (this.state.minimized) ? "caret-square-right" : "caret-square-left";
    }

    public render(): React.ReactNode {

        const minimizedStyle: any = (this.state.minimized) && (styles.minimized);

        return (
            <div className={this.css(styles.leftPanel, this.props.className, minimizedStyle)}>

                {this.children}

                <div className={this.css(styles.minimize)} onClick={async () => await this.toggleAsync()}>
                    <Icon name={this.iconName} size={IconSize.Large} />
                </div>

            </div>
        );
    }
};