import React from 'react';
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import {Utility, TFormat} from "@weare/athenaeum-toolkit";
import {RenderCallback} from "@weare/athenaeum-react-common";
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import DateInputLocalizer from "./DateInputLocalizer";

import formStyles from "../Form/Form.module.scss";
import styles from "./DateInput.module.scss";

import "./BootstrapOverride.scss";

// Locale imports
import fi from "date-fns/locale/fi";
import en from "date-fns/locale/en-GB";
import pl from "date-fns/locale/pl";
import sv from "date-fns/locale/sv";
import nb from "date-fns/locale/nb";
import da from "date-fns/locale/da";

registerLocale("fi", fi);
registerLocale("en", en);
registerLocale("pl", pl);
registerLocale("da", da);
registerLocale("sv", sv);
registerLocale("nb", nb);

setDefaultLocale("fi");

interface IDateInputProps extends IBaseInputProps<Date> {
    forwardedRef?: React.RefObject<any>;
    calendarClassName?: string;
    todayButton?: string;
    expanded?: boolean;
    rentaStyle?: boolean;
    popup?: boolean;
    maxDate?: Date | null;
    minDate?: Date | null;
    showMonthDropdown?: boolean;
    showMonthYearPicker?: boolean;
    showYearDropdown?: boolean;
    showMonthYearDropdown?: boolean;
    shortDate?: boolean;
    small?: boolean;
    readonly?: boolean;
    customInput?: RenderCallback;
    showTime?: boolean;
    showOnlyTime?: boolean;
    onChange?(date: Date): Promise<void>;
    onBlur?(sender: DateInput): Promise<void>;
}

interface IDateInputState extends IBaseInputState<Date> {
}

export default class DateInput extends BaseInput<Date, IDateInputProps, IDateInputState> {

    private get todayButton(): string {
        return this.props.todayButton || "";
    }

    private get calendarClassName(): string {
        const calendarStyle = this.props.rentaStyle ? "renta" : "";
        return this.props.calendarClassName || calendarStyle;
    }

    private async handleChangeAsync(date: Date): Promise<void> {
        await this.updateValueAsync(date);

        if (this.props.clickToEdit) {
            await super.hideEditAsync();
        }

        if (this.props.onChange) {
            await this.props.onChange(this.state.model.value);
        }
    }

    private async handleRawChange(e: React.ChangeEvent) {
        e.preventDefault();
    }

    private get selected(): Date | null {
        return (this.state.model.value != null) ? new Date(this.state.model.value) : null;
    }

    private renderCustomInput(): React.ReactNode {
        return (this.props.customInput) ? this.props.customInput(this) : null;
    }

    protected get format(): TFormat {
        let format: string = (this.props.showMonthYearPicker)
            ? (this.props.shortDate)
                ? "MM.yy"
                : "MM.yyyy"
            : (this.props.shortDate)
                ? "dd.MM.yy"
                : "dd.MM.yyyy";

        if (this.props.showTime) {
            format = "dd.MM.yyyy H:mm";
        }

        if (this.props.showOnlyTime) {
            format = "H:mm";
        }

        return this.props.format || format;
    }

    protected async valueBlurHandlerAsync(): Promise<void> {
        await super.validateAsync();

        if (this.props.onBlur) {
            await this.props.onBlur(this);
        }
    }

    protected async onLabelClick(e: React.MouseEvent): Promise<void> {
        e.preventDefault()
    }

    public async clearAsync(): Promise<void> {
        const model = this.state.model as any;
        model.value = null;
        await this.setState({model});
    }

    public clear(): void {
        // no await needed
        // noinspection JSIgnoredPromiseFromCall
        this.clearAsync();
    }

    public renderValue(): React.ReactNode {
        const strValue: string = this.state.model.value != null ? Utility.toDateString(this.state.model.value) : "";
        return <span className={formStyles.value}>{strValue}</span>
    }

    public async componentDidMount(): Promise<void> {
        //super
        await super.componentDidMount();
        //set input as readonly to avoid auto complete
        this.JQuery(`#${this.getInputId()}`).prop("readonly", true);
    }

    public renderInput(): React.ReactNode {
        const smallStyle: any = (this.props.small) && styles.small;
        const readonlyStyle: any = (this.readonly) && styles.readonly;

        return (
            <div className={this.css(styles.dateInput, smallStyle, readonlyStyle, this.props.className)}>
                <DatePicker id={this.getInputId()}
                            title={DateInputLocalizer.get(this.props.title)}
                            dateFormat={this.format as string}
                            minDate={this.props.minDate}
                            maxDate={this.props.maxDate}
                            selected={this.selected}
                            className="form-control"
                            calendarClassName={this.css("datepicker", this.calendarClassName)}
                            todayButton={this.todayButton}
                            inline={this.props.expanded}
                            withPortal={this.props.popup}
                            showMonthDropdown={this.props.showMonthDropdown}
                            showMonthYearPicker={this.props.showMonthYearPicker}
                            showYearDropdown={this.props.showYearDropdown}
                            showMonthYearDropdown={this.props.showMonthYearDropdown}
                            ref={this.props.forwardedRef}
                            locale={DateInputLocalizer.language}
                            readOnly={this.readonly}
                            customInput={this.renderCustomInput()}
                            showTimeSelect={this.props.showTime}
                            showTimeSelectOnly={this.props.showOnlyTime}
                            onChange={async (date: Date) => await this.handleChangeAsync(date)}
                            onChangeRaw={(e) => this.handleRawChange(e)}
                            onBlur={() => this.valueBlurHandlerAsync()}
                />
            </div>
        );
    }
}