import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { ColumnModel, GridModel, ITotalRow } from "../GridModel";

import styles from "./TotalRow.module.scss";

interface ITotalRowProps<TItem = {}> {
    grid: GridModel<TItem>
}

interface ITotalRowState {
}

export default class TotalRow<TItem = {}> extends BaseComponent<ITotalRowProps<TItem>, ITotalRowState> implements ITotalRow {
    
    state: ITotalRowState = {
    };

    public get grid(): GridModel<TItem> {
        return this.props.grid;
    }
    
    render(): React.ReactNode {

        const grid: GridModel<TItem> = this.grid;

        const totals: (number | null)[] = [grid.columns.length];
        for (let i: number = 0; i < grid.columns.length; i++) {
            const column: ColumnModel<TItem> = grid.columns[i];
            totals[i] = (column.total)
                ? Utility.sum(column.cells, cell => cell.value)
                : null;
        }

        return (
            <React.Fragment>
                <tr className={this.css(styles.totalRow)}>
                    {
                        totals.map((value: number | null, index) =>
                            (
                                <td key={index}>
                                    {
                                        (value != null) && 
                                        (
                                            <span>{Utility.format("{0:0.00}", value)}</span>
                                        )
                                    }
                                </td>
                            )
                        )
                    }
                </tr>
            </React.Fragment>
        );
    }
}