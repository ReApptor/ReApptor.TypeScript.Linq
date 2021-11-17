import React from "react";
import {ArrayUtility, IPagedList, SortDirection, Utility} from "@weare/athenaeum-toolkit";
import {ActionType, BaseComponent, ch, Justify, TextAlign} from "@weare/athenaeum-react-common";
import {
    CellModel,
    Checkbox,
    ColumnActionDefinition,
    ColumnActionType,
    ColumnDefinition,
    ColumnType,
    Dropdown,
    DropdownOrderBy,
    DropdownRequiredType,
    Form,
    Grid,
    GridHoveringType,
    GridOddType,
    GridSelectableType,
    SelectListItem, TextInput
} from "@weare/athenaeum-react-components";

export interface IGridTestsState {
    bePagination: boolean;
    responsive: boolean;
    selectable: boolean;
    selectableType: GridSelectableType;
    checkable: boolean;
    headerGroups: boolean;
    search: string | null;
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

    public description: string = "";

    public enum: GridEnum = GridEnum.Second;
}

export default class GridTests extends BaseComponent<{}, IGridTestsState> {

    state: IGridTestsState = {
        bePagination: true,
        responsive: true,
        selectable: false,
        selectableType: GridSelectableType.Single,
        checkable: false,
        headerGroups: true,
        search: null,
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
                    callback: async (cell) => await GridTests.toggleDetailsAsync(cell)
                } as ColumnActionDefinition
            ]
        } as ColumnDefinition,
        {
            group: this.state.headerGroups ? "Identifiers" : undefined,
            header: "Name",
            accessor: "name",
            sorting: true,
            minWidth: 90,
            noWrap: false,
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
            isDefaultSorting: true,
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
            rotate: true,
            noWrap: true,
            minWidth: "5rem",
            transform: (cell, value) => (value) ? GridTests.transformEnumToSomething(value) : "",
            init: (cell) => GridTests.initCell(cell),
            settings: {
                infoAccessor: "name",
                addButton: "Add new",
                addCallback: async (cell: CellModel<GridItem>) => GridTests.addNewEnumAsync(cell),
                infoTransform: (cell, value) => (value) ? GridTests.transformEnumToSomething(value) : "",
                required: true,
                requiredType: DropdownRequiredType.AutoSelect,
                nothingSelectedText: "-",
                fetchItems: async () => GridTests.getEnumItems()
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
                locationPicker: true,
                descriptionAccessor: nameof<GridItem>(o => o.description),
                descriptionTitle: "description",
                descriptionJustify: Justify.Right,
                descriptionMaxLength: 10
            },
        } as ColumnDefinition,
        {
            actions: [
                {
                    name: "cancel",
                    title: "save",
                    type: ActionType.Blue,
                    actions: ["test1", "test2"],
                    callback: (cell, action: any, selectedAction: string) => GridTests.cellActionCallBack(selectedAction),
                },
                {
                    name: "save",
                    title: "save",
                    icon: "far save",
                    type: ActionType.Create,
                    actions: ["test11", "test22"],
                    callback: (cell, action: string, selectedAction: string) => GridTests.cellActionCallBack(selectedAction),
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

    private static async toggleDetailsAsync(cell: CellModel<GridItem>): Promise<void> {
        await cell.row.toggleAsync();
    }

    private static getEnumItems(): SelectListItem[] {
        return [
            new SelectListItem(GridEnum.First.toString(), GridTests.getEnumText(GridEnum.First)),
            new SelectListItem(GridEnum.Second.toString(), GridTests.getEnumText(GridEnum.Second)),
            new SelectListItem(GridEnum.Third.toString(), GridTests.getEnumText(GridEnum.Third)),
            new SelectListItem(GridEnum.Forth.toString(), GridTests.getEnumText(GridEnum.Forth))
        ];
    }

    private static getEnumText(value: GridEnum): string {
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

    private static async addNewEnumAsync(cell: CellModel<GridItem>): Promise<void> {
        await ch.flyoutMessageAsync("onAdd: " + cell.model.value);
    }

    private get items(): GridItem[] {
        if (!this._items) {
            this._items = [];
            for (let i: number = 1; i < 100; i++) {
                const name: string = Array(i).fill("a ", 0, i).reduce((previous: string, current: string) => previous + current);
                const item: GridItem = {
                    index: i,
                    name: name,
                    code: "#" + i,
                    float: Math.random(),
                    int: Math.round(100 * Math.random()),
                    date: new Date(),
                    value: Math.round(100 * Math.random()).toString(),
                    enum: Math.round(3 * Math.random()),
                    address: "",
                    description: ""
                };
                this._items.push(item);
            }
        }
        return this._items!;
    }

    private async fetchDataAsync(pageNumber: number, pageSize: number, sortColumnName: string | null, sortDirection: SortDirection | null): Promise<IPagedList<GridItem> | GridItem[]> {

        let items: GridItem[] = (sortColumnName)
            ? this.items.sort(ArrayUtility.sortByProperty(sortColumnName, sortDirection))
            : this.items;

        if (this.state.search) {
            items = items.filter(item => item.name.includes(this.state.search!));
            console.log(this.state.search);
        }

        const ret: GridItem[] | IPagedList<GridItem> = (this.state.bePagination)
            ? Utility.toPagedList(items, pageNumber, pageSize)
            : items;

        console.log(ret);

        return ret;
    }

    private async fetchInnerDataAsync(): Promise<GridItem[]> {
        return this.items.take(10);
    }

    private static initCell(cell: CellModel<any>): void {
        cell.readonly = false;
    }

    private static transformEnumToSomething(value: any): string {
        return value.toString() + " aaaaaa";
    }

    private static cellActionCallBack(selectedAction: string): void {
        console.log(selectedAction)
    }

    private static getGridSelectableTypeName(item: GridSelectableType): string {
        switch (item) {
            case GridSelectableType.Single: return "Single";
            case GridSelectableType.Multiple: return "Multiple";
        }
    }

    private async searchAsync(search: string | null): Promise<void> {
        await this.setState({search});
        await this._gridRef.current!.reloadAsync();
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
                              onChange={async (sender, value) => {await this.setState({bePagination: value})}}
                    />

                    <Checkbox inline
                              label="Responsive"
                              value={this.state.responsive}
                              onChange={async (sender, value) => {await this.setState({responsive: value})}}
                    />

                    <Checkbox inline
                              label="Selectable"
                              value={this.state.selectable}
                              onChange={async (sender, value) => {await this.setState({selectable: value})}}
                    />

                    {
                        (this.state.selectable) &&
                        (
                            <Dropdown label="Selectable Type" inline required noValidate noWrap noFilter
                                      orderBy={DropdownOrderBy.None}
                                      transform={(item) => new SelectListItem(item.toString(), GridTests.getGridSelectableTypeName(item), null, item)}
                                      items={[GridSelectableType.Single, GridSelectableType.Multiple]}
                                      selectedItem={this.state.selectableType}
                                      onChange={async (sender, value) => {await this.setState({ selectableType: value! })}}
                            />
                        )
                    }

                    <Checkbox inline
                              label="Checkable"
                              value={this.state.checkable}
                              onChange={async (sender, value) => {await this.setState({checkable: value})}}
                    />

                    <TextInput inline
                               label="Search"
                               value={this.state.search ?? ""}
                               onChange={async (_, value) => await this.searchAsync(value)}
                    />

                </Form>

                <Grid ref={this._gridRef}
                      responsive={this.state.responsive}
                      selectable={this.state.selectable ? this.state.selectableType : undefined}
                      checkable={this.state.checkable}
                      pagination={10}
                      columns={this._columns}
                      hovering={GridHoveringType.Row}
                      odd={GridOddType.Row}
                      renderDetails={() => this.renderDetailsContent()}
                      fetchData={async (sender, pageNumber, pageSize, sortColumnName, sortDirection) => await this.fetchDataAsync(pageNumber, pageSize, sortColumnName, sortDirection)}
                      onRowToggle={async (row) => console.log("onRowToggle", row)}
                />

            </React.Fragment>
        );
    }
}