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

}

interface GridDay {
    year: number,
    month: number,
    day: number
}

const GRID_MONTH_VIEW_DAYS = 35;
const WEEK_LENGTH = 7;

export default class DateRangeInput extends BaseComponent<IDateRangeInputProps, IDateRangeInputState> {
    private activeMonthView: Date = this.defaultActiveMonthView;
    private gridDayIds: string[] = this.defaultGridDayIds;
    private gridDays: GridDay[] = this.defaultGridDays;
    
    state: IDateRangeInputState = {
        lastHoveredGridId: null,
        firstClickedGridId: null,
        lastClickedGridId: null
    };

    get defaultActiveMonthView(): Date {
        if (this.props.value) {
            return this.props.value
        }

        return new Date();
    }
    
    get defaultGridDayIds(): string[] {
        return new Array(GRID_MONTH_VIEW_DAYS).fill(0).map((value, index: number) => this.getDayGridId(index));
    }

    get defaultGridDays(): GridDay[] {
        return this.monthGridDays(this.activeMonthView.getFullYear(), this.activeMonthView.getMonth());
    }

    private getDayGridId(index: number): string {
        return `${this.id}_day_${index}`;
    }

    private monthGridDays(year: number, month: number): GridDay[] {
        const firstDayOfNextMonth: number = 1;
        const previousMonth: number = month - 1;
        const nextMonth: number = month + 1;

        const currentMonthDayCount: number = DateRangeInput.daysInMonth(year, month);
        
        const firstDay: Date = new Date(this.activeMonthView.setDate(1));
        
        const firstDayWeekDay: WeekDaysEnum = firstDay.getDay();
        
        const introDaysCount: number = firstDayWeekDay === WeekDaysEnum.Sunday ? WEEK_LENGTH - 1 : firstDayWeekDay - 1;
        
        const outroDaysCount: number = GRID_MONTH_VIEW_DAYS - introDaysCount - currentMonthDayCount;
        
        const lastDayOfPreviousMonth: number = DateRangeInput.lastDayInMonth(year, previousMonth);
        
        const currentMonthGridDays: GridDay[] = new Array(currentMonthDayCount).fill(0).map((val: 0, index: number): GridDay => {
            return  {
                day: index + 1,
                month,
                year
            }
        });
        
        const introMonthGridDays: GridDay[] = new Array(introDaysCount).fill(0).map((val: 0, index: number): GridDay => {
            return  {
                day: lastDayOfPreviousMonth - index,
                month: previousMonth,
                year
            }
        }).reverse();  
        
        const outroMonthGridDays: GridDay[] = new Array(outroDaysCount).fill(0).map((val: 0, index: number): GridDay => {
            return  {
                day: firstDayOfNextMonth + index,
                month: nextMonth,
                year
            }
        });

        return [...introMonthGridDays, ...currentMonthGridDays, ...outroMonthGridDays];
    }


  
    private getDayGridValue(id: string): string | number {
        const index = this.gridDayIds.indexOf(id);
        return this.gridDays[index]?.day;
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

        const currentGridIndex = this.gridDayIds.indexOf(dayGridId);
        const firstClickedGridIndex = this.gridDayIds.indexOf(this.state.firstClickedGridId || "-1");
        const lastClickedGridIndex = this.gridDayIds.indexOf(this.state.lastClickedGridId || "-1");

        if (firstClickedGridIndex !== -1 && currentGridIndex === firstClickedGridIndex) {
            return true;
        }
        
        if (lastClickedGridIndex !== -1 && currentGridIndex === lastClickedGridIndex) {
            return true;
        }
        
        return  false
    }
    
    private isDayGridInRange(dayGridId: string): boolean {
        
        const currentGridIndex: number = this.gridDayIds.indexOf(dayGridId);
        const lastHoveredGridIndex: number = this.gridDayIds.indexOf(this.state.lastHoveredGridId || "-1");
        const firstClickedGridIndex: number = this.gridDayIds.indexOf(this.state.firstClickedGridId || "-1");
        const lastClickedGridIndex: number = this.gridDayIds.indexOf(this.state.lastClickedGridId || "-1");
        
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
                        this.gridDayIds.map(gridDayId => this.renderGridDayById(gridDayId))
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
}