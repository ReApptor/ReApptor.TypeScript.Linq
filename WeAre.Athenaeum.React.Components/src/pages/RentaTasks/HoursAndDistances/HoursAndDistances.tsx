import React from "react";
import TitleWidget from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import WorkOrderDistance from "@/models/server/WorkOrderDistance";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import DailyHoursWidget from "@/pages/RentaTasks/HoursAndDistances/DailyHoursWidget/DailyHoursWidget";
import DistanceWidget from "@/pages/RentaTasks/HoursAndDistances/DistanceWidget/DistanceWidget";
import Localizer from "@/localization/Localizer";

export interface IHoursAndDistancesProps {
}

interface IHoursAndDistancesState {
}

export default class HoursAndDistances extends RentaTasksWizardPage<IHoursAndDistancesProps, IHoursAndDistancesState> {
    
    state: IHoursAndDistancesState = {
    };

    private get workOrder(): WorkOrderModel {
        return this.wizard.workOrder!;
    }

    private get myHours(): UserSalaryHour {
        return this.wizard.myHours;
    }

    private async setAllHoursAsync(hours: UserSalaryHour[]): Promise<void> {
        this.workOrder.userSalaryHours = hours;
        this.saveContext();
    }
    
    private async setDistances(distances: WorkOrderDistance[]): Promise<void> {
        this.workOrder.distances = distances;
        this.saveContext();
    }

    public async nextAsync(): Promise<void> {
        await super.nextAsync();
    }
    
    public getManual(): string {
        return Localizer.taskGetManual;
    }

    public renderContent(): React.ReactNode {
        
        return (
            <React.Fragment>

                <TitleWidget model={this.title} wide />

                <DistanceWidget id="WorkOrderDistances" wide
                                distances={this.workOrder.distances || []}
                                onChange={async (sender, distances) => await this.setDistances(distances)}
                />

                <DailyHoursWidget id="WorkOrderHours" wide
                                  workOrderId={this.workOrder.id}
                                  hours={this.workOrder.userSalaryHours || []}
                                  myHours={this.myHours}
                                  onChange={async (sender, hours) => await this.setAllHoursAsync(hours)}
                />

            </React.Fragment>
        );
    }
}