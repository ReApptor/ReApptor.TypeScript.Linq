import React from "react";
import ConfirmationDialog, { ConfirmationDialogTitleCallback, IConfirmation } from "../ConfirmationDialog/ConfirmationDialog";
import {BaseComponent} from "@weare/athenaeum-react-common";
import IconLocalizer from "./IconLocalizer";
import IconAction, {IIconActionProps} from "./IconAction.tsx/IconAction";
import styles from "./Icon.module.scss";
import {Utility} from "@weare/athenaeum-toolkit";

export enum IconSize {
    Normal,

    ExtraSmall,

    Small,

    Large,
    
    X2,
    
    X3,
    
    X4,
    
    X5,
    
    X7,
    
    X10
}

export enum IconStyle {
    Solid,

    Regular,

    Light,

    Brands,

    Duotone
}

export interface IIconProps {
    id?: string;
    name: string;
    tooltip?: string;
    style?: IconStyle;
    size?: IconSize;
    className?: string;
    dataTarget?: string;
    dataModal?: string;
    toggleModal?: boolean;
    dismissModal?: boolean;
    customStyle?: React.CSSProperties;
    disabled?: boolean;
    confirm?: string | IConfirmation | ConfirmationDialogTitleCallback;
    onClick?(sender: Icon): Promise<void>;
}

interface IIconState {
    isOpen: boolean;
}

export default class Icon extends BaseComponent<IIconProps, IIconState> {

    state: IIconState = {
        isOpen: false
    }
    
    private readonly _confirmDialogRef: React.RefObject<ConfirmationDialog> = React.createRef();
    private _forcedWidth: number | null = null;
    private _actionLoading: boolean = false;
    private _actionProps: IIconActionProps | null = null;

    public static get Action(): typeof IconAction {
        return IconAction;
    }
    
    private static add(lowerClassName: string, className: string, style: string, asPrefix: boolean = false): string {
        const includes: boolean = (asPrefix)
            ? lowerClassName.startsWith(style + " ")
            : lowerClassName.includes(style);
        if (!includes) {
            className += " " + style;
        }
        return className;
    }

    async componentDidMount(): Promise<void> {
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

            this.reRenderAsync();
        }
    }

    private get actionsId(): string {
        return `${this.id}_actions`;
    }

    private async closeActions(): Promise<void> {
        await this.setState({isOpen: false});
    }

    public async onGlobalClick(e: React.MouseEvent): Promise<void> {
        const target = e.target as Node;

        const outside: boolean = Utility.clickedOutside(target, this.id);

        if (outside && this.state.isOpen) {
            await this.closeActions();
        }
    }

    private static addSize(lowerClassName: string, className: string, size?: IconSize): string {
        if (size != null) {
            switch (size) {
                case IconSize.ExtraSmall:
                    className = Icon.add(lowerClassName, className, "fa-xs");
                    break;
                case IconSize.Small:
                    className = Icon.add(lowerClassName, className, "fa-sm");
                    break;
                case IconSize.Large:
                    className = Icon.add(lowerClassName, className, "fa-lg");
                    break;
                case IconSize.X2:
                    className = Icon.add(lowerClassName, className, "fa-2x");
                    break;
                case IconSize.X3:
                    className = Icon.add(lowerClassName, className, "fa-3x");
                    break;
                case IconSize.X4:
                    className = Icon.add(lowerClassName, className, "fa-4x");
                    break;
                case IconSize.X5:
                    className = Icon.add(lowerClassName, className, "fa-5x");
                    break;
                case IconSize.X7:
                    className = Icon.add(lowerClassName, className, "fa-7x");
                    break;
                case IconSize.X10:
                    className = Icon.add(lowerClassName, className, "fa-10x");
                    break;
                }
        }

        return className;
    }

    private static addStyle(lowerClassName: string, className: string, style?: IconStyle): string {
        if (style != null) {
            switch (style) {
                case IconStyle.Solid:
                    return Icon.add(lowerClassName, className, "fas");
                case IconStyle.Regular:
                    return Icon.add(lowerClassName, className, "far");
                case IconStyle.Light:
                    return Icon.add(lowerClassName, className, "fal");
                case IconStyle.Brands:
                    return Icon.add(lowerClassName, className, "fab");
                case IconStyle.Duotone:
                    return Icon.add(lowerClassName, className, "fad");
            }
        }

        return Icon.add(lowerClassName, className, "fa", true);
    }

    private static getClassStyle(lowerName: string): IconStyle | undefined {
        let classStyle: IconStyle | undefined = undefined;
        if (lowerName.startsWith("fas ")) {
            classStyle = IconStyle.Solid;
        } else if (lowerName.startsWith("far ")) {
            classStyle = IconStyle.Regular;
        } else if (lowerName.startsWith("fal ")) {
            classStyle = IconStyle.Light;
        } else if (lowerName.startsWith("fab ")) {
            classStyle = IconStyle.Brands;
        } else if (lowerName.startsWith("fad ")) {
            classStyle = IconStyle.Duotone;
        }
        return classStyle;
    }

    // overriding children's onClick 
    protected extendChildProps(element: React.ReactElement): any | null {
        return {
            onClick: async () => {
                await this.onActionClickAsync(element.props);
            }
        }
    }

    private async onActionClickAsync(actionProps: IIconActionProps): Promise<void> {
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

    private getClassName(): string {

        let name = this.props.name;
        let className: string = this.props.className || "";
        const lowerClassName: string = className.toLowerCase();
        const lowerName: string = name.toLowerCase();
        const classStyle: IconStyle | undefined = Icon.getClassStyle(lowerName);

        if (classStyle != null) {
            name = name.substr(4);
        }
        
        if ((!lowerName.startsWith("fa-")) && (!lowerName.includes(" fa-"))) {
            className += " fa-";
        } else {
            className += " ";
        }
        
        className += name;

        className = Icon.addSize(lowerClassName, className, this.props.size);

        className = Icon.addStyle(lowerClassName, className, this.props.style || classStyle);

        className = className.trim();

        return className;
    }
    
    private get disabledStyle(): React.CSSProperties {
        return {
            opacity: 0.5,
            pointerEvents: "none"
        }
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

    private async toggleActions(): Promise<void> {
        await this.setState({isOpen: !this.state.isOpen});
    }

    private get showActions(): boolean {
        return this.hasActions && this.state.isOpen;
    }

    private async onClickAsync(confirmed: boolean): Promise<void> {
        
        if (this.hasActions) {
            return await this.toggleActions();
        }
        
        const confirmNeeded: boolean = (!!this.props.confirm) && (!confirmed);
        if (confirmNeeded) {
            await this._confirmDialogRef.current!.openAsync();
        } else  {
            if (this.props.onClick) {
                await this.props.onClick(this);
            }
        }
    }

    public static isIconName(name: string): boolean {
        const lowerName: string = name.toLowerCase().trim();
        return (
            (lowerName.startsWith("fa-")) ||
            (lowerName.includes(" fa-")) ||
            (Icon.getClassStyle(lowerName) != null)
        );
    }
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <i id={this.id}
                   style={this.props.customStyle ? this.props.customStyle : (this.props.disabled) ? this.disabledStyle : (this.hasActions) ? {position:"relative"} : {}}
                   className={this.getClassName()}
                   title={IconLocalizer.get(this.props.tooltip)}
                   data-target={`#${this.dataTarget}`}
                   data-toggle={this.dataToggleModal}
                   data-dismiss={this.dataDismissModal}
                   data-modal={this.dataModal}
                   onClick={async (e: React.MouseEvent) => await this.onClickAsync(false)}
                >
                    {this.children.length > 0 && <div id={this.actionsId} className={this.css(styles.actions, styles.color_grey,  "actions-container", !this.showActions && "invisible")}> {this.children}</div>}

                </i>
                {
                    (this.props.confirm) &&
                    (
                        <ConfirmationDialog ref={this._confirmDialogRef}
                                            title={this.props.confirm}
                                            callback={(caller) => this.onClickAsync(true)}
                        />
                    )
                }
            </React.Fragment>
        );
    }
}