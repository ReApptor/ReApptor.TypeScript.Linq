import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import TextInputWidget from "../../../components/WidgetContainer/TextInputWidget/TextInputWidget";
import DateInputWidget from "../../../components/WidgetContainer/DateInputWidget/DateInputWidget";
import TitleWidget from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import TextAreaWidget from "../../../components/WidgetContainer/TextAreaWidget/TextAreaWidget";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import Localizer from "../../../localization/Localizer";

export interface IAddWorkOrderProps {
}

interface IAddWorkOrderState {
}

export default class AddWorkOrder extends RentaTasksWizardPage<IAddWorkOrderProps, IAddWorkOrderState> {
    
    state: IAddWorkOrderState = {
    };

    private get workOrder(): WorkOrderModel {
        return this.wizard.workOrder!;
    }

    private get name(): string {
        return this.workOrder.name;
    }

    private get activationDate(): Date {
        return this.workOrder.activationDate;
    }

    private get description(): string {
        return this.workOrder.description || "";
    }

    private async setNameAsync(name: string): Promise<void> {
        if (name !== this.name) {
            this.workOrder.name = name;
            this.saveContext();
            await this.validateAsync();
        }
    }

    private async setActivationDateAsync(activationDate: Date): Promise<void> {
        if (activationDate !== this.activationDate) {
            this.workOrder.activationDate = activationDate;
            this.saveContext();
            await this.reRenderAsync();
        }
    }

    private async setDescriptionAsync(description: string): Promise<void> {
        if (description !== this.description) {
            this.workOrder.description = description;
            this.saveContext();
            await this.reRenderAsync();
        }
    }
    
    protected get canNext(): boolean {
        return (!!this.name);
    }

    public async nextAsync(): Promise<void> {
        if (this.name) {
            return super.nextAsync();
        }
    }

    public getManual(): string {
        return Localizer.rentaTasksAddTaskManual;
    }

    public renderContent(): React.ReactNode {
        return (
            <React.Fragment>
                
                <TitleWidget wide model={this.title} />
                
                <TextInputWidget id="name" stretchContent autoComplete={false}
                                 label={Localizer.addTaskTaskName}
                                 description={Localizer.addTaskTaskNameDescription}
                                 value={this.name}
                                 onChange={async (_, name) => await this.setNameAsync(name)}
                />

                <DateInputWidget id="activationDate"
                                 label={Localizer.addTaskStartDate}
                                 description={Localizer.addTaskStartDateDescription}
                                 value={this.activationDate}
                                 minDate={Utility.date()}
                                 onChange={async (activationDate) => await this.setActivationDateAsync(activationDate)}
                />

                <TextAreaWidget id="description" wide
                                label={Localizer.addTaskTaskDescription}
                                description={Localizer.addTaskTaskDescriptionDescription}
                                onChange={async (sender, description) => await this.setDescriptionAsync(description)}
                />
                                
            </React.Fragment>
        );
    }
}