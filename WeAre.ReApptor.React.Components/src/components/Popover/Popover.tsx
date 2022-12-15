import React from "react";
import ReactDOM from "react-dom";
import {Utility} from "@weare/reapptor-toolkit";
import {Justify, Align, BaseComponent, IGlobalClick, IGlobalKeydown, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "./Popover.module.scss";

interface IPopoverProps extends IBaseContainerComponentProps {
    tooltip?: string;
    align?: Align;
    justify?: Justify;
    center?: boolean;
    controls?: boolean;
    onToggle?(sender: Popover, isOpen: boolean): Promise<void>;
}

interface IPopoverState {
    isOpen: boolean;
    containerId: string | null;
}

export default class Popover extends BaseComponent<IPopoverProps, IPopoverState> implements IGlobalClick, IGlobalKeydown {
    
    static defaultProps: IPopoverProps = {
        align: Align.Bottom,
        justify: Justify.Left
    };
    
    state: IPopoverState = {
        isOpen: false,
        containerId: null
    };

    public async toggleAsync(containerId: string | null = null): Promise<void> {

        if (containerId) {
            const state: IPopoverState = this.state;
            state.containerId = containerId;
        }

        if (this.state.isOpen) {
            await this.closeAsync();
        } else {
            await this.openAsync();
        }
    }

    public async openAsync(): Promise<void> {
        await this.setState({isOpen: true });
        
        if (this.props.onToggle) {
            await this.props.onToggle(this, true);
        }
    }

    public async closeAsync(): Promise<void> {
        
        await this.setState({ isOpen: false });

        if (this.props.onToggle) {
            await this.props.onToggle(this, false);
        }
    }
    
    public async onGlobalClick(e: React.SyntheticEvent<Element, Event>): Promise<void> {
        const targetNode = e.target as Node;

        const outside: boolean = Utility.clickedOutside(targetNode, this.id, this.state.containerId, "span");

        if (outside) {
            await this.closeAsync();
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if(e.keyCode === 27) {
            await this.closeAsync();
        }
    }
    
    private get positionStyles(): string {
        let positionStyles = "";
        
        if (this.props.align === Align.Top) {
            positionStyles += `${styles.top}`;
        } else {
            positionStyles += `${styles.bottom}`;
        }
        
        if (this.props.justify === Justify.Right) {
            positionStyles += ` ${styles.right}`;
        } else {
            positionStyles += ` ${styles.left}`;
        }
        
        if (this.props.center) {
            positionStyles += ` ${styles.centered}`;
        }
        
        return positionStyles;
    }
    
    private renderPopover(): React.ReactNode {
        return(
            <div id={this.id} 
                 className={this.css(styles.popover, this.state.isOpen && styles.open, this.props.center && styles.centered, this.props.className)}>
                <div className={this.css(styles.content, this.positionStyles, this.props.controls && styles.controls)}>
                    {this.props.children}
                </div>
            </div>
        )
    }
    
    public get isOpen(): boolean {
        return this.state.isOpen;
    }

    public render(): React.ReactNode {
        if (this.state.isOpen) {
            const containerElement: Element | null = (this.state.containerId)
                ? document.getElementById(this.state.containerId)
                : null;

            if (containerElement) {
                return ReactDOM.createPortal(this.renderPopover(), containerElement);
            }
        }
        
        return null; 
    }
}