import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch, TextAlign} from "@weare/athenaeum-react-common";
import Grid from "../../../../components/Grid/Grid";
import {CellAction, CellModel, ColumnActionDefinition, ColumnDefinition, ColumnSettingsDefinition, ColumnType, GridHoveringType, GridModel, GridOddType, RowModel} from "@/components/Grid/GridModel";
import WorkOrderModel from "../../../../models/server/WorkOrderModel";
import {ActionType} from "@/models/Enums";
import UserSalaryHour from "../../../../models/server/UserSalaryHour";
import RentaTaskConstants from "../../../../helpers/RentaTaskConstants";
import SaveUserSalaryHourRequest from "../../../../models/server/requests/SaveUserSalaryHourRequest";
import Localizer from "../../../../localization/Localizer";

import styles from "./WarehouseTaskHoursPanel.module.scss";
import User from "@/models/server/User";

interface IWarehouseTaskHoursPanelProps  {
    taskRow: RowModel<WorkOrderModel>;
    readonly: boolean;
}

interface IWarehouseTaskHoursPanelState {
}

export default class WarehouseTaskHoursPanel extends BaseComponent<IWarehouseTaskHoursPanelProps, IWarehouseTaskHoursPanelState> {

    private readonly _userSalaryHoursGridRef: React.RefObject<Grid<UserSalaryHour>> = React.createRef();
    
    private readonly _userSalaryHoursColumns: ColumnDefinition[] = [
        {
            header: Localizer.tasksPanelDateLanguageItemName,
            accessor: "day",
            format: "D",
            textAlign: TextAlign.Center,
            minWidth: 85
        } as ColumnDefinition,
        {
            header: Localizer.taskHoursPanelMounterLanguageItemName,
            accessor: "user",
            className: "blue",
            minWidth: 180
        } as ColumnDefinition,
        {
            header: Localizer.taskHoursPanelHoursLanguageItemName,
            accessor: "hours",
            type: ColumnType.Number,
            format: "0.0",
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                infoAccessor: "autoHours",
                infoTitle: Localizer.taskHoursPanelHoursInfoLanguageItemName
            } as ColumnSettingsDefinition,
            editable: true,
            init: (cell) => this.initHoursColumn(cell)
        } as ColumnDefinition,
        {
            header: Localizer.taskHoursPanelExtraHoursLanguageItemName,
            accessor: "extraHours",
            type: ColumnType.Number,
            format: "0.0",
            minWidth: 85,
            settings: {
                min: 0,
                max: RentaTaskConstants.maxHoursPerDay,
                step: 0.5,
                hideZero: true,
                infoAccessor: "autoExtraHours",
                infoTitle: Localizer.taskHoursPanelExtraHoursInfoLanguageItemName
            } as ColumnSettingsDefinition,
            editable: true,
            init: (cell) => this.initExtraHours(cell),
        } as ColumnDefinition,
        {
            //stretch: true,
            //minWidth: 110,
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
        } as ColumnDefinition
    ];

    private initRow(row: RowModel<UserSalaryHour>): void {
        const model: UserSalaryHour = row.model;

        row.className = (model.locked)
            ? "bg-approved"
            : "";
    }

    private initHoursColumn(cell: CellModel<UserSalaryHour>): void {
        const model: UserSalaryHour = cell.row.model;
        cell.readonly = (model.locked);
        cell.className = ((model.locked) || (cell.row.hasDeleted))
                ? styles.approvedRow
                : styles.notApprovedRow;
    }

    private initExtraHours(cell: CellModel<UserSalaryHour>): void {
        this.initHoursColumn(cell);
        const model: UserSalaryHour = cell.row.model;
        cell.visible = ((model.workOrder != null))
    }

    private initHourOperations(cell: CellModel<UserSalaryHour>): void {

        const model: UserSalaryHour = cell.row.model;
        const modified: boolean = cell.row.modified;
        const deleted: boolean = cell.row.deleted;
        const valid: boolean = cell.row.valid;

        const saveAction: CellAction<UserSalaryHour> = cell.actions[0];
        const cancelAction: CellAction<UserSalaryHour> = cell.actions[1];
        const deleteAction: CellAction<UserSalaryHour> = cell.actions[2];
        const restoreAction: CellAction<UserSalaryHour> = cell.actions[3];

        saveAction.visible = (modified) && (!deleted) && (valid);
        cancelAction.visible = (modified)  && (!deleted);
        deleteAction.visible = (!model.locked) && (!deleted);
        restoreAction.visible = (deleted);
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
            model.id = await cell.grid.postAsync("api/warehouse/saveUserSalaryHour", request);
            await cell.row.saveAsync();
            await this.calcTaskHoursAsync(cell);
        } else if (action.action.name === "cancel") {
            await cell.row.cancelAsync();
        } else if (action.action.name === "delete") {
            model.deleted = true;
            model.deletedAt = new Date();
            model.deletedBy = ch.getUser<User>();
            const deletePermanently: boolean = (model.id == "");
            if (deletePermanently) {
                await cell.grid.deleteAsync(cell.row.index);
            } else {
                await cell.grid.postAsync("api/warehouse/deleteUserSalaryHour", model.id);
                await cell.row.setDeletedAsync(true);
            }
            await this.calcTaskHoursAsync(cell);
        } else if (action.action.name === "restore") {
            model.deleted = false;
            model.deletedAt = null;
            model.deletedBy = null;
            const restoreOnServer = (model.id != "");
            if (restoreOnServer) {
                await cell.grid.postAsync("api/warehouse/restoreUserSalaryHour", model.id);
            }
            await cell.row.setDeletedAsync(false);
            await this.calcTaskHoursAsync(cell);
        }
    }
    
    private async calcTaskHoursAsync(cell: CellModel<UserSalaryHour>): Promise<void> {
        const userSalaryHours: UserSalaryHour[] = cell.row.grid.rows.map(row => row.model).filter(item => !item.deleted);
        this.task.autoHours = Utility.sum(userSalaryHours, item => item.normalHours);
        await this.taskRow.bindAsync();
    }

    private async getUserSalaryHoursAsync(): Promise<UserSalaryHour[]> {
        return await this.userSalaryHoursGrid.postAsync("api/warehouse/getTaskHours", this.task.id);
    }

    private get userSalaryHoursGrid(): GridModel<UserSalaryHour> {
        return this._userSalaryHoursGridRef.current!.model;
    }

    private get task(): WorkOrderModel {
        return this.taskRow.model;
    }

    private get taskRow(): RowModel<WorkOrderModel> {
        return this.props.taskRow;
    }

    private get readonly(): boolean {
        return this.props.readonly;
    }

    public hasSpinner(): boolean {
        return true;
    }

    public render(): React.ReactNode {

        return (
            <div className={this.css(styles.taskHoursPanel)}>
                
                <Grid ref={this._userSalaryHoursGridRef} noDataNoHeader
                      className={this.css(styles.grid)}
                      hovering={GridHoveringType.None}
                      odd={GridOddType.None}
                      minWidth="auto"
                      columns={this._userSalaryHoursColumns}
                      initRow={(row) => this.initRow(row)}
                      fetchData={async () => await this.getUserSalaryHoursAsync()}
                      readonly={this.readonly}
                      noDataText={Localizer.taskHoursPanelNoAccessToHours}
                />
                        
            </div>
        );
        
    }
};