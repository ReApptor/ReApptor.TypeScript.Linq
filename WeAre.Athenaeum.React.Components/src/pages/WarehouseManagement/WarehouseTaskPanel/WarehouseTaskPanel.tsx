import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch, IBaseComponent, TextAlign, PageCacheProvider} from "@weare/athenaeum-react-common";
import Grid from "../../../components/Grid/Grid";
import Button, {ButtonType} from "../../../components/Button/Button";
import { IconSize } from "@/components/Icon/Icon";
import {CellAction, CellModel, ColumnActionDefinition, ColumnDefinition, ColumnType, GridHoveringType, GridModel, GridOddType, RowModel} from "@/components/Grid/GridModel";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import {ActionType} from "@/models/Enums";
import UserSalaryHour from "../../../models/server/UserSalaryHour";
import TaskMounter from "../../../models/server/TaskMounter";
import Dropdown, {DropdownAlign} from "../../../components/Form/Inputs/Dropdown/Dropdown";
import SaveWorkOrderRequest from "../../../models/server/requests/SaveWorkOrderRequest";
import SaveDescriptionRequest from "../../../models/server/requests/SaveDescriptionRequest";
import Panel from "../../../components/Panel/Panel";
import CreateWorkOrderRequest from "../../../models/server/requests/CreateWorkOrderRequest";
import WarehouseTaskHoursPanel from "./WarehouseTaskHoursPanel/WarehouseTaskHoursPanel";
import WarehouseAddTaskModal from "./WarehouseAddTaskModal/WarehouseAddTaskModal";
import Warehouse from "../../../models/server/Warehouse";
import User from "@/models/server/User";
import Localizer from "../../../localization/Localizer";

import styles from "./WarehouseTasksPanel.module.scss";

interface IWarehouseTasksPanelProps {
    warehouse: Warehouse;
    readonly: boolean;
}

interface IWarehouseTasksPanelState {
    selectedTabIndex: number,
    taskDescriptionPopover: CellModel<WorkOrderModel> | null,
}

export default class WarehouseTasksPanel extends BaseComponent<IWarehouseTasksPanelProps, IWarehouseTasksPanelState> {

    state: IWarehouseTasksPanelState = {
        selectedTabIndex: 0,
        taskDescriptionPopover: null,
    };

    private readonly _workOrdersGridRef: React.RefObject<Grid<WorkOrderModel>> = React.createRef();
    private readonly _addTaskModalRef: React.RefObject<WarehouseAddTaskModal> = React.createRef();

    private readonly _workOrdersColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: "code",
            minWidth: 65,
            noWrap: true,
            className: "grey"
        } as ColumnDefinition,
        {
            header: "fas sync-alt",
            minWidth: 40,
            type: ColumnType.Icon,
            accessor: (model) => WorkOrderModel.getStateIcon(model)
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelNameLanguageItemName,
            accessor: "name",
            editable: true,
            reRenderRow: true,
            minWidth: 280,
            maxWidth: 280,
            init: (cell) => this.initNameColumn(cell),
            settings: {
                descriptionTitle: "Description of the task",
                descriptionAccessor: "description",
                descriptionCallback: (cell) => this.updateTaskDescriptionAsync(cell)
            },
            isReadonly: true,
            callback: (cell: CellModel<WorkOrderModel>) => this.openAddTaskModalAsync(cell.row.model, cell),            
        } as ColumnDefinition,
        {
            header: Localizer.addTaskModalMountersLanguageItemName,
            accessor: "mounters",
            type: ColumnType.Dropdown,
            settings: {
                fetchItems: async () => this.getWorkOrderMountersAsync(),
                align: DropdownAlign.Left,
                multiple: true,
                autoCollapse: true,
                groupSelected: true,
                nothingSelectedText: "0",
                selectedTextTransform: (dropdown: Dropdown<WorkOrderModel>) => dropdown.selectedListItems.length.toString()
            },
            editable: true,
            minWidth: 50,
            init: (cell) => this.initTaskColumn(cell),
            callback: async (cell: CellModel<WorkOrderModel>) => await this.onTaskMounterChangeAsync(cell)
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelStartLanguageItemName,
            group: Localizer.genericDateLanguageItemName,
            accessor: "activationDate",
            type: ColumnType.Date,
            format: "D",
            editable: true,
            reRenderRow: true,
            textAlign: TextAlign.Center,
            minWidth: 67,
            title: Localizer.tasksPanelStartInfoLanguageItemName,
            init: (cell) => this.initDateColumn(cell),
        } as ColumnDefinition,
        {
            header: Localizer.tasksPanelDoneLanguageItemName,
            group: Localizer.genericDateLanguageItemName,
            accessor: "completionDate",
            type: ColumnType.Date,
            format: "D",
            editable: true,
            reRenderRow: true,
            textAlign: TextAlign.Center,
            minWidth: 67,
            title: Localizer.tasksPanelComplitionDateLanguageItemName,
            init: (cell) => this.initCompletedAtColumn(cell),
        } as ColumnDefinition,
        // {
        //     header: Localizer.taskHoursPanelHoursLanguageItemName,
        //     accessor: "extraHours",
        //     format: "0.0",
        //     minWidth: 65,
        //     textAlign: TextAlign.Center,
        //     editable: true,
        //     type: ColumnType.Number
        // } as ColumnDefinition,
        {
            header: Localizer.tasksPanelActionsLanguageItemName,
            minWidth: 100,
            //stretch: true,
            init: (cell) => this.initTaskOperations(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.tasksPanelCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.tasksPanelCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "complete",
                    title: Localizer.tasksPanelCompleteTaskLanguageItemName,
                    icon: "far check-circle",
                    type: ActionType.Default,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "activate",
                    title: Localizer.tasksPanelActivateTaskLanguageItemName,
                    icon: "far play-circle",
                    type: ActionType.Default,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "approve",
                    title: Localizer.tasksPanelApproveTaskCreateLanguageItemName,
                    icon: "far thumbs-up",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "unlock",
                    icon: "fas unlock-alt",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "delete",
                    title: Localizer.tasksPanelDeleteTaskLanguageItemName,
                    icon: "far trash-alt",
                    type: ActionType.Delete,
                    right: true,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition,
                {
                    name: "restore",
                    title: Localizer.tasksPanelRestoreTaskLanguageItemName,
                    icon: "far undo-alt",
                    type: ActionType.Create,
                    right: true,
                    callback: async (cell, action) => await this.processTaskOperationAsync(cell, action.action.name!)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
    ];

    private async updateTaskDescriptionAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const model: WorkOrderModel = cell.model;

        const request = new SaveDescriptionRequest();
        request.id = model.id;
        request.description = model.description;

        await this.workOrdersGrid.postAsync("api/constructionSiteManagement/saveTaskDescription", request);
    }

    private async getTasksAsync(): Promise<WorkOrderModel[]> {
        return await PageCacheProvider.getAsync("getTasksAsync", () => this.workOrdersGrid.postAsync("api/warehouse/getWarehouseTasks", this.warehouseId));
    }

    private async getMountersAsync(sender: IBaseComponent): Promise<TaskMounter[]> {
        return await PageCacheProvider.getAsync("getMountersAsync", () => sender.postAsync("api/warehouse/getEmployees", this.warehouseId));
    }

    private async getWorkOrderMountersAsync(): Promise<TaskMounter[]> {
        return await this.getMountersAsync(this.workOrdersGrid.instance);
    }

    private async addWorkOrderAsync(request: CreateWorkOrderRequest): Promise<void> {
        request.constructionSiteOrWarehouseId = this.warehouseId;

        await this.workOrdersGrid.postAsync("/api/RentaTasks/createWorkOrder", request);

        PageCacheProvider.clear();

        await this.workOrdersGrid.reloadAsync();
    }

    private isTaskValid(task: WorkOrderModel): boolean {
        let isValid = (task.name.length > 0);
        isValid = isValid && ((task.completionDate == null) || (task.completionDate.valueOf() >= task.activationDate.valueOf()));
        return isValid;
    }

    private initTasksRow(row: RowModel<WorkOrderModel>): void {

        const model: WorkOrderModel = row.model;

        const isInvoiced: boolean = model.invoiced;
        const isApproved: boolean = (model.approved);
        const isReadonly: boolean = (isApproved || model.deleted);

        row.className = (isInvoiced)
            ? "bg-processed"
            : (isApproved)
                ? "bg-approved"
                : (model.completed)
                    ? "bg-completed"
                    : "";

        row.readonly = (isReadonly);
    }

    private initTaskColumn(cell: CellModel<WorkOrderModel>): void {
        //const model: WorkOrderModel = cell.row.model;
        cell.className =  "green";
    }

    private initTypeColumn(cell: CellModel<WorkOrderModel>): void {
        this.initTaskColumn(cell);

        const model: WorkOrderModel = cell.row.model;
        const deleted: boolean = cell.row.deleted;
        const hasHours: boolean = model.hasSalaryHours;

        const detailsAction: CellAction<WorkOrderModel> = cell.actions[0];

        detailsAction.visible = (!deleted) && (hasHours);
    }

    private initNameColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.title = model.description || "";

        const deleted: boolean = cell.row.deleted;
        const completed: boolean = model.completed;
        const active: boolean = Utility.inInterval(Utility.now(), model.activationDate, model.completionDate);
        const locked: boolean = model.locked;
        if  ((!locked) && (!deleted)  && ((!completed) || (active))) {
            cell.className = styles.linkColumn;
        }
    }

    private initDateColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.valid = ((model.completionDate == null) || (model.completionDate.valueOf() >= model.activationDate.valueOf()));
    }

    private initCompletedAtColumn(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        cell.valid = ((model.completionDate == null) || (model.completionDate.valueOf() >= model.activationDate.valueOf()));
    }

    private initTaskOperations(cell: CellModel<WorkOrderModel>): void {
        const model: WorkOrderModel = cell.row.model;
        const modified: boolean = cell.row.modified;
        const deleted: boolean = cell.row.deleted;
        const completed: boolean = model.completed;
        const active: boolean = Utility.inInterval(Utility.now(), model.activationDate, model.completionDate);
        const futureActivate: boolean = (Utility.inFuture(model.activationDate));
        const isValid: boolean = this.isTaskValid(model);
        const approvable = true;
        const approved: boolean = (model.approved);
        const locked: boolean = model.locked;
        const isSubcontractorManager: boolean = this.isSubcontractorManager;

        const saveAction: CellAction<WorkOrderModel> = cell.actions[0];
        const cancelAction: CellAction<WorkOrderModel> = cell.actions[1];
        const completeAction: CellAction<WorkOrderModel> = cell.actions[2];
        const activateAction: CellAction<WorkOrderModel> = cell.actions[3];
        const approveAction: CellAction<WorkOrderModel> = cell.actions[4];
        const unlockAction: CellAction<WorkOrderModel> = cell.actions[5];
        const deleteAction: CellAction<WorkOrderModel> = cell.actions[6];
        const restoreAction: CellAction<WorkOrderModel> = cell.actions[7];

        saveAction.visible = (!locked) && (modified) && (isValid) && (!deleted) && (!approved) && (!isSubcontractorManager);
        cancelAction.visible = (!locked) && (modified) && (!deleted) && (!approved) && (!isSubcontractorManager);
        completeAction.visible = (!locked) && (!modified) && (!deleted) && (!completed) && (!approved) && (active);
        approveAction.visible = (!locked) && (approvable) && (!deleted) && (!modified) && (completed) && (!approved) && (!isSubcontractorManager);
        unlockAction.visible = (!locked) && (approvable) && (approved) && (!isSubcontractorManager) && (!isSubcontractorManager);
        activateAction.visible = (!locked) && (!deleted) && (!modified) && (!approved) && ((completed) || (!active));
        activateAction.action.type = (futureActivate) ? ActionType.Muted : ActionType.Blue;
        deleteAction.visible = (!locked) && (!deleted) && (!approved) && (!isSubcontractorManager);
        restoreAction.visible = (!locked) && (deleted) && (!isSubcontractorManager);
    }


    private processTaskOperationAsync = async (cell: CellModel<WorkOrderModel>, actionName: string): Promise<void> => {

        const model: WorkOrderModel = cell.row.model;

        if (actionName === "save") {

            const request = new SaveWorkOrderRequest();
            request.workOrderId = model.id;
            request.mounters = model.mounters;
            request.equipment = null;
            request.activationDate = model.activationDate;
            request.completionDate = model.completionDate;
            request.name = model.name;
            request.description = model.description;

            cell.row.model = await cell.grid.postAsync("api/constructionSiteManagement/saveWorkOrder", request);

            await cell.row.bindAsync();

        } else if (actionName === "cancel") {

            await cell.row.cancelAsync();

        } else if (actionName === "complete") {

            model.completed = true;
            model.completionDate = model.completionDate || new Date();
            model.completedBy = ch.getUser<User>();

            await cell.grid.postAsync("api/constructionSiteManagement/completeTask", model.id);

            await cell.row.bindAsync();

        } else if (actionName === "activate") {

            if (model.completed) {
                model.completed = false;
                model.completionDate = null;
                model.completedBy = null;
            } else {
                model.activationDate = Utility.date();
            }

            await cell.grid.postAsync("api/constructionSiteManagement/activateTask", model.id);

            await cell.row.bindAsync();

        } else if (actionName === "approve") {

            model.approved = true;
            model.approvedAt = new Date();
            model.approvedBy = ch.getUser<User>();

            await cell.grid.postAsync("api/constructionSiteManagement/approveTask", model.id);

            await cell.row.bindAsync();


        } else if (actionName === "unlock") {

            model.approved = false;
            model.approvedAt = null;
            model.approvedBy = null;

            await cell.grid.postAsync("api/constructionSiteManagement/unApproveTask", model.id);

            await cell.row.bindAsync();


        } else if (actionName === "delete") {

            const deletePermanently: boolean = (model.id == "");

            if (deletePermanently) {
                await cell.grid.deleteAsync(cell.row.index);
            } else {

                await cell.grid.postAsync("api/constructionSiteManagement/deleteTask", model.id);

                await cell.row.setDeletedAsync(true);

            }

        } else if (actionName === "restore") {

            const restoreOnServer = (model.id != "");
            if (restoreOnServer) {

                await cell.grid.postAsync("api/constructionSiteManagement/restoreTask", model.id);

            }

            await cell.row.setDeletedAsync(false);
        }
    }

    private async onTaskMounterChangeAsync(cell: CellModel<WorkOrderModel>): Promise<void> {
        const model: WorkOrderModel = cell.row.model;
        const mounters: any[] = (model.mounters as any[]);
        const mounterIds: string[] = mounters.map(item => (item.isTaskMounter) ? ((item as TaskMounter).user.id) : (item as string));
        cell.setValue(mounterIds);
        await cell.reloadAsync();
    }

    private async toggleTasksDetails(cell: CellModel<UserSalaryHour>): Promise<void> {
        await cell.row.toggleAsync();
    }

    private async openAddTaskModalAsync(task: WorkOrderModel | null = null, cell: CellModel<WorkOrderModel> | null = null): Promise<void> {
        if (this.isSubcontractorManager) {
            return;
        }
        
        if (cell) {
            const model: WorkOrderModel = cell.row.model;
            const deleted: boolean = cell.row.deleted;
            const completed: boolean = model.completed;
            const active: boolean = Utility.inInterval(Utility.now(), model.activationDate, model.completionDate);
            const locked: boolean = model.locked;
            if ((!locked) && (!deleted) && ((!completed) || (active))) {
                await this._addTaskModalRef.current!.openAsync(task, cell);
            }
        } else {
            await this._addTaskModalRef.current!.openAsync(task, cell);
        }
    }
    
    private get warehouseId(): string {
        return this.props.warehouse.id;
    }

    private get workOrdersGrid(): GridModel<WorkOrderModel> {
        return this._workOrdersGridRef.current!.model;
    }

    private get readonly(): boolean {
        return this.props.readonly;
    }

    private get addButtonTitle(): string {
        return (this.state.selectedTabIndex === 0)
            ? Localizer.tasksPanelAddTaskTitle
            : (this.state.selectedTabIndex === 1)
                ? Localizer.tasksPanelAddWorkReportTitle : "";
    }

    private get isSubcontractorManager(): boolean {
        return ch.getUser<User>().isSubcontractorManager;
    }

    public async reloadAsync(settings: { awaitTasks?: boolean, awaitWorkReports?: boolean, awaitRents?: boolean } | null = null): Promise<void> {
        PageCacheProvider.clear();

        if (settings && settings.awaitTasks) {
            await this.workOrdersGrid.reloadAsync();
        } else {
            this.workOrdersGrid.reload();
        }
    }

    public reload(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reloadAsync();
    }

    public async reloadTasksAsync(): Promise<void> {
        PageCacheProvider.clear();
        await this.workOrdersGrid.reloadAsync();
    }

    private renderDetailsContent(row: RowModel<WorkOrderModel>): React.ReactNode {
        return (
            <WarehouseTaskHoursPanel taskRow={row} readonly={this.readonly}/>
        );
    }


    public render(): React.ReactNode {

        return (
            <Panel title={Localizer.genericTasks}
                   customHeading={
                       <div className="col-6 d-flex justify-content-sm-between">
                           <h3 className="m-0">{Localizer.genericTasks}</h3>

                           {
                               !this.isSubcontractorManager &&
                               (
                                   <div>

                                       <span style={{paddingRight: "8px"}}>{this.addButtonTitle}</span>

                                       <Button icon={{name: "plus", size: IconSize.Large}}
                                               type={ButtonType.Orange}
                                               onClick={async () => await this.openAddTaskModalAsync()}
                                               disabled={this.readonly}
                                       />


                                       <Button title="Reload" className="ml-1"
                                               icon={{name: "far history", size: IconSize.Large}}
                                               type={ButtonType.Info}
                                               onClick={async () => await this.reloadAsync()}
                                       />

                                   </div>
                               )
                           }
                           
                       </div>
                   }
            >
                <div className={styles.tasksPanel}>

                    <div>
                        <div className="col-12">

                            <div>
                                <Grid ref={this._workOrdersGridRef}
                                      id="tasksGrid"
                                      minWidth={"auto"}
                                      hovering={GridHoveringType.Row}
                                      odd={GridOddType.None}
                                      noDataText={Localizer.gridNoDataTasks}
                                      columns={this._workOrdersColumns}
                                      initRow={(row) => this.initTasksRow(row)}
                                      fetchData={async () => await this.getTasksAsync()}
                                      renderDetails={(row) => this.renderDetailsContent(row)}
                                      readonly={this.readonly}
                                />
                            </div>

                        </div>
                    </div>

                    <WarehouseAddTaskModal ref={this._addTaskModalRef}
                                           warehouseId={this.warehouseId}
                                           fetchMounters={async (sender) => await this.getMountersAsync(sender)}
                                           addWorkOrder={async (sender, request) => await this.addWorkOrderAsync(request)}
                                           taskOperation={this.processTaskOperationAsync}
                    />
                    
                </div>
            </Panel>
        );

    }

};