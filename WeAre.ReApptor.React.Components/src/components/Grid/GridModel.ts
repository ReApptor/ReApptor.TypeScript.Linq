import React from "react";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import {HashCodeUtility, IPagedList, SortDirection, TFormat, Utility} from "@weare/reapptor-toolkit";
import {Align, ch, IAsyncComponent, IBaseComponent, IConfirmation, Justify, PageRoute, TextAlign, VerticalAlign, ArrayScope, ActionType, RenderCallback} from "@weare/reapptor-react-common";
import Icon, {IIconProps} from "../Icon/Icon";
import Comparator from "../../helpers/Comparator";
import Dropdown, {DropdownAlign, DropdownRequiredType, DropdownVerticalAlign} from "../Dropdown/Dropdown";
import {IInput} from "../BaseInput/BaseInput";

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

export enum GridSelectableType {
    Single,

    Multiple
}

export enum CellPaddingType {
    Large,

    Medium,

    Small
}

export enum BorderType {
    DarkSeparators,
    
    NoSeparators,
}

export interface ITag {
    tag: object | null;
}

export interface IGridDefinition {
    id?: string;

    className?: string;

    columns: ColumnDefinition[];

    /**
     * The class name for inner responsive collapsible columns (it applies only if responsive is enable and there are collapsed columns)
     */
    responsiveRowClassName?: string;

    headerMinHeight?: number;

    noDataNoHeader?: boolean;

    /**
     * Hides header (thead)
     */
    noHeader?: boolean;

    /**
     * @description keep table header in view while scrolling. remember to set a minHeight or height to see the effect.
     * @default false
     */
    stickyHeader?: boolean;

    minWidth?: string | number;

    cellPadding?: CellPaddingType;

    noDataText?: string;

    detailsColStart?: number;

    detailsColEnd?: number;

    autoToggle?: boolean;

    hovering?: GridHoveringType;

    odd?: GridOddType;

    responsive?: boolean;

    pagination?: boolean | number;

    checkable?: boolean;

    selectable?: boolean | GridSelectableType;

    readonly?: boolean;

    borderType?: BorderType;

    optimization?: boolean;

    initRow?(row: RowModel<any>): void;

    renderDetails?(row: RowModel<any>): React.ReactNode;

    onCheck?(sender: GridModel<any>): Promise<void>;

    onSelect?(sender: GridModel<any>, row: RowModel<any>): Promise<void>;
}

export interface IGrid extends IAsyncComponent {
    clearAsync(): Promise<void>;
}

export interface ICell extends IBaseComponent {
}

export interface IHeaderCell extends ICell {
    outerWidth(includeMargin?: boolean): number;
}

export interface IRow extends IBaseComponent {
}

export interface ITotalRow extends IBaseComponent {
}

export interface ICellAction extends IBaseComponent {
}

export class ColumnModel<TItem = {}> implements ITag {

    private _lastOuterWidth: number = 0;

    public name: string | null = null;

    public index: number = 0;

    public header: string = "";

    public title: string = "";

    public accessor: string | GridAccessorCallback<TItem> | null = null;

    public visible: boolean = true;

    public responsivePriority: number | boolean = 0;

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

    public maxHeight: string | number | null = null;

    public noWrap: boolean = false;

    public wordBreak: boolean = false;

    public stretch: boolean = false;

    public total: boolean = false;

    public route: PageRoute | GridRouteCallback<TItem> | null = null;

    public className: string | null = null;

    public settings: ColumnSettings<TItem> = new ColumnSettings<TItem>();

    public sorting: boolean | SortDirection | null = null;

    public isDefaultSorting: boolean = false;

    public actions: ColumnAction<TItem>[] = [];

    public headerCellInstance: IHeaderCell = {} as IHeaderCell;

    public collapsed: boolean = false;
    
    public tag: object | null = null;

    public init?(cell: CellModel<any>): void;

    public transform?(cell: CellModel<TItem>, cellValue: any, format: TFormat | null): string;

    public render?(cell: CellModel<TItem>): React.ReactNode;

    public callback?(cell: CellModel<TItem>, action: CellAction<TItem> | null): Promise<void>;

    public grid: GridModel<TItem> = new GridModel<TItem>();

    public outerWidth(visible: boolean = true): number {
        return ((this.isVisible) && (this.headerCellInstance.outerWidth))
            ? (this._lastOuterWidth = this.headerCellInstance.outerWidth())
            : (visible)
                ? 0
                : this._lastOuterWidth;
    }

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

    public get isVisible(): boolean {
        return (this.visible) && (!this.collapsed);
    }

    public get nextColumn(): ColumnModel<TItem> {
        return (this.index < this.grid.columns.length - 1)
            ? this.grid.columns[this.index + 1]
            : this.grid.columns[0];
    }

    public get prevColumn(): ColumnModel<TItem> {
        return (this.index > 0)
            ? this.grid.columns[this.index - 1]
            : this.grid.columns[this.grid.columns.length - 1];
    }
}

export class GridModel<TItem = {}> implements ITag {
    public id: string = "";

    public className: string | null = null;

    public responsiveRowClassName: string | null = null;

    public rows: RowModel<TItem>[] = [];

    public columns: ColumnModel<TItem>[] = [];

    public headerMinHeight: number | null = null;

    public noDataNoHeader: boolean = false;

    public noHeader: boolean = false;

    public stickyHeader: boolean = false;

    public minWidth: string | number | null = null;

    public cellPadding: CellPaddingType = CellPaddingType.Large;

    public noDataText: string | null = null;

    public detailsColStart: number | null = null;

    public detailsColEnd: number | null = null;

    public autoToggle: boolean = false;

    public hovering: GridHoveringType = GridHoveringType.Row;

    public odd: GridOddType = GridOddType.Row;

    public responsive: boolean = false;

    public pagination: boolean | number = false;

    public checkable: boolean = false;

    public selectableType: GridSelectableType | null = null;

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
    
    public tag: object | null = null;

    public onCheck?(sender: GridModel<any>): Promise<void>;

    public onSelect?(sender: GridModel<any>, row: RowModel<any>): Promise<void>;

    public renderDetails?(row: RowModel<TItem>): React.ReactNode;

    public get key(): string {
        return `grid_${this.id}`;
    }

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

    public get selectedRows(): RowModel<TItem>[] {
        return (this.selectable)
            ? this.rows.filter(row => row.selected)
            : [];
    }

    public get selectedRow(): RowModel<TItem> | null {
        const selectedRows: RowModel<TItem>[] = this.selectedRows;
        return (selectedRows.length > 0) ? selectedRows[0] : null;
    }

    public get items(): TItem[] {
        return this.rows.map(row => row.model);
    }

    public get checkedItems(): TItem[] {
        return this.checkedRows.map(row => row.model);
    }

    public get selectedItems(): TItem[] {
        return this.selectedRows.map(row => row.model);
    }

    public get selectedItem(): TItem | null {
        const selectedItems: TItem[] = this.selectedItems;
        return (selectedItems.length > 0) ? selectedItems[0] : null;
    }

    public get firstRow(): RowModel<TItem> {
        return this.rows[0];
    }

    public get lastRow(): RowModel<TItem> {
        return this.rows[this.rows.length - 1];
    }

    public get mobile(): boolean {
        return (this.responsive) && (ch.mobile);
    }

    public get desktop(): boolean {
        return (!this.mobile);
    }

    public get selectable(): boolean {
        return (this.selectableType != null);
    }

    public fullWidth(visible: boolean = true): number {
        return this.columns.sum(column => column.outerWidth(visible));
    }

    public collapsedWidth(): number {
        return this
            .columns
            .where(column => column.collapsed)
            .sum(column => column.outerWidth(false));
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
            await Utility.forEachAsync(components, async component => await component.reloadAsync());
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
            await Utility.forEachAsync(inputs, async input => await input.reRenderAsync());
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

    public find(model: TItem, equals?: (x: TItem, y: TItem) => boolean): RowModel<TItem> | null {
        equals = equals ?? Comparator.isEqual;
        return this.rows.find(row => equals!(row.model, model)) || null;
    }

    public get(model: TItem, equals?: (x: TItem, y: TItem) => boolean): RowModel<TItem> {
        const row: RowModel<TItem> | null = this.find(model, equals);

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

    public async saveAsync(): Promise<void> {
        this.rows.forEach(row => row.saveAsync());
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

    public maxLength?: number;

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

    /**
     * Custom icon for the description. If no value is specified default icon will be used
     * See {@link Description}
     */
    public descriptionIcon?: string;

    /**
     * Max length for the description text. If no value is specified defaults to 250
     * See {@link Description}
     */
    public descriptionMaxLength?: number;

    public descriptionAlight?: Align;

    public required?: boolean;

    public requiredType?: DropdownRequiredType;

    public addButton?: boolean | string | RenderCallback;

    public nothingSelectedText?: string;

    public autoCollapse?: boolean;

    public groupSelected?: boolean;

    public multiple?: boolean;

    public noFilter?: boolean;

    public align?: DropdownAlign;

    public verticalAlign?: DropdownVerticalAlign;

    public arrows?: boolean;

    public locationPicker?: boolean;

    public descriptionCallback?(cell: CellModel<any>, action: CellAction<any>): Promise<void>;

    public addCallback?(cell: CellModel<any>): Promise<void>;

    public fetchItems?<TDataItem>(cell: CellModel<any>): Promise<TDataItem[]>;

    public selectedTextTransform?(sender: Dropdown<any>): string;

    public infoTransform?(cell: CellModel<any>, cellValue: any, format: TFormat | null): string;
}

export class ColumnSettings<TItem = {}> {
    public min: number | Date | null = null;

    public max: number | Date | null = null;

    public step: number | null = null;

    public maxLength: number | null = null;

    public hideZero: boolean = false;

    /**
     * Show additional info line below main text.
     */
    public infoAccessor: string | GridAccessorCallback<any> | null = null;

    /**
     * If number is used for infoAccessor: Option to hide value if 0
     */
    public infoHideZero: boolean = false;

    /**
     * If infoAccessor value equals to main text: Option to hide if equal
     */
    public infoHideEqual: boolean = false;

    /**
     * Title for infoAccessor.
     */
    public infoTitle: string | null = null;

    /**
     * Show infoAccessor value with bold style
     */
    public infoBold: boolean = false;

    /**
     * Show infoAccessor value with bold style if it doesn't match to main text
     */
    public infoBoldNotEqual: boolean = false;

    public infoFormat: TFormat | null = null;

    public descriptionAccessor: string | GridDescriptionAccessorCallback<TItem> | null = null;

    public descriptionTitle: string | null = null;

    public descriptionMaxLength: number | null = null;

    public descriptionJustify: Justify = Justify.Left;
    
    public descriptionIcon: string | null = null;

    public descriptionAlight: Align = Align.Bottom;

    public descriptionCallback?(cell: CellModel<TItem>, action: CellAction<TItem>): Promise<void>;

    public addCallback?(cell: CellModel<TItem>): Promise<void>;

    public required: boolean = false;

    public requiredType: DropdownRequiredType = DropdownRequiredType.Manual;

    public addButton: boolean | string | RenderCallback = false;

    public nothingSelectedText: string | null = null;

    public multiple: boolean = false;

    public noFilter: boolean = false;

    public autoCollapse: boolean = true;

    public groupSelected: boolean = false;

    public align: DropdownAlign = DropdownAlign.Right;

    public verticalAlign: DropdownVerticalAlign = DropdownVerticalAlign.Auto;

    public arrows: boolean = false;

    public locationPicker: boolean = false;

    public fetchItems?<TDataItem>(cell: CellModel<TItem>): Promise<TDataItem[]>;

    public selectedTextTransform?(sender: Dropdown<TItem>): string;

    /**
     * Transform function for infoAccessor property
     * @param cell
     * @param cellValue
     * @param format
     */
    public infoTransform?(cell: CellModel<any>, cellValue: any, format: TFormat | null): string;

}

export class ColumnActionDefinition {
    public name?: string;

    public title?: string;

    public className?: string

    public icon?: IIconProps | string;

    public type?: ActionType | ColumnActionType;

    public right?: boolean;

    /*
     * If true - ignores "grid.readonly" prop when hides actions;
     */
    public alwaysAvailable?: boolean;

    public toggleModal?: string;

    /**
     *  If specific action button/icon will show additional actions when clicked.
     *  Selected action is available in callback function
     */
    public actions?: string[];

    public confirm?: string | IConfirmation | GridConfirmationDialogTitleCallback<any>;

    public callback?(cell: CellModel<any>, action: CellAction<any>, selectedAction?: string): Promise<void>;

    public render?(cell: CellModel<any>, action: CellAction<any>): React.ReactNode;
}

export class ColumnAction<TItem = {}> {
    public name: string | null = null;

    public title: string | null = null;

    public className: string | null = null;

    public icon: IIconProps | null = null;

    public type: ActionType | null = null;

    public right: boolean = false;

    public toggleModal: string | null = null;

    public alwaysAvailable: boolean = false;

    public actions?: string[] | null = null;

    public confirm: string | IConfirmation | GridConfirmationDialogTitleCallback<TItem> | null = null;

    public column: ColumnModel<TItem> = new ColumnModel<TItem>();

    public callback?(cell: CellModel<TItem>, action: CellAction<TItem>, selectedAction?: string): Promise<void>;

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

    public maxLength: number | null = null;

    public isDescription: boolean = true;
}

export class ColumnDefinition {

    /**
     * @default null
     */
    public name?: string;

    /**
     * @default ""
     */
    public header?: string;

    /**
     * @default ""
     */
    public title?: string;

    /**
     * @default null
     */
    public accessor?: string | GridAccessorCallback<any>;

    /**
     * @default true
     */
    public visible?: boolean;

    /**
     * @default 0
     */
    public responsivePriority?: number | boolean = 0;

    /**
     * @default null
     */
    public group?: string;

    /**
     * @default null
     */
    public textAlign?: TextAlign;

    /**
     * @default null
     */
    public verticalAlign?: VerticalAlign;

    /**
     * @default {@link ColumnType.Custom}
     */
    public type?: ColumnType;

    /**
     * @default false
     */
    public editable?: boolean;

    /**
     * @default ???
     */
    public removable?: boolean;

    /**
     * Re-render row when cell value is modified, for example, if cell affects row (model) validity.
     * @default false
     */
    public reRenderRow?: boolean;

    /**
     * @default false
     */
    public rotate?: boolean;

    /**
     * See {@link Utility.format}.
     * @default null
     */
    public format?: TFormat;

    /**
     * @default null
     */
    public minWidth?: string | number;

    /**
     * @default null
     */
    public maxWidth?: string | number;

    /**
     * @default null
     */
    public maxHeight?: string | number;

    /**
     * @default false
     */
    public noWrap?: boolean;

    /**
     * @default false
     */
    public wordBreak?: boolean;

    /**
     * @default false
     */
    public stretch?: boolean;

    /**
     * @default false
     */
    public total?: boolean;

    /**
     * @default null
     */
    public className?: string;

    /**
     * @default ???
     */
    public settings?: ColumnSettingsDefinition;

    /**
     * @default null
     */
    public sorting?: boolean | SortDirection;

    /**
     * If {@link sorting} is set for multiple columns the {@link isDefaultSorting} can be used to override default sort column.
     * By default grid orders by first column that has {@link sorting} true.
     * @default false
     */
    public isDefaultSorting?: boolean;

    /**
     * @default []
     */
    public actions?: ColumnActionDefinition[];

    /**
     * @default null
     */
    public route?: PageRoute | GridRouteCallback<any>;

    /**
     * @default undefined
     */
    public init?(cell: CellModel<any>): void;

    /**
     * @default undefined
     */
    public transform?(cell: CellModel<any>, cellValue: any, format: TFormat | null): string;

    /**
     * @default undefined
     */
    public render?(cell: CellModel<any>): React.ReactNode;

    /**
     * @default undefined
     */
    public callback?(cell: CellModel<any>, action: CellAction<any> | null): Promise<void>;
}

export class RowModel<TItem = {}> implements ITag {

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

    public selectable: boolean = false;

    public readonly: boolean = false;

    public checked: boolean = false;

    public selected: boolean = false;

    public responsiveContainerExpanded: boolean = false;

    public tag: object | null = null;

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
        const detailsColEnd = (this.cells.length - 1);
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
            this.cells.find(item => item.accessor === columnName);

        if (cell == null)
            throw Error(`Column with name or accessor '${columnName}' cannot be found in the grid.`);

        return cell;
    }

    public getIndex(columnName: string): number {
        let index: number = this.cells.findIndex(item => item.column.name === columnName);
        if (index === -1) {
            index = this.cells.findIndex(item => item.accessor === columnName);
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
            const cell: CellModel<TItem> = cells[column.index];
            if (cell.accessor) {
                const value: any = (typeof cell.accessor === "string")
                    ? Utility.findValueByAccessor(model, cell.accessor)
                    : cell.accessor(model);
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

export class CellModel<TItem = {}> implements ITag {
    private _value: any = null;
    private _initialValue: any = null;
    private _valueInitialized: boolean = false;
    private _rowSpan: number = 0;
    private _columnSpan: number = 0;
    private _spannedRow: RowModel<TItem> | null = null;
    private _spannedColumn: ColumnModel<TItem> | null = null;
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

    public type: ColumnType = ColumnType.Custom;

    public editable: boolean = false;

    public accessor: string | GridAccessorCallback<TItem> | null = null;

    public route: PageRoute | null = null;

    public instance: ICell = {} as ICell;

    public asyncContentInstance: IAsyncComponent | null = null;

    public inputContentInstance: IInput | null = null;

    public tag: object | null = null;

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
        return this.visible && this.column.isVisible;
    }

    public get isSelectable(): boolean {
        return (this.isVisible) && (!this.isDeleted) && ((this.isReadonly) || (this.type == ColumnType.Custom) || (this.type == ColumnType.Icon)) && (this.actions.length == 0);
    }

    /**
     * The cell input is in the editable mode (input is visible).
     */
    public get edit(): boolean {
        return (this.inputContentInstance != null) && (this.inputContentInstance.edit);
    }

    public get rowSpan(): number {
        return this._rowSpan;
    }

    public get columnSpan(): number {
        return this._columnSpan;
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
                const columnIndex: number = this.columnIndex;
                for (let index: number = firstIndex; index <= lastIndex && index < rowsLength; index++) {
                    const cell: CellModel<TItem> = rows[index].cells[columnIndex];
                    cell._spannedRow = spanned ? this.row : null;
                    if (spanned) {
                        cell.rowSpan = 0;
                    }
                }
            }
            this._rowSpan = value;
        }
    }

    public set columnSpan(value: number) {
        value = (value === 1) ? 0 : value;
        if (this._columnSpan !== value) {
            if ((!this.spanned) && (value >= 0)) {
                const spanned: boolean = (value > 0);
                const columns: ColumnModel<TItem>[] = this.grid.columns;
                const columnsLength: number = columns.length;
                const firstIndex: number = this.columnIndex + 1;
                const lastIndex: number = firstIndex + ((spanned) ? value : this._columnSpan) - 2;
                //const rowIndex: number = this.rowIndex;
                const row: RowModel<TItem> = this.row;
                for (let index: number = firstIndex; index <= lastIndex && index < columnsLength; index++) {
                    //const cell: CellModel<TItem> = columns[index].cells[rowIndex];
                    const cell: CellModel<TItem> = row.cells[index];
                    cell._spannedColumn = spanned ? this.column : null;
                    if (spanned) {
                        cell.columnSpan = 0;
                    }
                }
            }
            this._columnSpan = value;
        }
    }

    public get descriptionAction(): DescriptionCellAction<TItem> | null {
        return this._descriptionAction || (this._descriptionAction = this.actions.find(action => action instanceof DescriptionCellAction) as DescriptionCellAction<TItem> | null);
    }

    public get descriptionIcon(): string | null {
        return this.column.settings.descriptionIcon;
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
        return (this._spannedRow != null) || (this._spannedColumn != null);
    }

    public get spannedRow(): RowModel<TItem> | null {
        return this._spannedRow;
    }

    public get spannedColumn(): ColumnModel<TItem> | null {
        return this._spannedColumn;
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

    public get spannedColumns(): ColumnModel<TItem>[] {
        const spannedColumns: ColumnModel<TItem>[] = [];
        if (!this.spanned) {
            const column: ColumnModel<TItem> = this.column;
            const rowIndex = this.rowIndex;
            let spannedColumn: ColumnModel<TItem> | null = column;
            while ((spannedColumn != null) && ((spannedColumn === column) || (spannedColumn.cells[rowIndex].spannedColumn === column))) {
                spannedColumns.push(spannedColumn);
                spannedColumn = (!spannedColumn.isLast) ? spannedColumn.nextColumn : null;
            }
        }
        return spannedColumns;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        if (this.accessor) {
            if (this._value !== value) {
                if (typeof this.accessor === "string") {
                    Utility.setValueByAccessor(this.row.model, this.accessor, value);
                    this._value = Utility.findValueByAccessor(this.row.model, this.accessor);
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

    public get modifiable(): boolean {
        return (this._valueInitialized) && (this.type != ColumnType.Icon) && ((this.type != ColumnType.Custom) || (this.editable));
    }

    public get modified(): boolean {
        if (this.modifiable) {
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
        if (this.accessor) {
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
        if (this.accessor) {
            const value: any = (typeof this.accessor === "string")
                ? Utility.findValueByAccessor(this.model, this.accessor)
                : this.accessor(this.model);
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
        this.row.cells.forEach((cell) => {
            if ((cell != this) && ((!cell.isSpanned))) {
                cell.deleted = deleted;
            }
        });
    }

    public async setRowDeletedAsync(deleted: boolean): Promise<void> {
        await Utility.forEachAsync(this.row.cells, async (cell) => {
            if ((cell != this) && ((!cell.isSpanned))) {
                await cell.setDeletedAsync(deleted);
            }
        });
        await this.reRenderAsync();
    }

    public async editAsync(select: boolean = false): Promise<void> {
        if ((this.editable) && (!this.isReadonly) && (this.inputContentInstance)) {
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
        to.responsiveRowClassName = from.responsiveRowClassName || null;
        to.headerMinHeight = from.headerMinHeight || null;
        to.noDataNoHeader = from.noDataNoHeader || false;
        to.noHeader = from.noHeader || false;
        to.stickyHeader = from.stickyHeader || false;
        to.minWidth = from.minWidth || null;
        to.cellPadding = from.cellPadding || CellPaddingType.Large;
        to.noDataText = from.noDataText || null;
        to.detailsColStart = from.detailsColStart || null;
        to.detailsColEnd = from.detailsColEnd || null;
        to.hovering = from.hovering || GridHoveringType.Row;
        to.odd = from.odd || GridOddType.Row;
        to.responsive = from.responsive || false;
        to.pagination = from.pagination || false;
        to.checkable = from.checkable || false;
        to.selectableType = ((from.selectable == null) || (from.selectable === false))
            ? null
            : (from.selectable === true)
                ? GridSelectableType.Single
                : from.selectable;
        to.readonly = from.readonly || false;
        to.borderType = from.borderType || BorderType.DarkSeparators;
        to.optimization = (from.optimization !== false);
        to.autoToggle = from.autoToggle || false;
        to.onCheck = from.onCheck;
        to.onSelect = from.onSelect;
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
        to.sortColumn = to.columns.find(item =>
            ((item.sorting != null) && (item.sorting != false) && (item.isDefaultSorting))) ||
            (to.columns.find(item => (item.sorting != null) && (item.sorting != false)) || null);
        to.sortDirection = (to.sortColumn != null)
            ? (to.sortColumn.sorting === SortDirection.Desc)
                ? SortDirection.Desc
                : SortDirection.Asc
            : null;
        //add check for multiple isSortColumn
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
        to.removable = (from.removable != false);
        to.reRenderRow = from.reRenderRow || false;
        to.rotate = from.rotate || false;
        to.format = from.format || null;
        to.minWidth = from.minWidth || null;
        to.maxWidth = from.maxWidth || null;
        to.maxHeight = from.maxHeight || null;
        to.noWrap = from.noWrap || false;
        to.wordBreak = from.wordBreak || false;
        to.stretch = from.stretch || false;
        to.total = from.total || false;
        to.route = from.route || null;
        to.className = from.className || null;
        to.header = from.header || "";
        to.visible = (from.visible !== false);
        to.responsivePriority = from.responsivePriority || 0;
        to.init = from.init;
        to.transform = from.transform;
        to.render = from.render;
        to.callback = from.callback;
        to.sorting = from.sorting || null;
        to.isDefaultSorting = from.isDefaultSorting || false;
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
        to.selectable = grid.selectable;
        to.cells = grid.columns.map((column) => this.toCell<TItem>(grid, to, column));
        return to;
    }

    public static toCell<TItem = {}>(grid: GridModel<TItem>, row: RowModel<TItem>, column: ColumnModel<TItem>): CellModel<TItem> {
        const to = new CellModel<TItem>();
        to.id = ch.getId();
        to.grid = grid;
        to.row = row;
        to.column = column;
        to.type = column.type;
        to.editable = column.editable;
        to.accessor = column.accessor;
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
        to.maxLength = from.maxLength || null;
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
        to.descriptionIcon = from.descriptionIcon || null;
        to.descriptionMaxLength = from.descriptionMaxLength || null;
        to.descriptionAlight = from.descriptionAlight || Align.Bottom;
        to.descriptionCallback = from.descriptionCallback;
        to.required = from.required || false;
        to.requiredType = from.requiredType || DropdownRequiredType.Manual;
        to.addButton = from.addButton || false;
        to.addCallback = from.addCallback;
        to.nothingSelectedText = from.nothingSelectedText || null;
        to.autoCollapse = from.autoCollapse || true;
        to.groupSelected = from.groupSelected || false;
        to.multiple = from.multiple || false;
        to.noFilter = from.noFilter || false;
        to.align = from.align || DropdownAlign.Right;
        to.verticalAlign = from.verticalAlign || DropdownVerticalAlign.Auto;
        to.arrows = from.arrows || false;
        to.locationPicker = from.locationPicker || false;
        to.fetchItems = from.fetchItems;
        to.selectedTextTransform = from.selectedTextTransform;
        to.infoTransform = from.infoTransform
        return to;
    }

    public static toAction<TItem = {}>(column: ColumnModel<TItem>, from: ColumnActionDefinition): ColumnAction<TItem> {

        const to = new ColumnAction<TItem>();
        to.column = column;
        to.title = from.title || null;
        to.className = from.className || null;
        to.toggleModal = from.toggleModal || null;
        to.confirm = from.confirm || null;
        to.callback = from.callback;
        to.render = from.render;
        to.right = from.right || false;
        to.actions = from.actions;

        to.alwaysAvailable = from.alwaysAvailable || false;
        to.name = from.name || null;
        to.icon = this.toIcon(from.icon);

        if (from.type != null) {
            switch (from.type) {
                case ColumnActionType.Details:
                    to.alwaysAvailable = (from.alwaysAvailable !== false);
                    to.name = from.name || "details";
                    to.className = from.className || null;
                    to.type = ActionType.Secondary;
                    to.icon = this.toIcon(from.icon || "far info-square");
                    break;

                case ColumnActionType.Download:
                    to.alwaysAvailable = (from.alwaysAvailable !== false);
                    to.name = from.name || "download";
                    to.className = from.className || null;
                    to.type = ActionType.Create;
                    to.icon = this.toIcon(from.icon || "far download");
                    break;

                case ColumnActionType.Preview:
                    to.alwaysAvailable = (from.alwaysAvailable !== false);
                    to.name = from.name || "preview";
                    to.className = from.className || null;
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
        to.maxLength = column.settings.descriptionMaxLength;
        to.alight = column.settings.descriptionAlight;
        return to;
    }

    public static toIcon(icon: IIconProps | null | undefined | string, checkIconName: boolean = false): IIconProps | null {
        if (icon != null) {
            if (typeof icon === "string") {
                if ((!checkIconName) || (Icon.isIconName(icon))) {
                    return {
                        name: icon as string,
                    }
                }

                return null;
            }

            return icon as IIconProps;
        }
        return null;
    }
}