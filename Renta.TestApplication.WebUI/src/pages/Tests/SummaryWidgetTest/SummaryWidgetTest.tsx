import React from "react";
import {GeoLocation} from "@weare/athenaeum-toolkit";
import {BaseComponent} from "@weare/athenaeum-react-common";
import WorkOrderModel from "@weare/athenaeum-react-components/lib/types/src/models/server/WorkOrderModel";
import CreateAndAssignContactPersonResponse from "@weare/athenaeum-react-components/lib/types/src/models/server/responses/CreateAndAssignContactPersonResponse";
import ConstructionSiteOrWarehouse from "@weare/athenaeum-react-components/lib/types/src/models/server/ConstructionSiteOrWarehouse";
import { WidgetContainer, User, SummaryWidget } from "@weare/athenaeum-react-components";
import CreateAndAssignContactPersonRequest from "@weare/athenaeum-react-components/lib/types/src/models/server/requests/CreateAndAssignContactPersonRequest";

export interface ISummaryWidgetTestState {
}

export default class SummaryWidgetTest extends BaseComponent<{}, ISummaryWidgetTestState> {
    state: ISummaryWidgetTestState = {
    }
    private workOrder: WorkOrderModel = new WorkOrderModel();

    private users: User[] = [];

    private fetchApproversAsync(): Promise<User[]> {
        return new Promise<User[]>((resolve) => resolve(this.users));
    }

    private async createAndAssignContactPersonAsync(request: CreateAndAssignContactPersonRequest): Promise<CreateAndAssignContactPersonResponse> {
        
        const userAlreadyExist: boolean = this.users.some(item => item.email == request.email || item.phone == request.phone);
        const response = new CreateAndAssignContactPersonResponse();

        if (userAlreadyExist) {
            response.successfully = false;
        }
        else {
            const contactPerson = new User();
            contactPerson.id = (10000 * Math.random()).toString();
            contactPerson.firstname = request.firstname;
            contactPerson.lastName = request.lastName;
            contactPerson.middleName = request.middleName;
            contactPerson.phone = request.phone;
            contactPerson.email = request.email;
            response.user = contactPerson;
            response.successfully = true;

            this.users.push(contactPerson);
        }

        return new Promise<CreateAndAssignContactPersonResponse>((resolve) => resolve(response));
    }

    private async onChangeAsync(workOrder: WorkOrderModel): Promise<void> {
        this.workOrder = workOrder;
        
        await this.reRenderAsync();
    }
    
    public async initializeAsync(): Promise<void> {
        const user1 = new User();
        user1.id = "1";
        user1.firstname = "user1";
        user1.email = "user1@renta.fi";
        user1.phone = "036452387";
        user1.isDeleted = false;
        const user2 = new User();
        user2.id = "2";
        user2.firstname = "user2";
        user2.email = "user2@renta.fi";
        user2.phone = "036452487";
        user2.isDeleted = false;

        this.users.push(user1, user2);
        
        const owner = new ConstructionSiteOrWarehouse();
        owner.id = "20f34f";
        owner.name = "Korjaustyö Porvoon työmaa";
        
        let location = new GeoLocation();
        location.city = "Oulu";
        location.country = "Finland";
        location.address = "Aleksanterinkatu 48";
        location.postalCode = "90120";
        
        owner.location = location
        
        this.workOrder.name = "TYÖ 1234/22345";
        this.workOrder.description = "Order from user";
        this.workOrder.customerOrderer = new User();
        this.workOrder.customerOrderer.firstname = "User' name";
        this.workOrder.constructionSiteId = "E0000000-2000-2000-2000-000000000001";
        this.workOrder.customerApproverId = user1.id;
        this.workOrder.customerApprover = user1;
        this.workOrder.completionDate = new Date(2020, 0, 1);
        this.workOrder.owner = owner;
        
    }

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <WidgetContainer>
                    
                    <SummaryWidget workOrder={this.workOrder}
                                   fetchApprovers={async () => await this.fetchApproversAsync()}
                                   createAndAssignContactPerson={async (sender, request) => await this.createAndAssignContactPersonAsync(request)}
                                   onChange={async (sender, workOrder) => await this.onChangeAsync(workOrder)}
                    />

                </WidgetContainer>
                
            </React.Fragment>
        );
    }
}