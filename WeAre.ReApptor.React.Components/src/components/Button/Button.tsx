import React from "react";
import {Utility} from "@weare/reapptor-toolkit";
import {BaseComponent, IGlobalClick, Justify, PageRoute, PageRouteProvider} from "@weare/reapptor-react-common";
import Icon, {IconStyle, IIconProps} from "../Icon/Icon";
import ButtonAction, {IButtonActionProps} from "./ButtonAction/ButtonAction";
import ConfirmationDialog, {ConfirmationDialogTitleCallback, IConfirmation} from "../ConfirmationDialog/ConfirmationDialog";
import ButtonLocalizer from "./ButtonLocalizer";

import styles from "./Button.module.scss";

export enum ButtonType {
    Default,

    Orange,

    Blue,

    Primary,

    Secondary,

    Success,

    Danger,

    Warning,

    Info,

    Light,

    Dark,

    Link,

    Unset,

    Text
}

export interface IButtonProps {
    id?: string;
    type?: ButtonType;
    className?: string;
    minWidth?: number | string;

    /**
     * Text displayed in the {@link Button}.
     */
    label?: string;

    title?: string;

    /**
     * Props for an {@link Icon} displayed inside the {@link Button}.
     */
    icon?: IIconProps;

    iconPosition?: Justify;

    block?: boolean;

    /**
     * Should the {@link Button} trigger a submit-event in a containing {@link Form}.
     */
    submit?: boolean;

    dataTarget?: string;
    dataModal?: string;
    toggleModal?: boolean;
    dismissModal?: boolean;

    /**
     * {@link PageRoute} to redirect to when the {@link Button} is clicked.
     */
    route?: PageRoute;

    small?: boolean;
    disabled?: boolean;

    /**
     * Inline styles for the {@link Button}.
     */
    style?: React.CSSProperties;

    confirm?: string | IConfirmation | ConfirmationDialogTitleCallback;

    /**
     * The button will aligned to the right in the ButtonContainer
     */
    right?: boolean;

    /**
     * The number is displayed in the upper right corner.
     */
    count?: number | (() => number | null);

    /**
     * Custom styles (class name) for the "count" property.
     */
    countClassName?: string;

    children?: React.ReactNode | React.ReactNode[];

    onClick?(sender: Button, data: string | null): Promise<void>;
}

interface IButtonState {
    isOpen: boolean;
}

export default class Button extends BaseComponent<IButtonProps, IButtonState> implements IGlobalClick {

    state: IButtonState = {
        isOpen: false
    }

    private readonly _confirmDialogRef: React.RefObject<ConfirmationDialog> = React.createRef();
    private _forcedWidth: number | null = null;
    private _actionLoading: boolean = false;
    private _actionProps: IButtonActionProps | null = null;
    private _onClickInvoking: boolean = false;

    public static get Action(): typeof ButtonAction {
        return ButtonAction;
    }

    public isButton(): boolean { return true; }

    private getStyleColor(): string {
        switch (this.props.type) {
            case ButtonType.Orange:
                return styles.color_orange;
            case ButtonType.Blue:
            case ButtonType.Primary:
                return "btn-primary";
            case ButtonType.Secondary:
                return "btn-secondary";
            case ButtonType.Success:
                return "btn-success";
            case ButtonType.Danger:
                return "btn-danger";
            case ButtonType.Warning:
                return "btn-warning";
            case ButtonType.Info:
                return "btn-info";
            case ButtonType.Light:
                return "btn-light";
            case ButtonType.Dark:
                return "btn-dark";
            case ButtonType.Link:
                return "btn-link";
            case ButtonType.Unset:
                return styles.color_unset;
            case ButtonType.Text:
                return styles.text;

            default:
                return styles.color_grey;
        }
    }
    
    private getCount(): number | null {
        return (this.props.count != null)
            ? (typeof this.props.count === "function")
                ? this.props.count()
                : this.props.count
            : null;
    }

    private getLeftSideIcon(): IIconProps | null {
        if (this._actionProps && this._actionProps.title && this._actionProps.icon && this._actionProps.iconPosition != Justify.Right) {
            return this._actionProps.icon;
        }

        if ((this._actionProps) && (this._actionProps.title)) {
            return null;
        }

        if ((this.props.icon) && (this.iconPosition == Justify.Left)) {
            return this.props.icon;
        }

        return null;
    }

    private getRightSideIcon(): IIconProps | null {
        if (this._actionProps && this._actionProps.icon && this._actionProps.iconPosition == Justify.Right) {
            return this._actionProps.icon;
        }

        if (this._actionProps && this._actionProps.icon) {
            return null;
        }

        if ((this.props.icon) && (this.iconPosition == Justify.Right)) {
            return this.props.icon;
        }

        return null;
    }
    
    private async invokeOnClickAsync(data: string | null = null): Promise<void> {
        if (!this._onClickInvoking) {
            try {
                this._onClickInvoking = true;

                if (this.props.route) {
                    await PageRouteProvider.redirectAsync(this.props.route);
                }

                if (this.props.onClick) {
                    await this.props.onClick(this, data);
                }
            } finally {
                this._onClickInvoking = false;
            }
        }
    }

    private async onClickAsync(confirmed: boolean = true, data: string | null = null): Promise<void> {

        if (this.hasActions) {
            return await this.toggleActionsAsync();
        }

        const confirmNeeded: boolean = (!!this.props.confirm) && (!confirmed);

        if (confirmNeeded) {
            await this._confirmDialogRef.current!.openAsync();
        } else {
            await this.invokeOnClickAsync(data);
        }
    }

    private async toggleActionsAsync(): Promise<void> {
        await this.setState({isOpen: !this.state.isOpen});
    }

    private async closeActionsAsync(): Promise<void> {
        await this.setState({isOpen: false});
    }

    private get actionsId(): string {
        return `${this.id}_actions`;
    }

    private get dataTarget(): string {
        return this.props.dataTarget || "";
    }

    private get dataModal(): string {
        return this.props.dataModal || "";
    }

    private get dataToggleModal(): string {
        return this.props.toggleModal ? "modal" : "";
    }

    private get dataDismissModal(): string {
        return this.props.dismissModal ? "modal" : "";
    }

    private get hasActions(): boolean {
        return !!this.props.children;
    }
    
    private get showActions(): boolean {
        return this.hasActions && this.state.isOpen;
    }

    private get label(): string | undefined {
        return this._actionProps?.title || this.props.label;
    }

    // overriding children's onClick
    protected extendChildProps(element: React.ReactElement): any | null {
        return {
            onClick: async () => {
                await this.onActionClickAsync(element.props);
            }
        }
    }

    private async onActionClickAsync(actionProps: IButtonActionProps): Promise<void> {
        if (this._actionLoading) {
            return;
        }

        this._actionProps = actionProps;
        this._actionLoading = true;
        await this.reRenderAsync();

        try {
            await actionProps.onClick();
        } finally {
            this._actionProps = null;
            this._actionLoading = false;
            await this.reRenderAsync();
        }
    }

    public async onGlobalClick(e: React.MouseEvent): Promise<void> {
        if (this.state.isOpen) {
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id);
            
            if (outside) {
                await this.closeActionsAsync();
            }
        }
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this.hasActions) {
            const actionsDiv: JQuery = this.JQuery(`#${this.actionsId}`);

            const buttonWidth: number = this.outerWidth();
            const actionsWidth: number = actionsDiv.outerWidth() || 0;

            if (actionsWidth >= buttonWidth) {
                this._forcedWidth = actionsWidth;
            } else {
                this._forcedWidth = buttonWidth;
            }

            await this.reRenderAsync();
        }
    }

    public get count(): number | null {
        return this.getCount();
    }

    public get iconPosition(): Justify {
        return this.props.iconPosition ?? Justify.Left;
    }

    public render(): React.ReactNode {

        const count: number | null = this.getCount();
        const leftSideIcon: IIconProps | null = this.getLeftSideIcon();
        const rightSideIcon: IIconProps | null = this.getRightSideIcon();
        
        const showCaret: boolean = (this.hasActions) && (!rightSideIcon) && (!this._actionProps?.title);

        const blockStyle: any = (this.props.block) && "btn-block";
        const smallStyle: any = (this.props.small) && styles.small;
        const labelRightPaddingStyle: any = (this.props.label) && (leftSideIcon) && styles.labelRightPadding;
        const labelLeftPaddingStyle: any = (this.props.label) && (rightSideIcon) && styles.labelLeftPadding;
        const hoverStyle: any = (this.desktop) && styles.hover;

        const inlineStyles: React.CSSProperties = this.props.style || {};

        if (this._forcedWidth) {
            inlineStyles.minWidth = this._forcedWidth;
        }

        if (this.props.minWidth) {
            inlineStyles.minWidth = this.props.minWidth;
        }

        return (
            <React.Fragment>
                <button id={this.id}
                        type={this.props.submit ? "submit" : "button"}
                        disabled={this.props.disabled}
                        title={ButtonLocalizer.get(this.props.title)}
                        className={this.css("btn btn-default", this.getStyleColor(), blockStyle, smallStyle, labelRightPaddingStyle, labelLeftPaddingStyle, hoverStyle, styles.button, this.props.disabled && styles.disabled, this.props.className, this.hasActions && styles.withActions)}
                        style={inlineStyles}
                        data-target={`#${this.dataTarget}`}
                        data-modal={this.dataModal}
                        data-toggle={this.dataToggleModal}
                        data-dismiss={this.dataDismissModal}
                        onClick={() => this.onClickAsync(false)}
                >

                    {leftSideIcon && <Icon {...leftSideIcon} tooltip={ButtonLocalizer.get(this.props.title)}/>}

                    {<span>{this.label}</span>}

                    {rightSideIcon && <Icon {...rightSideIcon} tooltip={ButtonLocalizer.get(this.props.title)}/>}

                    {showCaret && (<Icon className={this.css(styles.icon, "actions-icon")} name={"fa-caret-down"} style={IconStyle.Solid} />)}

                    {this.children.length > 0 && <div id={this.actionsId} className={this.css(styles.actions, this.getStyleColor(), "actions-container", !this.showActions && "invisible")}> {this.children}</div>}
                    
                    {
                        (count != null) &&
                        (
                            <div className={this.css(styles.count, this.props.countClassName)}>
                                <span>{count}</span>
                            </div>
                        )
                    }
                    
                </button>

                {
                    (this.props.confirm) &&
                    (
                        <ConfirmationDialog ref={this._confirmDialogRef}
                                            title={this.props.confirm}
                                            callback={(caller, data) => this.onClickAsync(true, data)}
                        />
                    )
                }

            </React.Fragment>
        );
    }
}