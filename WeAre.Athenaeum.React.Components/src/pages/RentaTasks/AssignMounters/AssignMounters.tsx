import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import DropdownWidget from "../../../components/WidgetContainer/DropdownWidget/DropdownWidget";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import TitleWidget from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import TaskMounter from "../../../models/server/TaskMounter";
import Localizer from "@/localization/Localizer";

export interface IAssignMountersProps {
}

interface IAssignMountersState {
}

export default class AssignMounters extends RentaTasksWizardPage<IAssignMountersProps, IAssignMountersState> {

    state: IAssignMountersState = {};

    private get mounters(): string[] {
        return this.wizard.mounters || [];
    }

    private async fetchMountersAsync(endpoint: string): Promise<TaskMounter[]> {
        return await this.postAsync(endpoint);
    }

    private async onAssignMounter(sender: DropdownWidget<TaskMounter>): Promise<void> {

        this.wizard.mounters = sender.selectedItems.map(item => item.user.id);
        this.saveContext();

        await this.reRenderAsync();
    }

    private get description(): string {
        return (this.mounters.length > 0)
            ? Utility.format(Localizer.rentaTasksAssignMounterDropdownWidgetMountersAssigned, this.mounters.length)
            : Localizer.rentaTasksAssignMounterDropdownWidgetAssignMounters;
    }

    protected getNoToggle(): boolean {
        return true;
    }

    public getManual(): string {
        return Localizer.assignMountersManual;
    }

    public renderContent(): React.ReactNode {
        return (
            <React.Fragment>

                <TitleWidget wide model={this.title} />

                <DropdownWidget<TaskMounter> id="Mounters" wide multiple expanded groupSelected
                                             icon={{name: "fas rocket"}}
                                             label={Localizer.addTaskModalMounters}
                                             description={this.description}
                                             fetchDataAsync={async (sender, endpoint) => this.fetchMountersAsync(endpoint)}
                                             selectedItems={this.mounters}
                                             onChange={async (sender) => await this.onAssignMounter(sender)}
                />

            </React.Fragment>
        );
    }
}