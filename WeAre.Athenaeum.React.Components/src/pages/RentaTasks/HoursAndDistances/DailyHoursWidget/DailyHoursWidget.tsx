import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {ch, IBaseComponent} from "@weare/athenaeum-react-common";
import {IBaseWidgetProps} from "@/components/WidgetContainer/BaseWidget";
import BaseExpandableWidget from "@/components/WidgetContainer/BaseExpandableWidget";
import Button, {ButtonType} from "@/components/Button/Button";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import DailyHoursModal from "@/pages/RentaTasks/HoursAndDistances/DailyHoursWidget/DailyHoursModal/DailyHoursModal";
import User from "@/models/server/User";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "@/localization/Localizer";

import styles from "./DailyHoursWidget.module.scss";

interface IDailyHoursWidgetProps extends IBaseWidgetProps {
    workOrderId: string;
    hours: UserSalaryHour[];
    myHours?: UserSalaryHour;
    onChange(sender: IBaseComponent, hours: UserSalaryHour[]): Promise<void>;
}

export default class DailyHoursWidget extends BaseExpandableWidget<IDailyHoursWidgetProps, User[]> {

    private readonly _modalRef: React.RefObject<DailyHoursModal> = React.createRef();
    private _hours: UserSalaryHour[] = this.processHours(this.props.hours);
    private _lastSelectedUser: User = ch.getUser();
    
    private processHours(hours: UserSalaryHour[]): UserSalaryHour[] {
        const myHours: UserSalaryHour | null = this.myHours;
        if ((myHours) && (!hours.some(item => (item.userId == myHours.userId) && (item.day.equals(myHours.day))))) {
            hours.unshift(myHours);
        }
        const emptyItems: UserSalaryHour[] = hours.where(item => (item.normalHours == 0) && (item.overtime50Hours == 0) && (item.overtime100Hours == 0));
        hours.remove(emptyItems);
        hours.order(item => -item.day.valueOf(), item => TransformProvider.toString(item.user));
        return hours;
    }

    private async invokeOnChangeAsync(): Promise<void> {
        await this.props.onChange(this, this.hours);
    }

    private async editHourAsync(hour: UserSalaryHour): Promise<void> {
        await this._modalRef.current!.openAsync(hour);
    }

    private async newHourAsync(): Promise<void> {
        const lastSelectedUser: User = this._lastSelectedUser;
        const userHours: UserSalaryHour[] = this.hours.where(item => item.userId == lastSelectedUser.id);
        const minDate: Date = (userHours.length > 0)
            ? userHours.min(item => item.day.valueOf()).day
            : Utility.today();

        const hour = new UserSalaryHour();
        hour.workOrderId = this.props.workOrderId;
        hour.day = minDate.addDays(-1);
        hour.user = lastSelectedUser;
        hour.userId = lastSelectedUser.id;
        hour.normalHours = 7.5;
        
        await this._modalRef.current!.openAsync(hour);
    }

    private async saveHourAsync(hour: UserSalaryHour): Promise<void> {

        this._lastSelectedUser = hour.user || ch.getUser();
        
        if (this.hours.includes(hour)) {
            this.hours.remove(hour);
        }
        
        const sameHour: UserSalaryHour | null = this.hours.find(item => (hour.userId == item.userId) && (hour.day.equals(item.day))) || null;
        if (sameHour) {
            // update existing day
            sameHour.normalHours = hour.normalHours;
            sameHour.overtime50Hours = hour.overtime50Hours;
            sameHour.overtime100Hours = hour.overtime100Hours;
        } else if (!this.hours.includes(hour)) {
            // add new day
            this.hours.push(hour);
        }

        this._hours = this.processHours(this._hours);

        await this.invokeOnChangeAsync();

        await this.reRenderAsync();
    }

    private get isModalOpen(): boolean {
        return ((this._modalRef.current != null) && (this._modalRef.current!.isOpen));
    }

    protected getLabel(): string | null {
        return super.getLabel() || Localizer.dailyHoursWidgetLabel;
    }

    protected getDescription(): string | null {
        return super.getDescription() || Localizer.dailyHoursWidgetDescription;
    }

    protected getNumber(): string {
        return (this.minimized)
            ? "{0:0.0}".format(this.totalHours)
            : "{0:0.0} {1}".format(this.totalHours, Localizer.genericAbbreviationsHours);
    }

    protected getInnerClassName(): string {
        return styles.dailyHoursWidget;
    }
    
    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        const canToggle: boolean = (!this.isModalOpen) && ((!this.contentVisible) || (Utility.clickedOutside(e.target as Node, `${this.id}_extended`))); 
        if (canToggle) {
            await super.onClickAsync(e);
        }
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        const canCollapse: boolean = (this.contentVisible) && (!this.isModalOpen);
        if (canCollapse) {
            await super.onGlobalClick(e);
        }
    }

    public get myHours(): UserSalaryHour | null {
        return this.props.myHours || null;
    }

    public get hours(): UserSalaryHour[] {
        return this._hours;
    }
    
    public get mounters(): User[] {
        return (this.state.data || []);
    }

    public get totalHours(): number {
        return this.hours.sum(item => item.normalHours);
    }
    
    public isAsync(): boolean {
        return true;
    }

    protected renderHour(index: number, hour: UserSalaryHour): React.ReactNode {
        return (
            <div key={index} className={styles.hourItem} onClick={async () => await this.editHourAsync(hour)}>
                <div className={this.css(styles.row1)}>
                    <span className={styles.user}>{TransformProvider.toString(hour.user)}</span>
                    <span className={styles.day}>{"{0:dd.MM.yyyy}".format(hour.day)}</span>
                </div>
                <div className={styles.row2}>
                    <div className={styles.hours}>
                        <span>{"{0:0.0} {1}".format(hour.normalHours, Localizer.genericAbbreviationsHours)}</span>
                        <span>{Localizer.dailyHoursWidgetLabelsNormal}</span>
                    </div>
                    <div className={styles.hours}>
                        <span>{"{0:0.0} {1}".format(hour.overtime50Hours, Localizer.genericAbbreviationsHours)}</span>
                        <span>50%</span>
                    </div>
                    <div className={styles.hours}>
                        <span>{"{0:0.0} {1}".format(hour.overtime100Hours, Localizer.genericAbbreviationsHours)}</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        )
    }

    protected renderExpanded(): React.ReactNode {
        const noDistancesStyle = (this.hours.length == 0) && (styles.noDistances);
        return (
            <div id={`${this.id}_extended`} className={styles.extended}>

                <div className={styles.distances}>
                    { this.hours.map((hour, index) => this.renderHour(index, hour)) }
                </div>

                <div className={this.css(styles.addItem, noDistancesStyle)} onClick={async () => await this.newHourAsync()}>
                    <Button icon={{name: "fas plus"}} type={ButtonType.Orange} />
                    <span>{Localizer.dailyHoursWidgetButtonsAddHours}</span>
                </div>
                
                <DailyHoursModal ref={this._modalRef}
                                 mounters={this.mounters}
                                 onChange={async (sender, hour) => await this.saveHourAsync(hour)}
                />

            </div>
        )
    }
};