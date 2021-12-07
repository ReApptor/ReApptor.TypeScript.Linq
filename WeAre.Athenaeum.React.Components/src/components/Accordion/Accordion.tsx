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

    /**
     * Classnames for specific sections of the {@link Accordion}.
     */
    readonly classNames?: IAccordionClassNames;

    children: React.ReactNode;

    /**
     * Text or {@link React.ReactNode} rendered in the {@link Accordion}'s header. Visible also when the {@link Accordion} is collapsed.
     */
    header: string | React.ReactNode;

    /**
     * Should the {@link Accordion} collapse when a click happens outside of it.
     *
     * @default true
     */
    autoCollapse?: boolean;

    /**
     * Should the {@link Accordion} be initially rendered as expanded.
     *
     * @default false
     */
    expanded?: boolean;

    /**
     * Added to the maximum-height CSS property of the expanded {@link Accordion}.
     * Useful for making sure that dynamically added elements make the {@link Accordion} resize smoothly.
     *
     * @default 0
     */
    maxHeightOffset?: number;

    /**
     * Should the {@link Accordion} only expand and collapse when a specific toggler-element is clicked.
     *
     * @default undefined
     */
    toggler?: boolean | React.ReactNode;

    togglerIcon?: string | null;
    togglerSize?: IconSize | null;
    togglerPosition?: TogglerPosition | TogglerPosition.Header;
    onToggle?(sender: Accordion, expanded: boolean): Promise<void>;
}

interface IAccordionState {
    expanded: boolean;
    maxHeight: number;
}

export default class Accordion extends BaseComponent<IAccordionProps, IAccordionState> implements IGlobalClick {

    // Inherited

    public state: IAccordionState = {
        expanded: (!!this.props.expanded),
        maxHeight: 0,
    };

    // Fields

    private readonly _contentRef: React.RefObject<HTMLDivElement> = React.createRef();

    // Getters

    private get autoCollapse(): boolean {
        switch (this.props.autoCollapse) {
            case false:
                return false;
            default:
                return true;
        }
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

    private get contentNode(): React.ReactNode | null {
        return this._contentRef.current;
    }

    public get collapsed(): boolean {
        return (!this.expanded);
    }

    public get expanded(): boolean {
        return this.state.expanded;
    }

    public get hasToggle(): boolean {
        return (!!this.props.toggler);
    }

    private get maxHeightOffset(): number {
        return this.props.maxHeightOffset ?? 0;
    }

    // Async-methods

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this.expanded) {
            await this.recalculateContentHeight();
        }
    }

    private async setExpanded(expanded: boolean): Promise<void> {
        if (expanded !== this.expanded) {

            await this.recalculateContentHeight();

            await this.setState({expanded});

            if (this.props.onToggle) {
                await this.props.onToggle(this, expanded);
            }
        }
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

    /**
     * If content is added dynamically to the {@link Accordion} while it is open, it will not resize itself automatically, causing the content to overflow and clip.
     * Calling this method will make the {@link Accordion} readjust itself, so all content is visible.
     */
    public async recalculateContentHeight(): Promise<void> {
        const contentNode: any = this.contentNode;

        if (contentNode) {
            const maxHeight: number = contentNode.getBoundingClientRect().height;

            await this.setState({maxHeight});
        }
    }

    public render(): React.ReactNode {
        const expandedStyles = this.expanded && styles.expanded;

        return (
            <div id={this.id}
                 className={this.css(this.classNames.accordion, this.props.className, styles.accordion, expandedStyles)}
            >
                <div className={this.css(this.classNames.headerContainer, styles.headerContainer, (!this.hasToggle) && "cursor-pointer")}
                     onClick={(!this.hasToggle) ? async () => await this.toggleAsync() : undefined}
                >

                    <div className={this.css(this.classNames.header, styles.header)}>
                        {
                            this.getHeader()
                        }
                    </div>

                    {
                        (!this.hasToggle) &&
                        (
                            <div className={this.css(styles.expansionInfo)}>
                                {
                                    <Icon className={this.css(styles.expansionInfoIcon, (this.expanded) && styles.expanded)}
                                          name={"angle-down"}
                                          size={IconSize.X2}
                                    />
                                }
                            </div>
                        )
                    }

                    {
                        (this.hasToggle) && (this.togglerPosition === TogglerPosition.Header) &&
                        (
                            <div className={this.css(this.classNames.toggler, styles.toggler)}
                                 onClick={async () => this.toggleAsync()}
                            >
                                {
                                    this.getToggler()
                                }
                            </div>
                        )
                    }

                </div>

                <div className={this.css(this.classNames.contentContainer, styles.contentContainer, (this.collapsed) && this.css(this.classNames.collapsed, styles.collapsed))}
                     style={{maxHeight: this.state.maxHeight + this.maxHeightOffset}}
                >

                    <hr className={this.css(this.classNames.separator, styles.separator)}/>

                    <div ref={this._contentRef}
                         className={this.css(this.classNames.content, styles.content)}
                    >
                        {
                            this.props.children
                        }
                    </div>

                </div>

                {
                    (this.togglerPosition === TogglerPosition.Bottom) && (this.hasToggle) &&
                    (
                        <div className={this.css(this.classNames.toggler, styles.toggler)}
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