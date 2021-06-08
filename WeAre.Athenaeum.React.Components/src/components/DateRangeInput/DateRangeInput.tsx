import React from "react";
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";

import styles from "./DateRangeInput.module.scss";
import Icon, {IconSize} from "../Icon/Icon";

interface IDateRangeInputProps extends IBaseInputProps<Date> {
    onChange?(date: Date): Promise<void>;
}

enum DaysOfWeek {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

interface IDateRangeInputState extends IBaseInputState<Date> {
}

const GRID_MONTH_VIEW_DAYS = 35;

export default class DateRangeInput extends BaseInput<Date, IDateRangeInputProps, IDateRangeInputState> {
    private gridDayIds: string[] = new Array(GRID_MONTH_VIEW_DAYS).fill(0).map((value, index) => this.getDayGridId(index));

    lastHoveredGridId: string | null = null;
    firstClickedGridId: string | null = null;
    lastClickedGridId: string | null = null;
    
    private getDayGridId(index: number): string {
        return `${this.id}_day_${index}`;
    }

    private async onDayGridClick(id: string): Promise<void> {
        if (!this.firstClickedGridId) {
            this.firstClickedGridId = id;
            this.lastClickedGridId = null;
            await this.reRenderAsync();
            return; 
        }
        
        if (this.firstClickedGridId && !this.lastClickedGridId) {
            this.lastClickedGridId = id;
            await this.reRenderAsync();
            return;
        }

        this.firstClickedGridId = id;
        this.lastClickedGridId = null;
        await this.reRenderAsync();
    }
    
    private async onDayGridMouseEnter(id: string): Promise<void> {
        this.lastHoveredGridId = id;
        
        await this.reRenderAsync();
    }

    private isDayGridSelected(dayGridId: string): boolean {

        const currentGridIndex = this.gridDayIds.indexOf(dayGridId);
        const firstClickedGridIndex = this.gridDayIds.indexOf(this.firstClickedGridId || "-1");
        const lastClickedGridIndex = this.gridDayIds.indexOf(this.lastClickedGridId || "-1");

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
        const lastHoveredGridIndex: number = this.gridDayIds.indexOf(this.lastHoveredGridId || "-1");
        const firstClickedGridIndex: number = this.gridDayIds.indexOf(this.firstClickedGridId || "-1");
        const lastClickedGridIndex: number = this.gridDayIds.indexOf(this.lastClickedGridId || "-1");
        
        if (this.lastHoveredGridId && lastHoveredGridIndex === -1) {
            this.lastHoveredGridId = null;
            throw new Error("Unknown Clicked cell");
        }
        
        if (this.firstClickedGridId && firstClickedGridIndex === -1) {
            this.firstClickedGridId = null;
            throw new Error("Unknown Clicked cell");
        }  
        
        if (this.lastClickedGridId && lastClickedGridIndex === -1) {
            this.lastClickedGridId = null;
            throw new Error("Unknown Clicked cell");
        }

        const isHoveredGrid = lastHoveredGridIndex !== -1;
        const isFirstClickedGrid = firstClickedGridIndex !== -1;
        const isLastClickedGrid = lastClickedGridIndex !== -1;
        
        const isSmallerThanHoveredGrid = currentGridIndex < lastHoveredGridIndex;
        const isBiggerThanLastHoveredGrid = currentGridIndex > lastHoveredGridIndex;

        const isBiggerThanFirstClickedGrid = currentGridIndex > firstClickedGridIndex;
        const isBiggerThanLastClickedGrid = currentGridIndex > lastClickedGridIndex;

        const isSmallerThanFirstClickedGrid = currentGridIndex < firstClickedGridIndex;
        const isSmallerThanLastClickedGrid = currentGridIndex < lastClickedGridIndex;

        if (isFirstClickedGrid && isLastClickedGrid) {
            return (isBiggerThanFirstClickedGrid && isSmallerThanLastClickedGrid) || (isSmallerThanFirstClickedGrid && isBiggerThanLastClickedGrid)
        }
        
        if (isFirstClickedGrid && !isLastClickedGrid) {
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
        
        return <div id={id} className={className} onMouseEnter={onMouseEnter} onClick={onClick}/>
    }
    
    public renderInput(): React.ReactNode {
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
}