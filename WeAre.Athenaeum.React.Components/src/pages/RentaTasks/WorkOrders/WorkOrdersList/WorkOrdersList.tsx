import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseAsyncComponent, IBaseAsyncComponentState, IBaseComponent} from "@weare/athenaeum-react-common";
import WorkOrderFiltersData from "@/models/server/WorkOrderFiltersData";
import WorkOrdersFiltersModal from "@/pages/RentaTasks/WorkOrders/WorkOrdersFiltersModal/WorkOrdersFiltersModal";
import Button, {ButtonType} from "@/components/Button/Button";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import Icon, {IconSize} from "@/components/Icon/Icon";
import ListActiveWorkOrdersRequest from "@/models/server/requests/ListActiveWorkOrdersRequest";
import TransformProvider from "@/providers/TransformProvider";
import RentaTasksController from "@/pages/RentaTasks/RentaTasksController";

import styles from "./WorkOrdersList.module.scss";
import Localizer from "@/localization/Localizer";

interface IWorkOrdersListProps {
    title: string;
    modalTitle: string;
    noDataText: string;
    request: ListActiveWorkOrdersRequest;
    filtersData: WorkOrderFiltersData;
    fetchData(sender: IBaseComponent, request: ListActiveWorkOrdersRequest): Promise<WorkOrderModel[]>;
    onWorkOrderOpen(sender: IBaseComponent, workOrder: WorkOrderModel): Promise<void>;
}

export interface IWorkOrdersListState extends IBaseAsyncComponentState<WorkOrderModel[]> {
    request: ListActiveWorkOrdersRequest;
}

export default class WorkOrdersList extends BaseAsyncComponent<IWorkOrdersListProps, IWorkOrdersListState, WorkOrderModel[]> {

    state: IWorkOrdersListState = {
        data: null,
        isLoading: false,
        request: this.props.request
    };

    private readonly _filtersModalRef: React.RefObject<WorkOrdersFiltersModal> = React.createRef();

    private getDate(workOrder: WorkOrderModel): string | null {
        const date: Date | null = this.props.request.getDate(workOrder);
        return (date)
            ? Utility.toDateString(date)
            : "";
    }

    private async openFiltersAsync(): Promise<void> {
        await this._filtersModalRef.current!.openAsync();
    }

    private async submitFiltersAsync(request: ListActiveWorkOrdersRequest): Promise<void> {
        await this.setState({request});
        await this.reloadAsync();
    }
    
    private async onItemClickAsync(workOrder: WorkOrderModel): Promise<void> {
        await this.props.onWorkOrderOpen(this, workOrder);
    }
    
    protected async fetchDataAsync(): Promise<WorkOrderModel[]> {
        return this.props.fetchData(this, this.state.request);
    }

    protected getEndpoint(): string {
        return "";
    }
    
    protected getIconName(): string {
        return (this.state.request.isEmpty())
            ? "far filter"
            : "fas filter";
    }

    public isAsync(): boolean {
        return true;
    }

    public renderRow(workOrder: WorkOrderModel, index: number): React.ReactNode {
        const address: string = ((workOrder.owner) && (workOrder.owner.location))
            ? TransformProvider.toString(workOrder.owner.location)
            : Localizer.workOrdersRowsNoAddress;
        
        const organizationInfo: string = ((workOrder.owner) && (workOrder.owner.organizationContract))
            ? `${TransformProvider.toString(workOrder.owner.organizationContract.name)}, ${TransformProvider.toString(workOrder.owner.name)}`
            : "";
        
        const isSignedIn = (RentaTasksController.isSignedIn) && (RentaTasksController.context.workOrder) && (RentaTasksController.context.workOrder.id == workOrder.id);
        const signedInStyle = (isSignedIn) && (styles.signedIn);
        
        return (
            <div key={index}
                 className={this.css(styles.workOrderListItem, signedInStyle, "cursor-pointer")}
                 onClick={async () => await this.onItemClickAsync(workOrder)}>
                
                <div className={styles.left}>
                    <div className={this.css(styles.multiLines, styles.topSpace)}>
                        <span>{workOrder.name}</span>
                        <span>{organizationInfo}</span>
                        <span>{address}</span>
                    </div>
                </div>

                <div className={styles.icons}>

                    <Icon {...WorkOrderModel.getStateIcon(workOrder)} size={IconSize.Large} />

                </div>

                <span>{this.getDate(workOrder)}</span>
                
            </div>
        )
    }
    
    public render(): React.ReactNode {
        
        return (
            <div className={this.css(styles.workOrdersList)}>
                
                <div>
                    <div className={this.css(styles.header)}>
                    
                    <span>
                        {this.toMultiLines(this.props.title)}
                    </span>
                        
                    <Button icon={{name: this.getIconName(), size: IconSize.X2}}
                            type={ButtonType.Blue}
                            small
                            className={this.css(styles.filter)}
                            onClick={async () => await this.openFiltersAsync()}
                    />

                    </div>
                </div>
                
                {
                    (!this.isLoading) && ((this.state.data == null) || (this.state.data.length == 0)) &&
                    (
                        <div className={this.css(styles.workOrderListItem, styles.noItems)}>
                            {this.props.noDataText}
                        </div>
                    )
                }
                
                {
                    (this.state.data) &&
                    (
                        this.state.data.map((item, index) => this.renderRow(item, index))
                    )
                }

                <WorkOrdersFiltersModal ref={this._filtersModalRef}
                                        title={this.props.modalTitle}
                                        request={this.state.request}
                                        filtersData={this.props.filtersData}
                                        onSubmit={async (sender, request) => await this.submitFiltersAsync(request)}
                />

            </div>
        );
    }
};