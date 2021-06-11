import React from "react";
import {Utility, IPagedList, SortDirection} from "@weare/athenaeum-toolkit";
import {BaseAsyncComponent, IBaseAsyncComponentState, IGlobalResize} from "@weare/athenaeum-react-common";
import {ColumnModel, GridAccessorCallback, GridHoveringType, GridModel, GridTransformer, IGrid, IGridDefinition, RowModel, TGridData} from "./GridModel";
import HeaderCell from "./Cell/HeaderCell";
import Row from "./Row/Row";
import GridSpinner from "./GridSpinner/GridSpinner";
import TotalRow from "./TotalRow/TotalRow";
import CheckHeaderCell from "./Cell/CheckHeaderCell";
import Pagination from "../Pagination/Pagintation";
import GridLocalizer from "./GridLocalizer";

import styles from "./Grid.module.scss";

interface IGridProps<TItem = {}> extends IGridDefinition {
    data?: TItem[] | null;
    fetchData?(sender: Grid<TItem>, pageNumber: number, pageSize: number, sortColumnName: string | null, sortDirection: SortDirection | null): Promise<TGridData<TItem>>;
}

interface IGridState<TItem = {}> extends IBaseAsyncComponentState<TGridData<TItem>> {
}

interface IGridOverflowData {
    containerWidth: number;
    
    gridWidth: number;
    
    gridFullWidth: number;
}

export default class Grid<TItem = {}> extends BaseAsyncComponent<IGridProps<TItem>, IGridState<TItem>,TGridData<TItem>> implements IGrid, IGlobalResize {

    state: IGridState<TItem> = {
        isLoading: false,
        data: null
    };

    private readonly _spinnerRef: React.RefObject<GridSpinner> = React.createRef();
    private _overflowData: IGridOverflowData | null = null;
    private _language: string = GridLocalizer.language;
    private _grid: GridModel<TItem> | null = null;
    private _rows: RowModel<TItem>[] | null = null;

    private async paginateAsync(pageNumber: number, pageSize: number): Promise<void> {
        if ((this.pageNumber != pageNumber) || (this.pageSize != pageSize)) {
            this.model.pageNumber = pageNumber;
            this.model.pageSize = pageSize;
            await this.reloadAsync();
        }
    }

    private async setDataAsync(data: TItem[]): Promise<void> {
        const state: IGridState<TItem> = this.state;
        await this.processDataAsync(state, data);
        if (this.isMounted) {
            await this.setState(state);
        }
    }

    private async buildModelAsync(): Promise<void> {
        const data: TItem[] = this.model.data;
        this._language = GridLocalizer.language;
        this._grid = null;
        this._rows = null;
        await this.setDataAsync(data);
    }

    private async onCheckRowAsync(): Promise<void> {
        const count: number = this.rows.length;
        const selected: number = Utility.count(this.rows, row => row.checked);
        const newChecked: boolean | undefined = (selected == 0)
            ? false
            : (selected === count)
                ? true
                : undefined;

        if (newChecked !== this.model.checked) {
            this.model.checked = newChecked;
            await this.model.checkHeaderInstance.reRenderAsync();
        }

        if (this.model.onCheck) {
            await this.model.onCheck(this.model);
        }
    }

    public width(): number {
        const gridNode: JQuery = this.JQuery(`#table_${this.id}`);

        const width: number | undefined = gridNode.width();

        return (width != null)
            ? width + 1
            : 0;
    }
    
    public getNode(): JQuery {
        return this.JQuery(`#table_${this.id}`);
    }

    public containerWidth(): number {
        const gridNode: JQuery = this.getNode();

        const parentNode: JQuery = gridNode.parent();

        return parentNode.innerWidth() || gridNode.outerWidth() || 0;
    }

    private getOverflowData(): IGridOverflowData {

        const gridContainerWidth: number = Math.round(this.containerWidth());

        const gridWidth: number = Math.round(this.model.fullWidth());

        const gridFullWidth: number = Math.round(this.model.fullWidth(false));

        return {
            containerWidth: gridContainerWidth,
            gridWidth: gridWidth,
            gridFullWidth: gridFullWidth,
        }
    }

    private async processResponsiveAsync(): Promise<void> {
        if (this.model.responsive) {
            const overflowData: IGridOverflowData = this.getOverflowData();

            let columns: ColumnModel<TItem>[] = this.model.columns;

            const needToHide: boolean = (overflowData.containerWidth < overflowData.gridWidth);

            if (needToHide) {

                let widthToCompensate: number = (overflowData.gridWidth - overflowData.containerWidth);

                const gridCollapsed: boolean = this.model.columns.some(row => row.collapsed);
                
                if (gridCollapsed) {
                    // Expand/Collapse TD width (hardcoded in styles)
                    widthToCompensate -= 40;
                }

                while (true) {

                    columns = columns.where(column => column.isVisible);

                    if (columns.length <= 1) {
                        return;
                    }

                    columns.order(column => column.responsivePriority);

                    const lastColumn: ColumnModel<TItem> = columns[columns.length - 1];

                    const columnWidth: number = lastColumn.outerWidth();

                    widthToCompensate -= columnWidth;

                    lastColumn.collapsed = true;

                    if (widthToCompensate <= 0) {
                        break;
                    }
                }

                this._overflowData = overflowData;

                this.reRenderAsync();

                return;
            }

            const lastContainerWidth = (this._overflowData) ? this._overflowData.containerWidth : overflowData.containerWidth;

            const needToShow: boolean = (lastContainerWidth < overflowData.containerWidth) && (columns.some(column => column.collapsed));

            if (needToShow) {

                columns.map(column => column.collapsed = false);

                await this.reRenderAsync();

                this._overflowData = overflowData;

                await this.processResponsiveAsync();

                return;
            }
        }
    }
    
    protected sort(items: TItem[], sortColumn: ColumnModel<TItem> | null, sortDirection: SortDirection | null): TItem[] {
        if ((sortColumn) && (sortColumn.accessor) && (items) && (sortDirection != null)) {

            const accessor: string | GridAccessorCallback<TItem> = sortColumn.accessor;

            const getter = (model: TItem): any => (typeof accessor === "string")
                ? Utility.findValueByAccessor(model, accessor)
                : accessor(model);

            items = items.sort((x: TItem, y: TItem): number => {
                const xValue: any = getter(x);
                const yValue: any = getter(y);
                return (xValue == yValue)
                    ? 0
                    : (xValue > yValue)
                        ? (sortDirection == SortDirection.Desc)
                            ? -1
                            : 1
                        : (sortDirection == SortDirection.Desc)
                            ? 1
                            : -1
            });
        }
        
        return items;
    }
    
    protected async processDataAsync(state: IGridState<TItem>, data: TGridData<TItem> | null): Promise<void> {
        const model: GridModel<TItem> = this.model;
        
        let items: TItem[] = [];
        let totalItemCount: number = 0;
        let pageNumber: number = model.pageNumber;
        const sortColumn: ColumnModel<TItem> | null = model.sortColumn;
        const sortDirection: SortDirection | null = model.sortDirection;
        
        if (data != null) {
            let pagedData = data as IPagedList<TItem>;
            if (pagedData.items != null) {
                items = pagedData.items;
                totalItemCount = pagedData.totalItemCount;
                pageNumber = pagedData.pageNumber;
            } else {
                items = data as TItem[];
                items = this.sort(items, sortColumn, sortDirection);
                if (model.pagination) {
                    pagedData = Utility.toPagedList(items, model.pageNumber, model.pageSize);
                    items = pagedData.items;
                    totalItemCount = pagedData.totalItemCount;
                    pageNumber = pagedData.pageNumber;
                } else {
                    pageNumber = 1;
                    totalItemCount = items.length;
                }
            }
        }
        
        model.data = items;
        model.checked = false;
        model.pageNumber = pageNumber;
        model.totalItemCount = totalItemCount;
        model.sortColumn = sortColumn;
        model.sortDirection = sortDirection;
        model.generation++;
        
        this._rows = null;
    }

    protected async fetchDataAsync(): Promise<TGridData<TItem>> {
        if (this.props.fetchData) {
            const model: GridModel<TItem> = this.model;
            const pageNumber: number = model.pageNumber;
            const pageSize: number = model.pageSize;
            
            const sortColumn: ColumnModel<TItem> | null = model.sortColumn;
            const sortColumnName: string | null = (sortColumn != null)
                ? (sortColumn.name)
                    ? sortColumn.name
                    : ((sortColumn.accessor) && (typeof sortColumn.accessor === "string"))
                        ? sortColumn.accessor
                        : sortColumn.index.toString()
                : null;
            const sortDirection: SortDirection | null = (sortColumnName)
                ? model.sortDirection || SortDirection.Asc
                : null;
            
            return await this.props.fetchData(this, pageNumber, pageSize, sortColumnName, sortDirection);
        }
        return [];
    }

    protected getEndpoint(): string {
        return "";
    }

    public isAsync(): boolean {
        return (this.props.fetchData != null);
    }

    public hasSpinner(): boolean {
        return true;
    }
    
    public async setSpinnerAsync(isSpinning: boolean): Promise<void> {
        if (this._spinnerRef.current) {
            await this._spinnerRef.current.setSpinnerAsync(isSpinning);
        }
    }
    
    public get columns(): ColumnModel<TItem>[] {
        return this.model.columns;
    }

    public get rows(): RowModel<TItem>[] {
        return this._rows || (this._rows = (this.model.rows = GridTransformer.toRows(this.model, this.model.data || [])));
    }

    public get model(): GridModel<TItem> {
        return this._grid || (this._grid = GridTransformer.toGrid(this.props, this.id));
    }

    public get pageNumber(): number {
        return this.model.pageNumber;
    }

    public get pageSize(): number {
        return this.model.pageSize;
    }

    public get itemCount(): number {
        return this.model.items.length;
    }

    public get totalItemCount(): number {
        return this.model.totalItemCount;
    }
    
    public get colSpan(): number {
        return (this.model.checkable)
            ? this.model.columns.length + 1 
            : this.model.columns.length;
    }

    public async clearAsync(): Promise<void> {
        await this.setDataAsync([]);
    }
    
    public async onGlobalResize(e: React.SyntheticEvent): Promise<void> {
        await this.processResponsiveAsync();
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        if (this.props.data != null) {
            await this.setDataAsync(this.props.data);
        }
    }

    public async componentWillReceiveProps(nextProps: IGridProps<TItem>): Promise<void> {

        const newData: boolean = (this.props.data !== nextProps.data);
        if (newData) {
            const data: TItem[] = nextProps.data || [];
            await this.setDataAsync(data);
        }
        
        const newReadonly: boolean = (this.props.readonly !== nextProps.readonly);
        const newResponsive: boolean = (this.props.responsive !== nextProps.responsive);
        const newLanguage: boolean = (this._language !== GridLocalizer.language);

        await super.componentWillReceiveProps(nextProps);

        if ((newReadonly) || (newLanguage) || (newResponsive)) {
            await this.buildModelAsync();
        }

        await this.processResponsiveAsync();
    }

    public async componentDidMount(): Promise<void> {

        await super.componentDidMount();

        await this.processResponsiveAsync();
    }

    private renderHeader(column: ColumnModel<TItem>, hasHeaderGroups: boolean, top: boolean,  colSpanLeft: boolean): React.ReactNode {
        return (
            <HeaderCell key={`grid_header_${column.index}_${top}`} column={column} hasHeaderGroups={hasHeaderGroups} top={top} colSpanLeft={colSpanLeft} />
        )
    }

    private renderDataRow(row: RowModel<TItem>): React.ReactNode {
        return (
            <Row key={row.key}
                 row={row}
                 init={this.props.initRow}
                 onCheck={async () => await this.onCheckRowAsync()}
            />
        )
    }
    
    private renderEmptyRow(): React.ReactNode {
        return (
            <tr className={styles.emptyRow}>
                <td colSpan={this.colSpan}>
                    {GridLocalizer.get(this.model.noDataText)}
                </td>
            </tr>
        );
    }

    public render(): React.ReactNode {
        const model: GridModel<TItem> = this.model;
        const rows: RowModel<TItem>[] = this.rows;
        
        this.model.instance = this;
        
        const visible: boolean = (this.hasData) || (!model.noDataNoHeader);
        const outerSpinner: boolean = (model.noDataNoHeader);
        const rowHoveringStyle: any = (model.hovering === GridHoveringType.Row) ? "table-hover" : styles.noRowHovering;
        
        const inlineStyles: React.CSSProperties = {};

        if (model.minWidth) {
            inlineStyles.minWidth = model.minWidth;
        }
        
        const columns: ColumnModel<TItem>[] = model.columns.where(item => item.isVisible);

        const collapsedColumns: ColumnModel<TItem>[] = (model.responsive)
            ? model.columns.where(item => item.collapsed)
            : [];
        const responsive: boolean = (collapsedColumns.length > 0);
        const hasHeaderGroups: boolean = (visible) && (columns.some(column => !!column.group));

        return (
            <React.Fragment>
                
                {
                    (visible) &&
                    (
                        <React.Fragment>
                            
                            <table id={"table_" + this.id}
                                   key={model.key}
                                   style={inlineStyles}
                                   className={this.css(styles.grid, "table table-bordered", rowHoveringStyle, this.props.className)}>
                                
                                {
                                    (columns.length > 0) &&
                                    (
                                        <React.Fragment>
                                            <thead>
                                            {
                                                <React.Fragment>
                                                    <tr>
                                                        {(model.checkable) && (<CheckHeaderCell model={model} hasHeaderGroups={hasHeaderGroups} colSpanLeft={responsive}/>)}
                                                        {columns.map((column, index) => this.renderHeader(column, hasHeaderGroups, true, (responsive) && (index == 0)))}
                                                    </tr>
                                                    {
                                                        (hasHeaderGroups) &&
                                                        (
                                                            <tr>
                                                                {columns.map((column, index) => this.renderHeader(column, hasHeaderGroups, false, (responsive) && (index == 0)))}
                                                            </tr>
                                                        )
                                                    }
                                                </React.Fragment>
                                            }
                                            </thead>
                                            <tbody>
                                            {
                                                ((model.noDataText) && (rows.length === 0)) 
                                                    ? this.renderEmptyRow()
                                                    : rows.map((item, rowIndex) => this.renderDataRow(rows[rowIndex]))
                                            }
                                            {
                                                ((rows.length > 0) && (model.total)) && (<TotalRow grid={model} />)
                                            }
                                            </tbody>
                                        </React.Fragment>
                                    )
                                }
    
                                {
                                    (!outerSpinner) &&
                                    (
                                        <tbody className={styles.spinner}>
                                            <tr>
                                                <td colSpan={this.colSpan}>
                                                    {
                                                        <GridSpinner ref={this._spinnerRef} />
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                }
                                
                            </table>
    
                            {
                                (model.pagination) &&
                                (
                                    <Pagination className={styles.pagination}
                                                pageSize={this.pageSize}
                                                pageNumber={this.pageNumber}
                                                itemCount={this.itemCount}
                                                totalItemCount={this.totalItemCount}
                                                onChange={async (sender, pageNumber, pageSize) => await this.paginateAsync(pageNumber, pageSize)}
                                    />
                                )
                            }
                        
                        </React.Fragment>
                    )
                }
                
                {
                    ((outerSpinner) && (<GridSpinner ref={this._spinnerRef} />))
                }

            </React.Fragment>
        );
    }
}