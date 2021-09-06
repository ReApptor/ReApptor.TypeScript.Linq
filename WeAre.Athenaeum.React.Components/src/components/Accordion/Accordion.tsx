import React, {CSSProperties} from "react";
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

    /**
     * Should the {@link Accordion} collapse when a click happens outside of it.
     * True by default.
     */
    autoCollapse?: boolean;
    toggler?: boolean | React.ReactNode;
    togglerIcon?: string | null;
    togglerSize?: IconSize | null;
    togglerPosition?: TogglerPosition | TogglerPosition.Header;
    expanded?: boolean;
    onToggle?(sender: Accordion, expanded: boolean): Promise<void>;
}

interface IAccordionState {
    expanded: boolean;
    maxHeight: number | "fit-content";
}

export default class Accordion extends BaseComponent<IAccordionProps, IAccordionState> implements IGlobalClick {

    public state: IAccordionState = {
        expanded: (!!this.props.expanded),
        maxHeight: 0,
    };

    private readonly _contentRef: React.RefObject<HTMLDivElement> = React.createRef();

    private async setExpanded(expanded: boolean): Promise<void> {
        if (expanded !== this.expanded) {

            const maxHeight = this.contentMaxHeight;

            this.setState({
                expanded,
                maxHeight,
            });

            if (this.props.onToggle) {
                await this.props.onToggle(this, expanded);
            }
        }
    }

    private get autoCollapse(): boolean {
        switch (this.props.autoCollapse) {
            case false:
                return false;
            default:
                return true;
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

    private get classNames(): IAccordionClassNames {
        const classNamesCopy: IBaseClassNames = {...this.props.classNames};

        Object
            .keys(styles)
            .forEach((key: string) => (!classNamesCopy[key])
                ? classNamesCopy[key] = styles[key]
                : classNamesCopy[key]);

        return classNamesCopy;
    }

    public get expanded(): boolean {
        // noinspection PointlessBooleanExpressionJS - let's not assume the runtime value will be a boolean.
        return (this.state.expanded === true);
    }

    public get collapsed(): boolean {
        return (!this.expanded);
    }

    public get hasToggle(): boolean {
        return (!!this.props.toggler);
    }

    public getHeader(): React.ReactNode {
        const headerIsComponent: boolean = (React.isValidElement(this.props.header));

        if (headerIsComponent) {
            return this.props.header;
        }

        return (
            <h3>
                {
                    this.props.header
                }
            </h3>
        );
    }

    public getToggler(): React.ReactNode | null {
        if (this.hasToggle) {
            const togglerIsComponent: boolean = (React.isValidElement(this.props.toggler));

            if (togglerIsComponent) {
                return this.props.toggler;
            }

            return (
                <Icon className={this.css(styles.icon, (this.expanded) && styles.expanded)}
                      name={this.props.togglerIcon ?? "caret-down"}
                      size={this.props.togglerSize ?? IconSize.X2}
                />
            );
        }

        return null;
    }

    public get togglerPosition(): TogglerPosition {
        return (this.props.togglerPosition !== undefined) && (this.props.togglerPosition !== null)
            ? this.props.togglerPosition
            : TogglerPosition.Header;
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

            if(outside) {
                await this.collapseAsync();
            }
        }
    }

    public render(): React.ReactNode {
        return (
            <div id={this.id}
                 className={this.css(this.classNames.accordion, this.props.className)}
            >
                <div className={this.css(this.classNames.headerContainer, (!this.hasToggle) && "cursor-pointer")}
                     onClick={(!this.hasToggle)
                         ? async () => await this.toggleAsync()
                         : undefined}
                >

                    <div className={this.css(this.classNames.header)}>
                        {
                            this.getHeader()
                        }
                    </div>

                    {
                        (this.hasToggle) && (this.togglerPosition === TogglerPosition.Header) &&
                        (
                            <div className={this.css(this.classNames.toggler)}
                                 onClick={async () => this.toggleAsync()}
                            >
                                {
                                    this.getToggler()
                                }
                            </div>
                        )
                    }

                </div>

                <div className={this.css(this.classNames.contentContainer, (this.collapsed) && this.classNames.collapsed)}
                     style={{maxHeight: this.state.maxHeight}}
                >

                    <hr className={this.css(this.classNames.separator)}/>

                    <div ref={this._contentRef}
                         className={this.css(this.classNames.content)}
                    >
                        {
                            this.props.children
                        }
                    </div>

                </div>

                {
                    (this.togglerPosition === TogglerPosition.Bottom) && (this.hasToggle) &&
                    (
                        <div className={this.css(this.classNames.toggler)}
                             onClick={async () => this.toggleAsync()}
                        >
                            {
                                this.getToggler()
                            }
                        </div>
                    )
                }

            </div>
        );
    }
}