import React from "react";
import {HashCodeUtility, Utility, TFormat, IPagedList, SortDirection} from "@weare/athenaeum-toolkit";
import {Justify, Align, PageRoute, TextAlign, VerticalAlign, ch, IBaseComponent, IAsyncComponent} from "@weare/athenaeum-react-common";
import {ActionType} from "@/models/Enums";
import {IIconProps} from "../Icon/Icon";
import Dropdown, {DropdownAlign, DropdownVerticalAlign} from "../Form/Inputs/Dropdown/Dropdown";
import Comparator from "../../helpers/Comparator";
import ArrayScope from "../../models/ArrayScope";
import {IInput} from "../Form/Inputs/BaseInput";
import {IConfirmation} from "@/components/ConfirmationDialog/ConfirmationDialog";
import Dictionary from "typescript-collections/dist/lib/Dictionary";

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 20;

export type TGridData<TItem> = TItem[] | IPagedList<TItem>;

export type GridAccessorCallback<TItem = {}> = (model: TItem) => any;

export type GridDescriptionAccessorCallback<TItem = {}> = (model: TItem) => string;

export type GridRouteCallback<TItem = {}> = (cell: CellModel<TItem>) => PageRoute;

export type GridConfirmationDialogTitleCallback<TItem = {}> = (cell: CellModel<TItem>, action: CellAction<TItem>) => string;

//export type GridSortingCallback<TItem = {}> = (column: ColumnModel<TItem>, x: TItem, y: TItem) => number;

export enum ColumnType {
    Custom,
    
    Text,
    
    Number,
    
    Date,
    
    Enum,
    
    Boolean,
    
    Dropdown,
    
    Address,
    
    Icon
}

export enum ColumnActionType {
    Details = "_details",
    
    Preview = "_preview",
    
    Download = "_download"
}

export enum GridHoveringType {
    Row,
    
    Cell,
    
    EditableCell,
    
    None
}

export enum GridOddType {
    Row,
    
    None
}

export enum CellPaddingType {
    Large,

    Medium,
    
    Small
}

export enum BorderType {
    Default,
    
    DarkSeparators
}

export interface IGridDefinition {
    id?: string;

    className?: string;
    
    columns: ColumnDefinition[];
    
    headerMinHeight?: number;

    noDataNoHeader?: boolean;

    minWidth?: string | number;
    
    cellPadding?: CellPaddingType;
    
    noDataText?: string;
    
    detailsColStart?: number;

    detailsColEnd?: number;
    
    autoToggle?: boolean;

    hovering?: GridHoveringType;

    odd?: GridOddType;
    
    pagination?: boolean | number;
    
    checkable?: boolean;
    
    readonly?: boolean;
    
    borderType?: BorderType;

    optimization?: boolean;

    initRow?(row: RowModel<any>): void;

    renderDetails?(row: RowModel<any>): React.ReactNode;
    
    onCheck?(sender: GridModel<any>): Promise<void>;
}

export interface IGrid extends IAsyncComponent {
    clearAsync(): Promise<void>;
}

export interface ICell extends IBaseComponent {
}

export interface IRow extends IBaseComponent {
}

export interface ITotalRow extends IBaseComponent {
}

export interface ICellAction extends IBaseComponent {
}

export class ColumnModel<TItem = {}> {
    public name: string | null = null;
    
    public index: number = 0;

    public header: string = "";
    
    public title: string = "";

    public accessor: string | GridAccessorCallback<TItem> | null = null;

    public visible: boolean = true;

    public group: string | null = null;

    public textAlign: TextAlign | null = null;

    public verticalAlign: VerticalAlign | null = null;

    public type: ColumnType = ColumnType.Custom;

    public editable: boolean = false;
    
    public removable: boolean = true;

    public reRenderRow: boolean = false;
    
    public rotate: boolean = false;

    public format: TFormat | null = null;

    public minWidth: string | number | null = null;

    public maxWidth: string | number | null = null;
    
    public noWrap: boolean = false;
    
    public wordBreak: boolean = false;
    
    public stretch: boolean = false;
    
    public total: boolean = false;

    public route: PageRoute | GridRouteCallback<TItem> | null = null;
    
    public className: string | null = null;
    
    public settings: ColumnSettings<TItem> = new ColumnSettings<TItem>();

    public sorting: boolean | SortDirection | null = null;

    public actions: ColumnAction<TItem>[] = [];

    public init?(cell: CellModel<any>): void;

    public transform?(cell: CellModel<TItem>, cellValue: any, format: TFormat | null): string;

    public render?(cell: CellModel<TItem>): React.ReactNode;
    
    public callback?(cell: CellModel<TItem>, action: CellAction<TItem> | null): Promise<void>;

    public grid: GridModel<TItem> = new GridModel<TItem>();
    
    public get isFirst(): boolean {
        return (this.index === 0);
    }

    public get isLast(): boolean {
        return (this.index === this.grid.columns.length - 1);
    }
    
    public get cells(): CellModel<TItem>[] {
        return this.grid.rows.map(row => row.cells[this.index]);
    }
    
    public get sortable(): boolean {
        return (this.sorting != null) && (this.sorting != false);
    }
}

export class GridModel<TItem = {}> {
    public id: string = "";
    
    public className: string | null = null;
    
    public rows: RowModel<TItem>[] = [];

    public columns: ColumnModel<TItem>[] = [];
    
    public headerMinHeight: number | null = null;
    
    public noDataNoHeader: boolean = false;

    public minWidth: string | number | null = null;

    public cellPadding: CellPaddingType = CellPaddingType.Large;

    public noDataText: string | null = null;

    public detailsColStart: number | null = null;

    public detailsColEnd: number | null = null;

    public autoToggle: boolean = false;

    public hovering: GridHoveringType = GridHoveringType.Row;

    public odd: GridOddType = GridOddType.Row;
    
    public pagination: boolean | number = false;
    
    public checkable: boolean = false;
    
    public readonly: boolean = false;
    
    public borderType: BorderType = BorderType.DarkSeparators;
    
    public optimization: boolean = true;
    
    public checked: boolean | undefined = false;

    public instance: IGrid = {} as IGrid;
    
    public checkHeaderInstance: IBaseComponent = {} as IBaseComponent;
    
    public data: TItem[] = [];

    public pageNumber: number = 1;

    public pageSize: number = DEFAULT_PAGE_SIZE;
    
    public sortColumn: ColumnModel<TItem> | null = null;
    
    public sortDirection: SortDirection | null = null;

    public totalItemCount: number = 0;
    
    public generation: number = 0;
    
    public get key(): string {
        return `grid_${this.id}`;
    }

    public onCheck?(sender: GridModel<any>): Promise<void>;

    public renderDetails?(row: RowModel<TItem>): React.ReactNode;
    
    public get modified(): boolean {
        return this.rows.some(item => item.modified);
    }
    
    public get total(): boolean {
        return this.columns.some(item => item.total);
    }

    public get checkedRows(): RowModel<TItem>[] {
        return (this.checkable)
            ? this.rows.filter(row => row.checked)
            : [];
    }
    
    public get items(): TItem[] {
        return this.rows.map(row => row.model);
    }

    public get checkedItems(): TItem[] {
        return this.checkedRows.map(row => row.model);
    }
    
    public get firstRow(): RowModel<TItem> {
        return this.rows[0];
    }

    public get lastRow(): RowModel<TItem> {
        return this.rows[this.rows.length - 1];
    }
    
    public getDump(): Dictionary<string, any> {
        const dump = new Dictionary<string, string>();
        //const cells: CellModel<TItem>[] = [];
        this.rows.filter(row => row.modified).forEach(row => row.cells.filter(cell => cell.modified).forEach(cell => dump.setValue(cell.initialKey, cell.value)));
        return dump;
    }
    
    public setDump(dump: Dictionary<string, any>): boolean {
        let modified: boolean = false;

        const length: number = dump.size();
        if (length) {
            this.rows.forEach(row => row.cells.forEach(cell => {
                const key: string = cell.initialKey;
                if (dump.containsKey(key)) {
                    const value: any = dump.getValue(key)!;
                    cell.setValue(value);
                    modified = modified || cell.modified;
                }
            }));
        }
        
        return modified;
    }

    public async setDumpAsync(dump: Dictionary<string, any>): Promise<boolean> {
        const modified: boolean = this.setDump(dump);
        if (modified) {
            await this.reRenderAsync();
        }
        return modified;
    }
    
    public async reloadComponentsAsync(): Promise<void> {
        const components: IAsyncComponent[] = this.rows.selectMany(row => row.cells.where(cell => (cell.asyncContentInstance != null)).map(cell => cell.asyncContentInstance!));
        if (components) {
            await Utility.forEachAsync(components,async component => await component.reloadAsync());
        }
    }

    public reloadComponents(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reloadComponentsAsync();
    }
    
    public async reRenderInputsAsync(): Promise<void> {
        const inputs: IInput[] = this.rows.selectMany(row => row.cells.where(cell => (cell.inputContentInstance != null)).map(cell => cell.inputContentInstance!));
        if (inputs) {
            await Utility.forEachAsync(inputs,async input => await input.reRenderAsync());
        }
    }

    public reRenderInputs(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reRenderInputsAsync();
    }
    
    public async reloadAsync(keepState: boolean = false): Promise<void> {
        if ((this.instance) && (this.instance.reloadAsync)) {
            if (keepState) {
                const dump: Dictionary<string, any> = this.getDump();
                await this.instance.reloadAsync();
                await this.setDumpAsync(dump);
            } else {
                await this.instance.reloadAsync();
            }
        }
    }

    public reload(keepState: boolean = false): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reloadAsync(keepState);
    }
    
    public async clearAsync(): Promise<void> {
        if ((this.instance) && (this.instance.clearAsync)) {
            await this.instance.clearAsync();
        }
    }

    public clear(): void {
        // clear without await
        // noinspection JSIgnoredPromiseFromCall
        this.clearAsync();
    }
    
    public find(model: TItem): RowModel<TItem> | null {
        return this.rows.find(row => Comparator.isEqual(row.model, model)) || null;
    }

    public get(model: TItem): RowModel<TItem> {
        const row: RowModel<TItem> | null = this.find(model);
        
        if (row == null)
            throw Error("Row cannot be found, unknown model.");
        
        return row;
    }

    public async getAsync<TResponse>(endpoint: string): Promise<TResponse> {
        return await this.instance.getAsync(endpoint);
    }
    
    public async postAsync<TResponse>(endpoint: string, request: any | null): Promise<TResponse> {
        return await this.instance.postAsync(endpoint, request);
    }
    
    public async insertAsync(index: number, ...items: TItem[]): Promise<RowModel<TItem>[]> {
        const rows: RowModel<TItem>[] = this.rows;

        if ((index < 0) || (index > rows.length))
            throw Error(`Row index "${index}" out of range, can be in [0..${rows.length}]`);

        const newRows: RowModel<TItem>[] = items.map((item, itemIndex) => GridTransformer.toRow(this, item, index + itemIndex));

        rows.splice(index, 0, ...newRows);

        for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
            const row: RowModel<TItem> = rows[rowIndex];
            row.index = rowIndex;
            row.cells.forEach(cell => cell.clearRowSpan());
        }

        await this.instance.reRenderAsync();
        
        return newRows;
    }

    public async addAsync(model: TItem): Promise<RowModel<TItem>[]> {
        return await this.insertAsync(this.rows.length, model);
    }

    public async reRenderAsync(): Promise<void> {
        await this.instance.reRenderAsync();
    }

    public bind(): boolean {
        return this.rows.map(row => row.bind()).some(modified => modified);
    }

    public async bindAsync(forceRender: boolean = true): Promise<void> {
        const modified: boolean = this.bind();
        if ((forceRender) || (modified)) {
            await this.reRenderAsync();
        }
    }

    public delete(modelOrIndex: TItem | number): void {
        const rows: RowModel<TItem>[] = this.rows;
        
        let index: number = 0;
        
        if (typeof modelOrIndex === "number") {
            index = modelOrIndex;

            if ((index < 0) || (index >= rows.length))
                throw Error(`Row index "${index}" out of range, can be in [0..${rows.length}].`);

        } else {
            const row: RowModel<TItem> | null = this.find(modelOrIndex);

            if (row == null) {
                return;
            }

            index = row.index;
        }

        rows.removeAt(index);

        for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
            const row: RowModel<TItem> = rows[rowIndex];
            row.index = rowIndex;
            row.cells.forEach(cell => cell.clearRowSpan());
        }
    }

    public async deleteAsync(modelOrIndex: TItem | number): Promise<void> {
        this.delete(modelOrIndex);
        //await this.instance.newGenerationAsync();
        await this.instance.reRenderAsync();
    }
}

export class ColumnSettingsDefinition {
    public min?: number | Date;

    public max?: number | Date;

    public step?: number;
    
    public hideZero?: boolean;

    public infoAccessor?: string | GridAccessorCallback<any>;
    
    public infoHideZero?: boolean;

    public infoHideEqual?: boolean;

    public infoTitle?: string;
    
    public infoBold?: boolean;
    
    public infoBoldNotEqual?: boolean;

    public infoFormat?: TFormat;

    public descriptionAccessor?: string | GridDescriptionAccessorCallback<any>;
    
    public descriptionTitle?: string;
    
    public descriptionJustify?: Justify;

    public descriptionAlight?: Align;

    public required?: boolean;

    public nothingSelectedText?: string;
    
    public autoCollapse?: boolean;
    
    public groupSelected?: boolean;
    
    public multiple?: boolean;
    
    public noFilter?: boolean;
    
    public align?: DropdownAlign;
    
    public verticalAlign?: DropdownVerticalAlign;
    
    public arrows?: boolean;

    public descriptionCallback?(cell: CellModel<any>, action: CellAction<any>): Promise<void>;
    
    public fetchItems?<TDataItem>(cell: CellModel<any>): Promise<TDataItem[]>;

    public selectedTextTransform?(sender: Dropdown<any>): string;
}

export class ColumnSettings<TItem = {}> {
    public min: number | Date | null = null;

    public max: number | Date | null = null;

    public step: number | null = null;

    public hideZero: boolean = false;
    
    public infoAccessor: string | GridAccessorCallback<any> | null = null;

    public infoHideZero: boolean = false;

    public infoHideEqual: boolean = false;

    public infoTitle: string | null = null;

    public infoBold: boolean = false;
    
    public infoBoldNotEqual: boolean = false;

    public infoFormat: TFormat | null = null;

    public descriptionAccessor: string | GridDescriptionAccessorCallback<TItem> | null = null;
    
    public descriptionTitle: string | null = null;

    public descriptionJustify: Justify = Justify.Left;

    public descriptionAlight: Align = Align.Bottom;

    public descriptionCallback?(cell: CellModel<TItem>, action: CellAction<TItem>): Promise<void>;

    public required: boolean = false;
    
    public nothingSelectedText: string | null = null;
    
    public multiple: boolean = false;

    public noFilter: boolean = false;
    
    public autoCollapse: boolean = true;
    
    public groupSelected: boolean = false;
    
    public align: DropdownAlign = DropdownAlign.Right;
    
    public verticalAlign: DropdownVerticalAlign = DropdownVerticalAlign.Auto;
    
    public arrows: boolean = false;

    public fetchItems?<TDataItem>(cell: CellModel<TItem>): Promise<TDataItem[]>;

    public selectedTextTransform?(sender: Dropdown<TItem>): string;
}

export class ColumnActionDefinition {
    public name?: string;

    public title?: string;

    public icon?: IIconProps | string;

    public type?: ActionType | ColumnActionType;
    
    public right?: boolean;
    
    /*
     * If true - ignores "grid.readonly" prop when hides actions;
     */
    public alwaysAvailable?: boolean;
    
    public toggleModal?: string;

    public confirm?: string | IConfirmation | GridConfirmationDialogTitleCallback<any>;

    public callback?(cell: CellModel<any>, action: CellAction<any>): Promise<void>;

    public render?(cell: CellModel<any>, action: CellAction<any>): React.ReactNode;
}

export class ColumnAction<TItem = {}> {
    public name: string | null = null;

    public title: string | null = null;

    public icon: IIconProps | null = null;

    public type: ActionType | null = null;

    public right: boolean = false;

    public toggleModal: string | null = null;
    
    public alwaysAvailable: boolean = false;

    public confirm: string | IConfirmation | GridConfirmationDialogTitleCallback<TItem> | null = null;

    public column: ColumnModel<TItem> = new ColumnModel<TItem>();

    public callback?(cell: CellModel<TItem>, action: CellAction<TItem>): Promise<void>;

    public render?(cell: CellModel<TItem>, action: CellAction<TItem>): React.ReactNode;
}

export class CellAction<TItem = {}> {
    public action: ColumnAction<TItem> = new ColumnAction<TItem>();

    public visible: boolean = true;

    //public enabled: boolean = true;

    public instance: ICellAction = {} as ICellAction;
}

export class DescriptionCellAction<TItem = {}> extends CellAction<TItem> {
    
    public readonly: boolean | null = null;

    public justify: Justify = Justify.Left;

    public alight: Align = Align.Bottom;
    
    public isDescription: boolean = true;
}

export class ColumnDefinition {
    public name?: string;
    
    public header?: string;
    
    public title?: string;

    public accessor?: string | GridAccessorCallback<any>;

    public visible?: boolean;
    
    public group?: string;

    public textAlign?: TextAlign;

    public verticalAlign?: VerticalAlign;
    
    public type?: ColumnType;

    public editable?: boolean;
    
    public removable?: boolean;

    /**
     * Re-render row when cell value is modified, for example, if cell affects row (model) validity
     */
    public reRenderRow?: boolean;
    
    public rotate?: boolean;
    
    public format?: TFormat;
    
    public minWidth?: string | number;
    
    public maxWidth?: string | number;
    
    public noWrap?: boolean;
    
    public wordBreak?: boolean;

    public stretch?: boolean;
    
    public total?: boolean;

    public className?: string;
    
    public settings?: ColumnSettingsDefinition;

    public sorting?: boolean | SortDirection;

    public actions?: ColumnActionDefinition[];
    
    public route?: PageRoute | GridRouteCallback<any>;

    public init?(cell: CellModel<any>): void;
    
    public transform?(cell: CellModel<any>, cellValue: any, format: TFormat | null): string;

    public render?(cell: CellModel<any>): React.ReactNode;

    public callback?(cell: CellModel<any>, action: CellAction<any> | null): Promise<void>;
}

export class RowModel<TItem = {}> {

    private _initialKey: string | null = null;
    private _key: string | null = null;
    private _model: TItem = {} as TItem;
    
    private initializeKeys(): void {
        if (this._key == null) {
            this._key = (this.grid.optimization)
                ? `${this.grid.key}_row_${HashCodeUtility.getHashCode(this.model)}`
                : `${this.grid.key}_row_${this.id}`;
            if (this._initialKey == null) {
                this._initialKey = this._key;
            }
        }
    }
    
    public id: number = 0;
    
    public index: number = 0;
    
    public grid: GridModel<TItem> = new GridModel<TItem>();

    public cells: CellModel<TItem>[] = [];
    
    public className: string | null = null;
    
    public expanded: boolean = false;

    public deleted: boolean = false;
    
    public hasDetails: boolean = false;
    
    public instance: IRow = {} as IRow;
    
    public checkable: boolean = false;

    public readonly: boolean = false;
    
    public checked: boolean = false;
    
    public get model(): TItem {
        return this._model;
    }
    
    public set model(value: TItem) {
        if (this._model !== value) {
            this._model = value;
            const rowIndex: number = this.index;
            const data: TItem[] = this.grid.data;
            if (data[rowIndex] !== value) {
                data[rowIndex] = value;
            }
        }
    }

    public get initialKey(): string {
        this.initializeKeys();
        return this._initialKey!;
    }

    public get key(): string {
        this.initializeKeys();
        return this._key!;
    }
    
    public get isReadonly(): boolean {
        return this.readonly || this.grid.readonly;
    }
    
    public get isFirst(): boolean {
        return (this.index === 0);
    }

    public get isLast(): boolean {
        return (this.index === this.grid.rows.length - 1);
    }
    
    public get modified(): boolean {
        return this.cells.some(item => item.modified);
    }

    public get valid(): boolean {
        return this.cells.every(item => item.valid);
    }
    
    public get hasDeleted(): boolean {
        return (this.cells.some(item => item.deleted));
    }

    public get spannedRows(): RowModel<TItem>[] {
        return this
            .cells
            .filter(cell => (cell.spannedRow != null))
            .map(cell => cell.spannedRow!)
            .distinct(row => row.index);
    }

    public get position(): number {
        return ((this.grid.pageNumber - 1) * this.grid.pageSize) + this.index + 1;
    }

    public get detailsColStart(): number {
        const detailsColStart: number = this.grid.detailsColStart || 0;
        return (this.grid.checkable) ? detailsColStart + 1 : detailsColStart;
    }
    
    public get detailsColEnd(): number {
        if (this.grid.detailsColEnd != null) {
            const detailsColEnd = (this.grid.detailsColEnd < 0)
                ? this.grid.columns.length + this.grid.detailsColEnd
                : this.grid.detailsColEnd;
            return (this.grid.checkable) ? detailsColEnd + 1 : detailsColEnd;
        }
        for (let columnIndex: number = this.cells.length - 1; columnIndex >= 0; columnIndex--) {
            const cell: CellModel<TItem> = this.cells[columnIndex];
            if (!cell.spanned && cell.rowSpan < 1) {
                return (this.grid.checkable) ? columnIndex + 1 : columnIndex;
            }
        }
        const detailsColEnd =  (this.cells.length - 1);
        return (this.grid.checkable) ? detailsColEnd + 1 : detailsColEnd;
    }

    public get nextRow(): RowModel<TItem> {
        return (this.index < this.grid.rows.length - 1)
            ? this.grid.rows[this.index + 1]
            : this.grid.rows[0];
    }

    public get prevRow(): RowModel<TItem> {
        return (this.index > 0)
            ? this.grid.rows[this.index - 1]
            : this.grid.rows[this.grid.rows.length - 1];
    }

    public resetKey(resetInitialKey: boolean = false): void {
        this._key = null;
        if (resetInitialKey) {
            this._initialKey = null;
        }
    }

    public get(columnName: string): CellModel<TItem> {
        const cell: CellModel<TItem> | undefined =
            this.cells.find(item => item.column.name === columnName) ||
            this.cells.find(item => item.column.accessor === columnName);

        if (cell == null)
            throw Error(`Column with name or accessor '${columnName}' cannot be found in the grid.`);

        return cell;
    }
    
    public getIndex(columnName: string): number {
        let index: number = this.cells.findIndex(item => item.column.name === columnName);
        if (index === -1) {
            index = this.cells.findIndex(item => item.column.accessor === columnName);
        }
        return index;
    }

    public loop(inScope: (row: RowModel<TItem>) => boolean): ArrayScope {

        const rows: RowModel<TItem>[] = this.grid.rows;
        const rowIndex: number = this.index;
        let firstIndex: number = rowIndex;
        let lastIndex: number = rowIndex;
        const lastRowIndex: number = rows.length - 1;

        for (let index: number = rowIndex - 1; index >= 0; index--) {
            const subRow: RowModel<TItem> = rows[index];
            if (!inScope(subRow)) {
                break;
            }
            firstIndex = index;
        }

        for (let index: number = rowIndex + 1; index <= lastRowIndex; index++) {
            const subRow: RowModel<TItem> = rows[index];
            if (!inScope(subRow)) {
                break;
            }
            lastIndex = index;
        }
        
        const scope: ArrayScope = new ArrayScope();
        scope.firstIndex = firstIndex;
        scope.lastIndex = lastIndex;

        return scope;
    }
    
    public async toggleAsync(): Promise<void> {
        
        this.expanded = !this.expanded;
        
        if ((this.expanded) && (this.grid.autoToggle)) {
            const expandedRow: RowModel<TItem> | null = this.grid.rows.find(row => (row !== this) && (row.expanded)) || null;
            if (expandedRow) {
                await expandedRow.toggleAsync();
            }
        }

        await this.reRenderAsync();
        //await this.instance.updateStateAsync();
        
        await Utility.forEachAsync(this.spannedRows, async (row) => await row.reRenderAsync());
    }

    public bind(): boolean {
        return this.cells.map(cell => cell.bind()).some(modified => modified);
    }

    public async bindAsync(forceRender: boolean = true): Promise<void> {
        const modified: boolean = this.bind();
        if ((forceRender) || (modified)) {
            await this.reRenderAsync();
        }
    }
    
    public setModel(model: TItem): boolean {
        let modified: boolean = false;
        const cells: CellModel<TItem>[] = this.cells;
        const columns: ColumnModel<TItem>[] = this.grid.columns;
        const length: number = columns.length;
        for (let i: number = 0; i < length; i++) {
            const column: ColumnModel<TItem> = columns[i];
            if (column.accessor) {
                const cell: CellModel<TItem> = cells[column.index];
                const value: any = (typeof column.accessor === "string")
                    ? Utility.findValueByAccessor(model, column.accessor)
                    : column.accessor(model);
                cell.setValue(value);
                modified = modified || cell.modified;
            }
        }
        return modified;
    }

    public async setModelAsync(model: TItem, forceRender: boolean = true): Promise<boolean> {
        const modified: boolean = this.setModel(model);
        if ((forceRender) || (modified)) {
            await this.reRenderAsync();
        }
        return modified;
    }
    
    public async saveAsync(): Promise<void> {
        if (this.modified) {
            this.cells.forEach(cell => cell.save());
            await this.reRenderAsync();
        }
    }

    public async cancelAsync(): Promise<void> {
        if (this.modified) {
            await Utility.forEachAsync(this.cells, async (cell) => await cell.cancelAsync());
            await this.reRenderAsync();
        }
    }

    public async reRenderAsync(withSpannedRows: boolean = false): Promise<void> {
        if (withSpannedRows) {
            await Utility.forEachAsync(this.spannedRows, async (row) => row.reRenderAsync());
        }

        await this.instance.reRenderAsync();
    }
    
    public async setDeletedAsync(deleted: boolean): Promise<void> {
        if (this.deleted !== deleted) {
            this.deleted = deleted;
            await this.reRenderAsync();
        }
    }
}

export class CellModel<TItem = {}> {
    private _value: any = null;
    private _initialValue: any = null;
    private _valueInitialized: boolean = false;
    private _rowSpan: number = 0;
    private _spannedRow: RowModel<TItem> | null = null;
    private _descriptionAction: DescriptionCellAction<TItem> | null = null;
    private _description: string | null = null;
    
    public id: number = 0;
    
    public actions: CellAction<TItem>[] = [];
    
    public row: RowModel<TItem> = new RowModel<TItem>();
    
    public column: ColumnModel<TItem> = new ColumnModel<TItem>();

    public grid: GridModel<TItem> = new GridModel<TItem>();
    
    public className: string | null = null;

    public visible: boolean = true;
    
    public readonly: boolean = false;

    public valid: boolean = true;

    public deleted: boolean = false;
    
    public title: string = "";
    
    public route: PageRoute | null = null;
    
    public instance: ICell = {} as ICell;
    
    public asyncContentInstance: IAsyncComponent | null = null;
    
    public inputContentInstance: IInput | null = null;

    public get key(): string {
        return `${this.row.key}_cell_${this.columnIndex}`;
    }

    public get initialKey(): string {
        return `${this.row.initialKey}_cell_${this.columnIndex}`;
    }
    
    public get isFirstColumn(): boolean {
        return this.column.isFirst;
    }

    public get isLastColumn(): boolean {
        return this.column.isLast;
    }

    public get isFirstRow(): boolean {
        return this.row.isFirst;
    }

    public get isLastRow(): boolean {
        return this.row.isLast;
    }
    
    public get isSpanned(): boolean {
        return this.spanned || this.rowSpan > 1;
    }

    public get isDeleted(): boolean {
        return (this.removable) && (this.deleted || this.row.deleted);
    }

    public get isReadonly(): boolean {
        return this.readonly || this.row.isReadonly;
    }

    public get isVisible(): boolean {
        return this.visible && this.column.visible;
    }
    
    public get rowSpan(): number {
        return this._rowSpan;
    }

    public set rowSpan(value: number) {
        value = (value === 1) ? 0 : value;
        if (this._rowSpan !== value) {
            if ((!this.spanned) && (value >= 0)) {
                const spanned: boolean = (value > 0);
                const rows: RowModel<TItem>[] = this.grid.rows;
                const rowsLength: number = rows.length;
                const firstIndex: number = this.rowIndex + 1;
                const lastIndex: number = firstIndex + ((spanned) ? value : this._rowSpan) - 2;
                for (let index: number = firstIndex; index <= lastIndex && index < rowsLength; index++) {
                    const cell: CellModel<TItem> = rows[index].cells[this.columnIndex];
                    cell._spannedRow = spanned ? this.row : null;
                    if (spanned) {
                        cell.rowSpan = 0;
                    }
                }
            }
            this._rowSpan = value;
        }
    }
    
    public get descriptionAction(): DescriptionCellAction<TItem> | null {
        return this._descriptionAction || (this._descriptionAction = this.actions.find(action => action instanceof DescriptionCellAction) as DescriptionCellAction<TItem> | null);
    }
    
    public get description(): string {
        if (this._description === null) {
            const accessor: string | GridDescriptionAccessorCallback<TItem> | null = this.column.settings.descriptionAccessor;
            if (accessor) {
                this._description = (typeof accessor === "string")
                    ? Utility.findValueByAccessor(this.model, accessor)
                    : accessor(this.model);
            }
        }
        return this._description || (this._description = "");
    }
    
    public set description(value: string) {
        const accessor: string | GridDescriptionAccessorCallback<TItem> | null = this.column.settings.descriptionAccessor;
        if ((accessor) && (typeof accessor === "string")) {
            Utility.setValueByAccessor(this.model, accessor, value);
            this._description = null;
        }
    }
    
    public get descriptionReadonly(): boolean {
        return ((this.descriptionAction) && (this.descriptionAction.readonly != null))
            ? this.descriptionAction.readonly
            : this.isReadonly || this.isDeleted;
    }

    public set descriptionReadonly(value: boolean) {
        if (this.descriptionAction) {
            this.descriptionAction.readonly = value;
        }
    }
    
    public get spanned(): boolean {
        return (this._spannedRow != null);
    }
    
    public get spannedRow(): RowModel<TItem> | null {
        return this._spannedRow;
    }
    
    public get spannedRows(): RowModel<TItem>[] {
        const spannedRows: RowModel<TItem>[] = [];
        if (!this.spanned) {
            const row: RowModel<TItem> = this.row;
            const columnIndex = this.columnIndex;
            let spannedRow: RowModel<TItem> | null = row;
            while ((spannedRow != null) && ((spannedRow === row) || (spannedRow.cells[columnIndex].spannedRow === row))) {
                spannedRows.push(spannedRow);
                spannedRow = (!spannedRow.isLast) ? spannedRow.nextRow : null;
            }
        }
        return spannedRows;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        if (this.column.accessor) {
            if (this._value !== value) {
                if (typeof this.column.accessor === "string") {
                    Utility.setValueByAccessor(this.row.model, this.column.accessor, value);
                    this._value = Utility.findValueByAccessor(this.row.model, this.column.accessor);
                } else {
                    this._value = value;
                }
            }
            if (!this._valueInitialized) {
                this._initialValue = this._value;
                this._valueInitialized = true;
            }
        }
    }
    
    public get modified(): boolean {
        const modifiable: boolean = 
            (this._valueInitialized) && 
            (this.column.type != ColumnType.Icon) && 
            ((this.column.type != ColumnType.Custom) || (this.column.editable));
        if (modifiable) {
            const hideZero: boolean = this.column.settings.hideZero;
            const value: any = (hideZero) ? (this._value || 0) : this._value;
            const initialValue: any = (hideZero) ? (this._initialValue || 0) : this._initialValue;
            const isEqual: boolean = Comparator.isEqual(value, initialValue);
            if (!isEqual) {
                return true;
            }
        }
        return false;
    }

    public get rowIndex(): number {
        return this.row.index;
    }

    public get columnIndex(): number {
        return this.column.index;
    }

    public get model(): TItem {
        return this.row.model;
    }
    
    public get next(): CellModel<TItem> {
        return (this.columnIndex < this.grid.columns.length - 1)
            ? this.row.cells[this.columnIndex + 1]
            : this.row.cells[0];
    }

    public get prev(): CellModel<TItem> {
        return (this.columnIndex > 0)
            ? this.row.cells[this.columnIndex - 1]
            : this.row.cells[this.grid.columns.length - 1];
    }

    public get nextRow(): RowModel<TItem> {
        return this.row.nextRow;
    }

    public get prevRow(): RowModel<TItem> {
        return this.row.prevRow;
    }
    
    public get removable(): boolean {
        return this.column.removable;
    }

    public clearRowSpan(): void {
        this._rowSpan = 0;
        this._spannedRow = null;
    }

    public calcRowSpan(): number | null {
        let rowSpan: number = this._rowSpan;
        const columnIndex = (this.grid.checkable) ? this.columnIndex + 1 : this.columnIndex;
        if (rowSpan > 1) {
            const rows: RowModel<TItem>[] = this.grid.rows;
            const rowsLength: number = rows.length;
            const firstRowIndex: number = this.rowIndex;
            const lastRowIndex: number = firstRowIndex + rowSpan - 1;
            const detailsColStart: number = this.row.detailsColStart;
            const detailsColEnd: number = this.row.detailsColEnd;
            for (let index: number = firstRowIndex; index <= lastRowIndex && index < rowsLength; index++) {
                const row: RowModel<TItem> = rows[index];
                const rowExpanded: boolean = row.expanded && ((columnIndex < detailsColStart) || (columnIndex > detailsColEnd));
                if (rowExpanded) {
                    rowSpan++;
                }
            }
            return rowSpan;
        } else if (this.row.expanded) {
            const detailsColStart: number = this.row.detailsColStart;
            const detailsColEnd: number = this.row.detailsColEnd;
            const rowExpanded: boolean = ((columnIndex < detailsColStart) || (columnIndex > detailsColEnd));
            if (rowExpanded) {
                return 2;
            }
        }
        return null;
    }
    
    public equalRowSpan(cell: CellModel<TItem>): boolean {
        let equal: boolean = (cell.rowIndex == this.rowIndex);
        equal = equal && (cell.spanned === this.spanned) && (cell.rowSpan === this.rowSpan);
        return equal;
    }
    
    public prevRows(callback: (item: TItem) => boolean): RowModel<TItem>[] {
        const result: RowModel<TItem>[] = [];
        if (this.rowIndex > 0) {
            for (let index: number = this.rowIndex - 1; index >= 0; index--) {
                const row: RowModel<TItem> = this.grid.rows[index];
                const item: TItem = row.model;
                if (!callback(item)) {
                    break;
                }
                result.push(row);                
            }
        }
        return result;
    }

    public nextRows(callback: (item: TItem) => boolean, start: number = 1): RowModel<TItem>[] {
        const result: RowModel<TItem>[] = [];
        if (this.rowIndex <= this.grid.rows.length - 1) {
            const firstIndex: number = this.rowIndex + start;
            for (let index: number = firstIndex; index < this.grid.rows.length; index++) {
                const row: RowModel<TItem> = this.grid.rows[index];
                const item: TItem = row.model;
                if (!callback(item)) {
                    break;
                }
                result.push(row);
            }
        }
        return result;
    }

    public filterRows(callback: (item: TItem) => boolean, excludeSelf: boolean = true): RowModel<TItem>[] {
        return this.grid.rows.filter(row => ((!excludeSelf) || (row.index !== this.rowIndex)) && (callback(row.cells[this.columnIndex].model)));
    }

    public someRows(callback: (item: TItem) => boolean, excludeSelf: boolean = true, excludeDeleted = true): boolean {
        const rowIndex: number = this.rowIndex;
        const columnIndex: number = this.columnIndex;
        return this.grid.rows.some(row => ((!excludeDeleted) || (!row.deleted)) && ((!excludeSelf) || (row.index !== rowIndex)) && (callback(row.cells[columnIndex].model)));
    }

    public async forEachRowsAsync(callback: (cell: CellModel<TItem>) => Promise<void>, excludeSelf: boolean = true, excludeDeleted = true): Promise<void> {
        let items: RowModel<TItem>[] = this.grid.rows;
        items = (excludeSelf)
            ? items.filter(row => row.index !== this.rowIndex)
            : items;
        items = (excludeDeleted)
            ? items.filter(row => !row.deleted)
            : items;
        await Utility.forEachAsync(items, row => callback(row.cells[this.columnIndex]));
    }

    public save(): void {
        if (this.modified) {
            this._initialValue = this.value;
            this.row.resetKey(true);
        }
    }

    public async saveAsync(): Promise<void> {
        if (this.modified) {
            this._initialValue = this.value;
            this.row.resetKey(true);
            if (this.column.callback) {
                await this.column.callback(this, null);
            }
            await this.reRenderAsync();
        }
    }

    public async cancel(): Promise<void> {
        if (this.modified) {
            this.value = this._initialValue;
            this.row.resetKey();
        }
    }

    public async cancelAsync(): Promise<void> {
        if (this.modified) {
            this.value = this._initialValue;
            this.row.resetKey();
            if (this.column.callback) {
                await this.column.callback(this, null);
            }
            await this.reRenderAsync();
        }
    }
    
    public setValue(value: any): boolean {
        if (this.column.accessor) {
            if (this.value !== value) {
                const modified: boolean = this.modified;
                this.value = value;
                this.row.resetKey();
                return (this.modified !== modified);
            }
        }
        
        return false;
    }

    public async setValueAsync(value: any): Promise<boolean> {
        const modified: boolean = this.setValue(value);
        if (modified) {
            await this.row.reRenderAsync();
        } else {
            await this.reRenderAsync();
        }
        return modified;
    }
    
    public bind(): boolean {
        if (this.column.accessor) {
            const value: any = (typeof this.column.accessor === "string")
                ? Utility.findValueByAccessor(this.model, this.column.accessor)
                : this.column.accessor(this.model);
            this.setValue(value);
            if (this.modified) {
                this.save();
                return true;
            }
        }
        return false;
    }

    public async bindAsync(forceRender: boolean = true): Promise<void> {
        const modified: boolean = this.bind();
        if ((forceRender) || (modified)) {
            await this.reRenderAsync();
        }
    }

    public async setValidAsync(valid: boolean): Promise<void> {
        if (this.valid !== valid) {
            const rowValid: boolean = this.row.valid;
            this.valid = valid;
            const rowValidModified: boolean = (rowValid !== this.row.valid);
            if (rowValidModified) {
                await this.row.reRenderAsync();
            } else {
                await this.reRenderAsync();
            }
        }
    }

    public async setDeletedAsync(deleted: boolean): Promise<void> {
        if ((this.removable) && (this.deleted !== deleted)) {
            this.deleted = deleted;
            await this.reRenderAsync();
        }
    }

    public setRowDeleted(deleted: boolean): void {
        this.row.cells.forEach( (cell) => {
            if ((cell != this) && ((!cell.isSpanned))) {
                cell.deleted = deleted;
            }
        });
    }

    public async setRowDeletedAsync(deleted: boolean): Promise<void> {
        await Utility.forEachAsync(this.row.cells,async (cell) => {
            if ((cell != this) && ((!cell.isSpanned))) {
                await cell.setDeletedAsync(deleted);
            }
        });
        await this.reRenderAsync();
    }

    public async editAsync(select: boolean = false): Promise<void> {
        if ((this.column.editable) && (!this.isReadonly) && (this.inputContentInstance)) {
            await this.inputContentInstance.showEditAsync(select);
        }
    }
    
    public async reRenderAsync(): Promise<void> {
        if (this.isVisible) {
            await this.instance.reRenderAsync();
        }
    }
    
    public reRender(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reRenderAsync();
    }
    
    public async reloadAsync(): Promise<void> {
        if (this.asyncContentInstance) {            
            await this.asyncContentInstance.reloadAsync();
        }
    }
}

export class GridTransformer {

    public static toGrid<TItem = {}>(from: IGridDefinition, id: string): GridModel<TItem> {
        const to = new GridModel<TItem>();
        to.id = id;
        to.className = from.className || null;
        to.headerMinHeight = from.headerMinHeight || null;
        to.noDataNoHeader = from.noDataNoHeader || false;
        to.minWidth = from.minWidth || null;
        to.cellPadding = from.cellPadding || CellPaddingType.Large;
        to.noDataText = from.noDataText || null;
        to.detailsColStart = from.detailsColStart || null;
        to.detailsColEnd = from.detailsColEnd || null;
        to.hovering = from.hovering || GridHoveringType.Row;
        to.odd = from.odd || GridOddType.Row;
        to.pagination = from.pagination || false;
        to.checkable = from.checkable || false;
        to.readonly = from.readonly || false;
        to.borderType = from.borderType || BorderType.DarkSeparators;
        to.optimization = (from.optimization !== false);
        to.autoToggle = from.autoToggle || false;
        to.onCheck = from.onCheck;
        to.renderDetails = from.renderDetails;
        to.columns = (from.columns || []).map((item, index) => this.toColumn(to, item, index));
        to.rows = [];
        to.pageNumber = 1;
        to.totalItemCount = 0;
        to.pageSize = (from.pagination)
            ? (typeof from.pagination === "number")
                ? from.pagination
                : DEFAULT_PAGE_SIZE
            : MAX_PAGE_SIZE;
        to.sortColumn = to.columns.find(item => (item.sorting != null) && (item.sorting != false)) || null;
        to.sortDirection = (to.sortColumn != null)
            ? (to.sortColumn.sorting == SortDirection.Desc)
                ? SortDirection.Desc
                : SortDirection.Asc
            : null;
        return to;
    }

    public static toColumn<TItem = {}>(grid: GridModel<TItem>, from: ColumnDefinition, columnIndex: number): ColumnModel<TItem> {
        const to = new ColumnModel<TItem>();
        to.name = from.name || null;
        to.title = from.title || "";
        to.index = columnIndex;
        to.accessor = from.accessor || null;
        to.grid = grid;
        to.group = from.group || null;
        to.textAlign = from.textAlign || null;
        to.verticalAlign = from.verticalAlign || null;
        to.type = from.type || ColumnType.Custom;
        to.editable = from.editable || false;
        to.removable = (from.removable != null) ? from.removable : true;
        to.reRenderRow = from.reRenderRow || false;
        to.rotate = from.rotate || false;
        to.format = from.format || null;
        to.minWidth = from.minWidth || null;
        to.maxWidth = from.maxWidth || null;
        to.noWrap = from.noWrap || false;
        to.wordBreak = from.wordBreak || false;
        to.stretch = from.stretch || false;
        to.total = from.total || false;
        to.route = from.route || null;
        to.className = from.className || null;
        to.header = from.header || "";
        to.visible = from.visible !== false;
        to.init = from.init;
        to.transform = from.transform;
        to.render = from.render;
        to.callback = from.callback;
        to.sorting = from.sorting || null;
        to.settings = this.toSettings(from.settings || new ColumnSettingsDefinition());
        to.actions = (from.actions || []).map((action) => this.toAction<TItem>(to, action));
        return to;
    }
    
    public static toRows<TItem = {}>(grid: GridModel<TItem>, items: TItem[]): RowModel<TItem>[] {
        return items.map((item, rowIndex) => this.toRow(grid, item, rowIndex));
    }

    public static toRow<TItem = {}>(grid: GridModel<TItem>, model: TItem, rowIndex: number): RowModel<TItem> {
        const to = new RowModel<TItem>();
        to.id = ch.getId();
        to.grid = grid;
        to.index = rowIndex;
        to.model = model;
        to.checkable = grid.checkable;
        to.cells = grid.columns.map((column) => this.toCell<TItem>(grid, to, column));
        return to;
    }
    
    public static toCell<TItem = {}>(grid: GridModel<TItem>, row: RowModel<TItem>, column: ColumnModel<TItem>): CellModel<TItem> {
        const to = new CellModel<TItem>();
        to.id = ch.getId();
        to.grid = grid;
        to.row = row;
        to.column = column;
        to.actions = column.actions.map((columnAction) => this.toCellAction<TItem>(columnAction));
        if (column.settings.descriptionAccessor) {
            to.actions.push(this.toDescriptionCellAction(column));
        }
        to.title = column.title;
        return to;
    }

    public static toSettings<TItem = {}>(from: ColumnSettingsDefinition): ColumnSettings<TItem> {
        const to = new ColumnSettings<TItem>();
        to.min = from.min || null;
        to.max = from.max || null;
        to.step = from.step || null;
        to.hideZero = from.hideZero || false;
        to.infoHideZero = from.infoHideZero || false;
        to.infoHideEqual = from.infoHideEqual || false;
        to.infoAccessor = from.infoAccessor || null;
        to.infoTitle = from.infoTitle || null;
        to.infoBold = from.infoBold || false;
        to.infoBoldNotEqual = from.infoBoldNotEqual || false;
        to.infoFormat = from.infoFormat || null;
        to.descriptionAccessor = from.descriptionAccessor || null;
        to.descriptionJustify = from.descriptionJustify || Justify.Left;
        to.descriptionAlight = from.descriptionAlight || Align.Bottom;
        to.descriptionCallback = from.descriptionCallback;
        to.required = from.required || false;
        to.nothingSelectedText = from.nothingSelectedText || null;
        to.autoCollapse = from.autoCollapse || true;
        to.groupSelected = from.groupSelected || false;
        to.multiple = from.multiple || false;
        to.noFilter = from.noFilter || false;
        to.align = from.align || DropdownAlign.Right;
        to.verticalAlign = from.verticalAlign || DropdownVerticalAlign.Auto;
        to.arrows = from.arrows || false;
        to.fetchItems = from.fetchItems;
        to.selectedTextTransform = from.selectedTextTransform;
        return to;
    }

    public static toAction<TItem = {}>(column: ColumnModel<TItem>, from: ColumnActionDefinition): ColumnAction<TItem> {

        const to = new ColumnAction<TItem>();
        to.column = column;
        to.title = from.title || null;
        to.toggleModal = from.toggleModal || null;
        to.confirm = from.confirm || null;
        to.callback = from.callback;
        to.render = from.render;
        to.right = from.right || false;

        to.alwaysAvailable = from.alwaysAvailable || false;
        to.name = from.name || null;
        to.icon = this.toIcon(from.icon);
        
        if (from.type != null) {
            switch (from.type) {
                case ColumnActionType.Details:
                    to.alwaysAvailable = (from.alwaysAvailable !== false);
                    to.name = from.name || "details";
                    to.type = ActionType.Secondary;
                    to.icon = this.toIcon(from.icon || "far info-square");
                    break;
                    
                case ColumnActionType.Download:
                    to.alwaysAvailable = (from.alwaysAvailable !== false);
                    to.name = from.name || "download";
                    to.type = ActionType.Create;
                    to.icon = this.toIcon(from.icon || "far download");
                    break;
                    
                case ColumnActionType.Preview:
                    to.alwaysAvailable = (from.alwaysAvailable !== false);
                    to.name = from.name || "preview";
                    to.type = ActionType.Blue;
                    to.icon = this.toIcon(from.icon || "far search");
                    break;
                    
                default:
                    to.type = from.type || null;
            }
        }
        
        return to;
    }

    public static toCellAction<TItem = {}>(columnAction: ColumnAction<TItem>): CellAction<TItem> {
        const to = new CellAction<TItem>();
        to.action = columnAction;
        return to;
    }

    public static toDescriptionCellAction<TItem = {}>(column: ColumnModel<TItem>): DescriptionCellAction<TItem> {
        const to = new DescriptionCellAction<TItem>();
        to.action.name = "description";
        to.action.type = ActionType.Grey;
        to.action.title = column.settings.descriptionTitle;
        to.action.callback = column.settings.descriptionCallback;
        to.justify = column.settings.descriptionJustify;
        to.alight = column.settings.descriptionAlight;
        return to;
    }

    public static toIcon(icon: IIconProps | null | undefined | string): IIconProps | null {
        if (icon != null) {
            if (typeof icon === "string") {
                return {
                    name: icon as string,
                }
            }
            return icon as IIconProps;
        }
        return null;
    }
}