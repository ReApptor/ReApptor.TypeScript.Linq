import React from "react";
import {BaseComponent, DataStorageType, UserInteractionDataStorage} from "@weare/athenaeum-react-common";

import styles from "./Panel.module.scss";

export enum PanelCollapseType {
    Vertical,
    
    Horizontal
}

interface IPanelProps {
    id?: string;
    collapsible?: PanelCollapseType;
    collapsed?: boolean;
    title?: string;
    customHeading?: React.ReactNode;
    className?: string;
    dataStorageType?: DataStorageType;
}

interface IPanelState {
    collapsed: boolean;
}

export default class Panel extends BaseComponent<IPanelProps, IPanelState> {
    state: IPanelState = {
        collapsed: this.props.collapsed || UserInteractionDataStorage.get(this.id, false, this.dataStorageType)
    };
    
    private saveCollapsed(): void {
        if (this.props.id) {
            UserInteractionDataStorage.set(this.id, this.collapsed, this.dataStorageType);
        }
    }
    
    private get collapsed(): boolean {
        return this.state.collapsed;
    }
    
    private get collapseType(): PanelCollapseType | null {
        return (this.props.collapsible !== undefined) ? this.props.collapsible : null;
    }
    
    private get collapseClass(): string {
        if (this.collapseType !== null) {
            if(this.collapseType === PanelCollapseType.Horizontal) {
                return styles.collapseHorizontally;
            } else {
                return styles.collapseVertically;
            }
        }
        return "";
    }

    private get dataStorageType(): DataStorageType {
        return this.props.dataStorageType || DataStorageType.Page;
    }

    private get customHeading(): React.ReactNode | null {
        return this.props.customHeading;
    }

    private get title(): string {
        return this.props.title || "";
    }
    
    private async toggleAsync(): Promise<void> {
        if(this.collapsed) {
            await this.expandAsync();
        } else {
            await this.collapseAsync();
        }
    }

    public async expandAsync(): Promise<void> {
        if (this.collapsed) {
            await this.setState({collapsed: false});
            this.saveCollapsed();
        }
    }
    
    public async collapseAsync(): Promise<void> {
        if (!this.collapsed) {
            await this.setState({collapsed: true})
            this.saveCollapsed();
        }
    }
    
    public render(): React.ReactNode {
        return (
            <div id={this.id}
                 className={this.css(styles.panel, this.collapsed && this.collapseClass, this.props.className)}
            >
                
                { 
                    (this.customHeading || this.title) && 
                        (
                            <div className={styles.heading}>
                                { !this.customHeading && <h3 className={this.css(styles.title, "col")} title={this.title}>{this.title}</h3> }
        
                                { this.customHeading }
                            </div>
                        )
                }
                
                {
                    this.collapsed && 
                        (
                            <div className={styles.collapsedContent} onClick={async () => await this.toggleAsync()}>
                                <h3 className={this.css(styles.title, "col")}>{this.title}</h3>
                            </div>
                        )
                }
                
                {
                    (this.collapseType !== null) && (
                        (this.collapseType === PanelCollapseType.Horizontal)
                            ? <i className={this.css(styles.minimize, `${this.collapsed ? "fa fa-lg fa-caret-square-right" : "fa fa-lg fa-caret-square-left"}`)}
                                 onClick={async () => await this.toggleAsync()} />
                            : (this.collapseType === PanelCollapseType.Vertical)
                            ? <i className={this.css(styles.minimize, `${this.collapsed ? "fa fa-lg fa-caret-square-down" : "fa fa-lg fa-caret-square-up"}`)}
                                 onClick={async () => await this.toggleAsync()} />
                            : null
                    )
                }
                
                <div className={this.css(styles.content)}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}