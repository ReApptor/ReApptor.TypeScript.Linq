import React from "react";
import {BaseComponent, IGlobalClick} from "@weare/reapptor-react-common";
import { Utility } from "@weare/reapptor-toolkit";

import styles from "./Expander.module.scss";

export enum ExpanderType {
    Vertical,

    Horizontal
}

export interface IExpanderProps {
    readonly id?: string;
    className?: string;
    contentClassName?: string;
    autoCollapse?: boolean;
    expanded?: boolean;
    transitionTime?: number;
    type?: ExpanderType;
    children: React.ReactNode;
    onToggle?(sender: Expander, expanded: boolean): Promise<void>;
}

interface IExpanderState {
    expanded: boolean;
    preprocessing: boolean;
    animation: boolean;
    maxHeight: number | "none";
    maxWidth: number | "none";
}

export default class Expander extends BaseComponent<IExpanderProps, IExpanderState> implements IGlobalClick {

    public state: IExpanderState = {
        expanded: (!!this.props.expanded),
        preprocessing: false,
        animation: false,
        maxHeight: 0,
        maxWidth: 0
    };

    private readonly _contentRef: React.RefObject<HTMLDivElement> = React.createRef();
    
    private async invokeToggleAsync(expand: boolean): Promise<void> {
        const vertical: boolean = (this.type == ExpanderType.Vertical);
        const horizontal: boolean = (!vertical);
        const transitionTime: number = 1000 * this.transitionTime;

        if (expand) {
            
            // Expand:
            // Step #1: Hidden rendering
            await this.setState({preprocessing: true, maxHeight: "none", maxWidth: "none"});

            // Step #2: Recalculate
            const contentNode: HTMLDivElement = this._contentRef.current!;
            const rect: DOMRect = contentNode.getBoundingClientRect();

            let maxHeight: number | "none" = (vertical) ? 0 : "none";
            let maxWidth: number | "none" = (horizontal) ? 0 : "none";

            await this.setState({expanded: true, preprocessing: false, maxHeight, maxWidth});
            
            // Wait 1 ms -> start new circle in new thread ("getBoundingClientRect" breaks transition)
            await Utility.wait(1);

            // Step 3#: Transition (Animation):
            maxHeight = (vertical) ? rect.height : "none";
            maxWidth = (horizontal) ? rect.width : "none";
            
            await this.setState({maxHeight, maxWidth, animation: true});

            await Utility.wait(transitionTime);

            await this.setState({animation: false});

            // Callback
            if (this.props.onToggle) {
                await this.props.onToggle(this, true);
            }
            
        } else {
            
            // Collapse:
            const maxHeight = (vertical) ? 0 : "none";
            const maxWidth = (horizontal) ? 0 : "none";

            await this.setState({maxHeight, maxWidth, expanded: false, animation: true});

            await Utility.wait(transitionTime);

            await this.setState({animation: false});

            // Callback
            if (this.props.onToggle) {
                await this.props.onToggle(this, true);
            }
        }
    }

    // Getters

    private get autoCollapse(): boolean {
        return (this.props.autoCollapse === true);
    }

    public get type(): ExpanderType {
        return this.props.type ?? ExpanderType.Vertical;
    }

    public get transitionTime(): number {
        return this.props.transitionTime || 0.2;
    }

    public get expanded(): boolean {
        return this.state.expanded;
    }

    public get collapsed(): boolean {
        return (!this.expanded);
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this.expanded) {
            await this.expandAsync();
        }
    }

    private async setExpanded(expanded: boolean): Promise<void> {
        if (expanded !== this.expanded) {
            await this.invokeToggleAsync(expanded);
        }
    }

    public async expandAsync(): Promise<void> {
        await this.setExpanded(true);
    }

    public async collapseAsync(): Promise<void> {
        await this.setExpanded(false);
    }

    public async toggleAsync(): Promise<void> {
        return (this.expanded)
            ? await this.collapseAsync()
            : await this.expandAsync();
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        if ((this.expanded) && (this.autoCollapse)) {
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id);

            if (outside) {
                await this.collapseAsync();
            }
        }
    }

    public render(): React.ReactNode {
        const preprocessing: boolean = this.state.preprocessing;
        const expanded: boolean = this.expanded;
        
        const processingStyles: any = preprocessing
                ? styles.processing
                : (expanded)
                    ? styles.expanded
                    : styles.collapsed;
        
        const typeStyle: any = (this.type == ExpanderType.Vertical)
            ? styles.vertical
            : styles.horizontal;
        
        const animationStyle: any = this.state.animation && styles.animation;
        
        //console.log("render: processing=", preprocessing, "expanded=", expanded, "maxHeight=", this.state.maxHeight, "maxWidth=", this.state.maxWidth);

        const inlineStyles: React.CSSProperties = {
            maxHeight: this.state.maxHeight,
            maxWidth: this.state.maxWidth,
            transitionDuration: `${this.transitionTime}s`
        };

        return (
            <div id={this.id} className={this.css(styles.expander, this.props.className, processingStyles)}>

                <div id={`${this.id}_content`} ref={this._contentRef}
                     className={this.css(styles.content, this.props.contentClassName, typeStyle, processingStyles, animationStyle)}
                     style={inlineStyles}>

                    {
                        this.children
                    }

                </div>

            </div>
        );
    }
}