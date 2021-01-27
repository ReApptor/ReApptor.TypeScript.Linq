import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch, IBaseComponent, TextAlign} from "@weare/athenaeum-react-common";
import {CellAction, CellModel, ColumnActionDefinition, ColumnDefinition, ColumnSettingsDefinition, ColumnType, GridHoveringType, GridModel, GridOddType, RowModel} from "@/components/Grid/GridModel";
import Grid from "../../../components/Grid/Grid";
import {ButtonType} from "@/components/Button/Button";
import {IconSize} from "@/components/Icon/Icon";
import Product from "@/models/server/Product";
import {ActionType, ProductUnit, WorkOrderStatus} from "@/models/Enums";
import {DropdownAlign} from "@/components/Form/Inputs/Dropdown/Dropdown";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import SaveWorkOrderEquipmentRequest from "@/models/server/requests/SaveWorkOrderEquipmentRequest";
import WorkOrderEquipmentData from "@/models/server/WorkOrderEquipmentData";
import TabContainer from "@/components/TabContainer/TabContainer";
import Tab from "@/components/TabContainer/Tab/Tab";
import Inline, {JustifyContent} from "@/components/Layout/Inline/Inline";
import ToolbarButton from "@/components/ToolbarContainer/ToolbarButton/ToolbarButton";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import TaskMounter from "@/models/server/TaskMounter";
import SaveUserSalaryHourRequest from "@/models/server/requests/SaveUserSalaryHourRequest";
import UserContext from "@/models/server/UserContext";
import {DefaultPrices} from "@/models/server/DefaultPrices";
import AddMounterHoursRequest from "@/models/server/requests/AddMounterHoursRequest";
import RentaTaskConstants from "@/helpers/RentaTaskConstants";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import WorkOrderDistance from "@/models/server/WorkOrderDistance";
import SaveWorkOrderDistanceRequest from "@/models/server/requests/SaveWorkOrderDistanceRequest";
import Comparator from "@/helpers/Comparator";
import Localizer from "../../../localization/Localizer";

enum WorkOrderAccess {
    Editable,
    
    PriceEditable,
    
    Readonly,
}

interface IWorkOrderDetailsProps {
    workOrder: WorkOrderModel;
    products: Product[];
    mounters: TaskMounter[];
    defaultPrices: DefaultPrices | null;
    onCostChange(sender: IBaseComponent): Promise<void>;
}

interface IWorkOrderDetailsPanelState {
    selectedTabIndex: number,
    managerUserIds: string[];
    mounterUserIds: string[];
}

export default class WorkOrderDetailsPanel extends BaseComponent<IWorkOrderDetailsProps, IWorkOrderDetailsPanelState> {

    state: IWorkOrderDetailsPanelState = {
        selectedTabIndex: 0,
        managerUserIds: [],
        mounterUserIds: []
    };

    public getTitle(): string {
        return Localizer.topNavWorkOrders;
    }

    private readonly _hoursGridRef: React.RefObject<Grid<UserSalaryHour>> = React.createRef();
    private readonly _equipmentGridRef: React.RefObject<Grid<WorkOrderEquipmentData>> = React.createRef();
    private readonly _distancesGridRef: React.RefObject<Grid<WorkOrderDistance>> = React.createRef();
    
    private readonly _hoursColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: "#",
            textAlign: TextAlign.Left,
            minWidth: 40,
            stretch: false
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsHoursGridDayLanguageItemName,
            accessor: "day",
            format: "D",
            textAlign: TextAlign.Left,
            type: ColumnType.Date,
            editable: true,
            minWidth: 90,
            settings: {
                max: Utility.today()
            },
            init: (cell) => this.initHoursDayAndUserColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsHoursGridUserLanguageItemName,
            accessor: "user",
            type: ColumnType.Dropdown,
            settings: {
                fetchItems: async () => this.props.mounters,
                align: DropdownAlign.Left,
                multiple: false,
                autoCollapse: true
            },
            editable: true,
            minWidth: 150,
            init: (cell) => this.initHoursDayAndUserColumn(cell),
        } as ColumnDefinition,
        {
            group: Localizer.workOrderDetailsHoursGridHoursHeaderLanguageItemName,
            header: Localizer.workOrderDetailsHoursGridNormalHoursLanguageItemName,
            accessor: "normalHours",
            type: ColumnType.Number,
            format: "0.0",
            editable: true,
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                infoAccessor: "autoHours",
                infoTitle: Localizer.taskHoursPanelHoursInfoLanguageItemName,
                infoBoldNotEqual: true
            } as ColumnSettingsDefinition,
            init: (cell) => this.initColumn(cell),
            callback: async (cell) => await this.calcCostAsync(cell)
        } as ColumnDefinition,
        {
            group: Localizer.workOrderDetailsHoursGridHoursHeaderLanguageItemName,
            header: Localizer.workOrderDetailsHoursGridOverTime50LanguageItemName,
            accessor: "overtime50Hours",
            type: ColumnType.Number,
            format: "0.0",
            editable: true,
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                hideZero: true
            } as ColumnSettingsDefinition,
            init: (cell) => this.initColumn(cell),
            callback: async (cell) => await this.calcCostAsync(cell)
        } as ColumnDefinition,
        {
            group: Localizer.workOrderDetailsHoursGridHoursHeaderLanguageItemName,
            header: Localizer.workOrderDetailsHoursGridOverTime100LanguageItemName,
            accessor: "overtime100Hours",
            type: ColumnType.Number,
            format: "0.0",
            editable: true,
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                hideZero: true
            } as ColumnSettingsDefinition,
            init: (cell) => this.initColumn(cell),
            callback: async (cell) => await this.calcCostAsync(cell)
        } as ColumnDefinition,
        {
            group: Localizer.tasksPanelCostLanguageItemName,
            header: Localizer.workOrderDetailsHoursGridPriceLanguageItemName,
            accessor: "hoursPrice",
            type: ColumnType.Number,
            format: "0.0",
            editable: true,
            visible: this.isAdminOrBusinessManager,
            settings: {
                infoAccessor: (workOrder) => ConstructionSiteOrWarehouse.getHoursPrice(workOrder.owner, this.props.defaultPrices),
                infoTitle: Localizer.workOrderDetailsPanelGridHoursHoursPriceInfoTitleLanguageItemName,
                infoHideEqual: true,
            } as ColumnSettingsDefinition,
            init: (cell) => this.initColumn(cell, true),
            callback: async (cell) => await this.calcCostAsync(cell),
        } as ColumnDefinition,
        {
            group: Localizer.tasksPanelCostLanguageItemName,
            header: Localizer.tasksPanelCostLanguageItemName,
            accessor: "cost",
            format: "C",
            minWidth: 75,
            visible: this.isAdminOrBusinessManager
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelActionsLanguageItemName,
            minWidth: 100,
            stretch: false,
            removable: false,
            init: (cell) => this.initHoursOperations(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.tasksPanelCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processHourOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.tasksPanelCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processHourOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "delete",
                    title: Localizer.tasksPanelDeleteHoursLanguageItemName,
                    icon: "far trash-alt",
                    type: ActionType.Delete,
                    right: true,
                    callback: async (cell, action) => await this.processHourOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "restore",
                    title: Localizer.taskHoursPanelRestoreDeletedHoursLanguageItemName,
                    icon: "far undo-alt",
                    type: ActionType.Create,
                    right: true,
                    callback: async (cell, action) => await this.processHourOperationAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ]
    
    private readonly _equipmentColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: "#",
            textAlign: TextAlign.Left,
            minWidth: 40,
            stretch: false
        } as ColumnDefinition,
        {
            header: Localizer.workOrderEquipmentNameLanguageItemName,
            accessor: "product",
            type: ColumnType.Dropdown,
            reRenderRow: true,
            settings: {
                align: DropdownAlign.Left,
                fetchItems: async () => this.props.products,
            },
            minWidth: 300,
            stretch: true,
            callback: async (cell) => await this.onProductChangeAsync(cell),
            init: (cell) => this.initEquipmentProductColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.workOrderEquipmentDescriptionLanguageItemName,
            accessor: "description",
            type: ColumnType.Text,
            minWidth: 280,
        } as ColumnDefinition,
        {
            header: Localizer.workOrderEquipmentAmountLanguageItemName,
            accessor: "amount",
            type: ColumnType.Number,
            reRenderRow: true,
            minWidth: 100,
            editable: true,
            format: "0.00",
            init: (cell) => this.initColumn(cell),
            callback: async (cell) => await this.calcEquipmentCostAsync(cell),
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsPanelGridProductUnitLanguageItemName,
            accessor: "product.unit",
            format: "ProductUnit",
            minWidth: 75,
        } as ColumnDefinition,
        {
            header: Localizer.workOrderEquipmentPriceLanguageItemName,
            accessor: "price",
            type: ColumnType.Number,
            textAlign: TextAlign.Left,
            format: "C",
            reRenderRow: true,
            editable: true,
            visible: this.isAdminOrBusinessManager,
            settings: {
                infoAccessor: "product.price",
                infoTitle: Localizer.workOrderDetailsPanelGridEquipmentPriceInfoTitleLanguageItemName,
                infoHideEqual: true
            } as ColumnSettingsDefinition,
            init: (cell) => this.initColumn(cell, true, false),
            callback: async (cell) => await this.calcEquipmentCostAsync(cell)
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelCostLanguageItemName,
            accessor: "cost",
            textAlign: TextAlign.Center,
            format: "C",
            minWidth: 75,
            visible: this.isAdminOrBusinessManager
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelActionsLanguageItemName,
            minWidth: 100,
            stretch: true,
            init: (cell) => this.initEquipmentOperations(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.tasksPanelCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processEquipmentOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.tasksPanelCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processEquipmentOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "delete",
                    title: Localizer.tasksPanelDeleteHoursLanguageItemName,
                    icon: "far trash-alt",
                    type: ActionType.Delete,
                    right: true,
                    confirm: (cell: CellModel<WorkOrderEquipmentData>) => cell.model.id && Localizer.workOrderDetailsPanelGridEquipmentConfirmDelete.format(cell.model.product),
                    callback: async (cell, action) => await this.processEquipmentOperationAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ];
    
    private readonly _distancesColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: "#",
            textAlign: TextAlign.Left,
            minWidth: 40,
            stretch: false
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsPanelGridDistancesDayLanguageItemName,
            accessor: "day",
            format: "D",
            textAlign: TextAlign.Left,
            type: ColumnType.Date,
            editable: true,
            minWidth: 90,
            init: (cell) => this.initDistanceDayColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsPanelGridDistancesVehiclesLanguageItemName,
            accessor: "vehicles",
            type: ColumnType.Number,
            reRenderRow: true,
            minWidth: 100,
            editable: true,
            format: "0",
            init: (cell) => this.initColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsPanelGridDistancesDistanceLanguageItemName,
            accessor: "value",
            type: ColumnType.Number,
            reRenderRow: true,
            minWidth: 100,
            editable: true,
            format: "0.0",
            init: (cell) => this.initColumn(cell),
            callback: async (cell) => await this.calcDistanceCostAsync(cell),
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsPanelGridDistancesPriceLanguageItemName,
            accessor: () => WorkOrderModel.getDistancesPrice(this.workOrder),
            textAlign: TextAlign.Left,
            format: "C",
            reRenderRow: true,
            visible: this.isAdminOrBusinessManager
        } as ColumnDefinition,
        {
            header: Localizer.workOrderDetailsPanelGridDistancesCostLanguageItemName,
            accessor: (model: WorkOrderDistance) => model.value * WorkOrderModel.getDistancesPrice(this.workOrder),
            textAlign: TextAlign.Center,
            format: "C",
            minWidth: 75,
            visible: this.isAdminOrBusinessManager
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelActionsLanguageItemName,
            minWidth: 100,
            stretch: true,
            init: (cell) => this.initDistanceOperations(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.tasksPanelCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processDistanceOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.tasksPanelCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processDistanceOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "delete",
                    title: Localizer.tasksPanelDeleteHoursLanguageItemName,
                    icon: "far trash-alt",
                    type: ActionType.Delete,
                    right: true,
                    confirm: (cell: CellModel<WorkOrderDistance>) => cell.model.id && Localizer.workOrderDetailsPanelGridDistancesConfirmDelete.format(cell.model.value, cell.model.day),
                    callback: async (cell, action) => await this.processDistanceOperationAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ];

    private initColumn(cell: CellModel<UserSalaryHour> | CellModel<WorkOrderEquipmentData> | CellModel<WorkOrderDistance>, priceColumn: boolean = false, onlyNewIsEditable: boolean = false): void {
        const model: UserSalaryHour | WorkOrderEquipmentData | WorkOrderDistance = cell.row.model;
        const isNew: boolean = (!model.id);
        const editable: boolean = (
            ((this.access == WorkOrderAccess.Editable) || ((priceColumn) && (this.access == WorkOrderAccess.PriceEditable))) &&
            ((!onlyNewIsEditable) || (isNew))
        );
        cell.readonly = (cell.isDeleted) || (!editable);
    }

    private initHoursDayAndUserColumn(cell: CellModel<UserSalaryHour>): void {
        this.initColumn(cell, false, true);
        cell.valid = this.isHoursDayAndUserValid(cell);
    }

    private initEquipmentProductColumn(cell: CellModel<WorkOrderEquipmentData>): void {
        this.initColumn(cell, false, true);
        cell.valid = this.isEquipmentProductValid(cell);
    }

    private initDistanceDayColumn(cell: CellModel<WorkOrderDistance>): void {
        this.initColumn(cell, false, true);
        cell.valid = this.isDistanceDayValid(cell);
    }
    
    private initRow(row: RowModel<WorkOrderModel> | RowModel<WorkOrderEquipmentData>): void {
        const model: WorkOrderModel = this.workOrder;
        row.className = WorkOrderModel.getBackgroundStyle(model);
    }
    
    private async invokeWorkOrderCostChangeAsync(): Promise<void> {
        // sync equipment, userSalaryHours & distances
        this.workOrder.equipments = this.equipmentGrid.rows.where(item => !item.deleted).map(item => item.model);
        this.workOrder.userSalaryHours = this.hoursGrid.rows.where(item => !item.deleted).map(item => item.model);
        this.workOrder.distances = this.distancesGrid.rows.where(item => !item.deleted).map(item => item.model);
        await this.props.onCostChange(this);
    }

    private async calcCostAsync(cell: CellModel<UserSalaryHour>): Promise<void> {
        const model: UserSalaryHour = cell.model;
        const cost: number = UserSalaryHour.calcCost(model);
        if (cost != model.cost) {
            model.cost = cost;
            const costCell: CellModel<UserSalaryHour> = cell.row.get("cost");
            await costCell.reRenderAsync();
            await this.invokeWorkOrderCostChangeAsync();
        }
    }

    private async calcEquipmentCostAsync(cell: CellModel<WorkOrderEquipmentData>) {
        const model: WorkOrderEquipmentData = cell.model;
        const cost: number = model.amount * model.price;
        if (cost != model.cost) {
            model.cost = cost;
            const costCell: CellModel<WorkOrderEquipmentData> = cell.row.get("cost");
            await costCell.reRenderAsync();
            await this.invokeWorkOrderCostChangeAsync();
        }
    }

    private async calcDistanceCostAsync(cell: CellModel<WorkOrderDistance>) {
        await cell.row.reRenderAsync();
        await this.invokeWorkOrderCostChangeAsync();
    }

    private async fetchEquipmentAsync(sender: IBaseComponent): Promise<WorkOrderEquipmentData[]> {
        const equipment: WorkOrderEquipmentData[] = await sender.postAsync("/api/WorkOrders/getWorkOrderEquipment", this.workOrder.id);
        this.workOrder.equipments = equipment;
        return equipment;
    }

    private async fetchUserSalaryHoursAsync(sender: IBaseComponent): Promise<UserSalaryHour[]> {
        const userSalaryHours: UserSalaryHour[] = await sender.postAsync("/api/WorkOrders/getWorkOrderHours", this.workOrder.id);
        this.workOrder.userSalaryHours = userSalaryHours;
        return userSalaryHours;
    }

    private async fetchDistancesAsync(sender: IBaseComponent): Promise<WorkOrderDistance[]> {
        const distances: WorkOrderDistance[] = await sender.postAsync("/api/WorkOrders/getWorkOrderDistances", this.workOrder.id);
        this.workOrder.distances = distances;
        return distances;
    }

    private async processHourOperationAsync(cell: CellModel<UserSalaryHour>, action: CellAction<UserSalaryHour>): Promise<void> {

        const model: UserSalaryHour = cell.model;

        if (action.action.name === "save") {

            if (!model.id) {
                
                const request = new AddMounterHoursRequest();
                request.workOrderId = model.workOrderId!;
                request.normalHours = model.normalHours;
                request.overtime50Hours = model!.overtime50Hours!;
                request.overtime100Hours = model!.overtime100Hours!;
                request.userId = model.user!.id;
                request.hoursPrice = model.hoursPrice;
                request.day = model.day;

                cell.row.model = await cell.grid.postAsync("api/employees/addMounterHours", request);
                
                await cell.row.bindAsync();
                
            } else {

                const request = new SaveUserSalaryHourRequest();
                request.userSalaryHourId = model.id;
                request.constructionSiteOrWarehouseId = model.ownerId;
                request.workOrderId = model.workOrderId!;
                request.normalHours = model.normalHours;
                request.overtime50Hours = model!.overtime50Hours!;
                request.overtime100Hours = model!.overtime100Hours!;
                request.userSalaryDayId = model.userSalaryDayId;
                request.userSalaryHourId = model.id;
                request.hoursPrice = model.hoursPrice;

                await cell.grid.postAsync("api/employees/saveUserSalaryHour", request);
                
                await cell.row.saveAsync();
            }

        } else if (action.action.name === "cancel") {

            await cell.row.cancelAsync();

        } else if (action.action.name === "delete") {

            const deletePermanently: boolean = (!model.id);
            if (deletePermanently) {
                await cell.grid.deleteAsync(cell.row.index);
            } else {
                await cell.grid.postAsync("api/employees/deleteUserSalaryHour", model.id);

                await cell.row.setDeletedAsync(true);
            }
            
            await this.invokeWorkOrderCostChangeAsync();

        } else if (action.action.name === "restore") {
            
            await cell.row.setDeletedAsync(false);

            const restoreOnServer = (model.id != "");

            if (restoreOnServer) {
                await cell.grid.postAsync("api/employees/restoreUserSalaryHour", model.id);
            }

            await cell.row.setDeletedAsync(false);

            await this.invokeWorkOrderCostChangeAsync();
            
        }
    }

    private async processEquipmentOperationAsync(cell: CellModel<WorkOrderEquipmentData>, action: CellAction<WorkOrderEquipmentData>): Promise<void> {

        const model: WorkOrderEquipmentData = cell.model;

        if (action.action.name === "save") {
            
            const request = new SaveWorkOrderEquipmentRequest();
            request.id = (model.id) ? model.id : null;
            request.productId = model!.product!.id;
            request.description = model.description;
            request.amount = model.amount;
            request.price = model.price;
            request.workOrderId = model.workOrderId;

            cell.row.model = await cell.grid.postAsync("api/workOrders/SaveWorkOrderEquipment", request);
            
            await cell.row.bindAsync();

        } else if (action.action.name === "cancel") {
            
            await cell.row.cancelAsync();

        } else if (action.action.name === "delete") {
            
            const isNew: boolean = !model.id;

            if (!isNew) {
                await cell.grid.postAsync("api/workOrders/DeleteWorkOrderEquipment", model.id);
            }
            
            await cell.grid.deleteAsync(cell.row.index);

            await this.invokeWorkOrderCostChangeAsync();
            
        }
    }

    private async processDistanceOperationAsync(cell: CellModel<WorkOrderDistance>, action: CellAction<WorkOrderDistance>): Promise<void> {

        const model: WorkOrderDistance = cell.model;

        if (action.action.name === "save") {
            
            const request = new SaveWorkOrderDistanceRequest();
            request.id = (model.id) ? model.id : null;
            request.workOrderId = model.workOrderId;
            request.day = model.day;
            request.vehicles = model.vehicles;
            request.value = model.value;

            cell.row.model = await cell.grid.postAsync("api/workOrders/SaveWorkOrderDistance", request);
            
            await cell.row.bindAsync();

        } else if (action.action.name === "cancel") {
            
            await cell.row.cancelAsync();

        } else if (action.action.name === "delete") {

            const isNew: boolean = !model.id;

            if (!isNew) {
                await cell.grid.postAsync("api/workOrders/DeleteWorkOrderDistance", model.id);
            }
            
            await cell.grid.deleteAsync(cell.row.index);

            await this.invokeWorkOrderCostChangeAsync();
            
        }
    }

    private async onTabSelect(index: number): Promise<void> {
        if (this.state.selectedTabIndex != index) {
            await this.setState({selectedTabIndex: index});
        }
    }

    private async buttonActionAsync() {
        if (this.state.selectedTabIndex == 0) {
            await this.addProductAsync();
        }
        if (this.state.selectedTabIndex == 1) {
            await this.addHourAsync();
        }
        if (this.state.selectedTabIndex == 2) {
            await this.addDistanceAsync();
        }
        await this.invokeWorkOrderCostChangeAsync();
    }

    private async addHourAsync(): Promise<void> {
        const salaryHour = new UserSalaryHour();
        salaryHour.hoursPrice = WorkOrderModel.getHoursPrice(this.workOrder, this.props.defaultPrices);
        salaryHour.workOrderId = this.workOrder.id;
        salaryHour.normalHours = 7.5;
        salaryHour.cost = UserSalaryHour.calcCost(salaryHour);
        
        await this.hoursGrid.addAsync(salaryHour);
    }

    private async addProductAsync(): Promise<void> {
        const equipmentData = new WorkOrderEquipmentData();
        equipmentData.workOrderId = this.workOrder.id;
        await this.equipmentGrid.addAsync(equipmentData);
    }

    private async addDistanceAsync(): Promise<void> {
        const distance = new WorkOrderDistance();
        distance.workOrderId = this.workOrder.id;
        distance.vehicles = 1;
        distance.value = 1;
        await this.distancesGrid.addAsync(distance);
    }

    private async onProductChangeAsync(cell: CellModel<WorkOrderEquipmentData>) {
        const model: WorkOrderEquipmentData = cell.model;
        model.price = (model.product) ? model.product.price : 0;
        model.productId = (model.product) ? model.product.id : "";
        await cell.row.reRenderAsync();
        await this.calcEquipmentCostAsync(cell);
    }

    private isHoursDayAndUserValid(cell: CellModel<UserSalaryHour>): boolean {
        const model: UserSalaryHour = cell.model;
        return !cell.someRows(item => (item.day.equals(model.day)) && (Comparator.isEqual(item.user, model.user)), true, false);
    }

    private isHoursValid(cell: CellModel<UserSalaryHour>): boolean {
        const model: UserSalaryHour = cell.model;
        return (!model.day.inFuture()) && (this.isHoursDayAndUserValid(cell));
    }

    private initHoursOperations(cell: CellModel<UserSalaryHour>): void {
        const model: UserSalaryHour = cell.model;
        const isNew: boolean = !model.id;
        const modified: boolean = cell.row.modified;
        const deleted: boolean = cell.row.deleted;
        const canDelete: boolean = (this.access == WorkOrderAccess.Editable);
        const isValid: boolean = this.isHoursValid(cell);

        const saveAction: CellAction<UserSalaryHour> = cell.actions[0];
        const cancelAction: CellAction<UserSalaryHour> = cell.actions[1];
        const deleteAction: CellAction<UserSalaryHour> = cell.actions[2];
        const restoreAction: CellAction<UserSalaryHour> = cell.actions[3];

        saveAction.visible = (isValid) && (modified) && (!deleted);
        cancelAction.visible = (modified) && (!deleted) && (!isNew);
        deleteAction.visible = (canDelete) && (!deleted);
        restoreAction.visible = (canDelete) && (deleted);
    }

    private isEquipmentProductValid(cell: CellModel<WorkOrderEquipmentData>): boolean {
        const model: WorkOrderEquipmentData = cell.model;
        return !cell.someRows(item => Comparator.isEqual(item.product, model.product));
    }

    private isEquipmentValid(cell: CellModel<WorkOrderEquipmentData>): boolean {
        const model: WorkOrderEquipmentData = cell.model;
        return (model.product != null) && (this.isEquipmentProductValid(cell));
    }

    private initEquipmentOperations(cell: CellModel<WorkOrderEquipmentData>): void {
        const model: WorkOrderEquipmentData = cell.model;
        const isNew: boolean = !model.id;
        const modified: boolean = cell.row.modified;
        const deleted: boolean = cell.row.deleted;
        const canDelete: boolean = (this.access == WorkOrderAccess.Editable);
        const isValid: boolean = this.isEquipmentValid(cell);

        const saveAction: CellAction<WorkOrderEquipmentData> = cell.actions[0];
        const cancelAction: CellAction<WorkOrderEquipmentData> = cell.actions[1];
        const deleteAction: CellAction<WorkOrderEquipmentData> = cell.actions[2];

        saveAction.visible = (isValid) && (modified) && (!deleted);
        cancelAction.visible = (modified) && (!deleted) && (!isNew);
        deleteAction.visible = (canDelete) && (!deleted);
    }
    
    private isDistanceDayValid(cell: CellModel<WorkOrderDistance>): boolean {
        const model: WorkOrderDistance = cell.model;
        return !cell.someRows(item => item.day.equals(model.day));
    }
    
    private isDistanceValid(cell: CellModel<WorkOrderDistance>): boolean {
        const model: WorkOrderDistance = cell.model;
        return (model.value > 0) && (this.isDistanceDayValid(cell));
    }

    private initDistanceOperations(cell: CellModel<WorkOrderDistance>): void {
        const model: WorkOrderDistance = cell.model;
        const isNew: boolean = !model.id;
        const modified: boolean = cell.row.modified;
        const deleted: boolean = cell.row.deleted;
        const canDelete: boolean = (this.access == WorkOrderAccess.Editable);
        const isValid: boolean = this.isDistanceValid(cell);

        const saveAction: CellAction<WorkOrderDistance> = cell.actions[0];
        const cancelAction: CellAction<WorkOrderDistance> = cell.actions[1];
        const deleteAction: CellAction<WorkOrderDistance> = cell.actions[2];

        saveAction.visible = (isValid) && (!deleted) && ((modified) || (isNew));
        cancelAction.visible = (modified) && (!deleted) && (!isNew);
        deleteAction.visible = (canDelete) && (!deleted);
    }

    private get workOrder(): WorkOrderModel {
        return this.props.workOrder;
    }
    
    private get equipmentGrid(): GridModel<WorkOrderEquipmentData> {
        return this._equipmentGridRef.current!.model;
    }

    private get hoursGrid(): GridModel<UserSalaryHour> {
        return this._hoursGridRef.current!.model;
    }

    private get distancesGrid(): GridModel<WorkOrderDistance> {
        return this._distancesGridRef.current!.model;
    }

    private get addButtonTitle(): string {
        return (this.state.selectedTabIndex === 0)
            ? Localizer.workOrderEquipmentAddProduct
            : (this.state.selectedTabIndex === 1)
                ? Localizer.workOrderDetailsAddHours
                : (this.state.selectedTabIndex === 2)
                    ? Localizer.workOrderDetailsAddDistance
                    : "";
    }

    private get isAdminOrBusinessManager(): boolean {
        const context: UserContext = ch.getContext() as UserContext;
        return context.isAdmin || context.isBusinessManager;
    }

    private get access(): WorkOrderAccess {
        const currentStatus: WorkOrderStatus = this.workOrder.currentStatus;
        if (currentStatus <= WorkOrderStatus.Completed) {
            return WorkOrderAccess.Editable;
        }
        if ((this.isAdminOrBusinessManager) && (currentStatus <= WorkOrderStatus.ReadyForInvoicing)) {
            return WorkOrderAccess.PriceEditable;
        }
        return WorkOrderAccess.Readonly;
    }

    public render(): React.ReactNode {

        return (
            <div>
                
                {
                    (this.access == WorkOrderAccess.Editable) &&
                    (
                        <Inline justify={JustifyContent.End}>
                            <ToolbarButton icon={{name: "plus", size: IconSize.Large}}
                                           label={this.addButtonTitle}
                                           type={ButtonType.Orange}
                                           disabled={this.access != WorkOrderAccess.Editable}
                                           onClick={async () => await this.buttonActionAsync()}
                            />
                        </Inline>
                    )
                }
                
                <TabContainer id="TaskManagementTabs" onSelect={async (tab) => await this.onTabSelect(tab.index)}>
                    
                    <Tab id="equipments" title={Localizer.workOrdersEquipmentsTabTitle}>
                        <Grid ref={this._equipmentGridRef}
                              columns={this._equipmentColumns}
                              readonly={this.access == WorkOrderAccess.Readonly}
                              minWidth="auto"
                              noDataText={Localizer.workOrderDetailsPanelGridEquipmentNoDataText}
                              hovering={GridHoveringType.Row}
                              odd={GridOddType.None}
                              initRow={(row) => this.initRow(row)}
                              fetchData={async (sender)=> await this.fetchEquipmentAsync(sender)}
                        />
                    </Tab>
                    
                    <Tab id="hours" title={Localizer.workOrdersHoursTabTitle}>
                        <Grid ref={this._hoursGridRef}
                              columns={this._hoursColumns}
                              readonly={this.access == WorkOrderAccess.Readonly}
                              minWidth="auto"
                              noDataText={Localizer.workOrderDetailsPanelGridHoursNoDataText}
                              hovering={GridHoveringType.Row}
                              odd={GridOddType.None}
                              initRow={(row) => this.initRow(row)}
                              fetchData={async (sender)=> await this.fetchUserSalaryHoursAsync(sender)}
                        />
                    </Tab>
                    
                    <Tab id="distance" title={Localizer.workOrderDetailsDistancesTabTitle}>
                        <Grid ref={this._distancesGridRef}
                              columns={this._distancesColumns}
                              readonly={this.access == WorkOrderAccess.Readonly}
                              minWidth="auto"
                              noDataText={Localizer.workOrderDetailsPanelGridDistancesNoDataText}
                              hovering={GridHoveringType.Row}
                              odd={GridOddType.None}
                              initRow={(row) => this.initRow(row)}
                              fetchData={async (sender)=> await this.fetchDistancesAsync(sender)}
                        />
                    </Tab>
                    
                </TabContainer>
                
            </div>
        );
    }
}