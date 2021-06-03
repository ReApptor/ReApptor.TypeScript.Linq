import React from "react";
import {ArrayUtility, Utility, IPagedList, SortDirection} from "@weare/athenaeum-toolkit";
import {ActionType, BaseComponent, TextAlign} from "@weare/athenaeum-react-common";
import {Checkbox, ColumnDefinition, ColumnType, Form, Grid, GridHoveringType, GridOddType, CellModel, SelectListItem, DropdownRequiredType} from "@weare/athenaeum-react-components";

export interface IGridTestsState {
    bePagination: boolean
}

enum GridEnum {
    First,
    
    Second,
    
    Third,
    
    Forth
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
    
    public enum: GridEnum = GridEnum.Second;
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
            header: "Enum",
            accessor: "enum",
            type: ColumnType.Dropdown,
            sorting: true,
            noWrap: true,
            minWidth: "5rem",
            transform: (cell, value) => (value) ? this.transformEnumToSomething(value, true) : "",
            init: (cell) => this.initCellAsync(cell),
            settings: {
                infoAccessor: "name",
                infoTransform:  (cell, value) => (value) ? this.transformEnumToSomething2(value, true) : "",
                required: true,
                requiredType: DropdownRequiredType.AutoSelect,
                nothingSelectedText: "-",
                fetchItems: async () => this.getEnumItems()
            }
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
           {
            actions:[
                {
                    name: "cancel",
                    title: "save",
                    type: ActionType.Blue,
                    actions: ["test1", "test2"],
                    callback:(cell, action: any, selectedAction: string  ) => this.cellActioncallBack(cell, action, selectedAction),

                },
                {
                    name: "save",
                    title: "save",
                    icon: "far save",
                    type: ActionType.Create,
                    actions: ["test11", "test22"],
                    callback:(cell, action: string, selectedAction: string  ) => this.cellActioncallBack(cell, action, selectedAction),

                }
            ]
            
        } as ColumnDefinition
    ];

    private getEnumItems(): SelectListItem[] {
        return [
            new SelectListItem(GridEnum.First.toString(), this.getEnumText(GridEnum.First)),
            new SelectListItem(GridEnum.Second.toString(), this.getEnumText(GridEnum.Second)),
            new SelectListItem(GridEnum.Third.toString(), this.getEnumText(GridEnum.Third)),
            new SelectListItem(GridEnum.Forth.toString(), this.getEnumText(GridEnum.Forth)),
        ];
    }

    private getEnumText(value: GridEnum): string {
        switch (value) {
            case GridEnum.First: return "First";
            case GridEnum.Second: return "Second";
            case GridEnum.Third: return "Third";
            case GridEnum.Forth: return "Forth";
        }
        return "GridEnum:" + value;
    }

    private get items(): GridItem[] {
        if (this._items == null) {
            this._items = [];
            const count: number = 1;//100;
            for (let i: number = 0; i < count; i++) {
                const item: GridItem = {
                    index: i,
                    name: `Item #${i + 1}`,
                    code: "#" + i,
                    float: Math.random(),
                    int: Math.round(100 * Math.random()),
                    date: new Date(),
                    value: Math.round(100 * Math.random()).toString(),
                    enum: Math.round(3 * Math.random()),
                    address: ""
                };
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

                <Grid ref={this._gridRef}
                      pagination={10}
                      columns={this._columns}
                      hovering={GridHoveringType.Row}
                      odd={GridOddType.Row}
                      fetchData={async (sender, pageNumber, pageSize, sortColumnName, sortDirection) => await this.fetchDataAsync(sender, pageNumber, pageSize, sortColumnName, sortDirection)}
                />

            </React.Fragment>
        );
    }

    private initCellAsync(cell: CellModel<any>) {
        cell.readonly = true;
    }

    private transformEnumToSomething2(value: any, b: boolean) {
        return value.toString() + " bbbbb";
    }

    private transformEnumToSomething(value: any, b: boolean) {
        return value.toString() + " aaaaaa";
    }

    private cellActioncallBack(cell: CellModel<any>, cellAction: string, selectedAction: string) {
        console.log(selectedAction)
    }
}