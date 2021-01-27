import React from "react";
import {ApiProvider, IBaseComponent} from "@weare/athenaeum-react-common";
import TitleWidget, {ITitleModel} from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import SummaryWidget from "@/pages/RentaTasks/Summary/SummaryWidget/SummaryWidget";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import User from "@/models/server/User";
import CreateAndAssignContactPersonRequest from "@/models/server/requests/CreateAndAssignContactPersonRequest";
import CreateAndAssignContactPersonResponse from "@/models/server/responses/CreateAndAssignContactPersonResponse";
import TransformProvider from "../../../providers/TransformProvider";
import Localizer from "@/localization/Localizer";

interface ISummaryProps {
}

interface ISummaryState {
}

export default class Summary extends RentaTasksWizardPage<ISummaryProps, ISummaryState> {
    
    state: ISummaryState = {
    };

    private get workOrder(): WorkOrderModel {
        return this.wizard.workOrder!;
    }

    private async fetchApproversAsync(sender: IBaseComponent): Promise<User[]> {
        const constructionSiteId: string = this.workOrder.constructionSiteId!;
        return await sender.postAsync("api/rentaTasks/getContactPersons", constructionSiteId);
    }

    private async addContactPersonAsync(request: CreateAndAssignContactPersonRequest): Promise<CreateAndAssignContactPersonResponse> {
        request.constructionSiteId = this.workOrder.constructionSiteId!;
        return await ApiProvider.postAsync("api/rentaTasks/createAndAssignContactPerson", request);
    }
    
    private async editContactPersonAsync(request: CreateAndAssignContactPersonRequest): Promise<CreateAndAssignContactPersonResponse> {
        request.constructionSiteId = this.workOrder.constructionSiteId;
        return await ApiProvider.postAsync("api/rentaTasks/createAndAssignContactPerson", request);
    }

    private async onChangeAsync(workOrder: WorkOrderModel): Promise<void> {
        this.wizard.workOrder = workOrder;
        this.saveContext();
        await this.validateAsync();
        await this.reRenderAsync();
    }

    protected getNoToggle(): boolean {
        return true;
    }

    protected get canNext(): boolean {
        return (!!this.workOrder.customerApprover);
    }
    
    public get title(): ITitleModel {
        return TransformProvider.toTitle(this.workOrder);
    }

    public get isEditable(): boolean {
        return (
            (!WorkOrderModel.isApproverOrOrdererValid(this.workOrder.customerApprover))
        );
    }
    
    public async nextAsync(): Promise<void> {
        if ((this.workOrder.customerApprover) && (!this.isEditable)) {
            await super.nextAsync();
        }
    }
    
    public getManual(): string {
        return Localizer.summaryManual;
    }

    public renderContent(): React.ReactNode {
        return (
            <React.Fragment>

                <TitleWidget model={this.title} wide />

                <SummaryWidget id="Summary" wide
                               workOrder={this.workOrder}
                               fetchApprovers={async (sender) => await this.fetchApproversAsync(sender)}
                               addContactPerson={async (sender, request) => await this.addContactPersonAsync(request)}
                               editContactPerson={async (sender, request) => await this.editContactPersonAsync(request)}
                               onChange={async (sender, workOrder) => await this.onChangeAsync(workOrder)}
                />
                
            </React.Fragment>
        );
    }
}