import React from "react";
import {TFormat, Utility} from "@weare/reapptor-toolkit";
import {BaseAsyncComponent, IBaseAsyncComponentState, IBaseClassNames, LinkTarget, ReactUtility} from "@weare/reapptor-react-common";
import Icon, {IconSize, IIconProps} from "../Icon/Icon";
import Spinner from "../Spinner/Spinner";
import BaseWidgetContainer from "./BaseWidgetContainer";
import WidgetContainerLocalizer from "./WidgetContainerLocalizer";

import styles from "./WidgetContainer.module.scss";

export interface IBaseWidgetClassNames extends IBaseClassNames {
    readonly widget?: string;
    readonly contentContainer?: string;
    readonly compactContainer?: string;
    readonly labelAndDescription?: string;
    readonly label?: string;
    readonly description?: string;
    readonly icon?: string;
}

export interface IBaseWidget {
    isWidget(): boolean;
    minimizeAsync(): Promise<void>;
    maximizeAsync(): Promise<void>;
    minimized: boolean;
    transparent: boolean;
}

export interface IBaseWidgetProps {
    id?: string;
    className?: string;
    classNames?: IBaseWidgetClassNames;
    wide?: boolean;
    label?: string;
    description?: string;
    icon?: IIconProps;
    text?: string;
    async?: boolean;
    minimized?: boolean;
    transparent?: boolean;
    stretchContent?: boolean;
}

export interface IBaseWidgetState<TWidgetData> extends IBaseAsyncComponentState<TWidgetData> {
    text: string | null;
    number: number | null;
    date: Date | null;
    label: string | null;
    description: string | null;
    icon: IIconProps | null;
    spinnerVisible: boolean;
    minimized: boolean;
    transparent: boolean;
}

export default abstract class BaseWidget<TProps extends IBaseWidgetProps = {}, TWidgetData = {}>
    extends BaseAsyncComponent<TProps, IBaseWidgetState<TWidgetData>, TWidgetData>
    implements IBaseWidget {

    state: IBaseWidgetState<TWidgetData> = {
        text: (this.props.text as string | null),
        number: null,
        date: null,
        label: (this.props.label as string | null),
        description: (this.props.description as string | null),
        icon: (this.props.icon as IIconProps | null),
        isLoading: false,
        data: null,
        spinnerVisible: false,
        minimized: (this.props.minimized === true),
        transparent: (this.props.transparent === true)
    };

    private async onSpinnerDelayHandlerAsync(): Promise<void> {
        if (this.isSpinning()) {
            await this.setState({ spinnerVisible: true });
        }
    }

    protected get numberFormat(): TFormat {
        return "0";
    }

    protected get dateFormat(): TFormat {
        return "D";
    }

    protected getDescription(): string | null {
        return this.state.description;
    }

    protected getLabel(): string | null {
        return this.state.label;
    }

    protected getNumber(): string {
        return (this.state.date != null)
            ? Utility.formatValue(this.state.date, this.dateFormat)
            : (this.state.number != null)
                ? Utility.formatValue(this.state.number, this.numberFormat)
                : this.state.text || "";
    }

    public isAsync(): boolean {
        return (!!this.props.id) && (this.props.async === true);
    }

    public get transparent(): boolean {
        return (this.state.transparent);
    }

    public async toggleTransparentAsync(): Promise<void> {
        const transparent: boolean = !this.transparent;
        await this.setState({ transparent });
    }

    protected async processDataAsync(state: IBaseWidgetState<TWidgetData>, data: TWidgetData | null): Promise<void> {
        const date: Date | null = (Utility.isDateType(data)) ? new Date(data as any) : null;
        const number: number | null = ((data != null) && (typeof data === "number")) ? data as number : null;
        state.text = data as (string | null);
        state.number = (number != null) ? number : null;
        state.date = date;
        state.spinnerVisible = false;
    }

    protected get number(): string {
        return (!this.isSpinning())
            ? this.getNumber()
            : "\u00A0";
    }

    protected get label(): string {
        return WidgetContainerLocalizer.get(this.getLabel());
    }

    protected get description(): string {
        const description: string | null = this.getDescription();
        return WidgetContainerLocalizer.get(description, this.state.number);
    }

    protected get icon(): IIconProps | null {
        const icon: IIconProps | null = this.state.icon;
        if (icon != null) {
            icon.size = (this.state.minimized) ? IconSize.X2 : IconSize.X3;
        }
        return icon;
    }

    protected get wide(): boolean {
        return (this.props.wide === true);
    }

    protected get contentFlexStyle(): object {
        return {flexGrow: `${this.props.stretchContent ? 1 : 0}`};
    }

    protected get descriptionFlexStyle(): object {
        return {flexGrow: `${!this.props.stretchContent ? 1 : 0}`};
    }

    protected hasDescription(): boolean {
        return !!this.description;
    }

    protected getActionEndpoint(action: string) {
        const controller: string = ((BaseWidgetContainer.mountedInstance) && (BaseWidgetContainer.mountedInstance.controller))
            ? BaseWidgetContainer.mountedInstance.controller
            : "Dashboard";
        return `api/${controller}/${action}`;
    }

    protected getEndpoint(): string {
        const action: string = `get${this.props.id}Data`;
        return this.getActionEndpoint(action);
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
    }

    protected async onMouseDownAsync(e: React.MouseEvent): Promise<void> {
    }

    protected getTarget(): LinkTarget {
        return LinkTarget.Self;
    }

    protected getHref(): string {
        return "javascript:void(0)";
    }

    protected getInnerClassName(): string {
        return "";
    }

    private get classNames(): IBaseWidgetClassNames {
        const classNamesCopy: IBaseWidgetClassNames = {...this.props.classNames} ?? {};

        Object.keys(styles).forEach((key: string) => !classNamesCopy[key] ? classNamesCopy[key] = styles[key] : classNamesCopy[key]);

        return classNamesCopy;
    }

    public isWidget(): boolean { return true; }

    public hasSpinner(): boolean { return true; }

    public isSpinning(): boolean {
        return ((this.isAsync()) && (this.state.data == null));
    }

    public get minimized(): boolean {
        return this.state.minimized;
    }

    public get containsTagSmall(): boolean {
        return this.number.includes("<small>");
    }

    public async toggleMinimized(): Promise<void> {
        if (this.minimized) {
            await this.maximizeAsync();
        } else {
            await this.minimizeAsync();
        }
    }

    public async minimizeAsync(): Promise<void> {
        if (!this.state.minimized) {
            await this.setState({ minimized: true });
        }
    }

    public async maximizeAsync(): Promise<void> {
        if (this.state.minimized) {
            await this.setState({ minimized: false });
        }
    }

    protected renderLabel(): React.ReactNode {
        return (
            <div className={this.css(styles.label, this.classNames.label)}><span>{this.toMultiLines(this.label)}</span></div>
        );
    }

    protected renderContent(renderHidden: boolean = false): React.ReactNode {
        return (
            <React.Fragment>
                {
                    (this.icon) &&
                    (
                        <div className={this.css(styles.icon, (this.state.spinnerVisible && styles.icon_hidden), (renderHidden && styles.icon_hidden))}>
                            <Icon {...this.icon} />
                        </div>
                    )
                }
                {
                    ((!this.icon) && (this.number)) &&
                    (
                        <div className={this.css(styles.number, (this.containsTagSmall) && styles.smallNumbers)}>
                            <span>{ReactUtility.toSmalls(this.number)}</span>
                        </div>
                    )
                }
            </React.Fragment>
        );
    }

    protected renderDescription(): React.ReactNode {
        return (
            <div className={this.css(styles.description, this.classNames.description)} style={this.descriptionFlexStyle}>
                <span>{this.toMultiLines(this.description)}</span>
            </div>
        );
    }
    
    protected renderExtendedContent(): React.ReactNode {
        return (<React.Fragment/>);
    }

    protected renderMinimized(): React.ReactNode {

        const minimized: boolean = this.minimized;
        
        return (
            <div className={this.css(styles.compactContainer, this.classNames.compactContainer)}>
                {
                    (minimized) && this.renderContent()
                }
                <div className={this.css(styles.labelAndDescription, this.classNames.labelAndDescription)}>
                    {(this.label) && <div className={this.css(styles.label, this.classNames.label)}><span>{this.label}</span></div>}
                    {(this.description) && <div className={this.css(styles.description, this.classNames.description)}><span>{this.description}</span></div>}
                </div>
                {
                    (minimized) && this.renderContent(true)
                }
            </div>
        );
    }

    public async componentWillReceiveProps(nextProps: Readonly<TProps>): Promise<void> {
        let newState: any | null = null;

        if (this.props.description !== nextProps.description) {
            newState = newState || {};
            newState.description = nextProps.description;
        }

        if (this.props.label !== nextProps.label) {
            newState = newState || {};
            newState.label = nextProps.label;
        }

        if (this.props.icon !== nextProps.icon) {
            newState = newState || {};
            newState.icon = nextProps.icon;
        }

        if (this.props.text !== nextProps.text) {
            newState = newState || {};
            newState.text = nextProps.text;
        }
        
        if (this.props.minimized !== nextProps.minimized) {
            newState = newState || {};
            newState.minimized = nextProps.minimized;
        }

        if (newState != null) {
            await this.setState(newState);
        }

        await super.componentWillReceiveProps(nextProps);
    }

    public render(): React.ReactNode {
        
        const minimized: boolean = this.minimized;
        
        return (
            <div id={this.id}
                 className={this.css(styles.widget, this.props.className, this.getInnerClassName(), (this.wide ? "col-md-12" : "col-md-6"), this.classNames.widget)}
            >

                <a href={this.getHref()}
                   rel="noreferrer"
                   title={this.toSingleLine(this.description || this.label)}
                   target={this.getTarget()}
                   className={this.css(minimized && styles.compact, this.transparent && styles.transparent)}
                   draggable={false} // Future note -> change this if drag'n'drop functionality for Widgets are going to be implemented
                   onMouseDown={(e: React.MouseEvent) => this.onMouseDownAsync(e)}
                   onClick={(e: React.MouseEvent) => this.onClickAsync(e)}
                >

                    { (!minimized) && this.renderLabel() }

                    <div className={this.css(styles.contentContainer, this.classNames.contentContainer)} style={this.contentFlexStyle}>
                        
                        { (!minimized) && this.renderContent() }
                        
                        { this.renderExtendedContent() }
                        
                    </div>

                    { (!minimized) && this.hasDescription() && this.renderDescription() }

                    { this.renderMinimized() }

                </a>

                {
                    (this.isSpinning()) &&
                    (
                        <Spinner noShading
                                 onDelay={() => this.onSpinnerDelayHandlerAsync()}
                        />
                    )
                }

            </div>
        );
    }
};