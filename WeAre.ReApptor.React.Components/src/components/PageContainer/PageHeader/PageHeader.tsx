import React from "react";
import {BaseComponent, RenderCallback} from "@weare/reapptor-react-common";

import styles from "../PageContainer.module.scss";

export interface IPageHeaderProps {
    title: string | RenderCallback,
    subtitle?: string;
    withTabs?: boolean
    className?: string;
    onClick?(sender: PageHeader): Promise<void>;
}

export default class PageHeader extends BaseComponent<IPageHeaderProps> {

    private async onClickAsync(): Promise<void> {
        if (this.props.onClick) {
            await this.props.onClick(this);
        }
    }
    
    private renderTitle(): React.ReactNode | string {

        const title: string | RenderCallback = this.props.title;

        if (typeof title === "function") {
            return title(this);
        }

        return (
            <React.Fragment>
                {this.toMultiLines(title)}
            </React.Fragment>
        );
    }
    
    render(): React.ReactNode {
        return (
            <div className={this.css(styles.header, styles.row, "row", this.props.className)}>
                <div className={styles.content}>
                    
                    <div>

                        <h4 onClick={async () => await this.onClickAsync()}>{this.renderTitle()}</h4>
                        
                        {this.props.subtitle && <p className={this.props.withTabs ? styles.noMargin : ""}>{this.props.subtitle}</p>}
                        
                    </div>
                    
                    {this.props.children}
                    
                </div>
                
                {!this.props.withTabs && <hr />}
                
            </div>
        )
    }
}