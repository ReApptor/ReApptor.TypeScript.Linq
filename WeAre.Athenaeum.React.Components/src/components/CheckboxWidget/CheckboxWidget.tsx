import BaseCheckboxWidget, { IBaseCheckboxWidgetProps } from "../WidgetContainer/BaseCheckboxWidget";

export interface ICheckboxWidgetProps extends IBaseCheckboxWidgetProps {
    onChange?(sender: CheckboxWidget, checked: boolean): Promise<void>;
}

export default class CheckboxWidget extends BaseCheckboxWidget<ICheckboxWidgetProps> {
    
    public get minimized(): boolean {
        return this.mobile || this.state.minimized;
    }

    protected async onChangeAsync(checked: boolean): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, checked);
        }
    }
};
