import React from 'react';
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import DateRangeInputLocalizer from "./DateRangeInputLocalizer";

import styles from "./DateRangeInput.module.scss";

interface IDateRangeInputProps extends IBaseInputProps<Date> {
    onChange?(date: Date): Promise<void>;
}

interface IDateRangeInputState extends IBaseInputState<Date> {
}

export default class DateRangeInput extends BaseInput<Date, IDateRangeInputProps, IDateRangeInputState> {

    public renderInput(): React.ReactNode {

        return (
            <div className={this.css(styles.dateRangeInput, this.props.className)}>

            </div>
        );
    }
}