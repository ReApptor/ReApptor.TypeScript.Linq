import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IChildrenProps, IGlobalClick, PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import Icon, {IconStyle, IIconProps} from "../Icon/Icon";
import ConfirmationDialog, {ConfirmationDialogTitleCallback, IConfirmation} from "../ConfirmationDialog/ConfirmationDialog";

import styles from "./Button.module.scss";
import { IPageHeaderProps } from "../PageContainer/PageHeader/PageHeader";
import ButtonAction, { IButtonActionProps } from "./ButtonAction/ButtonAction";
import ButtonLocalizer from "./ButtonLocalizer";

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

    public static get Action(): (props: IButtonActionProps & IChildrenProps) => React.ReactElement {
        return (props: IPageHeaderProps & IChildrenProps) => <ButtonAction {...props as IButtonActionProps} />;
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
                    {this.props.icon && <Icon {...this.props.icon} tooltip={ButtonLocalizer.get(this.props.title)} />}
                    <span>{this.props.label}</span>

                    {
                        this.hasActions && (
                            <Icon className={this.css(styles.icon, "actions-icon")} name={"fa-caret-down"} style={IconStyle.Solid} />
                        )
                    }

                    {
                        this.hasActions && this.state.isOpen && (
                            <div className={this.css(styles.actions, this.getStyleColor(), "actions-container")}>
                                {this.props.children}
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