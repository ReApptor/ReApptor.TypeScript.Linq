import React from "react";
import {Utility, IPagedList, GeoLocation, SortDirection} from "@weare/athenaeum-toolkit";
import {TextAlign} from "@weare/athenaeum-react-common";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import {CellAction, CellModel, ColumnActionDefinition, ColumnDefinition, ColumnType, GridHoveringType, GridModel, RowModel} from "@/components/Grid/GridModel";
import Grid from "../../components/Grid/Grid";
import ConstructionSite from "../../models/server/ConstructionSite";
import GetConstructionSitesRequest from "../../models/server/requests/GetConstructionSitesRequest";
import {ActionType, ConstructionSiteStatus} from "@/models/Enums";
import Toolbar from "./Toolbar/Toolbar";
import ToolbarModel from "./Toolbar/ToolbarModel";
import SaveConstructionSiteRequest from "../../models/server/requests/SaveConstructionSiteRequest";
import PageDefinitions from "../../providers/PageDefinitions";
import ConstructionSiteNavigator from "@/pages/ConstructionSiteManagement/ConstructionSiteNavigator";
import UserInteractionDataStorage from "@/providers/UserInteractionDataStorage";
import Localizer from "../../localization/Localizer";

interface IConstructionSitesProps {
}

interface IConstructionSitesState {
    filters: ToolbarModel
}

export default class ConstructionSites extends AuthorizedPage<IConstructionSitesProps, IConstructionSitesState> {

    state: IConstructionSitesState = {
        filters: ConstructionSites.initializeToolbar()
    };
    
    private static initializeToolbar(): ToolbarModel {
        return UserInteractionDataStorage.get("filter", new ToolbarModel());
    }
    
    private readonly _sitesRef: React.RefObject<Grid<ConstructionSite>> = React.createRef();

    private readonly _columns: ColumnDefinition[] = [
        {
            header: Localizer.constructionSitesToolbarCustomerLanguageItemName,
            accessor: "organization.name",
            sorting: true,
            minWidth: "20rem",
            settings: {
                infoAccessor: "organization.vatId"
            }
        } as ColumnDefinition,
        {
            header: Localizer.constructionSitesNameLanguageItemName,
            accessor: "name",
            sorting: true,
            minWidth: "20rem",
            route: (cell: CellModel<ConstructionSite>) => PageDefinitions.constructionSiteManagement(cell.model.id)
        } as ColumnDefinition,
        {
            header: Localizer.constructionSitesReferenceLanguageItemName,
            accessor: "externalReference",
            sorting: true,
            textAlign: TextAlign.Left,
            minWidth: "20rem"
        } as ColumnDefinition,
        {
            header: Localizer.formInputAddressLanguageItemName,
            accessor: "location.formattedAddress",
            type: ColumnType.Address,
            sorting: true,
            noWrap: true,
            minWidth: "20rem"
        } as ColumnDefinition,
        {
            header: Localizer.constructionSitesStatusLanguageItemName,
            accessor: "status",
            sorting: true,
            format: "ConstructionSiteStatus",
            type: ColumnType.Custom,
            editable: false,
            minWidth: 100,
        } as ColumnDefinition,
        {
            minWidth: 99,
            init: (cell) => this.initConstructionSiteOperationsAsync(cell),
            actions: [
                {
                    name: "save",
                    title: Localizer.constructionSitesCommitChangesLanguageItemName,
                    icon: "far save",
                    type: ActionType.Create,
                    callback: async (cell, action) => await this.processConstructionSiteOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "cancel",
                    title: Localizer.constructionSitesCancelChangesLanguageItemName,
                    icon: "far ban",
                    type: ActionType.Delete,
                    callback: async (cell, action) => await this.processConstructionSiteOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "activate",
                    title: Localizer.constructionSitesActivateLanguageItemName,
                    icon: "far play-circle",
                    type: ActionType.Create,
                    confirm: (cell: CellModel<ConstructionSite>) => Utility.format(Localizer.constructionSitesConfirmationActivateSite, cell.model.name),
                    callback: async (cell, action) => await this.processConstructionSiteOperationAsync(cell, action)
                } as ColumnActionDefinition,
                {
                    name: "deactivate",
                    title: Localizer.constructionSitesDeactivateLanguageItemName,
                    icon: "far stop-circle",
                    type: ActionType.Default,
                    confirm: (cell: CellModel<ConstructionSite>) => Utility.format(Localizer.constructionSitesConfirmationDeactivateSite, cell.model.name),
                    callback: async (cell, action) => await this.processConstructionSiteOperationAsync(cell, action)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition
    ];

    private async processConstructionSiteOperationAsync(cell: CellModel<ConstructionSite>, action: CellAction<ConstructionSite>): Promise<void> {
        const model: ConstructionSite = cell.row.cells[0].model;

        if (action.action.name === "save") {

            const request = new SaveConstructionSiteRequest();
            request.constructionSiteId = model.id;
            request.organizationContractId = (model.organizationContract) ? model.organizationContract.id : "";
            request.formattedAddress = (model.location) ? model.location!.formattedAddress : "";
            request.name = model.name;
            request.status = model.status;
            request.externalId = model.externalId;
            
            await cell.grid.postAsync("api/constructionSites/saveConstructionSite", request);
            await cell.row.saveAsync();

        } else if (action.action.name === "cancel") {

            await cell.row.cancelAsync();

        } else if (action.action.name === "activate") {
            
            model.status = ConstructionSiteStatus.Active;
            
            await cell.grid.postAsync("api/constructionSites/activateConstructionSite", model.id);
            await cell.row.bindAsync();
            
        } else if (action.action.name === "deactivate") {
            
            model.status = ConstructionSiteStatus.Inactive;

            await cell.grid.postAsync("api/constructionSites/deactivateConstructionSite", model.id);
            await cell.row.bindAsync();
        }
    }

    private initRow(row: RowModel<ConstructionSite>): void {
        const model: ConstructionSite = row.model;
        if (model.location == null) {
            model.location = new GeoLocation();
        }
    }
    
    private async initConstructionSiteOperationsAsync(cell: CellModel<ConstructionSite>): Promise<void> {

        const model: ConstructionSite = cell.row.model;
        const modified: boolean = cell.row.modified;
        const isActive: boolean = (model.status == ConstructionSiteStatus.Active);
        const isClosed: boolean = (model.status == ConstructionSiteStatus.Closed);

        const saveAction: CellAction<ConstructionSite> = cell.actions[0];
        const cancelAction: CellAction<ConstructionSite> = cell.actions[1];
        const activateAction: CellAction<ConstructionSite> = cell.actions[2];
        const disableAction: CellAction<ConstructionSite> = cell.actions[3];

        saveAction.visible = (modified);
        cancelAction.visible = (modified);
        activateAction.visible = (!isActive) && (!isClosed) && (!modified);
        disableAction.visible = (isActive) && (!isClosed) && (!modified);
    }

    private async onFilterAsync(filters: ToolbarModel): Promise<void> {
        await this.setState({filters});
        UserInteractionDataStorage.set("filter", filters);
        await this.sitesGrid.reloadAsync();
    }

    private async getConstructionSitesAsync(sender: Grid<ConstructionSite>, pageNumber: number, pageSize: number, sortColumnName: string | null, sortDirection: SortDirection | null): Promise<IPagedList<ConstructionSite>> {

        const request = new GetConstructionSitesRequest();
        request.pageNumber = pageNumber;
        request.pageSize = pageSize;
        request.sortColumnName = sortColumnName;
        request.sortDirection = sortDirection;
        request.status = this.state.filters.status;
        request.organizationIds = [this.state.filters.customer];
        request.siteNameOrExternalId = this.state.filters.site;
        request.customerNameOrExternalId = this.state.filters.customer;
        request.workOrderStatus = this.state.filters.workOrderStatuses;

        ConstructionSiteNavigator.filters = request;

        return await sender.postAsync("api/constructionSites/getConstructionSites", request);
    }

    private get sitesGrid(): GridModel<ConstructionSite> {
        return this._sitesRef.current!.model;
    }

    public getTitle(): string {
        return Localizer.topNavConstructionSites;
    }

    public render(): React.ReactNode {
        return (
            <PageContainer scale>
                <PageHeader title= {Localizer.constructionSitesSites} subtitle={Localizer.constructionSitesSitesInfo}/>

                <PageRow>

                    <div className="col">

                        <div className="d-inline-block">

                            <Toolbar model={this.state.filters}
                                     onChange={async (model) => this.onFilterAsync(model)}
                            />
                            
                            <Grid id="sites" ref={this._sitesRef} autoToggle pagination
                                  minWidth="auto"
                                  hovering={GridHoveringType.Row}
                                  headerMinHeight={80}
                                  columns={this._columns}
                                  initRow={(row) => this.initRow(row)}
                                  fetchData={async (sender, pageNumber, pageSize, sortColumnName, sortDirection) => await this.getConstructionSitesAsync(sender, pageNumber, pageSize, sortColumnName, sortDirection)}
                            />

                        </div>

                    </div>

                </PageRow>

            </PageContainer>
        );
    }
}