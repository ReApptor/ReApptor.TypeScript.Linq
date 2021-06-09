import React from "react";
import {IBaseInputProps} from "../BaseInput/BaseInput";

import styles from "./DateRangeInput.module.scss";
import Icon, {IconSize} from "../Icon/Icon";
import {BaseComponent} from "@weare/athenaeum-react-common";
import DateRangeInputLocalizer from "./DateRangeInputLocalizer";

enum WeekDaysEnum {
    Sunday,
    Monday,
    TuesDay,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

interface IDateRangeInputProps extends IBaseInputProps<Date> {
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
        firstClickedGrid: null,
        lastClickedGrid: null
    };

    private get defaultActiveMonthView(): Date {
        if (this.props.value) {
            return this.props.value
        }

        return new Date();
    }

    private get defaultGridDays(): GridDay[] {
        return this.getGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
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
        if (this.state.firstClickedGrid === gridDay) {
            this.state.firstClickedGrid = null;
            this.state.lastClickedGrid = null;
            await this.reRenderAsync();
            return;
        }
        
        if (this.state.lastClickedGrid === gridDay) {
            this.state.firstClickedGrid = null;
            this.state.lastClickedGrid = null;            
            await this.reRenderAsync();
            return;
        }
        
        if (!this.state.firstClickedGrid) {
            this.state.firstClickedGrid = gridDay;
            this.state.lastClickedGrid = null;
            await this.reRenderAsync();
            return; 
        }
        
        if (this.state.firstClickedGrid && !this.state.lastClickedGrid) {
            this.state.lastClickedGrid = gridDay;
            await this.reRenderAsync();
            return;
        }

        this.state.firstClickedGrid = gridDay;
        this.state.lastClickedGrid = null;
        await this.reRenderAsync();
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

    private renderGridDays(gridDay: GridDay): JSX.Element {
        const isSelected = this.isDayGridSelected(gridDay) && styles.isSelected || "";
        
        const isInRange = this.isDayGridInRange(gridDay) && styles.isInRange || "";
        
        const className: string = this.css(styles.monthViewGridDay, isInRange, isSelected);
        
        const onClick: () => void = async () => await this.onDayGridClick(gridDay);
        
        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnter(gridDay);
        
        return <div className={className} onMouseEnter={onMouseEnter} onClick={onClick}>{DateRangeInput.getDayOfUnixTime(gridDay.unixTime)}</div>
    }

    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.dateRangeInput, this.props.className)}>

                <div className={this.css(styles.dateRangeInputMonthView)}>

                    <div className={styles.monthAction}  onClick={() => this.onPreviousMonthClick()}>
                        <Icon name="caret-left" size={IconSize.Large}/>
                    </div>

                    <span className={styles.month}>{new Intl.DateTimeFormat(DateRangeInputLocalizer.language, { month: 'long'}).format(this.activeMonthView)}</span>

                    <div className={styles.monthAction} onClick={() => this.onNextMonthClick()}>
                        <Icon name="caret-right" size={IconSize.Large} />
                    </div>

                    {
                        this.gridDays.map(gridDay => this.renderGridDays(gridDay))
                    }
                </div>
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

    private static getDayOfUnixTime (unixTime: number): number {
        return new Date(unixTime).getDate();
    }
}