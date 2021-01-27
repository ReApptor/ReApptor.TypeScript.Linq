import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {ch, PageRouteProvider} from "@weare/athenaeum-react-common";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import WorkOrderFiltersData from "@/models/server/WorkOrderFiltersData";
import PageContainer from "@/components/PageContainer/PageContainer";
import PageRow from "@/components/PageContainer/PageRow/PageRow";
import PageHeader from "@/components/PageContainer/PageHeader/PageHeader";
import WorkOrdersList from "@/pages/RentaTasks/WorkOrders/WorkOrdersList/WorkOrdersList";
import GetWorkOrderFiltersResponse from "@/models/server/responses/GetWorkOrderFiltersResponse";
import ListActiveWorkOrdersRequest from "@/models/server/requests/ListActiveWorkOrdersRequest";
import AuthorizedPage from "@/models/base/AuthorizedPage";
import PageDefinitions from "@/providers/PageDefinitions";
import Localizer from "@/localization/Localizer"

import rentaTaskStyles from "@/pages/RentaTask.module.scss";
import styles from "./WorkOrders.module.scss";

export interface IWorkOrdersProps {
}

interface IWorkOrdersState {
    listActiveWorkOrdersRequest: ListActiveWorkOrdersRequest;
    activeWorkOrdersFiltersData: WorkOrderFiltersData;
}

export default class WorkOrders extends AuthorizedPage<IWorkOrdersProps, IWorkOrdersState> {
    
    state: IWorkOrdersState = {
        listActiveWorkOrdersRequest: new ListActiveWorkOrdersRequest(ch.getUserId()),
        activeWorkOrdersFiltersData: new WorkOrderFiltersData()
    };

    private readonly _activeWorkOrdersRef: React.RefObject<WorkOrdersList> = React.createRef();
    private _activeWorkOrdersCount: number = 0;
    
    private async openWorkOrderAsync(workOrder: WorkOrderModel): Promise<void> {
        await PageRouteProvider.redirectAsync(PageDefinitions.rentaTasksWorkOrder(workOrder.id));
    }

    private async fetchActiveWorkOrdersAsync(): Promise<WorkOrderModel[]> {
        const workOrders: WorkOrderModel[] = await this.postAsync("api/rentaTasks/listActiveWorkOrders", this.state.listActiveWorkOrdersRequest);
        this._activeWorkOrdersCount = workOrders.length;
        await this.reRenderAsync();
        return workOrders;
    }

    private get activeWorkOrdersTitle(): string {
        return (this._activeWorkOrdersCount === 0)
            ? Utility.format(Localizer.workOrdersActiveListNoOrders)
            : Utility.format(Localizer.workOrdersActiveListTitle, this._activeWorkOrdersCount);
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        const response: GetWorkOrderFiltersResponse = await this.postAsync("api/rentaTasks/getWorkOrderFilters");

        await this.setState({activeWorkOrdersFiltersData: response.active});
    }

    public getManual(): string {
        return Localizer.rentaTasksWorkOrdersGetManual;
    }

    public render(): React.ReactNode {
        return (
            <PageContainer alertClassName={rentaTaskStyles.alert} className={this.css(rentaTaskStyles.pageContainer, styles.workOrders)}>

                <PageRow className={rentaTaskStyles.pageRow}>
                    <div className={"w-100"}>
                        <PageHeader className={this.css(styles.pageHeader, rentaTaskStyles.pageHeader)} title={Localizer.workOrdersPageTitle} />
                    </div>
                </PageRow>

                <PageRow className={rentaTaskStyles.pageRow}>

                    <div className={"w-100"}>

                        <WorkOrdersList ref={this._activeWorkOrdersRef}
                                        title={this.activeWorkOrdersTitle}
                                        modalTitle={Localizer.workOrdersFiltersModalTitleActive}
                                        noDataText={Localizer.genericNoData}
                                        request={this.state.listActiveWorkOrdersRequest}
                                        filtersData={this.state.activeWorkOrdersFiltersData}
                                        fetchData={async () => await this.fetchActiveWorkOrdersAsync()}
                                        onWorkOrderOpen={async (sender, workOrder) => await this.openWorkOrderAsync(workOrder)}
                        />

                    </div>

                </PageRow>

            </PageContainer>
        );
    }
}