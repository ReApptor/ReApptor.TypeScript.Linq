import React from "react";
import {IPagedList} from "@weare/athenaeum-toolkit";
import {TextAlign} from "@weare/athenaeum-react-common";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import {CellModel, ColumnDefinition, ColumnType, GridHoveringType, GridModel, RowModel} from "@/components/Grid/GridModel";
import Grid from "../../components/Grid/Grid";
import Warehouse from "../../models/server/Warehouse";
import GetWarehousesRequest from "../../models/server/requests/GetWarehousesRequest";
import PageDefinitions from "../../providers/PageDefinitions";
import Localizer from "../../localization/Localizer";

interface IWarehousesProps  {
}

interface IWarehousesState {
}

export default class Warehouses extends AuthorizedPage<IWarehousesProps, IWarehousesState> {

    public getTitle(): string {
        return Localizer.topNavWarehouse;
    }
    
    private readonly _warehouseGridRef: React.RefObject<Grid<Warehouse>> = React.createRef();

    private readonly _warehouseColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: "#",
            minWidth: 50,
            noWrap: true,
            className: "grey",
            textAlign: TextAlign.Center
        } as ColumnDefinition,
        {
            header: Localizer.genericNameLanguageItemName,
            accessor: "name",
            minWidth: 150,
            type: ColumnType.Text,
            editable: true,
            noWrap: true,
            route: (cell: CellModel<Warehouse>) => PageDefinitions.warehouseManagement(cell.model.id),
            settings: {
                required: true
            }
        } as ColumnDefinition,
        {
            header: Localizer.genericCostPoolLanguageItemName,
            accessor: "costPool",
            minWidth: 70,
            type: ColumnType.Text,
            editable: true,
            noWrap: true,
            settings: {
                required: true
            }
        } as ColumnDefinition,
        {
            header: "Manager",
            accessor: "manager",
            minWidth: 150,
            type: ColumnType.Text,
            editable: true,
            noWrap: true,
        } as ColumnDefinition,
        {
            header: "Address",
            accessor: "location.formattedAddress",
            minWidth: 300,
            type: ColumnType.Address,
            editable: true,
            noWrap: true,
        } as ColumnDefinition
    ];

    private initRow(row: RowModel<Warehouse>): void {
        const model: Warehouse = row.model;
        const isNew: boolean = (!model.id);
        row.className = (isNew)
            ? "bg-processed"
            : "";
    }

    private get warehouseGrid(): GridModel<Warehouse> {
        return this._warehouseGridRef.current!.model;
    }

    private async getWarehousesAsync(pageNumber: number, pageSize: number): Promise<IPagedList<Warehouse>> {
        const request = new GetWarehousesRequest();
        request.pageNumber = pageNumber;
        request.pageSize = pageSize;
        return await this.warehouseGrid.postAsync("api/warehouse/getWarehouses", request);
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title={Localizer.warehousesPageTitle} subtitle="" />

                <PageRow>
                    <div className="col">
                  
                            <Grid ref={this._warehouseGridRef}
                                  readonly={true}
                                  pagination={10}
                                  hovering={GridHoveringType.EditableCell}
                                  minWidth="auto"
                                  columns={this._warehouseColumns}
                                  initRow={(row) => this.initRow(row)}
                                  fetchData={async (sender, pageNumber, pageSize) => await this.getWarehousesAsync(pageNumber, pageSize)}
                            />
                            
                    </div>
                </PageRow>
            </PageContainer>
        );
    }
}