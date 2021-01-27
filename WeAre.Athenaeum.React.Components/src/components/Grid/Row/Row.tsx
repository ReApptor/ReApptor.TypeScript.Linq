import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Cell from "../Cell/Cell";
import { BorderType, CellModel, GridHoveringType, GridModel, GridOddType, IRow, RowModel } from "../GridModel";

import gridStyles from "../Grid.module.scss";
import styles from "./Row.module.scss";

interface IRowProps<TItem = {}> {
    row: RowModel<TItem>;
    init?(row: RowModel<TItem>): void;
    onCheck?(row: RowModel<TItem>): Promise<void>;
}

export default class Row<TItem = {}> extends BaseComponent<IRowProps<TItem>> implements IRow {
    
    private async onCheckAsync(): Promise<void> {
        if (this.model.checkable) {
            this.model.checked = !this.model.checked;

            await this.reRenderAsync();

            if (this.props.onCheck) {
                await this.props.onCheck(this.model);
            }
        }
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

    render(): React.ReactNode {
        
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
        const detailsVisibleStyle: any = (row.expanded) && (styles.visible);
        const colSpan: number = (row.detailsColEnd - row.detailsColStart + 1);
        const checkRowSpan = (row.expanded) ? 2 : 1;
        
        const checkDisabledStyle: any = (grid.checkable) && (!row.checkable) && (gridStyles.disabled);
        const borderStyle: any = (this.grid.borderType == BorderType.DarkSeparators) && styles.darkSeparators;
        
        const cells: CellModel<TItem>[] = row.cells.where(item => item.column.visible);

        return (
            <React.Fragment>
                <tr className={this.css(styles.gridRow, rowHoveringStyle, styles.data, row.className, oddStyle, borderStyle)}>
                    {
                        (grid.checkable) &&
                        (
                            <td className={this.css(gridStyles.check, checkDisabledStyle)} rowSpan={checkRowSpan} onClick={async () => this.onCheckAsync()}>
                                <input type="checkbox" checked={row.checked} disabled={!this.model.checkable} onChange={() => {}} />
                            </td>
                        )
                    }
                    {
                        cells.map((cell: CellModel<TItem>) => (
                            <Cell key={cell.key} cell={cell}/>
                        ))
                    }
                </tr>
                <tr className={this.css(styles.gridRow, styles.details, detailsVisibleStyle, oddStyle)}>
                    <td colSpan={colSpan}>
                        {
                            (renderDetails) &&
                            (
                                <React.Fragment>
                                    {row.grid.renderDetails!(row)}
                                </React.Fragment>
                            )
                        }
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}