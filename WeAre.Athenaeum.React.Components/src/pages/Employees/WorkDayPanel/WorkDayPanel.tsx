import React from "react";
import {Utility, GeoLocation, IPagedList} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch, IBaseComponent, PageCacheProvider, PageRoute, TextAlign, VerticalAlign} from "@weare/athenaeum-react-common";
import Grid from "../../../components/Grid/Grid";
import {CellAction, CellModel, CellPaddingType, ColumnActionDefinition, ColumnDefinition, ColumnSettingsDefinition, ColumnType, GridHoveringType, GridModel, GridOddType, RowModel} from "@/components/Grid/GridModel";
import {ActionType, ConstructionSiteOrWarehouseType, WorkDayState} from "@/models/Enums";
import List from "../../../components/List/List";
import GetEmployeeStatusesRequest from "../../../models/server/requests/GetEmployeeStatusesRequest";
import UserStatus from "../../../models/server/UserStatus";
import Toolbar from "./Toolbar/Toolbar";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import UserSalaryHour from "../../../models/server/UserSalaryHour";
import GetUserSalaryHoursRequest from "../../../models/server/requests/GetUserSalaryHoursRequest";
import {DropdownAlign, DropdownVerticalAlign} from "@/components/Form/Inputs/Dropdown/Dropdown";
import ArrayScope from "../../../models/ArrayScope";
import ToolbarModel from "./Toolbar/ToolbarModel";
import LeftPanel from "./LeftPanel/LeftPanel";
import ConstructionSiteOrWarehouse from "../../../models/server/ConstructionSiteOrWarehouse";
import CheckInsPanel from "./CheckInsPanel/CheckInsPanel";
import Comparator from "../../../helpers/Comparator";
import User from "../../../models/server/User";
import UserSalaryAggregate from "../../../models/server/UserSalaryAggregate";
import GetUserSalaryAggregatesRequest from "../../../models/server/requests/GetUserSalaryAggregatesRequest";
import PageDefinitions from "../../../providers/PageDefinitions";
import AddMounterHoursRequest from "../../../models/server/requests/AddMounterHoursRequest";
import UserSalaryDay from "../../../models/server/UserSalaryDay";
import SaveUserSalaryHourRequest from "../../../models/server/requests/SaveUserSalaryHourRequest";
import SaveUserSalaryDayRequest from "../../../models/server/requests/SaveUserSalaryDayRequest";
import RentaTaskConstants from "../../../helpers/RentaTaskConstants";
import TransformProvider from "../../../providers/TransformProvider";
import Localizer from "../../../localization/Localizer";

import styles from "./WorkDayPanel.module.scss";

interface IWorkDayPanelProps {
}

interface IWorkDayPanelState {
    filters: ToolbarModel;
    managerUserIds: string[];
    mounterUserIds: string[];
}

export default class WorkDayPanel extends BaseComponent<IWorkDayPanelProps, IWorkDayPanelState> {

    state: IWorkDayPanelState = {
        filters: WorkDayPanel.initializeFilters(),
        managerUserIds: WorkDayPanel.initializeManagers(),
        mounterUserIds: [],
    };
    
    private static initializeFilters(): ToolbarModel {
        return new ToolbarModel();
    }

    private static initializeManagers(): string[] {
        const user: User = ch.getUser();
        return (user.isManager) ? [user.id] : [];
    }

    private readonly _managersRef: React.RefObject<List<UserStatus>> = React.createRef();
    private readonly _mountersRef: React.RefObject<List<UserStatus>> = React.createRef();
    private readonly _userSalaryHoursRef: React.RefObject<Grid<UserSalaryHour>> = React.createRef();
    private readonly _userSalaryAggregatesRef: React.RefObject<Grid<UserSalaryAggregate>> = React.createRef();

    private readonly _columns: ColumnDefinition[] = [
        {
            header: Localizer.tasksPanelDateLanguageItemName,
            accessor: "day",
            format: (date: Date) => Utility.format("{0:D}\n{0:dddd}", date),
            textAlign: TextAlign.Center,
            minWidth: 100,
            className: styles.fixedLineHeight,
            init: (cell) => this.initDayColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.addTaskModalMountersLanguageItemName,
            accessor: "user",
            className: "blue",
            minWidth: 250,
            maxWidth: 250,
            init: (cell) => this.initUserColumn(cell),
            actions: [
                {
                    name: "details",
                    title: Localizer.workDayPanelDetailsInfoLanguageItemName,
                    icon: "far info-square",
                    type: ActionType.Secondary,
                    callback: async (cell) => await this.toggleDetails(cell)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            header: Localizer.checkInsPanelSiteOrWarehouseLanguageItemName,
            accessor: "owner",
            transform: (cell, value) => (value) ? TransformProvider.constructionSiteOrWarehouseToString(value, true) : "",
            init: (cell) => this.initSiteOrWarehouseColumn(cell),
            route: (cell) => this.getConstructionSiteRoute(cell),
            minWidth: 250,
            maxWidth: 250,
            actions: [
                {
                    name: "add",
                    title: Localizer.workDayPanelAddNewTaskHoursLanguageItemName,
                    icon: "fas plus",
                    type: ActionType.Info,
                    callback: async (cell) => await this.addTaskHoursAsync(cell)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            header: Localizer.checkInsPanelTaskLanguageItemName,
            accessor: "workOrder",
            type: ColumnType.Dropdown,
            noWrap: true,
            settings: {
                fetchItems: async (cell) => this.getTasksAsync(cell),
                nothingSelectedText: "*",
                align: DropdownAlign.Left,
                verticalAlign: DropdownVerticalAlign.Auto
            },
            editable: true,
            minWidth: 350,
            maxWidth: 350,
            init: (cell) => this.initTaskColumn(cell),
            callback: async (cell: CellModel<any>) => await this.onTaskChangeAsync(cell)
        } as ColumnDefinition,
        {
            header: Localizer.workDayPanelWorkingHoursLanguageItemName,
            accessor: "normalHours",
            type: ColumnType.Number,
            format: "0.0",
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                infoAccessor: "autoHours",
                infoTitle: Localizer.taskHoursPanelHoursInfoLanguageItemName,
                infoBoldNotEqual: true
            } as ColumnSettingsDefinition,
            editable: true,
            init: (cell) => this.initOvertime(cell),
            actions: [
                {
                    name: "right",
                    title: Localizer.salaryHoursPanelOvertimeFiftyLanguageItemName,
                    icon: "fal caret-right",
                    callback: async (cell, action) => await this.moveOvertimeAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            header: "50%",
            accessor: "overtime50Hours",
            group: Localizer.taskHoursPanelOvertimeLanguageItemName,
            rotate: true,
            type: ColumnType.Number,
            format: "0.0",
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                hideZero: true
            } as ColumnSettingsDefinition,
            editable: true,
            init: (cell) => this.initOvertime(cell),
            callback: async (cell) => await this.calcOvertimeTotalHoursAsync(cell),
            actions: [
                {
                    name: "left",
                    title: Localizer.salaryHoursPanelMarkAsNormalLanguageItemName,
                    icon: "fal caret-left",
                    callback: async (cell, action) => await this.moveOvertimeAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "right",
                    title: Localizer.salaryHoursPanelOvertimeHundredLanguageItemName,
                    icon: "fal caret-right",
                    callback: async (cell, action) => await this.moveOvertimeAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            header: "100%",
            accessor: "overtime100Hours",
            group: Localizer.taskHoursPanelOvertimeLanguageItemName,
            rotate: true,
            type: ColumnType.Number,
            format: "0.0",
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                hideZero: true
            } as ColumnSettingsDefinition,
            editable: true,
            init: (cell) => this.initOvertime(cell),
            callback: async (cell) => await this.calcOvertimeTotalHoursAsync(cell),
            actions: [
                {
                    name: "left",
                    title: Localizer.salaryHoursPanelOvertimeFiftyLanguageItemName,
                    icon: "fal caret-left",
                    callback: async (cell, action) => await this.moveOvertimeAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            header: Localizer.salaryHoursPanelTotalLanguageItemName,
            group: Localizer.taskHoursPanelOvertimeLanguageItemName,
            accessor: "overtimeTotalHours",
            rotate: true,
            format: "0.0",
            minWidth: 85,
            className: "dark-blue",
            init: (cell) => this.initHourColumns(cell)
        } as ColumnDefinition,
        {
            stretch: true,
            minWidth: 74,
            init: (cell) => this.initHourOperations(cell),
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
        {
            group: Localizer.workDayPanelWorkDayLanguageItemName,
            header: Localizer.workDayPanelWorkDayTypeLanguageItemName,
            accessor: "userSalaryDay.state",
            type: ColumnType.Enum,
            format: "WorkDayState",
            verticalAlign: VerticalAlign.Middle,
            minWidth: 130,
            maxWidth: 130,
            init: (cell) => this.initDayColumns(cell),
        } as ColumnDefinition,
        {
            stretch: true,
            minWidth: 74,
            init: (cell) => this.initDayOperations(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.tasksPanelCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processDayOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.tasksPanelCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processDayOperationAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ];

    private readonly _aggregateColumns: ColumnDefinition[] = [
        {
            header: Localizer.tasksPanelDateLanguageItemName,
            accessor: "from",
            format: (date: Date) => Utility.format("{0:MM.yyyy}", date),
            textAlign: TextAlign.Center,
            minWidth: 100,
        } as ColumnDefinition,
        {
            header: Localizer.taskHoursPanelMounterLanguageItemName,
            accessor: "user",
            className: "blue",
            minWidth: 250,
        } as ColumnDefinition,
        {
            header: Localizer.workDayPanelAutoHoursLanguageItemName,
            accessor: "autoHours",
            format: "0.0",
            textAlign: TextAlign.Center,
            className: "grey",
            settings: {
                hideZero: true,
            },
            total: true
        } as ColumnDefinition,
        {
            header: Localizer.salaryHoursPanelWorkingHoursLanguageItemName,
            accessor: "normalHours",
            format: "0.0",
            textAlign: TextAlign.Center,
            settings: {
                hideZero: true,
            },
            total: true
        } as ColumnDefinition,
        {
            header: "50%",
            group: Localizer.taskHoursPanelOvertimeLanguageItemName,
            accessor: "overtime50Hours",
            format: "0.0",
            rotate: true,
            textAlign: TextAlign.Center,
            settings: {
                hideZero: true,
            },
            total: true
        } as ColumnDefinition,
        {
            header: "100%",
            group: Localizer.taskHoursPanelOvertimeLanguageItemName,
            accessor: "overtime100Hours",
            format: "0.0",
            rotate: true,
            textAlign: TextAlign.Center,
            settings: {
                hideZero: true,
            },
            total: true
        } as ColumnDefinition,
        {
            header: Localizer.salaryHoursPanelTotalLanguageItemName,
            group: Localizer.taskHoursPanelOvertimeLanguageItemName,
            accessor: "overtimeTotalHours",
            format: "0.0",
            rotate: true,
            textAlign: TextAlign.Center,
            settings: {
                hideZero: true,
            },
            total: true
        } as ColumnDefinition
    ];

    private async selectManagersAsync(sender: List<UserStatus>): Promise<void> {
        const managers: UserStatus[] = sender.selectedItems;
        const managerUserIds: string[] = managers.map(userStatus => userStatus.user.id);
        await this.setState({managerUserIds});
        if (this.dailyHours) {
            await this.userSalaryHoursGrid.reloadAsync();
        }
    }

    private async selectMountersAsync(sender: List<UserStatus>): Promise<void> {
        const mounters: UserStatus[] = sender.selectedItems;
        const mounterUserIds: string[] = mounters.map(userStatus => userStatus.user.id);
        await this.setState({mounterUserIds});
        if (this.dailyHours) {
            await this.userSalaryHoursGrid.reloadAsync();
        } else {
            await this.userSalaryAggregatesGrid.reloadAsync();
        }
    }

    private async getMountersAsync(sender: IBaseComponent): Promise<UserStatus[]> {
        const request = new GetEmployeeStatusesRequest();
        request.from = this.state.filters.from;
        request.to = this.state.filters.to;
        request.source = this.state.filters.source;
        return sender.postAsync("api/employees/getEmployeeStatuses", request);
    }

    private async getManagersAsync(sender: IBaseComponent): Promise<UserStatus[]> {
        const request = new GetEmployeeStatusesRequest();
        request.from = this.state.filters.from;
        request.to = this.state.filters.to;
        request.source = this.state.filters.source;
        return sender.postAsync("api/employees/getManagerStatuses", request);
    }

    private async fetchConstructionSitesAsync(sender: IBaseComponent): Promise<ConstructionSiteOrWarehouse[]> {
        return await PageCacheProvider.getAsync("fetchConstructionSitesAsync", async () => await sender.postAsync("api/employees/getConstructionSites", null));
    }

    private async fetchTasksAsync(sender: IBaseComponent, siteOrWarehouseId: string): Promise<WorkOrderModel[]> {
        return PageCacheProvider.getAsync(`fetchTasksAsync:${siteOrWarehouseId}`, async () => await sender.postAsync("api/employees/getTasks", siteOrWarehouseId));
    }

    private async getTasksAsync(cell: CellModel<UserSalaryHour>): Promise<WorkOrderModel[]> {
        const model: UserSalaryHour = cell.model;
        return this.fetchTasksAsync(cell.grid.instance, model.ownerId);
    }

    private async getUserSalaryAggregatesAsync(): Promise<UserSalaryAggregate[]> {
        const reportType: string | Date | null = this.state.filters.reportType;
        const request = new GetUserSalaryAggregatesRequest();
        request.mounterUserIds = this.state.mounterUserIds;
        request.month = reportType as Date;
        return await this.userSalaryAggregatesGrid.postAsync("api/employees/getUserSalaryAggregates", request);
    }

    private async getUserSalaryHoursAsync(pageNumber: number, pageSize: number): Promise<IPagedList<UserSalaryHour>> {
        const request = new GetUserSalaryHoursRequest();
        request.from = this.state.filters.from;
        request.to = this.state.filters.to;
        request.source = this.state.filters.source;
        request.mounterUserIds = this.state.mounterUserIds;
        request.managerUserIds = this.state.managerUserIds;
        request.pageNumber = pageNumber;
        request.pageSize = pageSize;
        return await this.userSalaryHoursGrid.postAsync("api/employees/getUserSalaryHours", request);
    }

    private async addUserSalaryHoursAsync(sender: IBaseComponent, request: AddMounterHoursRequest): Promise<void> {
        await sender.postAsync("api/employees/addMounterHours", request);
        
        if (this.dailyHours) {
            this.userSalaryHoursGrid.reload();
        }
    }

    private async onFiltersChange(filters: ToolbarModel, reloadManagersAndMounters: boolean, clear: boolean): Promise<void> {
        
        if (clear) {
            await this.setState({filters, managerUserIds: [], mounterUserIds: []});
        } else {
            await this.setState({filters});
        }

        if (this.dailyHours) {
            if (reloadManagersAndMounters) {
                
                let managerUserIds: string[] = this.state.managerUserIds;
                
                if (this.managersList.hasData) {
                    await this.managersList.reloadAsync();

                    managerUserIds = this.managersList.selectedItems.map((item: UserStatus) => item.user.id);
                }

                let mounterUserIds: string[] = this.state.mounterUserIds;
                
                if (this.mountersList.hasData) {
                    await this.mountersList.reloadAsync();

                    mounterUserIds = this.mountersList.selectedItems.map((item: UserStatus) => item.user.id);
                }

                await this.setState({managerUserIds, mounterUserIds});
            }

            await this.userSalaryHoursGrid.reloadAsync();
        } else {
            await this.userSalaryAggregatesGrid.reloadAsync();
        }
    }

    private async onTaskChangeAsync(cell: CellModel<UserSalaryHour>): Promise<void> {
        await this.validateTasksAsync(cell.row);

        const extraHoursCell: CellModel<UserSalaryHour> = cell.next;
        await extraHoursCell.reRenderAsync();
    }

    private loopHourRowsAsync(row: RowModel<UserSalaryHour>): ArrayScope {

        const model: UserSalaryHour = row.model;
        const user: User | null = model.user;
        const day: Date = model.day;
        const constructionSiteOrWarehouse: ConstructionSiteOrWarehouse | null = model.owner;
        let inScope = (subRow: RowModel<UserSalaryHour>): boolean => {
            const subModel: UserSalaryHour = subRow.model;
            return Comparator.isEqual(subModel.day, day) && (Comparator.isEqual(subModel.user, user) && Comparator.isEqual(subModel.owner, constructionSiteOrWarehouse));
        };

        return row.loop(inScope);
    }

    private isTaskValid(row: RowModel<UserSalaryHour>, subRow: RowModel<UserSalaryHour> | null = null): boolean {

        if (!row.hasDeleted) {
            const model: UserSalaryHour = row.model;
            const workOrder: WorkOrderModel | null = model.workOrder;

            if (workOrder == null) {
                return false;
            }

            if ((subRow != null) && (row.index != subRow.index) && (!subRow.deleted)) {
                const subTask: WorkOrderModel | null = subRow.model.workOrder;
                const sameTask: boolean = (subTask != null) && (subTask.id === workOrder.id);
                if (sameTask) {
                    return false;
                }
            }
        }

        return true;
    }

    private async validateTasksAsync(row: RowModel<UserSalaryHour>): Promise<void> {

        const taskColumnIndex: number = 3;

        const scope: ArrayScope = this.loopHourRowsAsync(row);

        const rows: RowModel<UserSalaryHour>[] = row.grid.rows;
        for (let index1: number = scope.firstIndex; index1 <= scope.lastIndex; index1++) {
            const row1: RowModel<UserSalaryHour> = rows[index1];
            let row1Valid: boolean = true;
            for (let index2: number = scope.firstIndex; index2 <= scope.lastIndex; index2++) {
                const row2: RowModel<UserSalaryHour> = rows[index2];
                row1Valid = (row1Valid) && (this.isTaskValid(row1, row2));
            }
            await row1.cells[taskColumnIndex].setValidAsync(row1Valid);
        }
    }

    private groupByDay(cell: CellModel<UserSalaryHour>): void {
        if (!cell.spanned) {
            const model: UserSalaryHour = cell.row.model;
            const day: Date = model.day;
            const sameDates: RowModel<UserSalaryHour>[] = (cell.nextRows(item => Comparator.isEqual(item.day, day)));
            cell.rowSpan = (sameDates.length + 1);
        }
    }
    
    private getDailyRows(cell: CellModel<UserSalaryHour>, start: number = 1): RowModel<UserSalaryHour>[] {
        const model: UserSalaryHour = cell.row.model;
        const day: Date = model.day;
        const user: User | null = model.user;
        return (cell.nextRows(item => Comparator.isEqual(item.day, day) && (Comparator.isEqual(item.user, user)), start));
    }

    private groupByUser(cell: CellModel<UserSalaryHour>): void {
        if (!cell.spanned) {
            const model: UserSalaryHour = cell.row.model;
            const userDailyHours: RowModel<UserSalaryHour>[] = this.getDailyRows(cell);
            userDailyHours.forEach(row => row.model.userSalaryDay = model.userSalaryDay!);
            cell.rowSpan = userDailyHours.length + 1;
        }
    }

    private groupBySiteOrWarehouse(cell: CellModel<UserSalaryHour>): void {
        if (!cell.spanned) {
            const model: UserSalaryHour = cell.row.model;
            const day: Date = model.day;
            const user: User | null = model.user;
            const constructionSiteOrWarehouse: ConstructionSiteOrWarehouse | null = model.owner;
            const sameSitesOrWarehouses: RowModel<UserSalaryHour>[] = cell.nextRows(item =>
                Comparator.isEqual(item.day, day) &&
                Comparator.isEqual(item.user, user) &&
                Comparator.isEqual(item.owner, constructionSiteOrWarehouse));
            cell.rowSpan = (sameSitesOrWarehouses.length + 1);
        }
    }

    private initDayColumn(cell: CellModel<UserSalaryHour>): void {
        this.groupByDay(cell);
        if (!cell.spanned) {
            const mounterRows: RowModel<UserSalaryHour>[] = cell.spannedRows;
            const approved: boolean = mounterRows.every(row => row.model.locked);
            const deleted: boolean = mounterRows.every(row => this.isHourRowDeleted(row));

            cell.className = (approved || deleted)
                    ? styles.approvedRow
                    : styles.notApprovedRow;
            cell.deleted = deleted;
        }
    }

    private initUserColumn(cell: CellModel<UserSalaryHour>): void {
        this.groupByUser(cell);
        if (!cell.spanned) {
            //const model: UserSalaryHour = cell.row.model;
            const siteRows: RowModel<UserSalaryHour>[] = cell.spannedRows;
            const approved: boolean = siteRows.every(row => row.model.locked);
            const deleted: boolean = siteRows.every(row => this.isHourRowDeleted(row));
            const detailsAction: CellAction<UserSalaryHour> = cell.actions[0];

            cell.className = (approved || deleted)
                    ? styles.approvedRow
                    : styles.notApprovedRow;
            cell.deleted = deleted;

            detailsAction.visible = (!deleted) && (!approved);
        }
    }

    private initSiteOrWarehouseColumn(cell: CellModel<UserSalaryHour>): void {
        this.groupBySiteOrWarehouse(cell);
        if (!cell.spanned) {
            const model: UserSalaryHour = cell.row.model;
            const add: CellAction<UserSalaryHour> = cell.actions[0];
            const siteRows: RowModel<UserSalaryHour>[] = cell.spannedRows;
            const approved: boolean = siteRows.every(row => row.model.locked);
            const deleted: boolean = siteRows.every(row => this.isHourRowDeleted(row));
            const address: GeoLocation | null = (model.owner) ? model.owner.location : null;

            const className: string = (approved || deleted)
                    ? styles.approvedRow
                    : styles.notApprovedRow;

            cell.deleted = deleted;
            cell.className = className;

            cell.title = TransformProvider.locationToString(address);

            add.visible = (!approved) && (!deleted);
        }
    }

    private getHourCells(row: RowModel<UserSalaryHour>): CellModel<UserSalaryHour>[] {
        return row.cells.slice(3, 8);
    }

    private getDayCells(row: RowModel<UserSalaryHour>): CellModel<UserSalaryHour>[] {
        return row.cells.slice(-2, -1);
    }

    private isHourRowDeleted(row: RowModel<UserSalaryHour>): boolean {
        return this.getHourCells(row).some(cell => cell.deleted);
    }

    private initHourColumns(cell: CellModel<UserSalaryHour>): void {
        const model: UserSalaryHour = cell.row.model;
        cell.readonly = (model.locked);
        cell.className = ((model.locked) || (cell.row.hasDeleted))
            ? styles.approvedRow
            : styles.notApprovedRow;
    }

    private initHourOperations(cell: CellModel<UserSalaryHour>): void {
        this.initHourColumns(cell);

        const hourCells: CellModel<UserSalaryHour>[] = this.getHourCells(cell.row);

        const model: UserSalaryHour = cell.row.model;
        const modified: boolean = hourCells.some(cell => cell.modified);
        const deleted: boolean = (cell.row.hasDeleted);
        const valid: boolean = (cell.row.valid);

        const saveAction: CellAction<UserSalaryHour> = cell.actions[0];
        const cancelAction: CellAction<UserSalaryHour> = cell.actions[1];
        const deleteAction: CellAction<UserSalaryHour> = cell.actions[2];
        const restoreAction: CellAction<UserSalaryHour> = cell.actions[3];
        
        saveAction.visible = (modified) && (!deleted) && (valid);
        cancelAction.visible = (modified) && (!deleted);
        deleteAction.visible = (!modified) && (!model.locked) && (!deleted);
        restoreAction.visible = (deleted) && (!model.locked);
    }

    private initDayColumns(cell: CellModel<UserSalaryHour>): void {

        this.groupByUser(cell);

        if (!cell.spanned) {
            //const model: UserSalaryHour = cell.row.model;

            const hourRows: RowModel<UserSalaryHour>[] = cell.spannedRows;
            const deleted: boolean = hourRows.every(row => row.hasDeleted);

            cell.readonly = (deleted);
            cell.className = (deleted)
                    ? styles.approvedRow
                    : styles.notApprovedRow;
        }
    }

    private initDayOperations(cell: CellModel<UserSalaryHour>): void {

        this.initDayColumns(cell);

        if (!cell.spanned) {
            const dayCells: CellModel<UserSalaryHour>[] = this.getDayCells(cell.row);
            const modified: boolean = dayCells.some(cell => cell.modified);

            const save: CellAction<UserSalaryHour> = cell.actions[0];
            const cancel: CellAction<UserSalaryHour> = cell.actions[1];

            save.visible = modified;
            cancel.visible = modified;
        }
    }

    private initTaskColumn(cell: CellModel<UserSalaryHour>): void {
        this.initHourColumns(cell);
        const model: UserSalaryHour = cell.row.model;
        cell.valid = cell.valid && this.isTaskValid(cell.row);
        if ((cell.className != styles.approvedRow) &&
            (cell.className != styles.exportedRow) &&
            (model.workOrder != null) && (model.workOrder.completed)) {
            cell.className = styles.completedTask;
        }
    }

    private initOvertime(cell: CellModel<UserSalaryHour>): void {
        this.initHourColumns(cell);
        const model: UserSalaryHour = cell.row.model;
        const normalHours: number = cell.value;
        const deleted: boolean = cell.isDeleted;
        cell.actions.forEach(action => {
            action.visible = (normalHours > 0) && (!model.locked) && (!deleted);
        });
    }

    private async moveOvertimeAsync(cell: CellModel<UserSalaryHour>, action: CellAction<UserSalaryHour>): Promise<void> {
        const normalHours: number = cell.value;
        const actionName: string | null = action.action.name;
        if (actionName === "left") {
            let prevHours: number = cell.prev.value as number;
            prevHours += normalHours;
            await cell.prev.setValueAsync(prevHours);
            await cell.setValueAsync(0);
        } else if (actionName === "right") {
            let nextHours: number = cell.next.value as number;
            nextHours += normalHours;
            await cell.next.setValueAsync(nextHours);
            await cell.setValueAsync(0);
        } else if (actionName === "normalHours") {
            const hoursCell: CellModel<UserSalaryHour> = cell.row.get("normalHours");
            let nextHours: number = hoursCell.value as number;
            nextHours += normalHours;
            await hoursCell.setValueAsync(nextHours);
            await cell.setValueAsync(0);
        }

        await this.calcOvertimeTotalHoursAsync(cell);
    }

    private async processHourOperationAsync(cell: CellModel<UserSalaryHour>, action: CellAction<UserSalaryHour>): Promise<void> {

        const model: UserSalaryHour = cell.model;
        if (action.action.name === "save") {
            const request = new SaveUserSalaryHourRequest();
            request.userSalaryDayId = model.userSalaryDay!.id;
            request.userSalaryHourId = model.id;
            request.constructionSiteOrWarehouseId = model.ownerId;
            request.workOrderId = model.workOrder!.id;
            request.normalHours = model.normalHours;
            request.overtime50Hours = model.overtime50Hours;
            request.overtime100Hours = model.overtime100Hours;
            model.id = await cell.grid.postAsync("api/employees/saveUserSalaryHour", request);
            const hourCells: CellModel<UserSalaryHour>[] = this.getHourCells(cell.row);
            await hourCells.forEach((cell) => cell.save());
            await cell.row.reRenderAsync();
        } else if (action.action.name === "cancel") {
            const hourCells: CellModel<UserSalaryHour>[] = this.getHourCells(cell.row);
            await hourCells.forEach((cell) => cell.cancel());
            await cell.row.reRenderAsync();
        } else if (action.action.name === "delete") {
            const deletePermanently: boolean = (model.id == "");
            if (deletePermanently) {
                await cell.grid.deleteAsync(cell.row.index);
            } else {
                await cell.grid.postAsync("api/employees/deleteUserSalaryHour", model.id);
                const hourCells: CellModel<UserSalaryHour>[] = this.getHourCells(cell.row);
                await hourCells.forEach((cell) => cell.deleted = true);
                await this.validateTasksAsync(cell.row);
                await cell.row.reRenderAsync(true);
            }
        } else if (action.action.name === "restore") {
            const restoreOnServer = (model.id != "");
            if (restoreOnServer) {
                await cell.grid.postAsync("api/employees/restoreUserSalaryHour", model.id);
            }
            const hourCells: CellModel<UserSalaryHour>[] = this.getHourCells(cell.row);
            await hourCells.forEach((cell) => cell.deleted = false);
            await this.validateTasksAsync(cell.row);
            await cell.row.reRenderAsync(true);
        }
    }

    private async processDayOperationAsync(cell: CellModel<UserSalaryHour>, action: CellAction<UserSalaryHour>): Promise<void> {
        const model: UserSalaryHour = cell.row.model;
        const userSalaryDay: UserSalaryDay = model.userSalaryDay!;

        if (action.action.name === "save") {
            const dayCells: CellModel<UserSalaryHour>[] = this.getDayCells(cell.row);
            await dayCells.forEach((cell) => cell.save());
            const request = new SaveUserSalaryDayRequest();
            request.userSalaryDayId = userSalaryDay.id;
            request.state = userSalaryDay.state;
            await cell.grid.postAsync("api/employees/saveUserSalaryDay", request);
            await cell.row.reRenderAsync();
        } else if (action.action.name === "cancel") {
            const dayCells: CellModel<UserSalaryHour>[] = this.getDayCells(cell.row);
            await dayCells.forEach((cell) => cell.cancel());
            await cell.row.reRenderAsync();
        }
    }

    private async addTaskHoursAsync(cell: CellModel<UserSalaryHour>): Promise<void> {
        const row: RowModel<UserSalaryHour> = cell.row;
        const model: UserSalaryHour = row.model;

        const newModel = new UserSalaryHour();
        newModel.userSalaryDay = model.userSalaryDay;
        newModel.user = model.user;
        newModel.day = model.day;
        newModel.ownerId = model.ownerId;
        newModel.owner = model.owner;
        newModel.hoursPrice = model.hoursPrice;
        newModel.workOrder = null;

        const lastTaskRow: RowModel<UserSalaryHour> = (cell.spannedRows[cell.spannedRows.length - 1]);
        const newRowIndex: number = lastTaskRow.index + 1;

        await row.grid.insertAsync(newRowIndex, newModel);
    }

    private async calcOvertimeTotalHoursAsync(cell: CellModel<UserSalaryHour>): Promise<void> {
        const model: UserSalaryHour = cell.model;
        model.overtimeTotalHours = model.overtime50Hours + model.overtime100Hours;
        const overtimeTotalHoursCell: CellModel<UserSalaryHour> = cell.row.get("overtimeTotalHours");
        await overtimeTotalHoursCell.reRenderAsync();
    }

    private getConstructionSiteRoute(cell: CellModel<UserSalaryHour>): PageRoute | null {
        const model: UserSalaryHour = cell.model;
        if ((model.owner)) {
            if ((model.owner.type === ConstructionSiteOrWarehouseType.ConstructionSite)) {
                const constructionSiteId: string = model.owner.id;
                return PageDefinitions.constructionSiteManagement(constructionSiteId);
            } else {
                const warehouseId: string = model.owner.id;
                return PageDefinitions.warehouseManagement(warehouseId);
            }
        }
        return null;
    }

    private async toggleDetails(cell: CellModel<UserSalaryHour>): Promise<void> {
        const spannedRows: RowModel<UserSalaryHour>[] = cell.spannedRows;
        const rowToExpand: RowModel<UserSalaryHour> = spannedRows[spannedRows.length - 1];
        await rowToExpand.toggleAsync();
    }

    private get userSalaryHoursGrid(): GridModel<UserSalaryHour> {
        return this._userSalaryHoursRef.current!.model;
    }

    private get userSalaryAggregatesGrid(): GridModel<UserSalaryAggregate> {
        return this._userSalaryAggregatesRef.current!.model;
    }

    private get managersList(): List<UserStatus> {
        return this._managersRef.current!;
    }

    private get mountersList(): List<UserStatus> {
        return this._mountersRef.current!;
    }

    private get dailyHours(): boolean {
        return (this.state.filters.reportType == null);
    }

    private renderDetailsContent(row: RowModel<UserSalaryHour>): React.ReactNode {
        return (
            <CheckInsPanel userSalaryHourRow={row} />
        );
    }

    public render(): React.ReactNode {

        return (
            <div className={this.css(styles.workDayPanel)}>

                <div>
                    <Toolbar model={this.state.filters}
                             fetchMounters={async (sender) => await this.getMountersAsync(sender)}
                             fetchConstructionSites={async (sender) => await this.fetchConstructionSitesAsync(sender)}
                             fetchTasks={async (sender, siteOrWarehouseId: string) => await this.fetchTasksAsync(sender, siteOrWarehouseId)}
                             onChange={async (model, reloadManagersAndMounters, clear: boolean = false) => this.onFiltersChange(model, reloadManagersAndMounters, clear)}
                             addHours={async (sender, request) => await this.addUserSalaryHoursAsync(sender, request)}
                    />
                </div>

                <div className={this.css(styles.main)}>

                    <LeftPanel className={styles.left}>

                        <div className={this.css((!this.dailyHours) && (styles.hidden))}>
                            <List multiple
                                  label={Localizer.enumUserRoleGroupManagers}
                                  ref={this._managersRef}
                                  fetchItems={async (sender) => await this.getManagersAsync(sender)}
                                  selectedItems={this.state.managerUserIds}
                                  maxHeight="initial"
                                  filterMinLength={10}
                                  onChange={async (sender: List<UserStatus>) => await this.selectManagersAsync(sender)}
                            />
                        </div>

                        <div>
                            <List multiple
                                  label={Localizer.addTaskModalMounters}
                                  ref={this._mountersRef}
                                  maxHeight="initial"
                                  filterMinLength={10}
                                  fetchItems={async (sender) => await this.getMountersAsync(sender)}
                                  selectedItems={this.state.mounterUserIds}
                                  onChange={async (sender: List<UserStatus>) => await this.selectMountersAsync(sender)}
                            />
                        </div>

                    </LeftPanel>

                    <div className={styles.right}>

                        {
                            (this.dailyHours) &&
                            (
                                <Grid id="workDay"
                                      pagination={25}
                                      ref={this._userSalaryHoursRef}
                                      className={this.css(styles.workDayTable)}
                                      hovering={GridHoveringType.EditableCell}
                                      odd={GridOddType.None}
                                      autoToggle
                                      headerMinHeight={80}
                                      cellPadding={CellPaddingType.Large}
                                      columns={this._columns}
                                      noDataText={Localizer.workDayPanelNoReportedHoursLanguageItemName}
                                      detailsColStart={1}
                                      detailsColEnd={-1}
                                      renderDetails={(row) => this.renderDetailsContent(row)}
                                      fetchData={async (sender, pageNumber, pageSize) => await this.getUserSalaryHoursAsync(pageNumber, pageSize)}
                                />
                            )
                        }

                        {
                            (!this.dailyHours) &&
                            (
                                <Grid id="_aggregates"
                                      ref={this._userSalaryAggregatesRef}
                                      className={this.css(styles.workDayTable)}
                                      hovering={GridHoveringType.Row}
                                      odd={GridOddType.Row}
                                      headerMinHeight={80}
                                      noDataText={Localizer.workDayPanelGridAggregatesNoDataText}
                                      columns={this._aggregateColumns}
                                      fetchData={async () => await this.getUserSalaryAggregatesAsync()}
                                />
                            )
                        }

                    </div>

                </div>

            </div>
        );
    }
};