import React from "react";
import {ch, ApiProvider, IIsLoading, PageRoute} from "@weare/athenaeum-react-common";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import {ConstructionSiteOrWarehouseType, ConstructionSiteStatus} from "@/models/Enums";
import TabContainer from "../../components/TabContainer/TabContainer";
import Tab from "../../components/TabContainer/Tab/Tab";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import ConstructionSite from "../../models/server/ConstructionSite";
import User from "../../models/server/User";
import Organization from "../../models/server/Organization";
import Warehouse from "../../models/server/Warehouse";
import ConstructionSitePanel from "./ConstructionSitePanel/ConstructionSitePanel";
import SaveConstructionSiteRequest from "../../models/server/requests/SaveConstructionSiteRequest";
import OrganizationPanel from "./OrganizationPanel/OrganizationPanel";
import SaveOrganizationContractRequest from "../../models/server/requests/SaveOrganizationContractRequest";
import OrganizationContract from "../../models/server/OrganizationContract";
import Button from "../../components/Button/Button";
import {IconSize} from "@/components/Icon/Icon";
import SaveConstructionSiteResponse from "@/models/server/responses/SaveConstructionSiteResponse";
import GetConstructionSiteWithFiltersResponse from "@/models/server/responses/GetConstructionSiteWithFiltersResponse";
import PageDefinitions from "@/providers/PageDefinitions";
import ConstructionSiteNavigator from "@/pages/ConstructionSiteManagement/ConstructionSiteNavigator";
import WorkOrdersPanel from "@/pages/WorkOrders/WorkOrdersPanel/WorkOrdersPanel";
import Toolbar from "@/pages/WorkOrders/Toolbar/Toolbar";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import {CellModel, GridModel, RowModel} from "@/components/Grid/GridModel";
import ToolbarModel from "@/pages/WorkOrders/Toolbar/ToolbarModel";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import {DefaultPrices} from "@/models/server/DefaultPrices";
import {ActivateConstructionSiteRequest} from "@/models/server/requests/ActivateConstructionSiteRequest";
import TransformProvider from "../../providers/TransformProvider";
import Localizer from "@/localization/Localizer";

import "./BootstrapOverride.scss";
import styles from "./ConstructionSiteManagement.module.scss";

interface IConstructionSiteManagementProps {
}

interface IConstructionSiteManagementState {
    constructionSite: ConstructionSite | null;
    previous: ConstructionSite | null;
    next: ConstructionSite | null;
    managers: User[] | null;
    manager: User | null;
    organization: Organization | null;
    salesPerson: User | null;
    warehouses: Warehouse[] | null;
    warehouse: Warehouse | null;
    isLoading: boolean;
    filters: ToolbarModel;
    defaultPrices: DefaultPrices | null;
}

export default class ConstructionSiteManagement extends AuthorizedPage<IConstructionSiteManagementProps, IConstructionSiteManagementState> implements IIsLoading {

    state: IConstructionSiteManagementState = {
        constructionSite: null,
        previous: null,
        next: null,
        managers: null,
        manager: null,
        organization: null,
        salesPerson: null,
        warehouses: null,
        warehouse: null,
        isLoading: false,
        defaultPrices: null,
        filters: new ToolbarModel(),
    };

    public getTitle(): string {
        return Localizer.topNavConstructionSiteManagement;
    }

    public getManual(): string {
        return Localizer.constructionSiteManagementGetManual;
    }

    private readonly _workOrdersPanel: React.RefObject<WorkOrdersPanel> = React.createRef();
    private readonly _organizationPanelRef: React.RefObject<OrganizationPanel> = React.createRef();
    private readonly _constructionSitePanelRef: React.RefObject<ConstructionSitePanel> = React.createRef();

    public async onIsLoading(): Promise<void> {
        await this.setState({isLoading: ApiProvider.isLoading});
    }

    private get constructionSiteId(): string {
        return this.routeId!;
    }

    private get constructionSite(): ConstructionSite | null {
        return this.state.constructionSite;
    }

    private get title(): string {
        return (this.constructionSite) ? this.constructionSite.name : Localizer.genericLoading;
    }

    private get subtitle(): string {
        return ((this.constructionSite) && (this.constructionSite.location)) ? TransformProvider.toString(this.constructionSite.location) : "";
    }

    private async fetchManagersAsync(): Promise<User[]> {
        return await this.postAsync("api/constructionSiteManagement/getManagers");
    }

    private async fetchWarehousesAsync(): Promise<Warehouse[]> {
        return await this.postAsync("api/constructionSiteManagement/getWarehouses");
    }

    private async fetchDefaultPricesAsync(): Promise<DefaultPrices> {
        return await this.postAsync("api/admin/getDefaultPrices");
    }

    private async organizationContractSubmitAsync(sender: OrganizationPanel, request: SaveOrganizationContractRequest): Promise<void> {
        const organizationContract: OrganizationContract = await sender.postAsync("api/constructionSiteManagement/saveOrganizationContract", request);

        if (organizationContract) {
            this.constructionSite!.organizationContract = organizationContract;
            await this.setState({constructionSite: this.constructionSite});
        }

        await ch.flyoutMessageAsync(Localizer.tasksPanelFlyoutChangesSaved);
    }

    private getNavigationSiteRoute(constructionSite: ConstructionSite | null): PageRoute | null {
        return (constructionSite != null)
            ? PageDefinitions.constructionSiteManagement(constructionSite.id)
            : null;
    }

    private getNavigationSiteTitle(constructionSite: ConstructionSite | null): string {
        return (constructionSite != null)
            ? `${constructionSite.name}\n${TransformProvider.toString(constructionSite.location)}`
            : "";
    }

    private get readonly(): boolean {
        return (this.constructionSite == null) || (this.constructionSite.status == ConstructionSiteStatus.Inactive);
    }

    public async setConstructionSiteActiveAsync(sender: ConstructionSitePanel, request: ActivateConstructionSiteRequest, active: boolean): Promise<void> {
        const apiUrl: string = active
            ? "api/constructionSiteManagement/ActivateConstructionSite"
            : "api/constructionSiteManagement/DeactivateConstructionSite";
        
        let constructionSite: ConstructionSite;
        if (active) {
            constructionSite = await sender.postAsync(apiUrl, request);
        } else {
            constructionSite = await sender.postAsync(apiUrl, request.constructionSiteId);
        }
        

        await this.setState({constructionSite});
    }

    public async constructionSiteSubmitAsync(sender: ConstructionSitePanel, request: SaveConstructionSiteRequest): Promise<SaveConstructionSiteResponse> {
        const response: SaveConstructionSiteResponse = await sender.postAsync("api/constructionSiteManagement/saveConstructionSite", request);

        if (response.constructionSite != null) {
            const constructionSite: ConstructionSite = response.constructionSite;
            await this.setState({constructionSite});
            await ch.flyoutMessageAsync(Localizer.tasksPanelFlyoutChangesSaved);
        }

        return response;
    }

    private async onFiltersChange(filters: ToolbarModel): Promise<void> {
        await this.setState({ filters });
        await this.workOrdersGrid.reloadAsync();
    }

    private async addWorkOrderAsync(model: WorkOrderModel) {
        const constructionSite: ConstructionSite | null = this.constructionSite;
        const canAdd: boolean = (!this.workOrdersPanel.hasNewRow);
        if ((constructionSite) && (canAdd)) {
            model.owner = new ConstructionSiteOrWarehouse();
            model.owner.type = ConstructionSiteOrWarehouseType.ConstructionSite;
            model.owner.id = constructionSite.id;
            model.owner.name = constructionSite.name;
            model.owner.location = constructionSite.location;
            model.constructionSiteId = this.constructionSiteId;

            const rows: RowModel<WorkOrderModel>[] = await this.workOrdersGrid.insertAsync(0, model);
            const row: RowModel<WorkOrderModel> = rows[0];
            const nameCell: CellModel<WorkOrderModel> = row.get("name");
            await nameCell.editAsync();
        }
    }

    private get workOrdersPanel(): WorkOrdersPanel {
        return this._workOrdersPanel.current!;
    }

    private get workOrdersGrid(): GridModel<WorkOrderModel> {
        return this.workOrdersPanel.workOrdersGrid;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this.constructionSite == null) {
            const request = {constructionSiteId: this.constructionSiteId, filters: ConstructionSiteNavigator.filters};
            const response: GetConstructionSiteWithFiltersResponse = await this.postAsync("api/constructionSiteManagement/getConstructionSiteWithFilters", request);
            const constructionSite: ConstructionSite = response.constructionSite!;
            const previous: ConstructionSite | null = response.previous;
            const next: ConstructionSite | null = response.next;
            const index: number = response.index;
            const totalItemCount: number = response.totalItemCount;
            const managers: User[] = await this.fetchManagersAsync();
            const warehouses: Warehouse[] = await this.fetchWarehousesAsync();
            const defaultPrices: DefaultPrices = await this.fetchDefaultPricesAsync();

            ConstructionSiteNavigator.index = index;
            ConstructionSiteNavigator.totalItemCount = totalItemCount;

            await this.setState({constructionSite, previous, next, managers, warehouses, defaultPrices});
        }
    }

    private renderTitle(): React.ReactNode {
        return (
            <React.Fragment>

                {
                    ((ConstructionSiteNavigator.hasFilters) && (ConstructionSiteNavigator.totalItemCount > 0))
                        ?
                        (
                            <div className={styles.title}>

                                <Button className={styles.button}
                                        icon={{name: "fal caret-left", size: IconSize.Large}}
                                        title={this.getNavigationSiteTitle(this.state.previous)}
                                        route={this.getNavigationSiteRoute(this.state.previous) || undefined}
                                        disabled={this.state.isLoading || !this.state.previous}
                                />

                                <span className={styles.blue}>{(ConstructionSiteNavigator.index + 1)}/{ConstructionSiteNavigator.totalItemCount}</span>

                                <Button className={styles.button}
                                        icon={{name: "fal caret-right", size: IconSize.Large}}
                                        title={this.getNavigationSiteTitle(this.state.next)}
                                        route={this.getNavigationSiteRoute(this.state.next) || undefined}
                                        disabled={this.state.isLoading || !this.state.next}
                                />

                                <span>{this.title}</span>

                            </div>
                        )
                        : this.title
                }

            </React.Fragment>
        );
    }

    public render(): React.ReactNode {
        return (
            <PageContainer scale className={styles.constructionSiteManagement}>

                <PageHeader title={() => this.renderTitle()} subtitle={this.subtitle} withTabs className={styles.pageHeader}/>

                <PageRow>
                    <div className="col">

                        {
                            (this.constructionSite) &&
                            (
                                <TabContainer id="constructionSiteManagementTabs">

                                    <Tab id="workOrders" title={Localizer.constructionSiteManagementTabsWorkOrders}>
                                        <div>

                                            <Toolbar model={this.state.filters}
                                                     readonly={this.readonly}
                                                     addWorkOrder={async (model) => this.addWorkOrderAsync(model)}
                                                     onChange={async (model) => this.onFiltersChange(model)}
                                            />

                                            <WorkOrdersPanel ref={this._workOrdersPanel}
                                                             filters={this.state.filters}
                                                             constructionSiteId={this.state.constructionSite!.id}
                                                             readonly={this.readonly}
                                            />

                                        </div>

                                    </Tab>

                                    <Tab id="contract" title={Localizer.constructionSiteManagementTabsContract}>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="d-flex flex-nowrap w-100 no-first-last-margin">

                                                    <ConstructionSitePanel ref={this._constructionSitePanelRef}
                                                                           constructionSite={this.constructionSite}
                                                                           warehouses={this.state.warehouses}
                                                                           managers={this.state.managers}
                                                                           readonly={this.readonly}
                                                                           defaultPrices={this.state.defaultPrices}
                                                                           submit={async (sender, request) => await this.constructionSiteSubmitAsync(sender, request)}
                                                                           setActiveAsync={async (sender, activateConstructionSiteRequest, active) => await this.setConstructionSiteActiveAsync(sender, activateConstructionSiteRequest, active)}
                                                    />

                                                    <OrganizationPanel ref={this._organizationPanelRef}
                                                                       constructionSite={this.constructionSite}
                                                                       readonly={this.readonly}
                                                                       submit={async (sender, request) => await this.organizationContractSubmitAsync(sender, request)}
                                                    />

                                                </div>
                                            </div>

                                        </div>

                                    </Tab>

                                </TabContainer>
                            )

                        }

                    </div>
                </PageRow>

            </PageContainer>
        );
    }
}