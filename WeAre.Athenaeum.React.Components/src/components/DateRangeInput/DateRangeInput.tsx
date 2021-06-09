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
    lastHoveredGrid: GridDay | null;
    firstClickedGrid: GridDay | null;
    lastClickedGrid: GridDay | null;

}

interface GridDay {
    year: number,
    month: number,
    day: number
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

        const isLongMonth = (introDaysCount + currentMonthDayCount) > MONTH_GRID;

        const gridCount = isLongMonth ? LONG_MONTH_GRID : MONTH_GRID;
        
        const outroDaysCount: number = gridCount - introDaysCount - currentMonthDayCount;
        
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
        return (gridDay === this.state.firstClickedGrid) || (gridDay === this.state.lastClickedGrid);
    }
    
    private isDayGridInRange(gridDay: GridDay): boolean {
        const currentGridIndex: number = this.gridDays.indexOf(gridDay);
        const lastHoveredGridIndex: number = this.gridDays.indexOf((this.state.lastHoveredGrid || "-1") as GridDay);
        const firstClickedGridIndex: number = this.gridDays.indexOf((this.state.firstClickedGrid || "-1") as GridDay);
        const lastClickedGridIndex: number = this.gridDays.indexOf((this.state.lastClickedGrid || "-1") as GridDay);

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

    private renderGridDays(gridDay: GridDay): JSX.Element {
        const isSelected = this.isDayGridSelected(gridDay) && styles.isSelected || "";
        
        const isInRange = this.isDayGridInRange(gridDay) && styles.isInRange || "";
        
        const className: string = this.css(styles.monthViewGridDay, isInRange, isSelected);
        
        const onClick: () => void = async () => await this.onDayGridClick(gridDay);
        
        const onMouseEnter: () => void = async () => await this.onDayGridMouseEnter(gridDay);
        
        return <div className={className} onMouseEnter={onMouseEnter} onClick={onClick}>{gridDay.day}</div>
    }

    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.dateRangeInput, this.props.className)}>
                <div className={styles.topControlPanel}>

                    <Icon name="caret-left" size={IconSize.Large} onClick={() => this.onPreviousMonthClick()}/>

                    <span>Current month</span>

                    <Icon name="caret-right" size={IconSize.Large} onClick={() => this.onNextMonthClick()}/>

                </div>

                <div className={this.css(styles.dateRangeInputMonthView)}>
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
}