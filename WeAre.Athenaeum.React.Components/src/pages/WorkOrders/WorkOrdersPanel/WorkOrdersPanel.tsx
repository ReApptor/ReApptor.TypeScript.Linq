import "./BootstrapOverride.scss";
import React from "react";
import {Utility, IPagedList, FileModel} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch, IBaseComponent, Justify, TextAlign, PageCacheProvider} from "@weare/athenaeum-react-common";
import {CellAction, CellModel, ColumnActionDefinition, ColumnActionType, ColumnDefinition, ColumnType, GridHoveringType, GridModel, GridOddType, RowModel} from "@/components/Grid/GridModel";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import Grid from "../../../components/Grid/Grid";
import {ActionType, CustomerApprovalType, WorkOrderStatus} from "@/models/Enums";
import {DropdownAlign} from "@/components/Form/Inputs/Dropdown/Dropdown";
import Dropdown from "../../../components/Form/Inputs/Dropdown/Dropdown";
import TaskMounter from "../../../models/server/TaskMounter";
import ToolbarModel from "./../Toolbar/ToolbarModel";
import GetWorkOrdersRequest from "@/models/server/requests/GetWorkOrdersRequest";
import Product from "@/models/server/Product";
import WorkOrderDetailsPanel from "@/pages/WorkOrders/WorkOrderDetailsPanel/WorkOrderDetailsPanel";
import User from "@/models/server/User";
import SaveDescriptionRequest from "@/models/server/requests/SaveDescriptionRequest";
import SaveWorkOrderRequest from "../../../models/server/requests/SaveWorkOrderRequest";
import UserContext from "@/models/server/UserContext";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import CreateWorkOrderRequest from "@/models/server/requests/CreateWorkOrderRequest";
import SendWorkOrderModal, {SendWorkOrderAction, SendWorkOrderUserType} from "@/pages/WorkOrders/WorkOrdersPanel/SendWorkOrderModal/SendWorkOrderModal";
import PageDefinitions from "@/providers/PageDefinitions";
import {DefaultPrices} from "@/models/server/DefaultPrices";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "../../../localization/Localizer";

import styles from "./WorkOrdersPanel.module.scss";

interface IWorkOrdersPanelProps {
    managerUserIds?: string[];
    mounterUserIds?: string[];
    filters: ToolbarModel;
    constructionSiteId?: string;
    readonly?: boolean;
}

interface IWorkOrdersPanelState {
    products: Product[];
    mounters: TaskMounter[];
    defaultPrices: DefaultPrices | null;
}

export default class WorkOrdersPanel extends BaseComponent<IWorkOrdersPanelProps, IWorkOrdersPanelState> {

    state: IWorkOrdersPanelState = {
        products: [],
        mounters: [],
        defaultPrices: null
    };

    private readonly _workOrdersGridRef: React.RefObject<Grid<WorkOrderModel>> = React.createRef();
    private readonly _sendWorkOrderModalRef: React.RefObject<SendWorkOrderModal> = React.createRef();

    private readonly _workOrdersColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: nameof<WorkOrderModel>(o => o.code),
            minWidth: 70,
            noWrap: true,
            className: "grey",
            init: (cell) => this.initCodeColumn(cell),
            actions: [
                {
                    title: Localizer.workOrdersShowDetailsTitleLanguageItemName,
                    type: ColumnActionType.Details,
                    callback: async (cell) => await this.toggleDetailsAsync(cell)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            header: "fas sync-alt",
            minWidth: 42,
            type: ColumnType.Icon,
            textAlign: TextAlign.Center,
            accessor: (model) => WorkOrderModel.getStateIcon(model)
        } as ColumnDefinition,
        {
            header: Localizer.checkInsPanelSiteOrWarehouseLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.owner),
            init: (cell) => this.initOwnerColumn(cell),
            transform: (cell, value) => (value) ? TransformProvider.constructionSiteOrWarehouseToString(value, true) : "",
            route: (cell: CellModel<WorkOrderModel>) => cell.model.constructionSiteId ? PageDefinitions.constructionSiteManagement(cell.model.constructionSiteId) : null,
            visible: !this.predefinedOwner,
            minWidth: 250,
            maxWidth: 250,
            type: ColumnType.Dropdown,
            settings: {
                fetchItems: async () => this.getConstructionSites(),
                align: DropdownAlign.Left,
                multiple: false,
                autoCollapse: true,
                nothingSelectedText: Localizer.workOrdersOwnerSelectConstructionSite
            },
            callback: async (cell: CellModel<WorkOrderModel>) => await this.onOwnerChangeAsync(cell)
        } as ColumnDefinition,
        {
            header: Localizer.tasksNameLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.name),
            type: ColumnType.Text,
            editable: true,
            reRenderRow: true,
            minWidth: 235,
            init: (cell) => this.initNameColumn(cell),
            settings: {
                descriptionAccessor: nameof<WorkOrderModel>(o => o.description),
                descriptionTitle: Localizer.invoicesInvoiceCommentLanguageItemName,
                descriptionJustify: Justify.Right,
                descriptionCallback: (cell) => this.updateWorkOrderDescription(cell)
            },
        } as ColumnDefinition,
        {
            header: Localizer.tasksMountersLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.mounters),
            type: ColumnType.Dropdown,
            settings: {
                fetchItems: async () => this.getWorkOrderMountersAsync(),
                align: DropdownAlign.Left,
                multiple: true,
                autoCollapse: true,
                nothingSelectedText: "0",
                selectedTextTransform: (dropdown: Dropdown<WorkOrderModel>) => dropdown.selectedListItems.length.toString(),
            },
            editable: true,
            minWidth: 75,
            init: (cell) => this.initMountersColumn(cell),
            callback: async (cell: CellModel<WorkOrderModel>) => await this.onWorkOrderMounterChangeAsync(cell)
        } as ColumnDefinition,
        {
            header: Localizer.workOrdersManagerLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.manager),
            transform: (cell: CellModel<WorkOrderModel>) => TransformProvider.toString(cell.model.manager),
            type: ColumnType.Dropdown,
            settings: {
                fetchItems: async () => this.getWorkOrderManagersAsync(),
                align: DropdownAlign.Left,
                nothingSelectedText: "-"
            },
            editable: true,
            minWidth: 150,
            maxWidth: 150
        } as ColumnDefinition,
        {
            group: Localizer.workOrdersCustomerGridHeaderLanguageItemName,
            header: Localizer.workOrdersCustomerOrdererLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.customerOrderer),
            settings: {
                align: DropdownAlign.Left,
            },
            editable: true,
            minWidth: 150,
            maxWidth: 150,
            noWrap: true,
            init: (cell) => this.initCustomerOrderer(cell),
            transform: (cell, customerOrderer: User | null) => customerOrderer ? TransformProvider.toString(customerOrderer) : "-",
            actions: [
                {
                    name: nameof<WorkOrderModel>(o => o.customerOrderer),
                    title: Localizer.workOrdersCustomerOrdererActionTooltipLanguageItemName,
                    icon: "far user-edit",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
            ]
        } as ColumnDefinition,
        {
            group: Localizer.workOrdersCustomerGridHeaderLanguageItemName,
            header: Localizer.workOrdersCustomerApproverLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.customerApprover),
            settings: {
                align: DropdownAlign.Left,
            },
            editable: true,
            minWidth: 150,
            maxWidth: 150,
            noWrap: true,
            init: (cell) => this.initCustomerApprover(cell),
            transform: (cell, customerApprover: User | null) => customerApprover ? TransformProvider.toString(customerApprover) : "-",
            actions: [
                {
                    name: nameof<WorkOrderModel>(o => o.customerApprover),
                    title: Localizer.workOrdersCustomerApproverActionTooltipLanguageItemName,
                    icon: "far user-edit",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
            ]

        } as ColumnDefinition,
        {
            header: Localizer.tasksStartLanguageItemName,
            group: Localizer.tasksDateLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.activationDate),
            type: ColumnType.Date,
            format: "D",
            editable: true,
            reRenderRow: true,
            textAlign: TextAlign.Left,
            minWidth: 90,
            init: (cell) => this.initActivationDateColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.tasksDoneLanguageItemName,
            group: Localizer.tasksDateLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.completionDate),
            type: ColumnType.Date,
            format: "D",
            editable: true,
            reRenderRow: true,
            textAlign: TextAlign.Left,
            minWidth: 90,
            init: (cell) => this.initCompletionDateColumn(cell),
        } as ColumnDefinition,
        {
            group: Localizer.workOrdersDefaultPricesGroupLanguageItemName,
            header: Localizer.workOrdersMileagePriceLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.mileagePrice),
            type: ColumnType.Number,
            format: "0.00",
            minWidth: 75,
            editable: true,
            visible: this.canSeePrices,
            settings: {
                hideZero: true,
                //infoHideEqual: true,
                //infoAccessor: (model: WorkOrderModel) => ConstructionSiteOrWarehouse.getDistancesPrice(model.owner, this.state.defaultPrices) 
            },
        } as ColumnDefinition,
        {
            group: Localizer.workOrdersDefaultPricesGroupLanguageItemName,
            header: Localizer.workOrdersHourPriceLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.hoursPrice),
            type: ColumnType.Number,
            format: "0.00",
            minWidth: 75,
            editable: true,
            visible: this.canSeePrices,
            settings: {
                hideZero: true,
                //infoHideEqual: true,
                //infoAccessor: (model: WorkOrderModel) => ConstructionSiteOrWarehouse.getHoursPrice(model.owner, this.state.defaultPrices)
            },
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelCostLanguageItemName,
            accessor: nameof<WorkOrderModel>(o => o.cost),
            format: "C",
            minWidth: 80,
            editable: false,
            visible: this.canSeePrices
        } as ColumnDefinition,
        {
            header: Localizer.workOrdersApprovalTypeLanguageItemName,
            //accessor: "approvalType",
            accessor: (model) => model.approved ? model.approvalType : null,
            format: "CustomerApprovalType",
            minWidth: 155,
            settings: {
                //infoAccessor: "sentAt",
                infoAccessor: (model) => (model.approved) ? model.approvedAt : (model.sent) ? model.sentAt : null,
                infoTitle: Localizer.workOrdersSentAtLanguageItemName,
                infoFormat: "D",
            }
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelActionsLanguageItemName,
            minWidth: 125,
            removable: false,
            init: (cell) => this.initWorkOrderOperations(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.tasksPanelCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.tasksPanelCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "complete",
                    title: Localizer.tasksPanelCompleteTaskLanguageItemName,
                    icon: "far check-circle",
                    type: ActionType.Default,
                    confirm: (cell) => Localizer.workOrderActionsConfirmCompletion.format(cell.model),
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "activate",
                    title: Localizer.tasksPanelActivateTaskLanguageItemName,
                    icon: "far play-circle",
                    type: ActionType.Default,
                    confirm: (cell) => (WorkOrderModel.isApproved(cell.model) ? Localizer.workOrderActionsConfirmCompletedActivation : Localizer.workOrderActionsConfirmActivation.format(cell.model)),
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "lock",
                    title: Localizer.workOrdersActionsLockLanguageItemName,
                    icon: "fas lock-alt",
                    type: ActionType.Create,
                    right: true,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "unlock",
                    title: Localizer.workOrderActionsUnlockLanguageItemName,
                    icon: "fas unlock-alt",
                    type: ActionType.Delete,
                    right: true,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "invoice",
                    title: Localizer.workOrdersActionsInvoice,
                    icon: "far file-invoice",
                    type: ActionType.Create,
                    confirm: Localizer.workOrderActionsConfirmInvoice,
                    right: true,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "preview",
                    title: Localizer.tasksPanelPreviewWorkReportLanguageItemName,
                    type: ColumnActionType.Preview,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "delete",
                    title: Localizer.tasksPanelDeleteHoursLanguageItemName,
                    icon: "far trash-alt",
                    type: ActionType.Delete,
                    right: true,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "restore",
                    title: Localizer.taskHoursPanelRestoreDeletedHoursLanguageItemName,
                    icon: "far undo-alt",
                    type: ActionType.Create,
                    right: true,
                    callback: async (cell, action) => await this.processWorkOrderOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "send",
                    title: Localizer.workOrdersActionsSend,
                    type: ActionType.Default,
                    icon: "far mail-bulk",
                    right: true,
                    toggleModal: SendWorkOrderModal.modalId
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ];

    private async toggleDetailsAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const spannedRows: RowModel<WorkOrderModel>[] = cell.spannedRows;
        const rowToExpand: RowModel<WorkOrderModel> = spannedRows[spannedRows.length - 1];
        await rowToExpand.toggleAsync();
    }

    private async getConstructionSites(): Promise<ConstructionSiteOrWarehouse[]> {
        return await this.getConstructionSitesAsync(this.workOrdersGrid.instance);
    }

    public async initializeAsync(): Promise<void> {
        const products: Product[] = await this.postAsync("api/rentaTasks/getAllProductsData");
        const defaultPrices: DefaultPrices = await this.postAsync("api/admin/getDefaultPrices");
        const mounters: TaskMounter[] = await this.getMountersAsync(this.workOrdersGrid.instance);
        await this.setState({products, mounters, defaultPrices});
    }

    private async getWorkOrdersAsync(pageNumber: number, pageSize: number): Promise<IPagedList<WorkOrderModel>> {
        const request = new GetWorkOrdersRequest();
        request.pageNumber = pageNumber;
        request.pageSize = pageSize;
        request.from = this.props.filters.from;
        request.to = this.props.filters.to;
        request.managerUserIds = this.props.managerUserIds || [];
        request.mounterUserIds = this.props.mounterUserIds || [];
        request.taskStatuses = this.props.filters.taskStatusesFilter;
        request.notAssigned = this.props.filters.notAssigned;
        request.constructionSiteOrWarehouseId = this.props.constructionSiteId || null;

        return await this.workOrdersGrid.postAsync("api/workOrders/getWorkOrders", request);
    }

    private async getConstructionSitesAsync(sender: IBaseComponent): Promise<ConstructionSiteOrWarehouse[]> {
        return await PageCacheProvider.getAsync("getConstructionSitesAsync", () => sender.postAsync("api/rentaManagement/getConstructionSitesData", null));
    }

    private async getMountersAsync(sender: IBaseComponent): Promise<TaskMounter[]> {
        return await PageCacheProvider.getAsync("getMountersAsync", () => sender.postAsync("api/workOrders/getMounters", null));
    }

    private async getManagersAsync(sender: IBaseComponent): Promise<User[]> {
        return await PageCacheProvider.getAsync("getManagersAsync", () => sender.postAsync("api/workOrders/getManagers", null));
    }

    private async getWorkOrderMountersAsync(): Promise<TaskMounter[]> {
        return await this.getMountersAsync(this.workOrdersGrid.instance);
    }

    private async getWorkOrderManagersAsync(): Promise<User[]> {
        return await this.getManagersAsync(this.workOrdersGrid.instance);
    }

    private initMountersColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.readonly = (model.completed);
    }

    private initCustomerOrderer(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        const action: CellAction<WorkOrderModel> = cell.actions[0];
        action.visible = (!cell.isDeleted) && (!cell.isReadonly) && (model.owner != null);
    }

    private initCustomerApprover(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        const action: CellAction<WorkOrderModel> = cell.actions[0];
        action.visible = (!cell.isDeleted) && (!cell.isReadonly) && (model.owner != null);
    }

    private initNameColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;

        cell.title = (model.createdBy != null) ? TransformProvider.userToString(model.createdBy)
            : "?";

        cell.descriptionReadonly = (!model.id) || (cell.isReadonly);
    }

    private initCodeColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        const deleted: boolean = cell.row.deleted;

        const detailsAction: CellAction<WorkOrderModel> = cell.actions[0];

        detailsAction.visible = (!deleted) && (!!model.id);
    }

    private initOwnerColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;

        const managerInfo: string = (model.manager != null) ? TransformProvider.userToString(model.manager)
            : "?";
        const addressInfo: string = (model.owner && model.owner.location)
            ? TransformProvider.locationToString(model.owner.location)
            : "?";

        cell.title = Localizer.get(Localizer.workDayPanelSiteOrWarehouseColumnTitle, managerInfo, addressInfo);
        cell.readonly = (!!model.id) || (this.predefinedOwner);
    }

    private initActivationDateColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.valid = ((model.completionDate == null) || (model.completionDate.valueOf() >= model.activationDate.valueOf()));
    }

    private initCompletionDateColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.valid = ((model.completionDate == null) || (model.completionDate.valueOf() >= model.activationDate.valueOf()));
    }

    private async onOwnerChangeAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const customerOrderer: CellModel<WorkOrderModel> = cell.row.get("customerOrderer");
        await customerOrderer.reloadAsync();
    }

    private async onWorkOrderMounterChangeAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const model: WorkOrderModel = cell.row.model;
        const mounters: any[] = (model.mounters as any[]);
        const mounterIds: string[] = mounters.map(item => (item.isEmployee) ? ((item as User).id) : (item as string));
        cell.setValue(mounterIds);
        await cell.reloadAsync();
    }

    private isValid(workOrderModel: WorkOrderModel): boolean {
        let isValid = (workOrderModel.name.length > 0);
        isValid = isValid && (workOrderModel.owner != null);
        isValid = isValid && ((workOrderModel.completionDate == null) || (workOrderModel.completionDate.valueOf() >= workOrderModel.activationDate.valueOf()));
        isValid = isValid && ((workOrderModel.completionDate == null) || (workOrderModel.completionDate.valueOf() <= Utility.today().valueOf()));
        return isValid;
    }

    private initRow(row: RowModel<WorkOrderModel>): void {
        const model: WorkOrderModel = row.model;
        const currentStatus: WorkOrderStatus = model.currentStatus;
        const editable: boolean = (currentStatus <= WorkOrderStatus.Completed);
        row.className = WorkOrderModel.getBackgroundStyle(model);
        row.readonly = (!editable);
    }

    private async updateWorkOrderDescription(cell: CellModel<WorkOrderModel>): Promise<void> {

        const model: WorkOrderModel = cell.model;

        const request: SaveDescriptionRequest = new SaveDescriptionRequest();
        request.description = model.description;
        request.id = model.id;

        await this.workOrdersGrid.postAsync("api/workOrders/saveWorkOrderDescription", request);
    }

    private initWorkOrderOperations(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        const modified: boolean = cell.row.modified;
        const deleted: boolean = cell.row.deleted;

        const isNew: boolean = (!model.id);
        const completed: boolean = (model.currentStatus == WorkOrderStatus.Completed);
        const active: boolean = (Utility.inInterval(Utility.now(), model.activationDate, model.completionDate));
        const invoiced: boolean = (model.currentStatus == WorkOrderStatus.Invoiced);
        const isAdmin: boolean = this.canSeePrices;

        const approvedByCustomer: boolean = WorkOrderModel.isApproved(model);
        const readyForInvoicing: boolean = WorkOrderModel.isReadyForInvoicing(model);

        const isValid: boolean = this.isValid(model);
        const canSend = (model.currentStatus == WorkOrderStatus.Completed);

        const saveAction: CellAction<WorkOrderModel> = cell.actions[0];
        const cancelAction: CellAction<WorkOrderModel> = cell.actions[1];
        const completeAction: CellAction<WorkOrderModel> = cell.actions[2];
        const activateAction: CellAction<WorkOrderModel> = cell.actions[3];
        const lockAction: CellAction<WorkOrderModel> = cell.actions[4];
        const unLockAction: CellAction<WorkOrderModel> = cell.actions[5];
        const invoiceAction: CellAction<WorkOrderModel> = cell.actions[6];
        const previewAction: CellAction<WorkOrderModel> = cell.actions[7];
        const deleteAction: CellAction<WorkOrderModel> = cell.actions[8];
        const restoreAction: CellAction<WorkOrderModel> = cell.actions[9];
        const sendToCustomerAction: CellAction<WorkOrderModel> = cell.actions[10];

        saveAction.visible = (modified) && (isValid) && (!deleted) && (!invoiced);
        cancelAction.visible = (modified) && (!deleted) && (!invoiced);
        completeAction.visible = (!isNew) && (!modified) && (!deleted) && (!completed) && (!invoiced) && (active);
        activateAction.visible = (!isNew) && (!deleted) && (!modified) && (!active) && (!readyForInvoicing) && (!invoiced);
        deleteAction.visible = (!deleted) && (!completed) && (!approvedByCustomer) && (!readyForInvoicing) && (!invoiced);
        restoreAction.visible = (!isNew) && (deleted);
        previewAction.visible = (!isNew) && (!deleted) && (!modified);
        lockAction.visible = (!isNew) && (!deleted) && (!modified) && (approvedByCustomer) && (!readyForInvoicing) && (!invoiced);
        unLockAction.visible = (!isNew) && (!deleted) && (readyForInvoicing) && (!invoiced) && (approvedByCustomer);
        invoiceAction.visible = (readyForInvoicing) && (isAdmin) && (!invoiced);
        sendToCustomerAction.visible = (!modified) && (canSend) && (!approvedByCustomer);
    }

    private async processWorkOrderOperationAsync(cell: CellModel<WorkOrderModel>, action: CellAction<WorkOrderModel>): Promise<void> {
        const model: WorkOrderModel = cell.model;
        const isNew: boolean = (!model.id);

        if (action.action.name === "save") {

            const saveWorkOrderRequest = new SaveWorkOrderRequest();
            saveWorkOrderRequest.workOrderId = model.id;
            saveWorkOrderRequest.name = model.name;
            saveWorkOrderRequest.hoursPrice = model.hoursPrice;
            saveWorkOrderRequest.mileagePrice = model.mileagePrice;
            saveWorkOrderRequest.description = model.description;
            saveWorkOrderRequest.mounters = model.mounters;
            saveWorkOrderRequest.managerId = model.manager ? model.manager.id : null;
            saveWorkOrderRequest.approvalType = model.approvalType;
            saveWorkOrderRequest.customerApprover = model.customerApprover;
            saveWorkOrderRequest.customerOrderer = model.customerOrderer;
            saveWorkOrderRequest.activationDate = model.activationDate;
            saveWorkOrderRequest.completionDate = model.completionDate;

            if (isNew) {
                const request = new CreateWorkOrderRequest(saveWorkOrderRequest);
                request.constructionSiteOrWarehouseId = model.owner!.id;

                cell.row.model = await cell.grid.postAsync("api/workOrders/createWorkOrder", request);
            } else {
                cell.row.model = await cell.grid.postAsync("api/workOrders/saveWorkOrder", saveWorkOrderRequest);
            }

            await cell.row.bindAsync();

        } else if (action.action.name === "cancel") {

            await cell.row.cancelAsync();

        } else if (action.action.name === "complete") {

            cell.row.model = await cell.grid.postAsync("api/workOrders/completeWorkOrder", model.id);

            await cell.row.bindAsync();

        } else if (action.action.name === "activate") {

            cell.row.model = await cell.grid.postAsync("api/workOrders/activateWorkOrder", model.id);

            await cell.row.bindAsync();

        } else if (action.action.name === "lock") {

            cell.row.model = await cell.grid.postAsync("api/workOrders/managerApproveWorkOrder", model.id);

            await cell.row.bindAsync();

        } else if (action.action.name === "unlock") {

            cell.row.model = await cell.grid.postAsync("api/workOrders/managerUnApproveWorkOrder", model.id);

            await cell.row.bindAsync();

        } else if (action.action.name === "invoice") {

            cell.row.model = await cell.grid.postAsync("api/workOrders/setInvoiced", model.id);

            await cell.row.bindAsync();

        } else if (action.action.name === "delete") {

            const deletePermanently: boolean = (model.id == "");

            if (deletePermanently) {
                await cell.grid.deleteAsync(cell.row.index);
            } else {

                await cell.grid.postAsync("api/workOrders/deleteWorkOrder", model.id);

                await cell.row.setDeletedAsync(true);
            }

        } else if (action.action.name === "restore") {

            const restoreOnServer = (model.id != "");

            if (restoreOnServer) {
                await cell.grid.postAsync("api/workOrders/restoreWorkOrder", model.id);
            }

            await cell.row.setDeletedAsync(false);

        } else if (action.action.name === "preview") {

            await this.previewWorkOrderPdfAsync(cell);

        } else if (action.action.name === "download") {

            const file: FileModel = await this.postAsync("api/workOrders/getWorkOrderPdf", model.id);

            ch.download(file);

        } else if (action.action.name === "customerOrderer") {

            await this.sendWorkOrderModal.openAsync(model, SendWorkOrderUserType.Orderer);

        } else if (action.action.name === "customerApprover") {

            await this.sendWorkOrderModal.openAsync(model, SendWorkOrderUserType.Approver);

        }
    }

    private async onCreateAndAssignContactPersonAsync(workOrder: WorkOrderModel, action: SendWorkOrderAction, successfully: boolean): Promise<void> {
        if (successfully) {

            const row: RowModel<WorkOrderModel> = this.workOrdersGrid.get(workOrder);

            if (action == SendWorkOrderAction.Save) {

                await row.setModelAsync(workOrder);

            } else {
                const message: string = (action == SendWorkOrderAction.Approve)
                    ? Localizer.workOrdersApprovedAlert
                    : Localizer.rentaTasksSignatureAlert;

                await ch.flyoutMessageAsync(message);

                row.model = workOrder;

                await row.bindAsync();
            }
        }
    }

    private async onCostChangeAsync(workOrder: WorkOrderModel): Promise<void> {
        const cost: number = WorkOrderModel.calcCost(workOrder, this.state.defaultPrices);
        if (cost != workOrder.cost) {
            workOrder.cost = cost;
            const row: RowModel<WorkOrderModel> = this.workOrdersGrid.get(workOrder);
            await row.reRenderAsync();
        }
    }

    private async previewWorkOrderPdfAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const workReportId: string = cell.model.id;
        await ch.documentPreviewAsync("api/workOrders/getWorkOrderPdf", workReportId, Localizer.documentPreviewModalWorkReportTitle);
    }

    private get predefinedOwner(): boolean {
        return !!this.props.constructionSiteId;
    }

    private get readonly(): boolean {
        return !!this.props.readonly;
    }

    private get canSeePrices(): boolean {
        const context: UserContext = ch.getContext() as UserContext;
        return context.isBusinessManager || context.isAdmin;
    }

    private get sendWorkOrderModal(): SendWorkOrderModal {
        return this._sendWorkOrderModalRef.current!;
    }

    public get workOrdersGrid(): GridModel<WorkOrderModel> {
        return this._workOrdersGridRef.current!.model;
    }

    public get hasNewRow(): boolean {
        return (this.workOrdersGrid.rows.length > 0) && (!this.workOrdersGrid.rows[0].model.id);
    }

    public getTitle(): string {
        return Localizer.topNavWorkOrders;
    }

    private renderDetailsContent(row: RowModel<WorkOrderModel>) {
        const model: WorkOrderModel = row.model;
        return (
            <WorkOrderDetailsPanel workOrder={model}
                                   mounters={this.state.mounters}
                                   products={this.state.products}
                                   defaultPrices={this.state.defaultPrices}
                                   onCostChange={async () => await this.onCostChangeAsync(model)}
            />
        );
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Grid ref={this._workOrdersGridRef} pagination autoToggle
                      className={this.css(styles.workDayTable)}
                      hovering={GridHoveringType.Row}
                      odd={GridOddType.None}
                      minWidth="auto"
                      noDataText={Localizer.workOrdersGridNoDataText}
                      readonly={this.readonly}
                      columns={this._workOrdersColumns}
                      initRow={(row) => this.initRow(row)}
                      renderDetails={(row) => this.renderDetailsContent(row)}
                      fetchData={async (sender, pageNumber, pageSize) => await this.getWorkOrdersAsync(pageNumber, pageSize)}
                />

                <SendWorkOrderModal ref={this._sendWorkOrderModalRef}
                                    onClose={async (sender, workOrder, action, successfully) => await this.onCreateAndAssignContactPersonAsync(workOrder, action, successfully)}
                />
            </React.Fragment>
        );
    }
}