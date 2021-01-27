import React from "react";
import AuthorizedPage from "../../../models/base/AuthorizedPage";
import PageDefinitions from "../../../providers/PageDefinitions";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import {ApiProvider, ch, IManualProps, PageRouteProvider} from "@weare/athenaeum-react-common";
import PageContainer from "@/components/PageContainer/PageContainer";
import PageHeader from "@/components/PageContainer/PageHeader/PageHeader";
import PageRow from "@/components/PageContainer/PageRow/PageRow";
import Button, {ButtonType} from "@/components/Button/Button";
import {WorkOrderStatus} from "@/models/Enums";
import RentaTasksController, {RentaTasksAction} from "@/pages/RentaTasks/RentaTasksController";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "../../../localization/Localizer";

import styles from "./WorkOrder.module.scss";
import rentaTaskStyles from "../../RentaTask.module.scss";

interface IDevicePageProps {
}

interface IDevicePageState {
    workOrder: WorkOrderModel | null;
}

export default class DevicePage extends AuthorizedPage<IDevicePageProps, IDevicePageState> {

    state: IDevicePageState = {
        workOrder: null
    };

    private async signInAsync(): Promise<void> {

        const canSignIn: boolean = (this.workOrder.currentStatus == WorkOrderStatus.InProgress) || (await ch.confirmAsync(Localizer.rentaTasksWorkOrderSignInConfirm));

        if (canSignIn) {
            await RentaTasksController.checkInAsync(this.workOrder);

            await this.alertMessageAsync(Localizer.rentaTasksWorkOrderSignInAlert, true);
            
            await this.reRenderAsync();
        }
    }

    private async signOutAsync(): Promise<void> {
        RentaTasksController.wizard.workOrder = this.workOrder;

        await RentaTasksController.actionAsync(RentaTasksAction.SignOut);
    }

    private async editAsync(): Promise<void> {
        RentaTasksController.wizard.workOrder = this.workOrder;

        await RentaTasksController.actionAsync(RentaTasksAction.EditWorkOrder);
    }

    private async addEquipmentAsync(): Promise<void> {
        RentaTasksController.wizard.workOrder = this.workOrder;

        await RentaTasksController.actionAsync(RentaTasksAction.AddEquipment);
    }

    private async completeAsync(): Promise<void> {
        RentaTasksController.wizard.workOrder = this.workOrder;

        await RentaTasksController.actionAsync(RentaTasksAction.CompleteWorkOrder);
    }

    private get workOrder(): WorkOrderModel {
        return this.state.workOrder!;
    }

    private get myWorkOrder(): WorkOrderModel | null {
        return RentaTasksController.context.workOrder;
    }

    private get isSignedIn(): boolean {
        return RentaTasksController.isSignedIn;
    }

    public get canSignIn(): boolean {
        return ((this.workOrder != null) && (!this.workOrder.deleted) && ((this.workOrder.currentStatus == WorkOrderStatus.Created) || (this.workOrder.currentStatus == WorkOrderStatus.InProgress))) && (!this.isSignedIn);
    }

    public get canSignOut(): boolean {
        return ((this.workOrder != null) && (!this.workOrder.deleted) && (this.myWorkOrder != null) && (this.workOrder.id == this.myWorkOrder.id)) && (this.isSignedIn);
    }

    public get canComplete(): boolean {
        return ((this.workOrder != null) && (!this.workOrder.deleted) && ((this.workOrder.currentStatus == WorkOrderStatus.Created) || (this.workOrder.currentStatus == WorkOrderStatus.InProgress) || (this.workOrder.currentStatus == WorkOrderStatus.Completed)));
    }

    public get canEdit(): boolean {
        return ((this.workOrder != null) && (!this.workOrder.deleted) && ((this.workOrder.currentStatus == WorkOrderStatus.Created) || (this.workOrder.currentStatus == WorkOrderStatus.InProgress) || (this.workOrder.currentStatus == WorkOrderStatus.Completed)));
    }

    public get canAddEquipment(): boolean {
        return ((this.workOrder != null) && (!this.workOrder.deleted) && ((this.workOrder.currentStatus == WorkOrderStatus.Created) || (this.workOrder.currentStatus == WorkOrderStatus.InProgress) || (this.workOrder.currentStatus == WorkOrderStatus.Completed)));
    }

    public get distance(): number {
        return (this.workOrder.distances || []).sum(item => item.value);
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

    public get totalHours(): number {
        return this.normalHours + this.overtime50Hours + this.overtime100Hours;
    }

    public get title(): string {
        return TransformProvider.toString(this.workOrder);
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        if (!this.routeId) {
            await PageRouteProvider.redirectAsync(PageDefinitions.dashboardRoute, true);
        }

        const workOrder: WorkOrderModel = await ApiProvider.postAsync("/api/RentaTasks/getWorkOrder", this.routeId);

        await this.setState({workOrder: workOrder});
        
        ch.reloadTopNav();
    }

    public getManualProps(): IManualProps {
        const manual: string | undefined = ((this.state.workOrder) && (this.state.workOrder.description))
            ? this.state.workOrder.description
            : undefined;
        return {
            title: Localizer.rentaTasksWorkOrderManualTitle,
            manual: manual,
            icon: "fal info",
        }
    }
    
    private renderData(): React.ReactNode {
        const customerName: string = ((this.workOrder.owner) && (this.workOrder.owner.organizationContract) && (this.workOrder.owner.organizationContract.name))
            ? this.workOrder.owner.organizationContract.name
            : "-";
        const constructionSiteName: string = ((this.workOrder.owner) && (this.workOrder.owner.name))
            ? this.workOrder.owner.name
            : "-";
        const customerApproverName: string = (this.workOrder.customerApprover)
            ? "{0}".format(this.workOrder.customerApprover)
            : "-";
        const customerOrdererName: string = (this.workOrder.customerOrderer)
            ? "{0}".format(this.workOrder.customerOrderer)
            : "-";
        const managerName: string = (this.workOrder.manager)
            ? "{0}".format(this.workOrder.manager)
            : "-";
        
        return (
            <table className={this.css(styles.table, "table table-striped")} >
                <tbody>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelCustomerName}</td>
                    <td>{customerName}</td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelConstructionSite}</td>
                    <td>{constructionSiteName}</td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelAddress}</td>
                    <td>
                        {
                            ((this.workOrder.owner) && (this.workOrder.owner.location))
                                ? <address>
                                    {"{0}".format(this.workOrder.owner.location)}
                                    {/*<AddressInput readonly append locationPicker value={this.workOrder.owner.location.formattedAddress} />*/}
                                  </address>
                                : "-"
                        }
                    </td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelOrderer}</td>
                    <td>{customerOrdererName}</td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelOrdererPhone}</td>
                    <td>
                        {
                            (((this.workOrder.customerOrderer) && (this.workOrder.customerOrderer.phone)))
                                ? <a href={`tel:${this.workOrder.customerOrderer.phone}`}>{this.workOrder.customerOrderer.phone}</a>
                                : "-"
                        }
                    </td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelApprover}</td>
                    <td>{customerApproverName}</td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelApproverPhone}</td>
                    <td>
                        {
                            (((this.workOrder.customerApprover) && (this.workOrder.customerApprover.phone)))
                                ? <a href={`tel:${this.workOrder.customerApprover.phone}`}>{this.workOrder.customerApprover.phone}</a>
                                : "-"
                        }
                    </td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelManager}</td>
                    <td>{managerName}</td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelManagerPhone}</td>
                    <td>
                        {
                            (((this.workOrder.manager) && (this.workOrder.manager.phone)))
                                ? <a href={this.workOrder.manager.phone}>{this.workOrder.manager.phone}</a>
                                : "-"
                        }
                    </td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelDistance}</td>
                    <td>{Localizer.genericKm.format(this.distance)}</td>
                </tr>

                <tr>
                    <td>{Localizer.rentaTasksWorkOrderLabelWorkingHours}</td>
                    <td>{Localizer.genericHours.format(this.totalHours, this.normalHours, this.overtime50Hours, this.overtime100Hours)}</td>
                </tr>

                </tbody>

            </table>
        );
    }

    public render(): React.ReactNode {
        
        const activationDate: string = ((this.workOrder) && (this.workOrder.activationDate)) ? "{0:dd.MM.yyyy}".format(this.workOrder.activationDate) : "-";
        const completionDate: string = ((this.workOrder) && (this.workOrder.completionDate)) ? "{0:dd.MM.yyyy}".format(this.workOrder.completionDate) : "-";

        return (
            <PageContainer alertClassName={rentaTaskStyles.alert} className={this.css(rentaTaskStyles.pageContainer, styles.workOrder)}>

                <PageHeader title={this.title} className={this.css(rentaTaskStyles.leftPageHeader, styles.title)} />
                
                <PageRow className={this.css(rentaTaskStyles.pageRow)}>

                    {
                        (this.state.workOrder) &&
                        (
                            <div className={styles.container}>

                                <div className={styles.data}>
                                    <div>

                                        { this.renderData() }

                                    </div>
                                </div>

                                <div className={styles.info}>

                                    <p>{Localizer.rentaTasksWorkOrderLabelStatus} <mark>{"{0:WorkOrderStatus}".format(this.workOrder.currentStatus)}</mark></p>
                                    <p>{Localizer.rentaTasksWorkOrderLabelActivationDate} <mark>{activationDate}</mark></p>
                                    <p>{Localizer.rentaTasksWorkOrderLabelCompletionDate} <mark>{completionDate}</mark></p>

                                </div>

                                {
                                    (this.canSignIn) &&
                                    (
                                        <Button block
                                                className={rentaTaskStyles.bigButton}
                                                type={ButtonType.Orange}
                                                label={Localizer.rentaTasksWorkOrderButtonLabelSignIn}
                                                icon={{name: "fas user-clock"}}
                                                onClick={async () => await this.signInAsync()}
                                        />
                                    )
                                }

                                {
                                    (this.canSignOut) &&
                                    (
                                        <Button block
                                                className={rentaTaskStyles.bigButton}
                                                type={ButtonType.Orange}
                                                label={Localizer.rentaTasksWorkOrderButtonLabelSignOut}
                                                icon={{name: "fas user-clock"}}
                                                onClick={async () => await this.signOutAsync()}
                                        />
                                    )
                                }

                                <Button block
                                        className={rentaTaskStyles.bigButton}
                                        type={ButtonType.Orange}
                                        label={Localizer.workOrdersModalActionsEdit}
                                        icon={{name: "far edit"}}
                                        disabled={!this.canEdit}
                                        onClick={async () => await this.editAsync()}
                                />

                                <Button block
                                        className={rentaTaskStyles.bigButton}
                                        type={ButtonType.Orange}
                                        label={Localizer.rentaTasksWorkOrderButtonLabelAddEquipment}
                                        icon={{name: "fas tools"}}
                                        disabled={!this.canAddEquipment}
                                        onClick={async () => await this.addEquipmentAsync()}
                                />

                                <Button block
                                        className={rentaTaskStyles.bigButton}
                                        type={ButtonType.Success}
                                        label={Localizer.workOrdersModalActionsComplete}
                                        icon={{name: "far check-circle"}}
                                        disabled={!this.canComplete}
                                        onClick={async () => await this.completeAsync()}
                                />

                                <Button block
                                        className={rentaTaskStyles.bigButton}
                                        type={ButtonType.Blue}
                                        label={Localizer.rentaTasksWorkOrderButtonLabelBack}
                                        onClick={async () => PageRouteProvider.back()}
                                />

                            </div>
                        )
                    }
                    
                </PageRow>

            </PageContainer>
        );
    }
}