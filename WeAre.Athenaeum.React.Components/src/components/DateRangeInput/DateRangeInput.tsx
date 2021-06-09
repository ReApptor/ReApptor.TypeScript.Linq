import React from "react";

import styles from "./DateRangeInput.module.scss";
import Icon, {IconSize} from "../Icon/Icon";
import {BaseComponent} from "@weare/athenaeum-react-common";
import DateRangeInputLocalizer from "./DateRangeInputLocalizer";
import {Utility} from "@weare/athenaeum-toolkit";

enum WeekDaysEnum {
    Sunday,
    Monday,
    TuesDay,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

interface IDateRangeInputProps {
    className?: string;
    sameDay?: boolean;
    startValue?: Date;
    endValue?: Date;
    onValueChange?: (start: Date, end: Date) => Promise<void>
}

interface IDateRangeInputState {
    lastHoveredGrid: GridDay | null;
    firstClickedGrid: GridDay | null;
    lastClickedGrid: GridDay | null;
}

interface GridDay {
    unixTime: number
}

const WEEK_LENGTH = 7;
const MONTH_GRID = 35;
const LONG_MONTH_GRID = 42;

export default class DateRangeInput extends BaseComponent<IDateRangeInputProps, IDateRangeInputState> {
    private activeMonthView: Date = this.defaultActiveMonthView;
    private gridDays: GridDay[] = this.defaultGridDays;

    state: IDateRangeInputState = {
        lastHoveredGrid: null,
        firstClickedGrid: this.defaultFirstClicked,
        lastClickedGrid: this.defaultEndClicked
    };

    private get defaultActiveMonthView(): Date {
        if (this.props.startValue) {
            return this.props.startValue
        }

        return new Date();
    }

    private get defaultGridDays(): GridDay[] {
        return this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
    }

    private get defaultFirstClicked(): GridDay | null {
        if (!this.props.startValue) {
            return null
        }

        return {
            unixTime: DateRangeInput.startOfDayInUnix(this.props.startValue.getFullYear(), this.props.startValue.getMonth(), this.props.startValue.getDate())
        }
    }

    private get defaultEndClicked(): GridDay | null {
        if (!this.props.endValue) {
            return null
        }
        
        return {
            unixTime: DateRangeInput.startOfDayInUnix(this.props.endValue.getFullYear(), this.props.endValue.getMonth(), this.props.endValue.getDate())
        }
    }

    private getGridDays(year: number, month: number): GridDay[] {
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

        const currentMonthGridDays: GridDay[] = new Array(currentMonthDayCount).fill(0).map((val: 0, index: number): GridDay => {
            const day = index + 1;
            return  {
                unixTime: DateRangeInput.startOfDayInUnix(year, month, day)
            }
        });
        
        const introMonthGridDays: GridDay[] = new Array(introDaysCount).fill(0).map((val: 0, index: number): GridDay => {
            const day = lastDayOfPreviousMonth - index;
            
            return  {
                unixTime: DateRangeInput.startOfDayInUnix(year, previousMonth, day)

            }
        }).reverse();

        const outroMonthGridDays: GridDay[] = new Array(outroDaysCount).fill(0).map((val: 0, index: number): GridDay => {
            const day = firstDayOfNextMonth + index;
            
            return  {
                unixTime: DateRangeInput.startOfDayInUnix(year, nextMonth, day)
            }
        });

        return [...introMonthGridDays, ...currentMonthGridDays, ...outroMonthGridDays];
    }

    private async onDayGridClick(gridDay: GridDay): Promise<void> {

        if (this.state.firstClickedGrid === gridDay && !this.state.lastClickedGrid && this.props.sameDay) {
            this.state.lastClickedGrid = gridDay;
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }
        
        if (this.state.firstClickedGrid === gridDay) {
            
            this.state.firstClickedGrid = null;
            this.state.lastClickedGrid = null;
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }
        
        if (this.state.lastClickedGrid === gridDay) {
            this.state.firstClickedGrid = null;
            this.state.lastClickedGrid = null;            
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }
        
        if (!this.state.firstClickedGrid) {
            this.state.firstClickedGrid = gridDay;
            this.state.lastClickedGrid = null;
            await this.reRenderAsync();
            await this.emitOutput();
            return; 
        }
        
        if (this.state.firstClickedGrid && !this.state.lastClickedGrid) {
            this.state.lastClickedGrid = gridDay;
            await this.reRenderAsync();
            await this.emitOutput();
            return;
        }

        this.state.firstClickedGrid = gridDay;
        this.state.lastClickedGrid = null;
        await this.reRenderAsync();
        await this.emitOutput();
    }
    
    private async onDayGridMouseEnter(gridDay: GridDay): Promise<void> {
        this.state.lastHoveredGrid = gridDay;
        await this.reRenderAsync();
    }
        
    private async onNextMonthClick(): Promise<void> {
        this.activeMonthView = new Date(this.activeMonthView.setMonth(this.activeMonthView.getMonth() + 1));
        this.gridDays = this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
        await this.reRenderAsync();
    }
         
    private async onPreviousMonthClick(): Promise<void> {
        this.activeMonthView = new Date(this.activeMonthView.setMonth(this.activeMonthView.getMonth() - 1));
        this.gridDays = this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
        await this.reRenderAsync();
    }

    private async emitOutput(): Promise<void> {
        if (!this.props.onValueChange || !this.state.firstClickedGrid || !this.state.lastClickedGrid) {
            return;
        }
        
        const start: Date = new Date(this.state.firstClickedGrid.unixTime);
        const end: Date = new Date(this.state.lastClickedGrid.unixTime);

        if (start.getTime() > end.getTime()) {
            await this.props.onValueChange(end, start);
            return;
        }
        
        await this.props.onValueChange(start, end);
    }

    private isDayGridSelected(gridDay: GridDay): boolean {
        return (gridDay.unixTime === this.state.firstClickedGrid?.unixTime) || (gridDay.unixTime === this.state.lastClickedGrid?.unixTime);
    }
    
    private isDayGridInRange(gridDay: GridDay): boolean {
        const isSmallerThanHoveredGrid = this.state.lastHoveredGrid ? gridDay.unixTime < this.state.lastHoveredGrid.unixTime : false;
        const isBiggerThanLastHoveredGrid = this.state.lastHoveredGrid ? gridDay.unixTime > this.state.lastHoveredGrid.unixTime : false;

        const isBiggerThanFirstClickedGrid = this.state.firstClickedGrid ? gridDay.unixTime > this.state.firstClickedGrid.unixTime : false;
        const isBiggerThanLastClickedGrid = this.state.lastClickedGrid ? gridDay.unixTime > this.state.lastClickedGrid.unixTime : false;

        const isSmallerThanFirstClickedGrid = this.state.firstClickedGrid ? gridDay.unixTime < this.state.firstClickedGrid.unixTime : false;
        
        const isSmallerThanLastClickedGrid = this.state.lastClickedGrid ? gridDay.unixTime < this.state.lastClickedGrid.unixTime : false;
        

        if (this.state.firstClickedGrid && this.state.lastClickedGrid) {
            return (isBiggerThanFirstClickedGrid && isSmallerThanLastClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastClickedGrid)
        }
        
        if (this.state.firstClickedGrid && !this.state.lastClickedGrid) {
            return (isSmallerThanHoveredGrid && isBiggerThanFirstClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastHoveredGrid);
        }
        
        return  false
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
        
        return weekDays.map(weekDay => <div className={styles.weekDayName}>{Utility.getShortDayOfWeek(weekDay)}</div>)
    }
    
    private renderGridDays(gridDay: GridDay): JSX.Element {
        const isSelected = this.isDayGridSelected(gridDay) && styles.isSelected || "";

        const isToday = DateRangeInput.todayInUnixTime() === gridDay.unixTime ? styles.isToday : "";
        
        const isInRangeAndSelected = (this.state.firstClickedGrid && this.state.lastClickedGrid) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndSelected : "";
        
        const isInRangeAndNotSelected = (this.state.firstClickedGrid && !this.state.lastClickedGrid) && this.isDayGridInRange(gridDay) ? styles.isInRangeAndNotSelected : "";
        
        const className: string = this.css(styles.monthViewGridDay, isInRangeAndSelected, isInRangeAndNotSelected, isSelected, isToday);
        
        const onClick: () => void = async () => await this.onDayGridClick(gridDay);
        
        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnter(gridDay);
        
        return <div className={className} onMouseEnter={onMouseEnter} onClick={onClick}><span>{DateRangeInput.getDayOfMonth(gridDay.unixTime)}</span></div>
    }

    public render(): React.ReactNode {
        const monthName: string = new Intl.DateTimeFormat(DateRangeInputLocalizer.language, {month: 'long'}).format(this.activeMonthView);
        const year: number = this.activeMonthView.getFullYear();
        
        return (
            <div className={this.css(styles.dateRangeInput, this.props.className)}>

                <span className={styles.monthName}>{monthName} {year}</span>

                <div className={styles.monthAction} onClick={() => this.onPreviousMonthClick()}>
                    <Icon name="chevron-up" size={IconSize.Normal}/>
                </div>


                <div className={styles.monthAction} onClick={() => this.onNextMonthClick()}>
                    <Icon name="chevron-down" size={IconSize.Normal}/>
                </div>

                {
                    this.renderWeekDays()
                }

                {
                    this.gridDays.map(gridDay => this.renderGridDays(gridDay))
                }
            </div>
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

    private static todayInUnixTime(): number {
        const now = new Date();
        return DateRangeInput.startOfDayInUnix(now.getFullYear(), now.getMonth(), now.getDate())
    }
}