import React from "react";
import BaseWidget, { IBaseWidgetProps } from "./BaseWidget";
import { IIconProps, IconSize, IconStyle } from "../Icon/Icon";

export interface IBaseCheckboxWidgetProps extends IBaseWidgetProps {
    checked?: boolean;
}

export default abstract class BaseCheckboxWidget<TProps extends IBaseCheckboxWidgetProps> extends BaseWidget<TProps, boolean> {

    protected async onChangeAsync(checked: boolean): Promise<void> {
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        let checked: boolean = !this.checked;

        let state = this.state;
        state.data = checked;

        if (this.isMounted) {
            e.stopPropagation();

            await this.onChangeAsync(checked);

            await this.setState(state);
        }
    }

    protected get icon(): IIconProps | null {
        const icon: IIconProps = (this.checked)
            ? { name: "check-circle", style: IconStyle.Solid }
            : { name: "circle", style: IconStyle.Regular };
        icon.size = (this.minimized) ? IconSize.X2 : IconSize.X3;
        return icon;
    }

    public async componentWillReceiveProps(nextProps: Readonly<TProps>): Promise<void> {
        if (nextProps.checked !== this.props.checked) {
            this.state.data = (nextProps.checked === true)
        }
        
        await super.componentWillReceiveProps(nextProps);
    }

    public async initializeAsync(): Promise<void> {
        let state = this.state;
        state.data = (this.props.checked) ? (this.props.checked as boolean) : false;
    }

    public get checked(): boolean {
        return (this.state.data === true);
    }

    public isWidget(): boolean { return true; }

    public hasSpinner(): boolean { return true; }
};