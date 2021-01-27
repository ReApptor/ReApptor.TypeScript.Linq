import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {IBaseComponent} from "@weare/athenaeum-react-common";
import BaseWidget, {IBaseWidgetProps} from "@/components/WidgetContainer/BaseWidget";
import Dropdown from "@/components/Form/Inputs/Dropdown/Dropdown";
import User from "@/models/server/User";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import CreateAndAssignContactPersonRequest from "@/models/server/requests/CreateAndAssignContactPersonRequest";
import CreateContactPersonModal from "@/pages/RentaTasks/Summary/SummaryWidget/CreateContactPersonModal/CreateContactPersonModal";
import EditContactPersonModal from "@/pages/RentaTasks/Summary/SummaryWidget/EditContactPersonModal/EditContactPersonModal";
import CreateAndAssignContactPersonResponse from "@/models/server/responses/CreateAndAssignContactPersonResponse";
import Button, {ButtonType} from "@/components/Button/Button";
import Icon, {IconSize} from "@/components/Icon/Icon";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "@/localization/Localizer";

import styles from "./SummaryWidget.module.scss";

interface ISummaryWidgetProps extends IBaseWidgetProps {
    workOrder: WorkOrderModel;
    fetchApprovers(sender: IBaseComponent, endpoint: string): Promise<User[]>;
    addContactPerson(sender: IBaseComponent, request: CreateAndAssignContactPersonRequest): Promise<CreateAndAssignContactPersonResponse>;
    onChange(sender: IBaseComponent, workOrder: WorkOrderModel): Promise<void>;
    editContactPerson(sender: IBaseComponent, request: CreateAndAssignContactPersonRequest): Promise<CreateAndAssignContactPersonResponse>;
}

export default class SummaryWidget extends BaseWidget<ISummaryWidgetProps, User[]> {
    private readonly _createContactPersonModalRef: React.RefObject<CreateContactPersonModal> = React.createRef();
    private readonly _editContactPersonModalRef: React.RefObject<EditContactPersonModal> = React.createRef();

    private async addContactPersonHandler(sender: IBaseComponent, request: CreateAndAssignContactPersonRequest): Promise<boolean> {
        const response: CreateAndAssignContactPersonResponse = await this.props.addContactPerson(sender, request);

        if (!response.successfully) {
            return false;
        }

        await this.invokeOnChangeAsync(response.user!);

        await this.reloadAsync();

        return true;
    }
    
    private async editContactPersonHandler(sender: IBaseComponent, request: CreateAndAssignContactPersonRequest): Promise<boolean> {
        const response: CreateAndAssignContactPersonResponse = await this.props.editContactPerson(sender, request);
        
        if(!response.successfully) {
            return false;
        }
        
        await this.invokeOnChangeAsync(response.user!);
        
        await this.reloadAsync();
        
        return true;
    }

    public get isEditable(): boolean {
        return (
            (!WorkOrderModel.isApproverOrOrdererValid(this.workOrder.customerApprover))
        );
    }

    private async invokeOnChangeAsync(item: User): Promise<void> {
        this.workOrder.customerApproverId = item.id;
        this.workOrder.customerApprover = item;
        if (this.isEditable) {
            await this.openEditContactPersonModalAsync()
        }

        await this.props.onChange(this, this.workOrder);
    }

    protected async fetchDataAsync(): Promise<User[]> {
        if (this.props.fetchApprovers) {
            return await this.props.fetchApprovers(this, this.getEndpoint());
        }

        return await super.fetchDataAsync();
    }

    protected getInnerClassName(): string {
        return styles.summaryWidget;
    }

    public get workOrder(): WorkOrderModel {
        return this.props.workOrder;
    }

    public get distance(): number {
        return (this.workOrder.distances || []).sum(item => item.value);
    }

    public get totalHours(): number {
        return this.normalHours + this.overtime50Hours + this.overtime100Hours;
    }

    public get normalHours(): number {
        return (this.workOrder.userSalaryHours || []).sum(item => item.normalHours);
    }

    public get overtime50Hours(): number {
        return (this.workOrder.userSalaryHours || []).sum(item => item.overtime50Hours);
    }

    public get overtime100Hours(): number {
        return (this.workOrder.userSalaryHours || []).sum(item => item.overtime100Hours);
    }
    
    public get completionDate(): Date {
        return this.workOrder.completionDate || Utility.today();
    }

    public isAsync(): boolean {
        return true;
    }

    private async openCreateContactPersonModalAsync(): Promise<void> {
        await this._createContactPersonModalRef.current!.openAsync();
    }
    
    private async openEditContactPersonModalAsync(): Promise<void> {
        await this._editContactPersonModalRef.current!.openAsync(this.workOrder);
    }

    protected renderContent(): React.ReactNode {

        const ordererName: string = (this.workOrder.customerOrderer)
            ? TransformProvider.toString(this.workOrder.customerOrderer)
            : Localizer.genericNoData;

        const approverEmail: string = (this.workOrder.customerApprover && this.workOrder.customerApprover.email)
            ? this.workOrder.customerApprover.email
            : Localizer.genericNoData;

        const approverPhone: string = (this.workOrder.customerApprover && this.workOrder.customerApprover.phone)
            ? this.workOrder.customerApprover.phone
            : Localizer.genericNoData;

        const workOrderDescription: string = (this.workOrder.description)
            ? this.workOrder.description
            : Localizer.genericNoData;

        return (

            <div className={styles.summaryWidgetContent}>
                <div className={styles.header}>
                    <span>{Localizer.summaryWidgetTitle}</span>
                    <span className={styles.date}>{"{0:dd.MM.yyyy}".format(this.completionDate)}</span>
                </div>

                <div className={styles.body}>

                    {
                        (this.state.data) &&
                        (
                            <React.Fragment>

                                {
                                    (this.workOrder.owner) &&
                                    (
                                        <React.Fragment>
                                            <span className={styles.constructionSiteName}>{this.workOrder.owner.name}</span>
                                            <span>{TransformProvider.toString(this.workOrder.owner.location)}</span>
                                        </React.Fragment>
                                    )
                                }

                                <div>
                                    <span>{Localizer.summaryWidgetOrderer}</span>
                                    <span className={(this.workOrder.customerOrderer) ? styles.data : styles.noDataText}>{ordererName}</span>
                                </div>

                                <span>{Localizer.summaryWidgetApprover}</span>
                                
                                <div className={this.css("w-100", styles.col)}>
                                    <Dropdown className={styles.dropdown} required noSubtext
                                              items={this.state.data}
                                              selectedItem={this.workOrder.customerApprover || this.workOrder.customerApproverId || undefined}
                                              onChange={async (sender, item) => await this.invokeOnChangeAsync(item!)}
                                    />
                                </div>

                            </React.Fragment>
                        )
                    }

                    {
                        (this.workOrder.customerApprover) &&
                        (
                            <React.Fragment>
                                <div>
                                    <Icon name="far envelope" size={IconSize.X2}/>
                                    <span className={(!this.workOrder.customerApprover.email) ? styles.noDataText : ""}>{approverEmail}</span>
                                </div>

                                <div>
                                    <Icon name="fas tty" size={IconSize.X2}/>
                                    <span className={(!this.workOrder.customerApprover.phone) ? styles.noDataText : ""}>{approverPhone}</span>
                                </div>

                            </React.Fragment>
                        )
                    }

                    <div>
                        <Button icon={{name: "fas plus"}} type={ButtonType.Orange} onClick={async () => await this.openCreateContactPersonModalAsync()}/>
                        <p>{Localizer.summaryWidgetButtonCreateApprover}</p>
                    </div>
                    
                    {
                        (this.isEditable) && (
                            <div>
                                <Button icon={{name: "fas pen"}} type={ButtonType.Orange} onClick={async () => await this.openEditContactPersonModalAsync()}/>
                                <p>EN: Fill in missing information</p>
                            </div>        
                        )
                    }

                    <CreateContactPersonModal
                        ref={this._createContactPersonModalRef}
                        constructionSiteName={this.workOrder.owner!.name}
                        addContactPerson={async (sender, request) => await this.addContactPersonHandler(sender, request)}
                    />
                    <EditContactPersonModal
                        ref={this._editContactPersonModalRef}
                        workOrder={this.workOrder}
                        constructionSiteName={this.workOrder.owner!.name}
                        editContactPerson={async (sender, request) => await this.editContactPersonHandler(sender, request)}
                    />

                    <div>
                        <span>{Localizer.summaryWidgetWorkOrderName}</span>
                        <span className={styles.data}>{this.workOrder.name}</span>
                    </div>
                    
                    <span>{Localizer.summaryWidgetWorkOrderDescription}</span>
                    <span className={(workOrderDescription) ? styles.data : styles.noDataText}>{workOrderDescription}</span>
                    
                    <div>
                        <span>{this.toMultiLines(Localizer.summaryWidgetLabelsDistance.format(this.distance))}</span>
                    </div>
                    
                    <div>
                        <span>{this.toMultiLines(Localizer.summaryWidgetLabelsHours.format(this.totalHours, this.normalHours, this.overtime50Hours, this.overtime100Hours))}</span>
                    </div>
                    
                </div>
            </div>
        );
    }
};