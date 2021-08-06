import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";

import Icon, {IconSize} from "../Icon/Icon";
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import DateRangeInputLocalizer from "./DateRangeInputLocalizer";
import styles from "./DateRangeInput.module.scss";
import {IGlobalClick} from "@weare/athenaeum-react-common";

enum WeekDaysEnum {
    Sunday,
    Monday,
    TuesDay,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

type DateRangeInputValue = [Date | null, Date | null]; // [StartDate, EndDate]

interface IDateRangeInputProps extends IBaseInputProps<DateRangeInputValue>{
    expanded?: boolean;
    sameDay?: boolean;
    onChange?: (value: DateRangeInputValue) => Promise<void>
    minDate?: Date;
    maxDate?: Date;
}

interface IDateRangeInputState extends IBaseInputState<DateRangeInputValue> {
    activeMonthView: Date;
    lastHoveredDayGrid: DayGridValue | null;
    firstClickedDayGrid: DayGridValue | null;
    lastClickedDayGrid: DayGridValue | null;
    showDatePicker: boolean;
    absolutePositionTop: number
}

type DayGridValue = Date;

export default class DateRangeInput extends BaseInput<DateRangeInputValue,IDateRangeInputProps, IDateRangeInputState> implements IGlobalClick {
    private readonly _absolutePositionPaddingPx: number = 20;
    private readonly _monthGridLongCount: number = 42;
    private readonly _monthGridCount: number = 35;
    private readonly _weekDaysCount: number = 7;

    private readonly _inputRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _datePickerRef: React.RefObject<HTMLDivElement> = React.createRef();

    state: IDateRangeInputState = {
        readonly: false,
        edit: true,
        validationError: null,
        absolutePositionTop: 0,
        activeMonthView: this.defaultActiveMonthView,
        lastHoveredDayGrid: null,
        firstClickedDayGrid: this.defaultClickedDayGridValues[0],
        lastClickedDayGrid: this.defaultClickedDayGridValues[1],
        showDatePicker: false,
        model: this.props.model ?? {
            value: DateRangeInput.sortDates(this.props.value)
        },
    }


    private get defaultActiveMonthView(): Date {
        if (DateRangeInput.isValidDateRangeInputValue(this.props.value)) {
            return this.props.value[0] ?? new Date();
        }

        return new Date();
    }

    private get defaultClickedDayGridValues(): [DayGridValue | null, DayGridValue | null] {
        if (!DateRangeInput.isValidDateRangeInputValue(this.props.value)) {
            return [null, null]
        }

        const startDate: Date | null = this.props.value[0];
        const endDate: Date | null = this.props.value[1];

        const start: DayGridValue | null = (startDate)
            ? DateRangeInput.getStartOfDay(startDate)
            : null;
        const end: DayGridValue | null = (endDate)
            ? DateRangeInput.getStartOfDay(endDate)
            : null;

        return [start, end];
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

    private get output(): [Date | null, Date | null] {
        if (!this.state.firstClickedDayGrid || !this.state.lastClickedDayGrid) {
            return [
                (this.state.firstClickedDayGrid)
                    ? this.state.firstClickedDayGrid
                    : null,
                (this.state.lastClickedDayGrid)
                    ? this.state.lastClickedDayGrid
                    : null,
            ];
        }

        const start: Date = this.state.firstClickedDayGrid;
        const end: Date = this.state.lastClickedDayGrid;

        if (start.getTime() > end.getTime()) {
            return [end, start]
        }

        return [start, end];
    }

    private get minDate(): Date | null {
        if (!this.props.minDate) return null;

        return DateRangeInput.getStartOfDay(this.props.minDate);
    }

    private get maxDate(): Date | null {
        if (!this.props.maxDate) return null;

        return DateRangeInput.getStartOfDay(this.props.maxDate);
    }

    public set value(dateRangeInputValue: DateRangeInputValue) {
        if (!DateRangeInput.isValidDateRangeInputValue(dateRangeInputValue)) {
            return;
        }

        const sortedValue = DateRangeInput.sortDates(dateRangeInputValue);

        const showDatePicker = !(DateRangeInput.isStartAndEndDatesSelected(dateRangeInputValue));

        this.setState({
            model: {
                value: sortedValue
            },
            showDatePicker
        });
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

    private async onDayGridClick(dayGridValue: DayGridValue): Promise<void> {
        if (this.isOutOfRange(dayGridValue)) {
            return;
        }

        const isBothSelected = !!this.state.firstClickedDayGrid && !!this.state.lastClickedDayGrid;
        const isOneSelected = !!this.state.firstClickedDayGrid || !!this.state.lastClickedDayGrid;

        /**
         * check if both selected then reset end and set to end and close the picker
         *
         * check if start is selected and set to end close the picker
         *
         * check if end is selected and compare and set to first and
         */

        // if (isBothSelected) {
        //     this.setState({
        //         firstClickedDayGrid: dayGridValue,
        //         lastClickedDayGrid: null
        //     });
        //     return;
        // }
        //
        // if (isOneSelected) {
        //
        // }

        if (this.state.firstClickedDayGrid === dayGridValue && !this.state.lastClickedDayGrid && this.props.sameDay) {
            this.setState({
                lastClickedDayGrid: dayGridValue
            });

            await this.emitOutput();
            return;
        }

        if (this.state.firstClickedDayGrid === dayGridValue) {
            this.setState({
                firstClickedDayGrid: null,
                lastClickedDayGrid: null
            });

            await this.emitOutput();
            return;
        }

        if (this.state.lastClickedDayGrid === dayGridValue) {
            this.setState({
                firstClickedDayGrid: null,
                lastClickedDayGrid: null
            });

            await this.emitOutput();
            return;
        }

        if (!this.state.firstClickedDayGrid) {
            this.setState({
                firstClickedDayGrid: dayGridValue,
                lastClickedDayGrid: null
            });

            await this.emitOutput();
            return;
        }

        if (this.state.firstClickedDayGrid && !this.state.lastClickedDayGrid) {
            this.setState({
                lastClickedDayGrid: dayGridValue
            });
            await this.reRenderAsync(); //TODO BUG HERE
            await this.emitOutput();
            return;
        }

        this.setState({
            firstClickedDayGrid: dayGridValue,
            lastClickedDayGrid: null
        });

        await this.reRenderAsync();
        await this.emitOutput();
    }

    private async onDayGridMouseEnter(dayGridValue: DayGridValue): Promise<void> {
        this.setState({
            lastHoveredDayGrid: dayGridValue
        });
    }

    private async onNextMonthClick(): Promise<void> {
        this.setState({
            activeMonthView: new Date(this.state.activeMonthView.setMonth(this.state.activeMonthView.getMonth() + 1))
        });
    }

    private async onPreviousMonthClick(): Promise<void> {
        this.setState({
            activeMonthView: new Date(this.state.activeMonthView.setMonth(this.state.activeMonthView.getMonth() - 1))
        });
    }

    private async emitOutput(): Promise<void> {
        const [start, end] = this.output;

        if ((start) && (end)) {
            console.log('emitOutput closing datePicker')
            this.setState({
                showDatePicker: false
            });
        }

        if (this.props.onChange) {
            await this.props.onChange([start, end]);
        }
    }

    private isDayGridSelected(dayGridValue: DayGridValue): boolean {
        return DateRangeInput.isSameDate(dayGridValue, this.state.firstClickedDayGrid) || DateRangeInput.isSameDate(dayGridValue, this.state.lastClickedDayGrid);
    }

    private isDayGridInRange(dayGridValue: DayGridValue): boolean {
        if (this.isOutOfRange(dayGridValue)) {
            return false;
        }

        const isSmallerThanHoveredGrid = this.state.lastHoveredDayGrid ? dayGridValue.getTime() < this.state.lastHoveredDayGrid.getTime() : false;
        const isBiggerThanLastHoveredGrid = this.state.lastHoveredDayGrid ? dayGridValue.getTime() > this.state.lastHoveredDayGrid.getTime() : false;

        const isBiggerThanFirstClickedGrid = this.state.firstClickedDayGrid ? dayGridValue.getTime() > this.state.firstClickedDayGrid.getTime() : false;
        const isBiggerThanLastClickedGrid = this.state.lastClickedDayGrid ? dayGridValue.getTime() > this.state.lastClickedDayGrid.getTime() : false;

        const isSmallerThanFirstClickedGrid = this.state.firstClickedDayGrid ? dayGridValue.getTime() < this.state.firstClickedDayGrid.getTime() : false;

        const isSmallerThanLastClickedGrid = this.state.lastClickedDayGrid ? dayGridValue.getTime() < this.state.lastClickedDayGrid.getTime() : false;

        if (this.state.firstClickedDayGrid && this.state.lastClickedDayGrid) {
            return (isBiggerThanFirstClickedGrid && isSmallerThanLastClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastClickedGrid)
        }

        if (this.state.firstClickedDayGrid && !this.state.lastClickedDayGrid) {
            return (isSmallerThanHoveredGrid && isBiggerThanFirstClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastHoveredGrid);
        }

        return false;
    }

    private isOutOfRange (dayGridValue: DayGridValue): boolean {
        const minDateUnixTime: number | null = this.minDate ? this.minDate.getTime() : null;
        const maxDateUnixTime: number | null = this.maxDate ? this.maxDate.getTime() : null;

        if (minDateUnixTime && maxDateUnixTime) {
            return (minDateUnixTime > dayGridValue.getTime()) || (maxDateUnixTime < dayGridValue.getTime());
        }

        if (minDateUnixTime) {
            return minDateUnixTime > dayGridValue.getTime();
        }

        if (maxDateUnixTime) {
            return maxDateUnixTime < dayGridValue.getTime();
        }

        return false;
    }

    private async toggleDatePicker() {
        if (!this._inputRef.current) {
            return;
        }

        this.setState({
            showDatePicker: !this.state.showDatePicker,
            absolutePositionTop: this._inputRef.current.getBoundingClientRect().height + this._absolutePositionPaddingPx
        });

        await this.reRenderAsync();
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
                <div
                    key={weekDay}
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

        const isInRangeAndSelectedStyle = (this.state.firstClickedDayGrid && this.state.lastClickedDayGrid) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndSelected : "";

        const isInRangeAndNotSelectedStyle = (this.state.firstClickedDayGrid && !this.state.lastClickedDayGrid) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndNotSelected : "";

        const className: string = this.css(styles.monthViewGridDay, isInRangeAndSelectedStyle, isInRangeAndNotSelectedStyle, isSelectedStyle, isTodayStyle, isOutOfRangeStyle);

        const onClick: () => void = async () => await this.onDayGridClick(gridDay);

        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnter(gridDay);

        return (
            <div
                className={className}
                key={String(gridDay.getTime())}
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

                <div className={styles.monthAction} onClick={() => this.onPreviousMonthClick()}>
                    <Icon name="chevron-up" size={IconSize.Normal}/>
                </div>

                <div className={styles.monthAction} onClick={() => this.onNextMonthClick()}>
                    <Icon name="chevron-down" size={IconSize.Normal}/>
                </div>

                {this.renderWeekDays()}

                {this.gridDays.map(gridDay => this.renderDayGrid(gridDay))}
            </div>
        );
    }

    public renderInput(): React.ReactNode {
        const [start, end] = this.output;

        return (
            <React.Fragment>
                <div ref={this._inputRef}
                     className={this.css("form-control", styles.input)}
                     onClick={async () => await this.toggleDatePicker()}
                >

                    <span>
                        {start?.toISODateString() || "-"}
                    </span>

                    <span className={styles.dateSeparator}>
                        -
                    </span>

                    <span>
                        {end?.toISODateString() || "-"}
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

    private static getStartOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }

    private static getDayOfMonth(unixTime: number): number {
        return new Date(unixTime).getDate();
    }

    private static isValidDateRangeInputValue(dateRangeInputValue: DateRangeInputValue | undefined): dateRangeInputValue is DateRangeInputValue {
        return !!dateRangeInputValue && Array.isArray(dateRangeInputValue) && dateRangeInputValue.length === 2;
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
            return [date1, date2].sort(sorter) as DateRangeInputValue;
        }

        if (date1) {
            return [date1, null];
        }

        if (date2) {
            return [date2, null];
        }

        return [null, null];
    }

    private static isSameDate(d1: Date | null, d2: Date | null): boolean {
        if(!d1 || !d2) return false;

        return d1.getTime() === d2.getTime();
    }

    private static isStartAndEndDatesSelected(value: DateRangeInputValue): value is [Date, Date] {
        if (!DateRangeInput.isValidDateRangeInputValue(value)) {
            return false;
        }

        const [d1, d2] = value;

        if (!d1 || !d2) {
            return false;
        }

        return true;
    }
}