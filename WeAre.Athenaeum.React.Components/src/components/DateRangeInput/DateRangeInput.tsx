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

type DateRangeInputValue = [Date, Date]; // [StartDate, EndDate] 

interface IDateRangeInputProps extends IBaseInputProps<DateRangeInputValue>{
    expanded?: boolean;
    sameDay?: boolean;
    onChange?: (value: DateRangeInputValue) => Promise<void>
}

interface IDateRangeInputState extends IBaseInputState<DateRangeInputValue> {}

interface DayGridValue {
    id?: string;
    unixTime: number
}

const WEEK_LENGTH = 7;
const MONTH_GRID = 35;
const LONG_MONTH_GRID = 42;

export default class DateRangeInput extends BaseInput<DateRangeInputValue,IDateRangeInputProps, IDateRangeInputState> implements IGlobalClick{
    private readonly absolutePositionPadding: string = '5px';
    private absolutePositionTop: string = '';
    
    private readonly _inputRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _datePickerRef: React.RefObject<HTMLDivElement> = React.createRef();

    private activeMonthView: Date = this.defaultActiveMonthView;
    private dayGridValues: DayGridValue[] = this.defaultDayGridValues;
    private lastHoveredDayGrid: DayGridValue | null = null;
    private firstClickedDayGrid: DayGridValue | null = this.defaultClickedDayGridValues[0];
    private lastClickedDayGrid: DayGridValue | null = this.defaultClickedDayGridValues[1];
    private showDatePicker: boolean = false;


    private get defaultActiveMonthView(): Date {
        if (DateRangeInput.isValidDateRangeInputValue(this.props.value)) {
            return this.props.value[0];
        }

        return new Date();
    }

    private get defaultDayGridValues(): DayGridValue[] {
        return this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
    }

    private get defaultClickedDayGridValues(): [DayGridValue, DayGridValue] | [null, null] {
        if (!DateRangeInput.isValidDateRangeInputValue(this.props.value)) {
            return [null, null]
        }

        const [start, end] = this.props.value;

        const startDefaultValue = DateRangeInput.startOfDayInUnix(start.getFullYear(), start.getMonth(), start.getDate());
        const endDefaultValue = DateRangeInput.startOfDayInUnix(end.getFullYear(), end.getMonth(), end.getDate());
        return [{unixTime: startDefaultValue}, {unixTime: endDefaultValue}];
    }

    private getGridDays(year: number, month: number): DayGridValue[] {
        const firstDayOfNextMonth: number = 1;
        const previousMonth: number = month - 1;
        const nextMonth: number = month + 1;

        const currentMonthDayCount: number = DateRangeInput.daysInMonth(year, month);
        
        const firstDay: Date = new Date(this.activeMonthView.setDate(1));
        
        const firstDayWeekDay: WeekDaysEnum = firstDay.getDay();
        
        const introDaysCount: number = firstDayWeekDay === WeekDaysEnum.Sunday ? WEEK_LENGTH - 1 : firstDayWeekDay - 1;

        const isLongMonth: boolean = (introDaysCount + currentMonthDayCount) > MONTH_GRID;

        const gridCount: number = isLongMonth ? LONG_MONTH_GRID : MONTH_GRID;
        
        const outroDaysCount: number = gridCount - introDaysCount - currentMonthDayCount;
        
        const lastDayOfPreviousMonth: number = DateRangeInput.lastDayInMonth(year, previousMonth);

        const currentMonthGridDays: DayGridValue[] = new Array(currentMonthDayCount).fill(0).map((val: 0, index: number): DayGridValue => {
            const id = `${this.id}_day_intro_${index}`;
            const day = index + 1;
            return  {
                unixTime: DateRangeInput.startOfDayInUnix(year, month, day),
                id
            }
        });
        
        const introMonthGridDays: DayGridValue[] = new Array(introDaysCount).fill(0).map((val: 0, index: number): DayGridValue => {
            const id = `${this.id}_day_${index}`;
            const day = lastDayOfPreviousMonth - index;
            
            return  {
                unixTime: DateRangeInput.startOfDayInUnix(year, previousMonth, day),
                id
            }
        }).reverse();

        const outroMonthGridDays: DayGridValue[] = new Array(outroDaysCount).fill(0).map((val: 0, index: number): DayGridValue => {
            const id = `${this.id}_day_outro_${index}`;
            const day = firstDayOfNextMonth + index;
            
            return  {
                unixTime: DateRangeInput.startOfDayInUnix(year, nextMonth, day),
                id
            }
        });

        return [...introMonthGridDays, ...currentMonthGridDays, ...outroMonthGridDays];
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
        
        this.showDatePicker = false;
        await this.reRenderAsync();
    }
    
    private async onDayGridClick(dayGridValue: DayGridValue): Promise<void> {

        if (this.firstClickedDayGrid === dayGridValue && !this.lastClickedDayGrid && this.props.sameDay) {
            this.lastClickedDayGrid = dayGridValue;
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }
        
        if (this.firstClickedDayGrid === dayGridValue) {
            
            this.firstClickedDayGrid = null;
            this.lastClickedDayGrid = null;
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }
        
        if (this.lastClickedDayGrid === dayGridValue) {
            this.firstClickedDayGrid = null;
            this.lastClickedDayGrid = null;            
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }
        
        if (!this.firstClickedDayGrid) {
            this.firstClickedDayGrid = dayGridValue;
            this.lastClickedDayGrid = null;
            await this.reRenderAsync();
            await this.emitOutput();
            return; 
        }
        
        if (this.firstClickedDayGrid && !this.lastClickedDayGrid) {
            this.lastClickedDayGrid = dayGridValue;
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }

        this.firstClickedDayGrid = dayGridValue;
        this.lastClickedDayGrid = null;
        await this.reRenderAsync();
        await this.emitOutput();
    }
    
    private async onDayGridMouseEnter(dayGridValue: DayGridValue): Promise<void> {
        this.lastHoveredDayGrid = dayGridValue;
        await this.reRenderAsync();
    }
        
    private async onNextMonthClick(): Promise<void> {
        this.activeMonthView = new Date(this.activeMonthView.setMonth(this.activeMonthView.getMonth() + 1));
        this.dayGridValues = this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
        await this.reRenderAsync();
    }
         
    private async onPreviousMonthClick(): Promise<void> {
        this.activeMonthView = new Date(this.activeMonthView.setMonth(this.activeMonthView.getMonth() - 1));
        this.dayGridValues = this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
        await this.reRenderAsync();
    }

    private get output(): [Date | null, Date | null] {
        if (!this.firstClickedDayGrid || !this.lastClickedDayGrid) {
            return [
                this.firstClickedDayGrid ? new Date(this.firstClickedDayGrid.unixTime) : null, 
                this.lastClickedDayGrid ? new Date(this.lastClickedDayGrid.unixTime) : null, 
            ];
        }        
        
        const start: Date = new Date(this.firstClickedDayGrid.unixTime);
        const end: Date = new Date(this.lastClickedDayGrid.unixTime);

        if (start.getTime() > end.getTime()) {
            return [end, start]
        }

        return [start, end];


    }

    private async emitOutput(): Promise<void> {
        const [start, end] = this.output;
        
        if (!this.props.onChange || !start || !end) {
            return;
        }

        this.showDatePicker = false;
        await this.reRenderAsync();
        await this.props.onChange([start, end]);
        
    }

    private isDayGridSelected(dayGridValue: DayGridValue): boolean {
        return (dayGridValue.unixTime === this.firstClickedDayGrid?.unixTime) || (dayGridValue.unixTime === this.lastClickedDayGrid?.unixTime);
    }
    
    private isDayGridInRange(dayGridValue: DayGridValue): boolean {
        const isSmallerThanHoveredGrid = this.lastHoveredDayGrid ? dayGridValue.unixTime < this.lastHoveredDayGrid.unixTime : false;
        const isBiggerThanLastHoveredGrid = this.lastHoveredDayGrid ? dayGridValue.unixTime > this.lastHoveredDayGrid.unixTime : false;

        const isBiggerThanFirstClickedGrid = this.firstClickedDayGrid ? dayGridValue.unixTime > this.firstClickedDayGrid.unixTime : false;
        const isBiggerThanLastClickedGrid = this.lastClickedDayGrid ? dayGridValue.unixTime > this.lastClickedDayGrid.unixTime : false;

        const isSmallerThanFirstClickedGrid = this.firstClickedDayGrid ? dayGridValue.unixTime < this.firstClickedDayGrid.unixTime : false;
        
        const isSmallerThanLastClickedGrid = this.lastClickedDayGrid ? dayGridValue.unixTime < this.lastClickedDayGrid.unixTime : false;
        
        if (this.firstClickedDayGrid && this.lastClickedDayGrid) {
            return (isBiggerThanFirstClickedGrid && isSmallerThanLastClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastClickedGrid)
        }
        
        if (this.firstClickedDayGrid && !this.lastClickedDayGrid) {
            return (isSmallerThanHoveredGrid && isBiggerThanFirstClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastHoveredGrid);
        }
        
        return  false
    }

    private async toggleDatePicker() {
        if (!this._inputRef.current) {
            return;
        }

        this.showDatePicker = !this.showDatePicker;

        this.absolutePositionTop = `calc(${this._inputRef.current.getBoundingClientRect().height}px + ${this.absolutePositionPadding})`
        
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
        const isSelectedStyle = this.isDayGridSelected(gridDay) && styles.isSelected || "";

        const isTodayStyle = DateRangeInput.todayInUnixTime() === gridDay.unixTime ? styles.isToday : "";
        
        const isInRangeAndSelectedStyle = (this.firstClickedDayGrid && this.lastClickedDayGrid) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndSelected : "";
        
        const isInRangeAndNotSelectedStyle = (this.firstClickedDayGrid && !this.lastClickedDayGrid) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndNotSelected : "";
        
        const className: string = this.css(styles.monthViewGridDay, isInRangeAndSelectedStyle, isInRangeAndNotSelectedStyle, isSelectedStyle, isTodayStyle);
        
        const onClick: () => void = async () => await this.onDayGridClick(gridDay);
        
        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnter(gridDay);

        return (
            <div
                className={className}
                key={String(gridDay.unixTime)}
                onMouseEnter={onMouseEnter}
                onClick={onClick}>
                    <span>
                        {DateRangeInput.getDayOfMonth(gridDay.unixTime)}
                    </span>
            </div>
        );
    }

    public renderDateRangePicker(): React.ReactNode {
        const style = this.props.expanded ? {top: this.absolutePositionTop} : {};
        const monthName: string = new Intl.DateTimeFormat(DateRangeInputLocalizer.language, {month: "long"}).format(this.activeMonthView);
        const year: number = this.activeMonthView.getFullYear();
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

                {this.dayGridValues.map(gridDay => this.renderDayGrid(gridDay))}
            </div>
        );
    }
    
    public renderInput(): React.ReactNode {
        const [start, end] = this.output;
        
        return (
            <React.Fragment>
                <div
                    ref={this._inputRef}
                    className={this.css("form-control", styles.input)}
                    onClick={async () => await this.toggleDatePicker()}>
                    <span>{start?.toISODateString() || "-"}</span>

                    <span className={styles.dateSeparator}>-</span>

                    <span>{end?.toISODateString() || "-"}</span>
                </div>

                {
                    (this.showDatePicker) &&
                    (
                        this.renderDateRangePicker()
                    )
                }
            </React.Fragment>
        );
    }

    private static daysInMonth (year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    private static lastDayInMonth (year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    private static startOfDayInUnix (year: number, month: number, day: number): number {
        return new Date(year, month, day, 0, 0, 0, 0).getTime();
    }

    private static getDayOfMonth (unixTime: number): number {
        return new Date(unixTime).getDate();
    }

    private static isValidDateRangeInputValue (dateRangeInputValue: DateRangeInputValue | undefined): dateRangeInputValue is DateRangeInputValue {
        return !!dateRangeInputValue && Array.isArray(dateRangeInputValue) && dateRangeInputValue.length === 2;
    }

    private static todayInUnixTime(): number {
        const now = new Date();
        return DateRangeInput.startOfDayInUnix(now.getFullYear(), now.getMonth(), now.getDate())
    }
}