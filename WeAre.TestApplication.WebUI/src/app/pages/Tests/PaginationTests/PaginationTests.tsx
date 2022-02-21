import React from "react";
import {ArrayUtility, Utility, IPagedList, SortDirection} from "@weare/reapptor-toolkit";
import {ch, ActionType, BaseComponent, TextAlign} from "@weare/reapptor-react-common";
import {ColumnActionDefinition, ColumnActionType, Checkbox, ColumnDefinition, ColumnType, Form, Grid, GridHoveringType, GridOddType, CellModel, SelectListItem, DropdownRequiredType, Pagination} from "@weare/reapptor-react-components";

export interface IPaginationTestsState {
    bePagination: boolean;
    responsive: boolean;
    headerGroups: boolean;
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

export default class PaginationTests extends BaseComponent<{}, IPaginationTestsState> {

    state: IPaginationTestsState = {
        bePagination: false,
        responsive: false,
        headerGroups: true,
    };

    private readonly _gridRef: React.RefObject<Grid<GridItem>> = React.createRef();
    private _items: GridItem[] | null = null;

    private readonly _columns: ColumnDefinition[] = [
        {
            group: this.state.headerGroups ? "Identifiers" : undefined,
            header: "#",
            accessor: "code",
            sorting: true,
            minWidth: 40,
            noWrap: true,
            className: "grey",
            actions: [
                {
                    type: ColumnActionType.Details,
                    callback: async (cell) => await this.toggleDetailsAsync(cell)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            group: this.state.headerGroups ? "Identifiers" : undefined,
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
            init: (cell) => this.initCell(cell),
            settings: {
                infoAccessor: "name",
                addButton: "Add new",
                addCallback: async (cell: CellModel<GridItem>) => this.addNewEnumAsync(cell),
                infoTransform: (cell, value) => (value) ? this.transformEnumToSomething2(value, true) : "",
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
            minWidth: "10rem",
            //responsivePriority: -1,
            settings: {
                locationPicker: true
            }
        } as ColumnDefinition,
        {
            actions: [
                {
                    name: "cancel",
                    title: "save",
                    type: ActionType.Blue,
                    actions: ["test1", "test2"],
                    callback: (cell, action: any, selectedAction: string) => this.cellActionCallBack(cell, action, selectedAction),
                },
                {
                    name: "save",
                    title: "save",
                    icon: "far save",
                    type: ActionType.Create,
                    actions: ["test11", "test22"],
                    callback: (cell, action: string, selectedAction: string) => this.cellActionCallBack(cell, action, selectedAction),
                }
            ]

        } as ColumnDefinition
    ];

    private readonly _innerColumns: ColumnDefinition[] = [
        {
            header: "#",
            accessor: "code",
            sorting: true,
            minWidth: 40,
            noWrap: true,
            className: "grey"
        } as ColumnDefinition,
        {
            header: "Name",
            accessor: "name",
            sorting: true,
            minWidth: 90,
            noWrap: true
        } as ColumnDefinition
    ];

    private async toggleDetailsAsync(cell: CellModel<GridItem>): Promise<void> {
        await cell.row.toggleAsync();
    }

    private getEnumItems(): SelectListItem[] {
        return [
            new SelectListItem(GridEnum.First.toString(), this.getEnumText(GridEnum.First)),
            new SelectListItem(GridEnum.Second.toString(), this.getEnumText(GridEnum.Second)),
            new SelectListItem(GridEnum.Third.toString(), this.getEnumText(GridEnum.Third)),
            new SelectListItem(GridEnum.Forth.toString(), this.getEnumText(GridEnum.Forth))
        ];
    }

    private getEnumText(value: GridEnum): string {
        switch (value) {
            case GridEnum.First:
                return "First";
            case GridEnum.Second:
                return "Second";
            case GridEnum.Third:
                return "Third";
            case GridEnum.Forth:
                return "Forth";
        }
        return "GridEnum:" + value;
    }
    
    private async addNewEnumAsync(cell: CellModel<GridItem>): Promise<void> {
        await ch.flyoutMessageAsync("onAdd: " + cell.model.value);
    }

    private get items(): GridItem[] {
        if (this._items == null) {
            this._items = [];
            const count: number = 100;
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

    private get grid(): Grid<GridItem> {
        return this._gridRef.current!;
    }

    private async fetchDataAsync(pageNumber: number, pageSize: number, sortColumnName: string | null, sortDirection: SortDirection | null): Promise<IPagedList<GridItem> | GridItem[]> {
        if (this.state.bePagination) {

            const items: GridItem[] = (sortColumnName)
                ? this.items.sort(ArrayUtility.sortByProperty(sortColumnName, sortDirection))
                : this.items;

            return Utility.toPagedList(items, pageNumber, pageSize);

        }

        return this.items;
    }

    private async fetchInnerDataAsync(): Promise<GridItem[]> {
        return this.items.take(10);
    }

    private initCell(cell: CellModel<any>): void {
        cell.readonly = false;
    }

    private transformEnumToSomething2(value: any, b: boolean): string {
        return value.toString() + " bbbbb";
    }

    private transformEnumToSomething(value: any, b: boolean): string {
        return value.toString() + " aaaaaa";
    }

    private cellActionCallBack(cell: CellModel<any>, cellAction: string, selectedAction: string): void {
        console.log(selectedAction)
    }

    public renderDetailsContent() {
        return (
            <div>
                <Grid columns={this._innerColumns}
                      minWidth="auto"
                      hovering={GridHoveringType.Row}
                      odd={GridOddType.None}
                      fetchData={() => this.fetchInnerDataAsync()}
                />
            </div>
        );
    }

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form>

                    <Checkbox inline
                              label="BE pagination"
                              value={this.state.bePagination}
                              onChange={async (sender, value) => await this.setState({bePagination: value})}
                    />

                    <Checkbox inline
                              label="Responsive"
                              value={this.state.responsive}
                              onChange={async (sender, value) => await this.setState({responsive: value})}
                    />

                    {/*<Checkbox inline*/}
                    {/*          label="Header groups"*/}
                    {/*          value={this.state.headerGroups}*/}
                    {/*          onChange={async (sender, value) => { await this.setState({ headerGroups: value }); }}*/}
                    {/*/>*/}

                </Form>

                <Grid ref={this._gridRef}
                      responsive={this.state.responsive}
                      pagination={10}
                      columns={this._columns}
                      hovering={GridHoveringType.Row}
                      odd={GridOddType.Row}
                      renderDetails={() => this.renderDetailsContent()}
                      fetchData={async (sender, pageNumber, pageSize, sortColumnName, sortDirection) => await this.fetchDataAsync(pageNumber, pageSize, sortColumnName, sortDirection)}
                />

                <Pagination pageNumber={1} pageSize={10} totalItemCount={100} itemCount={200}/>

            </React.Fragment>
        );
    }
}