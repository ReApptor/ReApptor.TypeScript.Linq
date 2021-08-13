import React from "react";
import {BaseComponent, IBaseClassNames, IGlobalClick,} from "@weare/athenaeum-react-common";
import { Utility } from "@weare/athenaeum-toolkit";

import Icon, {IconSize} from "../Icon/Icon";

import styles from "./Accordion.module.scss";

export interface IAccordionClassNames extends IBaseClassNames {
    readonly accordion?: string;
    readonly headerContainer?: string;
    readonly header?: string;
    readonly toggler?: string;
    readonly contentContainer?: string;
    readonly collapsed?: string;
    readonly separator?: string;
    readonly content?: string;
}

export enum TogglerPosition {
    Header,

    Bottom
}

export interface IAccordionProps {
    readonly className?: string;
    readonly classNames?: IAccordionClassNames;
    children: React.ReactNode;
    header: string | React.ReactNode;
    toggler?: boolean | React.ReactNode;
    togglerIcon?: string | null;
    togglerSize?: IconSize | null;
    togglerPosition?: TogglerPosition | TogglerPosition.Header;
    expanded?: boolean;
    onToggle?(sender: Accordion, expanded: boolean): Promise<void>; 
}

interface IAccordionState {
    expanded: boolean;
}

class Accordion extends BaseComponent<IAccordionProps, IAccordionState> implements IGlobalClick {
    state: IAccordionState = {
        expanded: !!this.props.expanded
    };
    
    private readonly _contentRef: React.RefObject<HTMLDivElement> = React.createRef();

    private async setExpanded(expanded: boolean): Promise<void> {
        if (expanded !== this.expanded) {
            await this.setState({ expanded })
            
            if (this.props.onToggle) {
                await this.props.onToggle(this, expanded);
            }
        }
    }
    
    private get contentNode(): React.ReactNode | null {
        return this._contentRef.current;
    }
    
    private get contentMaxHeight(): number {
        const node: any = this.contentNode;
        
        if(node) {
            return node.getBoundingClientRect().height;
        }
        
        return 0;
    }

    public get expanded(): boolean {
        return this.state.expanded;
    }

    public get collapsed(): boolean {
        return !this.state.expanded;
    }
    
    public get hasToggle(): boolean {
        return !!this.props.toggler;
    }
    
    public getHeader(): React.ReactNode {
        const isComponent: boolean = React.isValidElement(this.props.header);
        
        if (isComponent) {
            return this.props.header;
        }
        
        return <h3>{this.props.header}</h3>;
    }
    
    public getToggler(): React.ReactNode | null {
        if (this.hasToggle) {
            const isComponent: boolean = React.isValidElement(this.props.toggler);

            if (isComponent) {
                return this.props.toggler;
            }

            // return  <Icon className={this.css(styles.icon, this.expanded && styles.expanded)} name={"caret-down"} size={IconSize.X2} />
            return  <Icon className={this.css(styles.icon, this.expanded && styles.expanded)}
                          name={this.props.togglerIcon ?? "caret-down"} 
                          size={this.props.togglerSize ?? IconSize.X2}
            />
        }
        
        return null;
    }

    public get togglerPosition(): TogglerPosition {
        return (this.props.togglerPosition !== undefined) && (this.props.togglerPosition !== null)
            ? this.props.togglerPosition
            : TogglerPosition.Header;
    }

    private get classNames(): IAccordionClassNames {
        const classNamesCopy: IBaseClassNames = {...this.props.classNames};

        Object.keys(styles).forEach((key: string) => !classNamesCopy[key] ? classNamesCopy[key] = styles[key] : classNamesCopy[key]);

        return classNamesCopy;
    }
    
    public async expandAsync(): Promise<void> {
        await this.setExpanded(true);
    }

    public async collapseAsync(): Promise<void> {
        await this.setExpanded(false);
    }
    
    public async toggleAsync(): Promise<void> {
        return (this.expanded) ? await this.collapseAsync() : await this.expandAsync();
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        if (this.expanded) {
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id);

            if(outside) {
                await this.collapseAsync();
            }
        }
    }

    public render(): React.ReactNode {
        const contentMaxHeightStyle: any = {maxHeight: this.contentMaxHeight};

        return (
            <div id={this.id} className={this.css(this.classNames.accordion, styles.accordion, this.props.className)}>
                <div className={this.css(this.classNames.headerContainer, styles.headerContainer, !this.hasToggle && "cursor-pointer")} onClick={(!this.hasToggle) ? (async () => await this.toggleAsync()) : undefined}>
                    <div className={this.css(this.classNames.header, styles.header)}>
                        {this.getHeader()}
                    </div>

                    {(this.hasToggle) && (this.togglerPosition === TogglerPosition.Header) && (
                        <div className={this.css(this.classNames.toggler, styles.toggler)} onClick={async () => this.toggleAsync()}>
                            {this.getToggler()}
                        </div>
                    )}

                </div>

                <div className={this.css(styles.contentContainer, this.classNames.contentContainer, this.collapsed && styles.collapsed, this.collapsed && this.classNames.collapsed)} style={contentMaxHeightStyle}>

                    <hr className={this.css(styles.separator, this.classNames.separator)}/>

                    <div ref={this._contentRef} className={this.css(styles.content, this.classNames.content)}>

                        {this.props.children}

                    </div>

                </div>

                {
                    this.togglerPosition === TogglerPosition.Bottom && this.hasToggle &&
                    (
                        <div className={this.css(this.classNames.toggler, styles.toggler)} onClick={async () => this.toggleAsync()}>
                            {this.getToggler()}
                        </div>
                    )
                }

            </div>
        );
    }
}

export default Accordion;