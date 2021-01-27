import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import TitleWidget from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import CheckboxWidget from "../../../components/WidgetContainer/CheckboxWidget/CheckboxWidget";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import HoursWidget from "@/components/WidgetContainer/HoursWidget/HoursWidget";
import Localizer from "@/localization/Localizer";
import {RentaTasksAction} from "@/pages/RentaTasks/RentaTasksController";

export interface ICheckOutProps {
}

interface ICheckOutState {
    addEquipment: boolean;
    myHours: UserSalaryHour;
}

export default class CheckOut extends RentaTasksWizardPage<ICheckOutProps, ICheckOutState> {
    
    state: ICheckOutState = {
        addEquipment: this.wizard.addEquipment,
        myHours: new UserSalaryHour(),
    };

    private get addEquipmentVisible(): boolean {
        return (this.wizard.action != RentaTasksAction.CompleteWorkOrder);
    }

    private get addEquipment(): boolean {
        return (this.state.addEquipment);
    }

    private get myHours(): UserSalaryHour {
        this.state.myHours.day = Utility.today();
        this.state.myHours.user = this.getUser();
        this.state.myHours.userId = this.getUserId();
        this.state.myHours.normalHours = this.wizard.myHours.normalHours;
        this.state.myHours.overtime50Hours = this.wizard.myHours.overtime50Hours;
        this.state.myHours.overtime100Hours = this.wizard.myHours.overtime100Hours;
        return this.state.myHours;
    }

    private async setMyHours(normalHours: number, overtime50Hours: number, overtime100Hours: number): Promise<void> {
        if ((normalHours !== this.myHours.normalHours) || (overtime50Hours != this.myHours.overtime50Hours) || (overtime100Hours != this.myHours.overtime100Hours)) {
            this.wizard.myHours.normalHours = normalHours;
            this.wizard.myHours.overtime50Hours = overtime50Hours;
            this.wizard.myHours.overtime100Hours = overtime100Hours;
            this.saveContext();
            await this.reRenderAsync();
        }
    }

    private async setAddEquipment(addEquipment: boolean): Promise<void> {
        if (addEquipment !== this.addEquipment) {
            this.wizard.addEquipment = addEquipment;
            this.saveContext();
            await this.setState({ addEquipment });
        }
    }
    
    public getManual(): string {
        return Localizer.taskGetManual;
    }

    public renderContent(): React.ReactNode {
        
        return (
            <React.Fragment>

                <TitleWidget model={this.title} wide />
                
                <HoursWidget label={Localizer.workOrderLabelsMyHours}
                             description={Localizer.taskHoursDescription}
                             wide={!this.addEquipmentVisible}
                             normalHours={this.myHours.normalHours} overtime50Hours={this.myHours.overtime50Hours} overtime100Hours={this.myHours.overtime100Hours}
                             onChange={async (sender, normalHours, overtime50Hours, overtime100Hours) => await this.setMyHours(normalHours, overtime50Hours, overtime100Hours)}
                />

                {
                    (this.addEquipmentVisible) &&
                    (
                        <CheckboxWidget checked={this.addEquipment}
                                        label={Localizer.taskAdditionalEquipments}
                                        description={Localizer.taskAdditionalEquipmentsDescription}
                                        onChange={async (_, checked) => await this.setAddEquipment(checked)}
                        />
                    )
                }

            </React.Fragment>
        );
    }
}