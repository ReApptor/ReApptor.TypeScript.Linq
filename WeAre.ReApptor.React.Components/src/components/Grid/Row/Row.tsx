import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import Cell from "../Cell/Cell";
import CollapsedRow from "../CollapsedRow/CollapsedRow";
import {BorderType, CellModel, GridHoveringType, GridModel, GridOddType, GridSelectableType, IRow, RowModel} from "../GridModel";
import Icon, {IconSize} from "../../Icon/Icon";

import gridStyles from "../Grid.module.scss";
import styles from "./Row.module.scss";

interface IRowProps<TItem = {}> {
    row: RowModel<TItem>;
    init?(row: RowModel<TItem>): void;
    onCheck?(row: RowModel<TItem>): Promise<void>;
    onSelect?(row: RowModel<TItem>): Promise<void>;

    /**
     * Called when the {@link Row} is expanded or collapsed.
     * @param row {@link Row} which was expanded or collapsed.
     */
    onToggle?(row: RowModel<TItem>): Promise<void>;
}

export default class Row<TItem = {}> extends BaseComponent<IRowProps<TItem>> implements IRow {
    
    private async onSelectAsync(cell: CellModel<TItem>): Promise<void> {
        if ((this.model.selectable) && (cell.isSelectable)) {
            
            if (this.grid.selectableType == GridSelectableType.Single) {
                
                if (!this.model.selected) {
                    const selectedRow: RowModel<TItem> | null = this.grid.selectedRow;

                    this.model.selected = true;
                    
                    if (selectedRow != null) {
                        selectedRow.selected = false;

                        await selectedRow.reRenderAsync();
                    }

                    await this.reRenderAsync();

                    await this.props.onSelect?.(this.model);
                }
                
            } else {
                this.model.selected = !this.model.selected;

                await this.reRenderAsync();

                await this.props.onSelect?.(this.model);
            }
        }
    }

    private async onCheckAsync(e: React.MouseEvent<HTMLTableDataCellElement>): Promise<void> {
        if (this.model.checkable) {
            this.model.checked = !this.model.checked;

            await this.reRenderAsync();
            
            await this.props.onCheck?.(this.model);
        }

        e.preventDefault();
    }

    private async onToggleAsync(row: RowModel<TItem>): Promise<void> {
        row.responsiveContainerExpanded = !row.responsiveContainerExpanded;

        await this.reRenderAsync();
        
        await this.props.onToggle?.(this.model);
    }

    public get grid(): GridModel<TItem> {
        return this.model.grid;
    }

    public get model(): RowModel<TItem> {
        return this.props.row;
    }

    public get isLoading(): boolean {
        return this.grid.instance.isLoading;
    }

    public shouldComponentUpdate(nextProps: Readonly<IRowProps<TItem>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return (!this.isLoading) && (this.isMounted);
    }

    public render(): React.ReactNode {

        const grid: GridModel<TItem> = this.grid;
        const row: RowModel<TItem> = this.model;

        row.instance = this;

        const renderDetails: boolean = (row.grid.renderDetails != null) && ((row.hasDetails) || (row.expanded));
        row.hasDetails = renderDetails;

        if (this.props.init) {
            this.props.init(row);
        }

        const oddStyle: any = ((grid.odd === GridOddType.Row) && (row.index % 2 === 0)) && styles.odd;
        const rowHoveringStyle: any = (grid.hovering === GridHoveringType.Row) && styles.rowHovering;
        const selectedStyle: any = (row.selected) && styles.selected;
        const detailsVisibleStyle: any = (row.expanded) && (styles.visible);
        const detailsColSpan: number = (row.detailsColEnd - row.detailsColStart + 1);
        const checkRowSpan = (row.expanded) ? 2 : 1;

        const checkDisabledStyle: any = (grid.checkable) && (!row.checkable) && (gridStyles.disabled);
        const borderStyle: any = (this.grid.borderType === BorderType.DarkSeparators) && styles.darkSeparators;

        const cells: CellModel<TItem>[] = row.cells.where(item => item.column.isVisible);

        const collapsedCells: CellModel<TItem>[] = (grid.responsive)
            ? row.cells.where(item => ((item.column.collapsed) && (item.column.responsivePriority >= 0)))
            : [];

        const responsive: boolean = (collapsedCells.length > 0);
        const responsiveContainerExpanded: boolean = (responsive) && (row.responsiveContainerExpanded);
        const responsiveIconName: string = (responsiveContainerExpanded) ? "fas minus-circle" : "fas plus-circle";
        const responsiveExpandedStyle = (responsiveContainerExpanded) && styles.expanded;

        return (
            <React.Fragment>

                <tr className={this.css(styles.gridRow, rowHoveringStyle, selectedStyle, styles.data, row.className, oddStyle, borderStyle)}>
                    
                    {
                        (responsive) &&
                        (
                            <td className={this.css(styles.responsive)}
                                onClick={() => this.onToggleAsync(row)}
                            >
                                <Icon className={this.css(styles.responsiveIcon, responsiveExpandedStyle)}
                                      name={responsiveIconName}
                                      size={IconSize.Large}
                                />
                            </td>
                        )
                    }
                    
                    {
                        (grid.checkable) &&
                        (
                            <td className={this.css(gridStyles.check, checkDisabledStyle)}
                                rowSpan={checkRowSpan}
                                onClick={(e) => this.onCheckAsync(e)}
                            >
                                <input type="checkbox"
                                       checked={row.checked}
                                       disabled={!this.model.checkable}
                                       onChange={() => {}}
                                />
                            </td>
                        )
                    }
                    
                    {
                        cells.map((cell: CellModel<TItem>) => (
                            <Cell key={cell.key}
                                  cell={cell}
                                  onClick={(cell: CellModel<TItem>) => this.onSelectAsync(cell)}
                            />
                        ))
                    }
                    
                </tr>

                <tr className={this.css(styles.gridRow, styles.details, detailsVisibleStyle, oddStyle)}>
                    <td colSpan={detailsColSpan}>
                        {
                            (renderDetails) &&
                            (
                                <React.Fragment>
                                    {
                                        row.grid.renderDetails!(row)
                                    }
                                </React.Fragment>
                            )
                        }
                    </td>
                </tr>

                <CollapsedRow grid={grid}
                              row={row}
                              cells={cells}
                />

            </React.Fragment>
        );
    }
}