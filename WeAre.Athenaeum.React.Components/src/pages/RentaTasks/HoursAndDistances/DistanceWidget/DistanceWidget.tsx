import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {IBaseComponent} from "@weare/athenaeum-react-common";
import {IBaseWidgetProps} from "@/components/WidgetContainer/BaseWidget";
import BaseExpandableWidget from "@/components/WidgetContainer/BaseExpandableWidget";
import WorkOrderDistance from "@/models/server/WorkOrderDistance";
import Button, {ButtonType} from "@/components/Button/Button";
import DistanceModal from "@/pages/RentaTasks/HoursAndDistances/DistanceWidget/DistanceModal/DistanceModal";
import Localizer from "@/localization/Localizer";

import styles from "./DistanceWidget.module.scss";

interface IDistanceWidgetProps extends IBaseWidgetProps {
    distances: WorkOrderDistance[];
    onChange(sender: IBaseComponent, distances: WorkOrderDistance[]): Promise<void>;
}

export default class DistanceWidget extends BaseExpandableWidget<IDistanceWidgetProps> {

    private readonly _distanceModalRef: React.RefObject<DistanceModal> = React.createRef();
    private _distances: WorkOrderDistance[] = this.processDistances(this.props.distances);
    
    private processDistances(distances: WorkOrderDistance[]): WorkOrderDistance[] {
        if ((distances.length == 0) || (!distances.some(distance => distance.day.isToday()))) {
            const today = new WorkOrderDistance();
            today.day = Utility.today();
            today.vehicles = 1;
            today.value = 0;
            distances.splice(0, 0, today);
        }
        const emptyItems: WorkOrderDistance[] = distances.where(item => (item.value == 0) && (!item.day.isToday()));
        emptyItems.forEach(item => distances.remove(item));
        distances.sort((x, y) => x.day.compareTo(y.day, true));
        return distances;
    }

    private async invokeOnChangeAsync(): Promise<void> {
        await this.props.onChange(this, this.distances);
    }

    private async editDistanceAsync(distance: WorkOrderDistance): Promise<void> {
        await this._distanceModalRef.current!.openAsync(distance);
    }

    private async newDistanceAsync(): Promise<void> {
        const minDate: Date = (this.distances.length > 0)
            ? this.distances.min(item => item.day.valueOf()).day
            : Utility.today();
        
        const distance = new WorkOrderDistance();
        distance.day = minDate.addDays(-1);
        distance.vehicles = 1;
        distance.value = 1;
        
        await this._distanceModalRef.current!.openAsync(distance);
    }

    private async saveDistanceAsync(distance: WorkOrderDistance): Promise<void> {

        if (this.distances.includes(distance)) {
            this.distances.remove(distance);
        }

        const sameDay: WorkOrderDistance | null = this.distances.find(item => distance.day.equals(item.day)) || null;
        if (sameDay) {
            // update existing day
            sameDay.value = distance.value;
            sameDay.vehicles = distance.vehicles;
        } else if (!this.distances.includes(distance)) {
            // add new day
            this.distances.push(distance);
        }

        this._distances = this.processDistances(this._distances);

        await this.invokeOnChangeAsync();

        await this.reRenderAsync();
    }

    private get isModalOpen(): boolean {
        return ((this._distanceModalRef.current != null) && (this._distanceModalRef.current!.isOpen));
    }

    protected getLabel(): string | null {
        return super.getLabel() || Localizer.distanceWidgetLabel;
    }

    protected getDescription(): string | null {
        return super.getDescription() || Localizer.distanceWidgetDescription;
    }

    protected getNumber(): string {
        return (this.minimized)
            ? "{0:0}".format(this.distance)
            : "{0:0} {1}".format(this.distance, Localizer.genericAbbreviationsKilometers);
    }

    protected getInnerClassName(): string {
        return styles.distanceWidget;
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

    public get distances(): WorkOrderDistance[] {
        return this._distances;
    }

    public get distance(): number {
        return this.distances.sum(item => item.value);
    }

    protected renderDistance(index: number, distance: WorkOrderDistance): React.ReactNode {
        const todayStyle = (distance.day.isToday()) && styles.today;
        return (
            <div key={index} className={this.css(styles.distanceItem, todayStyle)} onClick={async () => await this.editDistanceAsync(distance)}>
                <span>{"{0:dd.MM.yyyy}".format(distance.day)}</span>
                <span className={styles.value}>{"{0} {1}".format(distance.value, Localizer.genericAbbreviationsKilometers)}</span>
                <span className={styles.value}>{"{0} {1}".format(distance.vehicles, Localizer.genericAbbreviationsVehicles)}</span>
            </div>
        )
    }

    protected renderExpanded(): React.ReactNode {
        
        return (
            <div id={`${this.id}_extended`} className={styles.extended}>

                <div className={styles.distances}>
                    { this.distances.map((distance, index) => this.renderDistance(index, distance)) }
                </div>

                <div className={styles.addItem} onClick={async () => await this.newDistanceAsync()}>
                    <Button icon={{name: "fas plus"}} type={ButtonType.Orange} />
                    <span>{Localizer.distanceWidgetButtonsAddKilometers}</span>
                </div>
                
                <DistanceModal ref={this._distanceModalRef}
                               onChange={async (sender, distance) => await this.saveDistanceAsync(distance)}
                />

            </div>
        )
    }
};