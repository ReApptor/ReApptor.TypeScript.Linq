import React from "react";
import {BaseAsyncComponent, IBaseAsyncComponentState, ReactUtility} from "@weare/athenaeum-react-common";
import Icon, { IconSize, IIconProps } from "../Icon/Icon";
import Spinner from "@/components/Spinner/Spinner";
import { TFormat, Utility } from "@weare/athenaeum-toolkit";
import { LinkTarget } from "@/models/Enums";
import BaseWidgetContainer from "@/components/WidgetContainer/BaseWidgetContainer";
import styles from "./WidgetContainer.module.scss";


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
    wide?: boolean;
    label?: string;
    description?: string;
    icon?: IIconProps;
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

export default abstract class BaseWidget<TProps extends IBaseWidgetProps = {}, TWidgetData = {}> extends BaseAsyncComponent<TProps, IBaseWidgetState<TWidgetData>, TWidgetData> implements IBaseWidget {

    private readonly _spinnerRef: React.RefObject<Spinner> = React.createRef();

    state: IBaseWidgetState<TWidgetData> = {
        text: "",
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

    protected getDescription(): string | null {
        return this.state.description;
    }

    protected getLabel(): string | null {
        return this.state.label;
    }

    protected getNumber(): string {
        return (this.state.number != null)
            ? Utility.formatValue(this.state.number, this.numberFormat)
            : "";
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
        const number: number | null = data as (number | null);
        state.number = (number != null) ? number : null;
        state.spinnerVisible = false;
    }

    protected get number(): string {
        return (!this.isSpinning())
            ? this.getNumber()
            : "\u00A0";
    }

    protected get label(): string {
        return this.localizer.get(this.getLabel());
    }

    protected get description(): string {
        const description: string | null = this.getDescription();
        return this.localizer.get(description, this.state.number);
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
        let controller: string = ((BaseWidgetContainer.mountedInstance) && (BaseWidgetContainer.mountedInstance.controller))
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
        if(this.minimized) {
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
            <div className={styles.label}><span>{this.toMultiLines(this.label)}</span></div>
        );
    }

    protected renderContent(): React.ReactNode {
        return (
            <React.Fragment>
                {(this.icon) && <div className={this.css(styles.icon, (this.state.spinnerVisible && styles.icon_hidden))}><Icon {...this.icon} /></div>}
                {(!this.icon && this.number) && (<div className={this.css(styles.number, (this.containsTagSmall) && styles.smallNumbers)}><span>{ReactUtility.toSmalls(this.number)}</span></div>)}
            </React.Fragment>
        );
    }

    protected renderDescription(): React.ReactNode {
        return (
            <div className={styles.description} style={this.descriptionFlexStyle}>
                <span>{this.toMultiLines(this.description)}</span>
            </div>
        );
    }

    protected renderMinimized(): React.ReactNode {
        return (
            <div className={styles.compactContainer}>
                {
                    (this.minimized) && this.renderContent()
                }
                <div className={styles.labelAndDescription}>
                    {(this.label) && <div className={styles.label}><span>{this.label}</span></div>}
                    <div className={styles.description}><span>{this.description}</span></div>
                </div>
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

        if (newState != null) {
            await this.setState(newState);
        }

        await super.componentWillReceiveProps(nextProps);
    }

    render(): React.ReactNode {
        return (
            <div id={this.id} className={this.css(styles.widget, this.props.className, this.getInnerClassName(), (this.wide ? "col-md-12" : "col-md-6"))}>

                <a href={this.getHref()}
                   rel="noreferrer"
                   title={this.toSingleLine(this.description || this.label)}
                   onClick={async (e: React.MouseEvent) => await this.onClickAsync(e)}
                   target={this.getTarget()}
                   className={this.css(this.minimized && styles.compact, this.transparent && styles.transparent)}
                   onMouseDown={async (e: React.MouseEvent) => await this.onMouseDownAsync(e)}
                   draggable={false} // Future note -> change this if drag'n'drop functionality for Widgets are going to be implemented
                >

                    { (!this.minimized) && this.renderLabel() }

                    <div className={styles.contentContainer} style={this.contentFlexStyle}>
                        { (!this.minimized) && this.renderContent() }
                    </div>

                    { this.hasDescription() && this.renderDescription() }

                    { this.renderMinimized() }

                </a>

                {(this.isSpinning()) && <Spinner ref={this._spinnerRef} noShading onDelay={async () => this.onSpinnerDelayHandlerAsync()} /> }

            </div>
        );
    }
};