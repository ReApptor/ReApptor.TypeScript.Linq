import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IGlobalClick, Justify, PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import Icon, {IconStyle, IIconProps} from "../Icon/Icon";
import ButtonAction, {IButtonActionProps} from "./ButtonAction/ButtonAction";
import ConfirmationDialog, {ConfirmationDialogTitleCallback, IConfirmation} from "../ConfirmationDialog/ConfirmationDialog";
import ButtonLocalizer from "./ButtonLocalizer";

import styles from "./Button.module.scss";
import {log} from "util";

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
    minWidth?: number | string;
    type?: ButtonType;
    label?: string;
    title?: string;
    icon?: IIconProps;
    block?: boolean;
    submit?: boolean;
    dataTarget?: string;
    dataModal?: string;
    toggleModal?: boolean;
    dismissModal?: boolean;
    className?: string;
    route?: PageRoute;
    small?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    confirm?: string | IConfirmation | ConfirmationDialogTitleCallback;
    /**
     * The button will aligned to the right in the ButtonContainer
     */
    right?: boolean;
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
    private _actionLoading: boolean = false;
    private _actionLabel: string | undefined | null = null;
    private _actionIcon: IIconProps | undefined | null = null;
    private _actionIconPosition: Justify | undefined | null = null;
    
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

    private async onClickAsync(confirmed: boolean = true, data: string | null = null): Promise<void> {

        if (this.hasActions) {
            return await this.toggleActions();
        }

        const confirmNeeded: boolean = (!!this.props.confirm) && (!confirmed);

        if (confirmNeeded) {
            await this._confirmDialogRef.current!.openAsync();
        } else {

            if (this.props.route) {
                await PageRouteProvider.redirectAsync(this.props.route);
            }

            if (this.props.onClick) {
                await this.props.onClick(this, data);
            }
        }
    }

    private async toggleActions(): Promise<void> {
        await this.setState({isOpen: !this.state.isOpen});
    }

    private async closeActions(): Promise<void> {
        await this.setState({isOpen: false});
    }

    private get actionsId(): string {
        return `${this.id}_actions`
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

    private get showCaret(): boolean {
        return this.hasActions && !this.rightSideIcon && !this._actionLabel;
    }
    
    private get showActions(): boolean {
        return this.hasActions && this.state.isOpen;
    }

    private get leftSideIcon(): IIconProps | null {
        if (this._actionLabel && this._actionIcon && this._actionIconPosition !== Justify.Right) {
            return this._actionIcon;
        }

        if (this._actionLabel) {
            return null;
        }
        
        if (this.props.icon) {
            return this.props.icon; 
        }
        
        return null;
    }
    
    private get rightSideIcon(): IIconProps | null {
        if (this._actionIcon && this._actionIconPosition === Justify.Right) {
            return this._actionIcon;
        }

        if (this._actionIcon) {
            return null;
        }
        
        return null;
    }

    private get label(): string | undefined {
        return this._actionLabel || this.props.label;
    }
    
    // overriding children's onClick 
    protected extendChildProps(element: React.ReactElement): any | null {
        return {
            onClick: async () => {
                await this.onActionClickAsync(element.props);
            }
        }
    }
    
    private async onActionClickAsync(childrenProps: IButtonActionProps): Promise<void> {
        const node = this.getNode();
        const width = node.outerWidth();

        if (this._actionLoading) {
            return; 
        }

        node.css({
            width: `${width}px`
        });

        this._actionLabel = childrenProps.title;
        this._actionIconPosition = childrenProps.iconPosition;
        this._actionIcon = childrenProps.icon;
        this._actionLoading = true;
        await this.reRenderAsync();
        
        try {
            await childrenProps.onClick();
        } finally {
            node.css({
                width: ""
            });

            this._actionLabel = null;
            this._actionIconPosition = null;
            this._actionIcon = null;

            this._actionLoading = false;
            await this.reRenderAsync();
        }
    }

    public async onGlobalClick(e: React.MouseEvent): Promise<void> {
        const target = e.target as Node;

        const outside: boolean = Utility.clickedOutside(target, this.id);

        if (outside && this.state.isOpen) {
            await this.closeActions();
        }
    }

    public render(): React.ReactNode {
        const blockStyle: any = (this.props.block) && "btn-block";
        const smallStyle: any = (this.props.small) && styles.small;
        const iconPaddingStyle: any = (this.props.icon) && styles.iconPadding;
        const labelPaddingStyle: any = (this.props.label) && styles.labelPadding;
        const hoverStyle: any = (this.desktop) && styles.hover;

        const inlineStyles: React.CSSProperties = this.props.style || {};

        if (this.props.minWidth) {
            inlineStyles.minWidth = this.props.minWidth;
        }
        const width = this.getNode().outerWidth();
        const actionsWidth = this.JQuery(`#${this.actionsId}`).outerWidth();
        if (width && actionsWidth && actionsWidth >= width) {
            inlineStyles.minWidth = actionsWidth;
        }
 
        return (
            <React.Fragment>
                <button id={this.id}
                        type={this.props.submit ? "submit" : "button"}
                        disabled={this.props.disabled}
                        title={ButtonLocalizer.get(this.props.title)}
                        className={this.css("btn btn-default", this.getStyleColor(), blockStyle, smallStyle, iconPaddingStyle, labelPaddingStyle, hoverStyle, styles.button, this.props.disabled && styles.disabled, this.props.className, this.hasActions && styles.withActions)}
                        data-target={`#${this.dataTarget}`}
                        data-modal={this.dataModal}
                        data-toggle={this.dataToggleModal}
                        data-dismiss={this.dataDismissModal}
                        onClick={async () => await this.onClickAsync(false)}
                        style={inlineStyles}>
                    
                    {this.leftSideIcon && <Icon {...this.leftSideIcon} tooltip={ButtonLocalizer.get(this.props.title)}/>}

                    {this.label && <span>{this.label}</span>}

                    {this.rightSideIcon && <Icon {...this.rightSideIcon} tooltip={ButtonLocalizer.get(this.props.title)}/>}

                    {this.showCaret && (<Icon className={this.css(styles.icon, "actions-icon")} name={"fa-caret-down"} style={IconStyle.Solid} />)}

                    {<div id={this.actionsId} className={this.css(styles.actions, this.getStyleColor(), "actions-container", !this.showActions && "invisible")}> {this.children}</div>}

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