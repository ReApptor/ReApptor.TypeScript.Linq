import React from "react";
import {IBaseInputProps} from "../BaseInput/BaseInput";

import styles from "./DateRangeInput.module.scss";
import Icon, {IconSize} from "../Icon/Icon";
import {BaseComponent} from "@weare/athenaeum-react-common";

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
    lastHoveredGridId: string | null;
    firstClickedGridId: string | null;
    lastClickedGridId: string | null;
    gridDayIds: string[];
    gridDayValues: number[];
    gridDays: GridDay[];
}

interface GridDay {
    id: string,
    year: number,
    month: number,
    day: number
}

const GRID_MONTH_VIEW_DAYS = 35;
const WEEK_LENGTH = 7;

export default class DateRangeInput extends BaseComponent<IDateRangeInputProps, IDateRangeInputState> {
    private now: Date = new Date();
    
    state: IDateRangeInputState = {
        lastHoveredGridId: null,
        firstClickedGridId: null,
        lastClickedGridId: null,
        gridDayIds: new Array(GRID_MONTH_VIEW_DAYS).fill(0).map((value, index) => this.getDayGridId(index)),
        gridDayValues: [],
        gridDays: []
    };
    
    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
    }

    async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        this.monthViewDays(this.now.getFullYear(), this.now.getMonth());
    }

    private monthViewDays(year: number, month: number): number[] {
        const previousMonth = month - 1;
        
        const currentMonthDayCount: number = DateRangeInput.daysInMonth(year, month);
        
        const firstDay: Date = new Date(this.now.setDate(1));
        
        const firstDayWeekDay: WeekDaysEnum = firstDay.getDay();
        
        const introDaysCount: number = firstDayWeekDay === WeekDaysEnum.Sunday ? WEEK_LENGTH - 1 : firstDayWeekDay - 1;
        
        const outroDaysCount: number = GRID_MONTH_VIEW_DAYS - introDaysCount - currentMonthDayCount;
        
        const lastDayOfPreviousMonth: number = DateRangeInput.lastDayInMonth(year, previousMonth);
        
        const firstDayOfNextMonth: number = 1;
        
        const currentMonthDays: number[] = new Array(currentMonthDayCount).fill(0).map((val: 0, index: number): number => index + 1);
        
        const introDays: number[] = new Array(introDaysCount).fill(0).map((val: 0, index: number): number => lastDayOfPreviousMonth - index).reverse();
        
        const outroDays: number[] = new Array(outroDaysCount).fill(0).map((val: 0, index: number): number => firstDayOfNextMonth + index);

        const monthViewCalendar: number[] = [...introDays, ...currentMonthDays, ...outroDays];

        this.state.gridDayValues = [...monthViewCalendar];

        console.log({
            year,
            month,
            firstDay,
            firstDayWeekDay,
            currentMonthDayCount,
            introDaysCount,
            outroDaysCount,
            lastDayOfPreviousMonth,
            firstDayOfNextMonth,
            outroDays,
            introDays,
            currentMonthDays,
            monthViewCalendar
        });
        
        return monthViewCalendar;
    }

    private static daysInMonth (year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }
    
    private static lastDayInMonth (year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    private getDayGridId(index: number): string {
        return `${this.id}_day_${index}`;
    }
  
    private getDayGridValue(id: string): string | number {
        const index = this.state.gridDayIds.indexOf(id);
        return this.state.gridDayValues[index];
    }

    private async onDayGridClick(id: string): Promise<void> {
        if (this.state.firstClickedGridId === id) {
            this.state.firstClickedGridId = null;
            this.state.lastClickedGridId = null;
            await this.reRenderAsync();
            return;
        }
        
        if (this.state.lastClickedGridId === id) {
            this.state.firstClickedGridId = null;
            this.state.lastClickedGridId = null;            
            await this.reRenderAsync();
            return;
        }
        
        if (!this.state.firstClickedGridId) {
            this.state.firstClickedGridId = id;
            this.state.lastClickedGridId = null;
            await this.reRenderAsync();
            return; 
        }
        
        if (this.state.firstClickedGridId && !this.state.lastClickedGridId) {
            this.state.lastClickedGridId = id;
            await this.reRenderAsync();
            return;
        }

        this.state.firstClickedGridId = id;
        this.state.lastClickedGridId = null;
        await this.reRenderAsync();
    }
    
    private async onDayGridMouseEnter(id: string): Promise<void> {
        this.state.lastHoveredGridId = id;
        
        await this.reRenderAsync();
    }

    private isDayGridSelected(dayGridId: string): boolean {

        const currentGridIndex = this.state.gridDayIds.indexOf(dayGridId);
        const firstClickedGridIndex = this.state.gridDayIds.indexOf(this.state.firstClickedGridId || "-1");
        const lastClickedGridIndex = this.state.gridDayIds.indexOf(this.state.lastClickedGridId || "-1");

        if (firstClickedGridIndex !== -1 && currentGridIndex === firstClickedGridIndex) {
            return true;
        }
        
        if (lastClickedGridIndex !== -1 && currentGridIndex === lastClickedGridIndex) {
            return true;
        }
        
        return  false
    }
    
    private isDayGridInRange(dayGridId: string): boolean {
        
        const currentGridIndex: number = this.state.gridDayIds.indexOf(dayGridId);
        const lastHoveredGridIndex: number = this.state.gridDayIds.indexOf(this.state.lastHoveredGridId || "-1");
        const firstClickedGridIndex: number = this.state.gridDayIds.indexOf(this.state.firstClickedGridId || "-1");
        const lastClickedGridIndex: number = this.state.gridDayIds.indexOf(this.state.lastClickedGridId || "-1");
        
        if (this.state.lastHoveredGridId && lastHoveredGridIndex === -1) {
            this.state.lastHoveredGridId = null;
            throw new Error("Unknown Clicked cell");
        }
        
        if (this.state.firstClickedGridId && firstClickedGridIndex === -1) {
            this.state.firstClickedGridId = null;
            throw new Error("Unknown Clicked cell");
        }  
        
        if (this.state.lastClickedGridId && lastClickedGridIndex === -1) {
            this.state.lastClickedGridId = null;
            throw new Error("Unknown Clicked cell");
        }

        const isSmallerThanHoveredGrid = currentGridIndex < lastHoveredGridIndex;
        const isBiggerThanLastHoveredGrid = currentGridIndex > lastHoveredGridIndex;

        const isBiggerThanFirstClickedGrid = currentGridIndex > firstClickedGridIndex;
        const isBiggerThanLastClickedGrid = currentGridIndex > lastClickedGridIndex;

        const isSmallerThanFirstClickedGrid = currentGridIndex < firstClickedGridIndex;
        const isSmallerThanLastClickedGrid = currentGridIndex < lastClickedGridIndex;

        if (firstClickedGridIndex !== -1 && lastClickedGridIndex !== -1) {
            return (isBiggerThanFirstClickedGrid && isSmallerThanLastClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastClickedGrid)
        }
        
        if (firstClickedGridIndex !== -1 && lastClickedGridIndex === -1) {
            return (isSmallerThanHoveredGrid && isBiggerThanFirstClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastHoveredGrid);
        }
        
        return  false
    }

    private renderGridDayById(id: string): JSX.Element {
        const isSelected = this.isDayGridSelected(id) && styles.isSelected || "";
        const isInRange = this.isDayGridInRange(id) && styles.isInRange || "";
        const className: string = this.css(styles.monthViewGridDay, isInRange, isSelected);
        const onClick: () => void = async () => await this.onDayGridClick(id);
        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnter(id);
        
        return <div id={id} className={className} onMouseEnter={onMouseEnter} onClick={onClick}>{this.getDayGridValue(id)}</div>
    }
    
    
    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.dateRangeInput, this.props.className)}>
                <div className={styles.topControlPanel}>
                    
                    <Icon name="caret-left" size={IconSize.Large}/>
                    
                    <span>Current month</span>
                    
                    <Icon name="caret-right" size={IconSize.Large}/>
                    
                </div>
                
                <div className={this.css(styles.dateRangeInputMonthView)}>
                    {
                        this.state.gridDayIds.map(gridDayId => this.renderGridDayById(gridDayId))
                    }
                </div>
            </div>
        );
    }
}