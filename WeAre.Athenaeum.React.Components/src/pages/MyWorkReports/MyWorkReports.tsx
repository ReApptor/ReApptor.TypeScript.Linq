import React from "react";
import {Utility, FileModel} from "@weare/athenaeum-toolkit";
import {ch} from "@weare/athenaeum-react-common";
import User from "@/models/server/User";
import AnonymousPage from "../../models/base/AnonymousPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import {CellAction, CellModel, ColumnActionDefinition, ColumnActionType, ColumnDefinition, GridHoveringType, GridModel, GridOddType, RowModel} from "@/components/Grid/GridModel";
import { ActionType, CustomerApprovalType } from "@/models/Enums";
import Grid from "../../components/Grid/Grid";
import WorkOrderModel from "../../models/server/WorkOrderModel";
import Localizer from "../../localization/Localizer";

export default class MyWorkReports extends AnonymousPage {
    
    private readonly _workReportsGridRef: React.RefObject<Grid<WorkOrderModel>> = React.createRef();
    
    private readonly _workReportsColumns: ColumnDefinition[] = [
        {
            header: Localizer.tasksPanelCodeLanguageItemName,
            accessor: "code",
            minWidth: 65,
            noWrap: true,
            className: "grey"
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelNameLanguageItemName,
            accessor: "name",
            minWidth: 140,
            init: (cell) => this.initNameColumn(cell),
            noWrap: true,
            settings: {
                descriptionTitle: Localizer.tasksPanelWorkReportDescriptionLanguageItemName,
                descriptionAccessor: "description",
            }
        } as ColumnDefinition,
        {
            header: Localizer.genericNameAndProjectLanguageItemName,
            group: Localizer.genericConstructionsiteLanguageItemName,
            accessor: "owner.name",
            minWidth: 140,
            maxWidth: 140,
            noWrap: true,
            settings: {
                infoAccessor: "owner.externalId"
            },
        } as ColumnDefinition,
        {
            header: Localizer.formInputAddressLanguageItemName,
            group: Localizer.genericConstructionsiteLanguageItemName,
            accessor: "owner.location.formattedAddress",
            minWidth: 140,
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelTypeLanguageItemName,
            group: Localizer.genericApprovalLanguageItemName,
            accessor: "approvalType",
            format: "CustomerApprovalType",
            minWidth: 80,
        } as ColumnDefinition,
        {
            accessor: "sentAt",
            header: Localizer.tasksPanelSentAtLanguageItemName,
            group: Localizer.genericApprovalLanguageItemName,
            format: "D",
            minWidth: 80,
        } as ColumnDefinition,
        {
            accessor: "approvedAt",
            header: Localizer.myWorkReportApprovedAtLanguageItemName,
            group: Localizer.genericApprovalLanguageItemName,
            format: "D",
            minWidth: 80,
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelActionsLanguageItemName,
            minWidth: 140,
            init: (cell) => this.initWorkReportOperations(cell),
            actions: [
                {
                    name: "approve",
                    title: Localizer.tasksPanelApproveWorkReportInvoiceLanguageItemName,
                    icon: "far thumbs-up",
                    type: ActionType.Create,
                    confirm: (cell: CellModel<WorkOrderModel>) => Utility.format(Localizer.myWorkReportsConfirmationApprove, cell.model.code),
                    callback: async (cell, action) => await this.processWorkReportOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "decline",
                    title: Localizer.myWorkReportDeclineWorkReportLanguageItemName,
                    icon: "far thumbs-down",
                    type: ActionType.Delete,
                    confirm: (cell: CellModel<WorkOrderModel>) => Utility.format(Localizer.myWorkReportsConfirmationDecline, cell.model.code),
                    callback: async (cell, action) => await this.processWorkReportOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    title: Localizer.tasksPanelPreviewWorkReportLanguageItemName,
                    type: ColumnActionType.Preview,
                    right: true,
                    callback: async (cell, action) => await this.processWorkReportOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    title: Localizer.tasksPanelDownloadWorkReportLanguageItemName,
                    type: ColumnActionType.Download,
                    right: true,
                    callback: async (cell, action) => await this.processWorkReportOperationAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ];

    private async getWorkReportsAsync(): Promise<WorkOrderModel[]> {
        return await this.workReportsGrid.getAsync("api/myWorkOrders/getWorkReports");
    }

    private initWorkReportsRow(row: RowModel<WorkOrderModel>): void {

        const model: WorkOrderModel = row.model;

        const approved: boolean = model.approved;
        const declined: boolean = model.declined;

        row.className = (approved)
            ? "bg-approved"
            : (declined)
                ? "bg-declined"
                : "";
    }

    private initWorkReportOperations(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        const approved: boolean = model.approved;
        const declined: boolean = model.declined;

        const approveAction: CellAction<WorkOrderModel> = cell.actions[0];
        const declineAction: CellAction<WorkOrderModel> = cell.actions[1];
        const previewAction: CellAction<WorkOrderModel> = cell.actions[2];
        const downloadAction: CellAction<WorkOrderModel> = cell.actions[3];

        approveAction.visible = (!approved) && (!declined);
        declineAction.visible = (!approved) && (!declined);
        previewAction.visible =  true;
        downloadAction.visible = true;
    }

    private initNameColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.readonly = true;
        cell.descriptionAction!.visible = !!model.description;
    }

    private async processWorkReportOperationAsync(cell: CellModel<WorkOrderModel>, action: CellAction<WorkOrderModel>): Promise<void> {

        const model: WorkOrderModel = cell.model;

        if (action.action.name === "preview") {

            await this.previewWorkReportPdfAsync(cell);

        } else if (action.action.name === "download") {

            const file: FileModel = await this.postAsync("api/myWorkOrders/getWorkReportPdf", model.id);
            
            ch.download(file);
        } else if (action.action.name === "approve") {

            model.approved = true;
            model.approvedAt = Utility.now();
            model.approvedBy = ch.getUser<User>();
            model.declined = false;
            model.declinedAt = null;
            model.declinedBy = null;
            //model.processedByCustomerAt = Utility.now();

            await cell.grid.postAsync("api/myWorkOrders/approveMyWorkOrder", model.id);

            await cell.row.bindAsync();
        } else if (action.action.name === "decline") {

            model.declined = true;
            model.declinedAt = Utility.now();
            model.declinedBy = ch.getUser<User>();
            model.approved = false;
            model.approvedAt = null;
            model.approvedBy = null;
            //model.processedByCustomerAt = Utility.now();

            await cell.grid.postAsync("api/myWorkOrders/declineWorkReport", model.id);

            await cell.row.bindAsync();
        }
    }

    private async previewWorkReportPdfAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const workReportId: string = cell.model.id;
        await ch.documentPreviewAsync("api/myWorkOrders/getWorkReportPdf", workReportId, Localizer.documentPreviewModalWorkReportTitle);
    }

    private get workReportsGrid(): GridModel<WorkOrderModel> {
        return this._workReportsGridRef.current!.model;
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                
                <PageHeader title={Localizer.myWorkReportMyReport}/>
                
                <PageRow>
                    
                    <div className="col">

                        <Grid ref={this._workReportsGridRef}
                              hovering={GridHoveringType.Row}
                              odd={GridOddType.None}
                              noDataText={Localizer.myWorkReportNoData}
                              columns={this._workReportsColumns}
                              initRow={(row) => this.initWorkReportsRow(row)}
                              fetchData={async () => await this.getWorkReportsAsync()}
                        />
                        
                    </div>
                    
                </PageRow>

            </PageContainer>
        );
    }
}