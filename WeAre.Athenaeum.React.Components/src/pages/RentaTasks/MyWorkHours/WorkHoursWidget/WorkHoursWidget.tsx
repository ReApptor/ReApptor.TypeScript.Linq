import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import BaseWidget, { IBaseWidgetProps } from "../../../../components/WidgetContainer/BaseWidget";
import Icon, { IconSize } from "../../../../components/Icon/Icon";
import Localizer from "@/localization/Localizer";

import styles from "./WorkHoursWidget.module.scss";

interface IWorkHoursWidgetProps extends IBaseWidgetProps {
    normalHours: number;
    onChange?(sender: WorkHoursWidget, date: Date): Promise<void>;
}

interface IWorkHoursWidgetData {
    date: Date;
}

export default class WorkHoursWidget extends BaseWidget<IWorkHoursWidgetProps, IWorkHoursWidgetData> {

    private get dateString(): string {
        if (this.state.date) {
            return Utility.toDateString(this.state.date);
        }
        
        return Utility.toDateString(new Date);
    }
    
    private get normalHours(): number {
        return this.props.normalHours;
    }
    
    private async setDateAsync(date: Date): Promise<void> {
        await this.setState({ date });
        
        if (this.props.onChange) {
            await this.props.onChange(this, date);
        }
    }
    
    private async setPreviousDate(): Promise<void> {
        if (this.state.date) {
            const previousDate: Date = this.state.date.addDays(-1);
            await this.setDateAsync(previousDate);
        }
    }
    
    private async setNextDate(): Promise<void> {
        if (this.state.date) {
            const nextDate: Date = this.state.date.addDays(1);
            await this.setDateAsync(nextDate);
        }
    }

    protected hasDescription(): boolean {
        return true;
    }

    protected getInnerClassName(): string {
        return styles.workHours;
    }
    
    public get date(): Date {
        return this.state.date || new Date();
    }

    public async initializeAsync(): Promise<void> {
        await this.setState({ date: new Date() });
    }

    protected renderLabel(): React.ReactElement {
        return (
            <div className={styles.header}>
                <span>{this.label}</span>
            </div>
        )
    }

    protected renderContent(): React.ReactNode {
        return (
            <div>
                <div className={styles.body}>
                    <Icon name={"fas chevron-circle-left"} size={IconSize.X2} onClick={async () => await this.setPreviousDate()} />
                    
                    <div className={styles.date}>
                        <span>
                            {this.dateString}
                        </span>
                    </div>
                
                    <Icon disabled={Utility.isToday(this.date)} name={"fas chevron-circle-right"} size={IconSize.X2} onClick={async () => await this.setNextDate()} />
                </div>
            </div>
        )
    }
    
    protected renderDescription(): React.ReactNode {
        return (
            <div className={this.css(styles.footer, !this.mobile && styles.desktop)}>
                <div className={styles.icon}>
                    <Icon name={"fas business-time"} size={IconSize.X3} />
                </div>
                
                <div className={styles.summary}>
                    <span className={styles.normal}>{Localizer.workHoursWidgetSummary.format(this.normalHours)}</span>
                </div>
            </div>
        )
    }
    
    protected renderMinimized(): React.ReactNode {
        return <div />;
    }
}