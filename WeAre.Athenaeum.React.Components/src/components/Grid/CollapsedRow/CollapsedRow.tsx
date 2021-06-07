import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Cell from "../Cell/Cell";
import {CellModel, ColumnModel, GridModel, RowModel} from "../GridModel";
import GridLocalizer from "../GridLocalizer";

import gridStyles from "../Grid.module.scss";
import styles from "./CollapsedRow.module.scss";

interface ICollapsedRowProps<TItem = {}> {
    grid: GridModel<TItem>;
    row: RowModel<TItem>;
    cells: CellModel<TItem>[];
}

export default class CollapsedRow<TItem = {}> extends BaseComponent<ICollapsedRowProps<TItem>> {

    public get grid(): GridModel<TItem> {
        return this.props.grid;
    }

    public get row(): RowModel<TItem> {
        return this.props.row;
    }
    
    public get cells(): CellModel<TItem>[] {
        return this.props.cells;
    }
    
    public renderCell(cell: CellModel<TItem>): React.ReactNode {

        const column: ColumnModel<TItem> = cell.column;
        const hasHeader: boolean = !!column.group || !!column.header;

        return (
            <tr>
                {
                    (hasHeader) &&
                    (
                        <td>
                            {(column.group) && (<span>{this.toMultiLines(GridLocalizer.get(column.group))}</span>)}
                            {(column.header) && (<span>{this.toMultiLines(GridLocalizer.get(column.header))}</span>)}
                        </td>
                    )
                }
                <Cell key={cell.key}
                      cell={cell}
                      colSpan={hasHeader ? 1 : 2}
                />
            </tr>
        )
    }

    public render(): React.ReactNode {

        const grid: GridModel<TItem> = this.grid;
        const row: RowModel<TItem> = this.row;
        const cells: CellModel<TItem>[] = this.cells;
        const className: string | null = grid.responsiveRowClassName;

        const collapsedCells: CellModel<TItem>[] = (grid.responsive)
            ? row.cells.where(item => item.column.collapsed)
            : [];

        if ((collapsedCells.length == 0) || (!row.responsiveContainerExpanded)) {
            return (<React.Fragment/>);
        }

        return (
            <tr className={this.css(styles.collapsedRow, className)}>
                <td colSpan={cells.length + 1}>
                    <table>
                        {
                            collapsedCells.map((cell: CellModel<TItem>) => this.renderCell(cell))
                        }
                    </table>
                </td>
            </tr>
        );
    }
}