import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {IGlobalClick} from "@weare/athenaeum-react-common";
import BaseWidget, { IBaseWidgetProps } from "./BaseWidget";

import styles from "./WidgetContainer.module.scss";

export interface IBaseExpandableWidgetProps extends IBaseWidgetProps {
}

export default abstract class BaseExpandableWidget<TProps extends IBaseExpandableWidgetProps = {}, TWidgetData = {}> extends BaseWidget<TProps, TWidgetData> implements IGlobalClick {
    
    private _contentVisible: boolean = false;

    protected async setContentAsync(visible: boolean): Promise<void> {
        if (this._contentVisible !== visible) {
            this._contentVisible = visible;
            const minimized: boolean = (this.props.minimized == true) ? (!visible) : false;
            await this.setState({ minimized: minimized });
        }
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        if (!this.isSpinning()) {
            await this.toggleContentAsync();
        }
    }

    public async toggleContentAsync(): Promise<void> {
        await this.setContentAsync(!this.contentVisible);
    }

    public async showContentAsync(): Promise<void> {
        await this.setContentAsync(true);
    }

    public async hideContentAsync(): Promise<void> {
        await this.setContentAsync(false);
    }

    public get contentVisible(): boolean {
        return this._contentVisible;
    }

    public isAsync(): boolean { return false; }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        if (!this.isSpinning()) {
            const target = e.target as Node;
            const outside = Utility.clickedOutside(target, this.id);
            if (outside) {
                await this.hideContentAsync();
            }
        }
    }
    
    protected abstract renderExpanded(): React.ReactNode;

    protected renderContent(renderHidden: boolean = false): React.ReactNode {
        return (
            <React.Fragment>
                {
                    (this.contentVisible)
                        ? 
                        <div className={styles.expandableContent}>
                            {this.renderExpanded()}
                        </div>
                        : super.renderContent(renderHidden)
                }
            </React.Fragment>
        );
    }
}