import React from "react";
import {ArrayUtility, Utility, IPagedList, SortDirection} from "@weare/athenaeum-toolkit";
import {BaseComponent, TextAlign} from "@weare/athenaeum-react-common";
import {Checkbox, ColumnDefinition, ColumnType, Form, Grid, GridHoveringType, GridOddType} from "@weare/athenaeum-react-components";

export interface IGridTestsState {
    bePagination: boolean
}

class GridItem {
    public index: number = 0;

    public name: string = "";

    public code: string = "";

    public float: number = 0;
    
    public int: number = 0;
    
    public date: Date = new Date();
    
    public value: string = "";
    
    public address: string = "";
}

export default class GridTests extends BaseComponent<{}, IGridTestsState> {

    state: IGridTestsState = {
        bePagination: false
    };

    private readonly _gridRef: React.RefObject<Grid<GridItem>> = React.createRef();
    private _items: GridItem[] | null = null;

    private readonly _columns: ColumnDefinition[] = [
        {
            group: "Identifiers",
            header: "#",
            accessor: "code",
            sorting: true,
            minWidth: 40,
            noWrap: true,
            className: "grey"
        } as ColumnDefinition,
        {
            group: "Identifiers",
            header: "Name",
            accessor: "name",
            sorting: true,
            minWidth: 90,
            noWrap: true
        } as ColumnDefinition,
        {
            header: "Float",
            accessor: "float",
            format: "0.00",
            sorting: true,
            minWidth: 90,
            noWrap: true,
            textAlign: TextAlign.Center
        } as ColumnDefinition,
        {
            header: "Int",
            accessor: "int",
            sorting: true,
            minWidth: 90,
            noWrap: true,
            textAlign: TextAlign.Center
        } as ColumnDefinition,
        {
            header: "Date",
            accessor: "date",
            format: "D",
            sorting: true,
            minWidth: 90,
            noWrap: true,
            textAlign: TextAlign.Center
        } as ColumnDefinition,
        {
            header: "Value",
            accessor: "value",
            editable: true,
            type: ColumnType.Text,
            minWidth: 150
        } as ColumnDefinition,
        {
            header: "Address",
            accessor: "address",
            type: ColumnType.Address,
            sorting: true,
            noWrap: true,
            minWidth: "20rem",
            settings: {
                locationPicker: true
            }
        } as ColumnDefinition,
    ];

    private get items(): GridItem[] {
        if (this._items == null) {
            this._items = [];
            const count: number = 1;//100;
            for (let i: number = 0; i < count; i++) {
                const item = { index: i, name: `Item #${i + 1}`, code: "#" + i, float: Math.random(), int: Math.round(100 * Math.random()), date: new Date(), value: Math.round(100 * Math.random()).toString() } as GridItem;
                this._items.push(item);
            }
        }
        return this._items!;
    }

    private async fetchDataAsync(sender: Grid<GridItem>, pageNumber: number, pageSize: number, sortColumnName: string | null, sortDirection: SortDirection | null): Promise<IPagedList<GridItem> | GridItem[]> {
        if (this.state.bePagination) {

            const items: GridItem[] = (sortColumnName)
                ? this.items.sort(ArrayUtility.sortByProperty(sortColumnName, sortDirection))
                : this.items;

            return Utility.toPagedList(items, pageNumber, pageSize);

        }

        return this.items;
    }

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form>

                    <Checkbox label="BE pagination"
                              inline
                              value={this.state.bePagination}
                              onChange={async (sender, value) => await this.setState({ bePagination:value })}
                    />

                </Form>

                <Grid ref={this._gridRef} pagination={10}
                      columns={this._columns}
                      hovering={GridHoveringType.Row}
                      odd={GridOddType.Row}
                      fetchData={async (sender, pageNumber, pageSize, sortColumnName, sortDirection) => await this.fetchDataAsync(sender, pageNumber, pageSize, sortColumnName, sortDirection)}
                />


            </React.Fragment>
        );
    }
}