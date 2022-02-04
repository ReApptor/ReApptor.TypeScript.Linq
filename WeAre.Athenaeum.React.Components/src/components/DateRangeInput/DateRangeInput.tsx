import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {IGlobalClick} from "@weare/athenaeum-react-common";
import Icon, {IconSize} from "../Icon/Icon";
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import DateRangeInputLocalizer from "./DateRangeInputLocalizer";

import styles from "./DateRangeInput.module.scss";

enum WeekDaysEnum {
    Sunday,
    Monday,
    TuesDay,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

export type DateRangeInputValue = [Date | null, Date | null]; // [StartDate, EndDate]

interface IDateRangeInputProps extends IBaseInputProps<DateRangeInputValue> {
    expanded?: boolean;
    sameDay?: boolean;
    onChange?: (value: DateRangeInputValue) => Promise<void>;
    minDate?: Date;
    maxDate?: Date;
    model: {value: DateRangeInputValue};
}

interface IDateRangeInputState extends IBaseInputState<DateRangeInputValue> {
    activeMonthView: Date;
    lastHoveredDayGrid: DayGridValue | null;
    showDatePicker: boolean;
    absolutePositionTop: number,
}

type DayGridValue = Date;

export class DateRangeInput extends BaseInput<DateRangeInputValue,IDateRangeInputProps, IDateRangeInputState> implements IGlobalClick {
    private readonly _absolutePositionPaddingPx: number = 20;
    private readonly _monthGridLongCount: number = 42;
    private readonly _monthGridCount: number = 35;
    private readonly _weekDaysCount: number = 7;
    private readonly _inputRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _datePickerRef: React.RefObject<HTMLDivElement> = React.createRef();

    state: IDateRangeInputState = {
        readonly: false,
        model: {value: [null, null]},
        edit: true,
        validationError: null,
        //...super.state,
        absolutePositionTop: 0,
        activeMonthView: this.defaultActiveMonthView(),
        lastHoveredDayGrid: null,
        showDatePicker: false
    };

    private get startDate(): Date | null {
        const value = this.state.model.value;

        if (value === null || value === undefined) return null;

        if (!(Array.isArray(value))) return null;

        if (value.length !== 2) return null;

        if (value[0] === null) return null;

        return DateRangeInput.getStartOfDay(value[0]);
    }

    private get endDate(): Date | null {
        const value = this.state.model.value;

        if (value === null || value === undefined) return null;

        if (!(Array.isArray(value))) return null;

        if (value.length !== 2) return null;

        if (value[1] === null) return null;

        return DateRangeInput.getStartOfDay(value[1]);
    }

    private get sameDayAllowed(): boolean {
        return this.props.sameDay ?? false
    }

    private defaultActiveMonthView(): Date {
        if (DateRangeInput.isValidDateRangeInputValue(this.props.value)) {
            return this.startDate ?? DateRangeInput.getStartOfDay(new Date());
        }

        return new Date();
    }

    private get gridDays(): DayGridValue[] {
        const year = this.state.activeMonthView.getFullYear();
        const month = this.state.activeMonthView.getMonth();

        const firstDayOfNextMonth: number = 1;
        const previousMonth: number = month - 1;
        const nextMonth: number = month + 1;

        const currentMonthDayCount: number = DateRangeInput.daysInMonth(year, month);

        const firstDay: Date = new Date(this.state.activeMonthView.setDate(1));

        const firstDayWeekDay: WeekDaysEnum = firstDay.getDay();

        const introDaysCount: number = firstDayWeekDay === WeekDaysEnum.Sunday ? this._weekDaysCount - 1 : firstDayWeekDay - 1;

        const isLongMonth: boolean = (introDaysCount + currentMonthDayCount) > this._monthGridCount;

        const gridCount: number = isLongMonth ? this._monthGridLongCount : this._monthGridCount;

        const outroDaysCount: number = gridCount - introDaysCount - currentMonthDayCount;

        const lastDayOfPreviousMonth: number = DateRangeInput.lastDayInMonth(year, previousMonth);

        const currentMonthGridDays: DayGridValue[] = new Array(currentMonthDayCount).fill(0).map((val: 0, index: number): DayGridValue => {
            const day = index + 1;
            return DateRangeInput.getStartOfDay(new Date(year, month, day));
        });

        const introMonthGridDays: DayGridValue[] = new Array(introDaysCount).fill(0).map((val: 0, index: number): DayGridValue => {
            const day = lastDayOfPreviousMonth - index;
            return DateRangeInput.getStartOfDay(new Date(year, previousMonth, day));
        }).reverse();

        const outroMonthGridDays: DayGridValue[] = new Array(outroDaysCount).fill(0).map((val: 0, index: number): DayGridValue => {
            const day = firstDayOfNextMonth + index;
            return DateRangeInput.getStartOfDay(new Date(year, nextMonth, day));
        });

        return [...introMonthGridDays, ...currentMonthGridDays, ...outroMonthGridDays];
    }

    private get minDate(): Date | null {
        if (!this.props.minDate) return null;

        return DateRangeInput.getStartOfDay(this.props.minDate);
    }

    private get maxDate(): Date | null {
        if (!this.props.maxDate) return null;

        return DateRangeInput.getStartOfDay(this.props.maxDate);
    }

    private async setValueAsync(dateRangeInputValue: DateRangeInputValue) {
        if (!DateRangeInput.isValidDateRangeInputValue(dateRangeInputValue)) {
            return;
        }

        const sortedValue = DateRangeInput.sortDates(dateRangeInputValue);

        await this.updateValueAsync(sortedValue, false);
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        const target: Node = e.target as Node;

        if (!this._inputRef.current || !this._datePickerRef.current) {
            return;
        }

        const isInsideOfDatePicker: boolean = this._inputRef.current.contains(target);
        const isInsideOfInput: boolean = this._datePickerRef.current.contains(target);

        if (isInsideOfDatePicker || isInsideOfInput) {
            return;
        }

        this.setState({
            showDatePicker: false
        });
    }

    private async onDayGridClickAsync(clickedDate: DayGridValue): Promise<void> {
        if (this.isOutOfRange(clickedDate)) {
            return;
        }

        //  No date is selected. set it to start

        if (!this.startDate && !this.endDate) {

            await this.setValueAsync([clickedDate, null]);

            await this.emitOnChange();

            return;
        }

        //  both are selected. reset end and set to start

        if (this.startDate && this.endDate) {

            await this.setValueAsync([clickedDate, null]);

            await this.emitOnChange();

            return;
        }

        //  only start is selected.

        if (this.startDate && !this.endDate) {

            //  sameDayAllowed is enabled and selected is same as start then do It!.

            if (this.sameDayAllowed && DateRangeInput.isSameDate(this.startDate, clickedDate)) {

                await this.setValueAsync([this.startDate, clickedDate]);

                await this.setState(() => ({showDatePicker: false}));

                await this.emitOnChange();

                return;
            }

            //  sameDayAllowed is disabled and selected is same as start then reset both.

            if (DateRangeInput.isSameDate(this.startDate, clickedDate)) {

                await this.setValueAsync([null, null]);

                return;
            }

            //  sameDayAllowed is disabled. clicked date is different than start then set to end

            await this.setValueAsync([this.startDate, clickedDate]);

            await this.emitOnChange();

            await this.setState(() => ({showDatePicker: false}));

            return;
        }

        //  end is selected. set to start. this path should not happen usually.

        await this.setValueAsync([clickedDate, this.endDate]);

        await this.emitOnChange();
    }

    private async onDayGridMouseEnterAsync(dayGridValue: DayGridValue): Promise<void> {
        await this.setState({lastHoveredDayGrid: dayGridValue});
    }

    private async onNextMonthClickAsync(): Promise<void> {
        const nextMonth: Date = this.state.activeMonthView.addMonths(1);
        await this.setState({ activeMonthView: nextMonth });
    }

    private async onPreviousMonthClickAsync(): Promise<void> {
        const prevMonth: Date = this.state.activeMonthView.addMonths(-1);
        await this.setState({ activeMonthView: prevMonth });
    }

    private async emitOnChange(): Promise<void> {
        if (!this.props.onChange) {
            return;
        }

        await this.props.onChange(this.value);
    }

    private isDayGridSelected(dayGridValue: DayGridValue): boolean {
        return DateRangeInput.isSameDate(dayGridValue, this.startDate) || DateRangeInput.isSameDate(dayGridValue, this.endDate);
    }

    private isDayGridInRange(dayGridValue: DayGridValue): boolean {
        if (this.isOutOfRange(dayGridValue)) {
            return false;
        }

        const isSmallerThanHoveredGrid = this.state.lastHoveredDayGrid ? dayGridValue.getTime() < this.state.lastHoveredDayGrid.getTime() : false;

        const isBiggerThanLastHoveredGrid = this.state.lastHoveredDayGrid ? dayGridValue.getTime() > this.state.lastHoveredDayGrid.getTime() : false;

        const isBiggerThanFirstClickedGrid = this.startDate ? dayGridValue.getTime() > this.startDate.getTime() : false;

        const isBiggerThanLastClickedGrid = this.endDate ? dayGridValue.getTime() > this.endDate.getTime() : false;

        const isSmallerThanFirstClickedGrid = this.startDate ? dayGridValue.getTime() < this.startDate.getTime() : false;

        const isSmallerThanLastClickedGrid = this.endDate ? dayGridValue.getTime() < this.endDate.getTime() : false;

        if (this.startDate && this.endDate) {
            return (isBiggerThanFirstClickedGrid && isSmallerThanLastClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastClickedGrid)
        }

        if (this.startDate && !this.endDate) {
            return (isSmallerThanHoveredGrid && isBiggerThanFirstClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastHoveredGrid);
        }

        return false;
    }

    private isOutOfRange(dayGridValue: DayGridValue): boolean {
        if (!this.minDate && !this.maxDate) {
            return false;
        }

        if (this.minDate && this.maxDate) {
            const minDateUnixTime: number = this.minDate.getTime();
            const maxDateUnixTime: number = this.maxDate.getTime();
            const gridValueUnixTime: number = dayGridValue.getTime();

            return (minDateUnixTime > gridValueUnixTime) || (maxDateUnixTime < gridValueUnixTime);
        }

        if (this.minDate) {
            const minDateUnixTime: number = this.minDate.getTime();
            const gridValueUnixTime: number = dayGridValue.getTime();

            return minDateUnixTime > gridValueUnixTime;
        }

        if (this.maxDate) {
            const maxDateUnixTime: number = this.maxDate.getTime();
            const gridValueUnixTime: number = dayGridValue.getTime();

            return maxDateUnixTime > gridValueUnixTime;
        }

        return false;
    }

    private async toggleDatePickerAsync(): Promise<void> {
        if (!this._inputRef.current) {
            return;
        }

        const showDatePicker: boolean = !this.state.showDatePicker;
        const absolutePositionTop: number = this._inputRef.current.getBoundingClientRect().height + this._absolutePositionPaddingPx;

        await this.setState({showDatePicker, absolutePositionTop});
    }

    private renderWeekDays(): JSX.Element[] {
        const weekDays = [
            WeekDaysEnum.Monday,
            WeekDaysEnum.TuesDay,
            WeekDaysEnum.Wednesday,
            WeekDaysEnum.Thursday,
            WeekDaysEnum.Friday,
            WeekDaysEnum.Saturday,
            WeekDaysEnum.Sunday
        ];

        return weekDays.map(weekDay =>
            (
                <div key={weekDay}
                     className={styles.weekDayName}>

                    {Utility.getShortDayOfWeek(weekDay)}

                </div>
            )
        );
    }

    private renderDayGrid(gridDay: DayGridValue): JSX.Element {
        const isOutOfRangeStyle = this.isOutOfRange(gridDay) ? styles.isOutOfRange : "";

        const isSelectedStyle = this.isDayGridSelected(gridDay) && styles.isSelected || "";

        const isTodayStyle = DateRangeInput.todayInUnixTime() === gridDay.getTime() ? styles.isToday : "";

        const isInRangeAndSelectedStyle = (this.startDate && this.endDate) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndSelected : "";

        const isInRangeAndNotSelectedStyle = (this.startDate && !this.endDate) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndNotSelected : "";

        const className: string = this.css(styles.monthViewGridDay, isInRangeAndSelectedStyle, isInRangeAndNotSelectedStyle, isSelectedStyle, isTodayStyle, isOutOfRangeStyle);

        const onClick: () => void = async () => await this.onDayGridClickAsync(gridDay);

        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnterAsync(gridDay);

        return (
            <div key={String(gridDay.getTime())}
                 className={className}
                 onMouseEnter={onMouseEnter}
                 onClick={onClick}>
                    <span>
                        {
                            DateRangeInput.getDayOfMonth(gridDay.getTime())
                        }
                    </span>
            </div>
        );
    }

    public renderDateRangePicker(): React.ReactNode {
        const style = this.props.expanded ? {top: `${this.state.absolutePositionTop}px`} : {};
        const monthName: string = new Intl.DateTimeFormat(DateRangeInputLocalizer.language, {month: "long"}).format(this.state.activeMonthView);
        const year: number = this.state.activeMonthView.getFullYear();
        const expandedStyle = this.props.expanded ? "" : styles.dateRangeInputExpanded;

        return (
            <div ref={this._datePickerRef} className={this.css(styles.dateRangeInput, this.props.className, expandedStyle)} style={style}>

                <span className={styles.monthName}>{monthName} {year}</span>

                <div className={styles.monthAction} onClick={() => this.onPreviousMonthClickAsync()}>
                    <Icon name="chevron-up" size={IconSize.Normal}/>
                </div>

                <div className={styles.monthAction} onClick={() => this.onNextMonthClickAsync()}>
                    <Icon name="chevron-down" size={IconSize.Normal}/>
                </div>

                {this.renderWeekDays()}

                {this.gridDays.map(gridDay => this.renderDayGrid(gridDay))}
            </div>
        );
    }

    public renderInput(): React.ReactNode {
        return (
            <React.Fragment>
                <div ref={this._inputRef}
                     className={this.css("form-control", styles.input)}
                     onClick={() => this.toggleDatePickerAsync()}
                >

                    <span>
                        {this.startDate?.toISODateString() || "-"}
                    </span>

                    <span className={styles.dateSeparator}>
                        -
                    </span>

                    <span>
                        {this.endDate?.toISODateString() || "-"}
                    </span>

                </div>

                {
                    (this.state.showDatePicker) &&
                    (
                        this.renderDateRangePicker()
                    )
                }
                
            </React.Fragment>
        );
    }

    private static daysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    private static lastDayInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    public static getStartOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }

    private static getDayOfMonth(unixTime: number): number {
        return new Date(unixTime).getDate();
    }

    private static isValidDateRangeInputValue(dateRangeInputValue: DateRangeInputValue | null | undefined): dateRangeInputValue is DateRangeInputValue {
        return (!!dateRangeInputValue) && (Array.isArray(dateRangeInputValue)) && (dateRangeInputValue.length === 2);
    }

    private static todayInUnixTime(): number {
        const now = new Date();
        return DateRangeInput.getStartOfDay(now).getTime();
    }

    private static sortDates(value: DateRangeInputValue | undefined): DateRangeInputValue {
        if (!value) {
            return [null, null];
        }

        const [date1, date2] = value;

        if (date1 && date2) {
            const sorter = (a: Date, b: Date) => a.getTime() - b.getTime();
            return [date1, date2].sort(sorter).map(date => DateRangeInput.getStartOfDay(date)) as DateRangeInputValue;
        }

        if (date1) {
            return [DateRangeInput.getStartOfDay(date1), null];
        }

        if (date2) {
            return [DateRangeInput.getStartOfDay(date2), null];
        }

        return [null, null];
    }

    private static isSameDate(d1: Date | null, d2: Date | null): boolean {
        if (!d1 || !d2) {
            return false;
        }

        return DateRangeInput.getStartOfDay(d1).getTime() === DateRangeInput.getStartOfDay(d2).getTime();
    }
}