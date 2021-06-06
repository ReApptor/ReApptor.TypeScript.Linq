import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Cell from "../Cell/Cell";
import Icon, {IconSize} from "../../Icon/Icon";
import {CellModel, GridModel, RowModel} from "../GridModel";
import GridLocalizer from "../GridLocalizer";

import gridStyles from "../Grid.module.scss";
import styles from "./CollapsedRow.module.scss";

interface ICollapsedRowProps<TItem = {}> {
    grid: GridModel<TItem>;
    row: RowModel<TItem>;
    cells: CellModel<TItem>[];
}

export default class CollapsedRow<TItem = {}> extends BaseComponent<ICollapsedRowProps<TItem>> {
    
    private async toggleAsync(row: RowModel<TItem>): Promise<void> {
        row.collapsed = !row.collapsed;
        
        await this.reRenderAsync();
    }

    public get grid(): GridModel<TItem> {
        return this.props.grid;
    }

    public get row(): RowModel<TItem> {
        return this.props.row;
    }
    
    public get cells(): CellModel<TItem>[] {
        return this.props.cells;
    }

    public render(): React.ReactNode {

        const grid: GridModel<TItem> = this.grid;
        const row: RowModel<TItem> = this.row;
        const cells: CellModel<TItem>[] = this.cells;

        const collapsedCells: CellModel<TItem>[] = (grid.responsive)
            ? row.cells.where(item => item.column.collapsed)
            : [];

        if (collapsedCells.length == 0) {
            return (<React.Fragment/>);
        }

        const primaryCollapsedCell: CellModel<TItem> = cells[0];
        const minWidth: number = primaryCollapsedCell.column.outerWidth();
        const expanded: boolean = !row.collapsed;
        const iconName: string = (expanded) ? "fas minus-circle" : "fas plus-circle";

        return (
            <tr className={styles.collapsedRow}>
                <td colSpan={cells.length}>
                    <table>
                        <tr className={styles.primary}>
                            <td onClick={() => this.toggleAsync(row)} style={{minWidth: minWidth}}>
                                <Icon name={iconName} size={IconSize.Large} />
                            </td>
                            <Cell key={primaryCollapsedCell.key}
                                  cell={primaryCollapsedCell}
                            />
                        </tr>
                        {
                            (expanded) &&
                            (
                                collapsedCells.map((cell: CellModel<TItem>) => {
                                    return (
                                        <tr>
                                            <td>
                                                <span>{this.toMultiLines(GridLocalizer.get(cell.column.header)) || this.props.children}</span>
                                            </td>
                                            <Cell key={cell.key}
                                                  cell={cell}
                                            />
                                        </tr>
                                    )
                                })
                            )
                        }
                    </table>
                </td>
            </tr>
        );
    }
}