import React from "react";
import {SortDirection} from "@weare/athenaeum-toolkit";
import {BaseComponent, StylesUtility, TextAlign, VerticalAlign} from "@weare/athenaeum-react-common";
import {ColumnModel, ColumnType, GridModel, GridTransformer} from "../GridModel";
import Icon, {IconSize, IIconProps} from "../../Icon/Icon";

import styles from "../Grid.module.scss";
import GridLocalizer from "../GridLocalizer";

interface IHeaderCellProps<TItem = {}> {
    column: ColumnModel<TItem>;
    top: boolean;
}

export default class HeaderCell<TItem = {}> extends BaseComponent<IHeaderCellProps<TItem>> {
    
    private async sortAsync(column: ColumnModel<TItem>): Promise<void> {
        const grid: GridModel<TItem> = column.grid;

        grid.sortColumn = column;
        grid.sortDirection = (grid.sortColumn == column)
            ? (grid.sortDirection == SortDirection.Asc)
                ? SortDirection.Desc
                : SortDirection.Asc
            : (column.sorting == SortDirection.Asc)
                ? SortDirection.Desc
                : SortDirection.Asc;

        await grid.reloadAsync();
    }

    render(): React.ReactNode {

        const column: ColumnModel<TItem> = this.props.column;
        const top: boolean = this.props.top;
        
        const grid: GridModel<TItem> = column.grid;
        const columnIndex: number = column.index;

        let render: boolean = true;
        let header: string | undefined;
        let rowSpan: number | undefined = undefined;
        let colSpan: number | undefined = undefined;
        let textAlign: TextAlign = column.textAlign || TextAlign.Left;
        let verticalAlign: VerticalAlign = VerticalAlign.Middle;

        if (column.group) {
            header = (top) ? column.group : column.header;
            
            if (top) {
                textAlign = TextAlign.Center;

                if ((columnIndex > 0) && (grid.columns[columnIndex - 1].group === column.group)) {
                    render = false;
                } else {
                    colSpan = 0;
                    for (let i: number = columnIndex; i < grid.columns.length; i++) {
                        if (grid.columns[i].group === column.group) {
                            colSpan++;
                        } else {
                            break;
                        }
                    }
                }
            }
        } else {
            textAlign = column.textAlign || textAlign;
            verticalAlign = column.verticalAlign || verticalAlign;
            if (top) {
                header = column.header;
                rowSpan = 2;
            } else {
                render = false;
            }
        }
        
        const groupHeaderCell: boolean = (top) && (colSpan != null) && (colSpan > 1);
        const sortable: boolean = (!groupHeaderCell) && (column.sortable);
        const sortDirection: SortDirection | null = (sortable) && (grid.sortColumn == column)
            ? grid.sortDirection
            : null;

        const inlineStyles: React.CSSProperties = {
            textAlign: StylesUtility.textAlign(textAlign),
            verticalAlign: StylesUtility.verticalAlign(verticalAlign),
            height: ((!top) && (grid.headerMinHeight)) ? `${grid.headerMinHeight}px` : undefined,
            minWidth: column.minWidth || undefined
        };
        
        if (column.stretch) {
            inlineStyles.width = "100%";
        }
        
        const rotateClassName: string = ((column.rotate) && ((!top) || (!column.group)))
            ? styles.rotateHeader
            : "";
        
        const sortableClassName: any = (sortable) && styles.sortable;
        const sortDirectionClassName: string = (sortDirection == SortDirection.Asc)
            ? styles.asc
            : (sortDirection == SortDirection.Desc)
                ? styles.desc
                : "";
        
        const icon: IIconProps | null = (column.type == ColumnType.Icon)
            ? GridTransformer.toIcon(header)
            : null;
        
        return (
            (render) &&
            (
                <th id={this.id}
                    style={inlineStyles}
                    rowSpan={rowSpan || 1}
                    colSpan={colSpan || 1}>
                    
                    <div className={this.css(rotateClassName, sortableClassName, sortDirectionClassName)} onClick={async () => (sortable) && await this.sortAsync(column)}>
                        {
                            (icon)
                                ?
                                (
                                    <Icon {...icon} size={IconSize.Large} />
                                )
                                :
                                (
                                    <span>{this.toMultiLines(GridLocalizer.get(header)) || this.props.children}</span>
                                )
                        }
                    </div>
                    
                </th>
            )
        )
    }
}