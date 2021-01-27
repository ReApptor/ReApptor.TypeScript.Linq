import "./BootstrapOverride.scss";
import React from "react";
import {ApiProvider, IBaseComponent, PageCacheProvider} from "@weare/athenaeum-react-common";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import {CellModel, GridModel, RowModel} from "@/components/Grid/GridModel";
import WorkOrderModel from "../../models/server/WorkOrderModel";
import TaskMounter from "../../models/server/TaskMounter";
import Toolbar from "./Toolbar/Toolbar";
import ToolbarModel from "./Toolbar/ToolbarModel";
import List from "../../components/List/List";
import UserStatus from "../../models/server/UserStatus";
import GetEmployeeStatusesRequest from "../../models/server/requests/GetEmployeeStatusesRequest";
import Product from "@/models/server/Product";
import LeftPanel from "@/pages/WorkOrders/LeftPanel/LeftPanel";
import WorkOrdersPanel from "@/pages/WorkOrders/WorkOrdersPanel/WorkOrdersPanel";
import UserInteractionDataStorage from "@/providers/UserInteractionDataStorage";
import Localizer from "../../localization/Localizer";

import styles from "./WorkOrders.module.scss";

interface IWorkOrdersProps {
}

interface IWorkOrdersState {
    filters: ToolbarModel;
    products: Product[];
    mounters: TaskMounter[];
    managerUserIds: string[];
    mounterUserIds: string[];
}

export default class WorkOrders extends AuthorizedPage<IWorkOrdersProps, IWorkOrdersState> {

    state: IWorkOrdersState = {
        filters: WorkOrders.initializeToolbar(),
        products: [],
        mounters: [],
        managerUserIds: [],
        mounterUserIds: []
    };

    private static initializeToolbar(): ToolbarModel {
        return UserInteractionDataStorage.get("filter", new ToolbarModel());
    }

    private readonly _mountersRef: React.RefObject<List> = React.createRef();
    private readonly _managersRef: React.RefObject<List> = React.createRef();
    private readonly _workOrdersGridRef: React.RefObject<WorkOrdersPanel> = React.createRef();

    private async getAllProductsDataAsync(): Promise<Product[]> {
        return await PageCacheProvider.getAsync("getAllProductsDataAsync", () => ApiProvider.postAsync("api/workOrders/getAllProducts"));
    }

    private async getMountersAsync(): Promise<TaskMounter[]> {
        return await PageCacheProvider.getAsync("getMountersAsync", () => ApiProvider.postAsync("api/workOrders/getMounters"));
    }

    private async getMounterStatusesAsync(sender: IBaseComponent): Promise<UserStatus[]> {
        const request = new GetEmployeeStatusesRequest();
        request.from = this.state.filters.from;
        request.to = this.state.filters.to;
        return sender.postAsync("api/employees/getEmployeeStatuses", request);
    }

    private async getManagersStatusesAsync(sender: IBaseComponent): Promise<UserStatus[]> {
        const request = new GetEmployeeStatusesRequest();
        request.from = this.state.filters.from;
        request.to = this.state.filters.to;
        return sender.postAsync("api/employees/getManagerStatuses", request);
    }

    private async selectMountersAsync(sender: List<UserStatus>): Promise<void> {
        const mounters: UserStatus[] = sender.selectedItems;
        const mounterUserIds: string[] = mounters.map(userStatus => userStatus.user.id);
        await this.setState({mounterUserIds});
        await this.workOrdersGrid.reloadAsync();
    }

    private async selectManagersAsync(sender: List<UserStatus>): Promise<void> {
        const managers: UserStatus[] = sender.selectedItems;
        const managerUserIds: string[] = managers.map(userStatus => userStatus.user.id);
        await this.setState({managerUserIds});
        await this.workOrdersGrid.reloadAsync();
    }

    private async onFiltersChange(filters: ToolbarModel, reloadManagers: boolean, reloadMounters: boolean): Promise<void> {
        UserInteractionDataStorage.set("filter", filters);

        await this.setState({filters});

        if (reloadManagers) {
            await this.managersList.reloadAsync();
        }

        if (reloadMounters) {
            await this.mountersList.reloadAsync();
        }

        await this.workOrdersGrid.reloadAsync();
    }

    private get managersList(): List {
        return this._managersRef.current!;
    }

    private async addWorkOrderAsync(model: WorkOrderModel) {
        const canAdd: boolean = (!this.workOrdersPanel.hasNewRow); 
        if (canAdd) {
            const rows: RowModel<WorkOrderModel>[] = await this.workOrdersGrid.insertAsync(0, model);
            const row: RowModel<WorkOrderModel> = rows[0];
            const nameCell: CellModel<WorkOrderModel> = row.get("name");
            await nameCell.editAsync();
        }
    }

    private get mountersList(): List {
        return this._mountersRef.current!;
    }

    private get workOrdersGrid(): GridModel<WorkOrderModel> {
        return this.workOrdersPanel.workOrdersGrid;
    }

    private get workOrdersPanel(): WorkOrdersPanel {
        return this._workOrdersGridRef.current!;
    }

    public async initializeAsync(): Promise<void> {
        const products: Product[] = await this.getAllProductsDataAsync();
        const mounters: TaskMounter[] = await this.getMountersAsync();
        await this.setState({products, mounters});
    }

    public getTitle(): string {
        return Localizer.topNavWorkOrders;
    }

    public render(): React.ReactNode {

        return (
            <PageContainer scale className={styles.tasks}>

                <PageRow>

                    <div className={"col"}>

                        <div>
                            <Toolbar model={this.state.filters}
                                     addWorkOrder={async (model) => this.addWorkOrderAsync(model)}
                                     onChange={async (model, reloadManagers, reloadMounters) => this.onFiltersChange(model, reloadManagers, reloadMounters)}
                            />
                        </div>

                        <div className={this.css(styles.main)}>

                            <LeftPanel className={styles.left}>

                                <div>
                                    <List multiple
                                          label={Localizer.enumUserRoleGroupManagers}
                                          ref={this._managersRef}
                                          maxHeight="initial"
                                          filterMinLength={10}
                                          fetchItems={async (sender) => await this.getManagersStatusesAsync(sender)}
                                          selectedItems={this.state.managerUserIds}
                                          onChange={async (sender: List<UserStatus>) => await this.selectManagersAsync(sender)}
                                    />
                                </div>

                                <div>
                                    <List multiple
                                          label={Localizer.tasksMounters}
                                          ref={this._mountersRef}
                                          maxHeight="initial"
                                          filterMinLength={10}
                                          fetchItems={async (sender) => await this.getMounterStatusesAsync(sender)}
                                          onChange={async (sender: List<UserStatus>) => await this.selectMountersAsync(sender)}
                                    />
                                </div>

                            </LeftPanel>

                            <div className={styles.right}>

                                <WorkOrdersPanel ref={this._workOrdersGridRef}
                                                 managerUserIds={this.state.managerUserIds}
                                                 mounterUserIds={this.state.mounterUserIds}
                                                 filters={this.state.filters}
                                />
                                
                            </div>

                        </div>

                    </div>

                </PageRow>

            </PageContainer>
        );
    }
}