import React from "react";
import {SortDirection} from "@weare/athenaeum-toolkit";
import {BaseComponent, StylesUtility, TextAlign, VerticalAlign} from "@weare/athenaeum-react-common";
import {ColumnModel, ColumnType, GridModel, GridTransformer, IHeaderCell} from "../GridModel";
import Icon, {IconSize, IIconProps} from "../../Icon/Icon";
import GridLocalizer from "../GridLocalizer";

import styles from "../Grid.module.scss";

interface IHeaderCellProps<TItem = {}> {
    column: ColumnModel<TItem>;
    top: boolean;
    colSpanLeft: boolean;
    hasHeaderGroups: boolean;

    /**
     * @description to get the height of first row in thead and calculate "top"
     * @link stickyHeader should be enabled for this to work.
     * @default null
     */
    tableHeadFirstRowRef?: React.RefObject<HTMLTableRowElement>;

    /**
     * @description for sticky header in view while scrolling.
     * @description sets th position to sticky
     * @description uses --app-navbar-height to add top padding while scrolling.
     * @default false
     */
    stickyHeader?: boolean;

    /**
     * @link stickyHeader used for stickyHeader.
     * @description to calculate "top" for sticky position
     * @default 0
     */
    tableHeadRowIndex?: number;
}

export default class HeaderCell<TItem = {}> extends BaseComponent<IHeaderCellProps<TItem>> implements IHeaderCell {

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

    public render(): React.ReactNode {

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
                rowSpan = (this.props.hasHeaderGroups) ? 2 : undefined;
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
            minWidth: column.minWidth || undefined,
            ...(this.props.stickyHeader) ? {top: `calc(var(--app-navbar-height) + ${(this.props.tableHeadFirstRowRef?.current?.clientHeight || 0) * (this.props.tableHeadRowIndex || 0)}px)`} : {}
        };

        if (column.stretch) {
            inlineStyles.width = "100%";
        }

        const rotateClassName: string = ((column.rotate) && ((!top) || (!column.group)))
            ? styles.rotateHeader
            : "";

        const stickyHeaderClassName: string = (this.props.stickyHeader)
            ? styles.stickyHeader
            : "";

        const sortableClassName: any = (sortable) && styles.sortable;
        const sortDirectionClassName: string = (sortDirection == SortDirection.Asc)
            ? styles.asc
            : (sortDirection == SortDirection.Desc)
                ? styles.desc
                : "";
        
        const icon: IIconProps | null = (column.type == ColumnType.Icon)
            ? GridTransformer.toIcon(header, true)
            : null;

        if (render) {
            column.headerCellInstance = this;
        }

        if (this.props.colSpanLeft) {
            colSpan = (colSpan || 1) + 1;
        }

        return (
            (render) &&
            (
                <th id={this.id}
                    style={inlineStyles}
                    rowSpan={rowSpan || undefined}
                    colSpan={colSpan || undefined}
                    className={this.css(styles.th, sortableClassName, sortDirectionClassName, stickyHeaderClassName)}
                    onClick={() => (sortable) && this.sortAsync(column)}
                >

                    <div className={this.css(rotateClassName)}>

                        {
                            (icon)
                                ?
                                (
                                    <Icon {...icon} size={IconSize.Large}/>
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