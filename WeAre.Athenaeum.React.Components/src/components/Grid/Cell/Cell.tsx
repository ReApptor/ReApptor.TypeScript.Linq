import React from "react";
import {Utility, TFormat, GeoLocation, IEnumProvider, ServiceProvider} from "@weare/athenaeum-toolkit";
import {ReactUtility, StylesUtility, PageRouteProvider, BaseComponent} from "@weare/athenaeum-react-common";
import {CellAction, CellModel, CellPaddingType, ColumnAction, ColumnModel, ColumnSettings, ColumnType, GridAccessorCallback, GridHoveringType, GridModel, GridRouteCallback, GridTransformer, ICell} from "../GridModel";
import DropdownCell from "./DropdownCell/DropdownCell";
import CellActionComponent from "./CellActionComponent/CellActionComponent";
import Comparator from "../../../helpers/Comparator";
import Icon, { IconSize, IIconProps } from "../../Icon/Icon";
import { IInput } from "@/models/base/BaseInput";
import { SelectListItem } from "@/components/Dropdown/SelectListItem";
import NumberInput from "@/components/NumberInput/NumberInput";
import TextInput from "@/components/TextInput/TextInput";
import Dropdown, { DropdownAlign, DropdownOrderBy, DropdownVerticalAlign } from "@/components/Dropdown/Dropdown";
import DateInput from "@/components/DateInput/DateInput";
import AddressInput from "@/components/AddressInput/AddressInput";
import GridLocalizer from "@/components/Grid/GridLocalizer";

import gridStyles from "../Grid.module.scss";

interface ICellProps<TItem = {}> {
    cell: CellModel<TItem>;
}

export default class Cell<TItem = {}> extends BaseComponent<ICellProps<TItem>> implements ICell {

    private readonly _inputRef: React.RefObject<IInput> = React.createRef();
    
    private findValueByAccessor(model: TItem, accessor: string | GridAccessorCallback<any> | null = null): any {
        return (accessor)
            ? (typeof accessor === "function")
                ? accessor(model)
                : Utility.findValueByAccessor(model, accessor)
            : null;
    }

    private async invokeCallback(cell: CellModel<TItem>): Promise<void> {
        const column: ColumnModel<TItem> = cell.column;

        if ((!cell.isReadonly) && (column.callback)) {
            await column.callback(cell, null);
        }

        if (cell.route) {
            await PageRouteProvider.redirectAsync(cell.route);
        }
    }

    private async processNewValueAsync(cell: CellModel<TItem>, value: any, userInteraction: boolean): Promise<void> {
        const modified: boolean = cell.setValue(value);

        if (userInteraction) {
            await this.invokeCallback(cell);
        }

        if ((modified) || (cell.column.reRenderRow)) {
            await cell.row.reRenderAsync();
        } else {
            await this.reRenderAsync();
        }
    }

    private async onPlaceSelectedAsync(cell: CellModel<TItem>, location: GeoLocation): Promise<void> {
        const value: string = location.formattedAddress;
        
        await this.processNewValueAsync(cell, value, true);
    }

    private async onTextCellChangeAsync(cell: CellModel<TItem>, value: any, userInteraction: boolean, done: boolean): Promise<void> {
        if (done) {
            await this.processNewValueAsync(cell, value, userInteraction);
        }
    }

    private async onEnumCellChangeAsync(cell: CellModel<TItem>, item: SelectListItem, userInteraction: boolean): Promise<void> {

        const value: number = parseInt(item.value);

        await this.processNewValueAsync(cell, value, userInteraction);
    }

    private async onNumberCellChangeAsync(cell: CellModel<TItem>, value: number, userInteraction: boolean, done: boolean): Promise<void> {
        if (done) {
            await this.processNewValueAsync(cell, value, userInteraction);
        }
    }

    private async onBooleanCellChangeAsync(cell: CellModel<TItem>, value: boolean): Promise<void> {
        await this.processNewValueAsync(cell, value, true);
    }

    private async onDateCellChangeAsync(cell: CellModel<TItem>, value: Date): Promise<void> {
        await this.processNewValueAsync(cell, value, true);
    }

    private renderDefaultCellContent(cell: CellModel<TItem>, settings: ColumnSettings<TItem>, cellValue: string): React.ReactNode {

        const hasInfo: boolean = (!!settings.infoAccessor);

        let infoValue: string = "";

        if (hasInfo) {
            infoValue = this.findValueByAccessor(cell.model, settings.infoAccessor!) as string;
            const infoFormat: TFormat | null = (cell.column.settings.infoFormat != null) ? cell.column.settings.infoFormat : cell.column.format;
            
            infoValue = ((settings.hideZero) && (!infoValue))
                ? ""
                : (cell.column.transform)
                    ? cell.column.transform(cell, infoValue, infoFormat)
                    : Utility.formatValue(infoValue, infoFormat);

            const hideInfo: boolean = (hasInfo) &&
                (
                    ((settings.infoHideZero) && (!infoValue)) ||
                    ((settings.infoHideEqual) && (infoValue == cellValue))
                );

            if (hideInfo) {
                infoValue = "";
            }
        }

        let hasValue: boolean = (!!cellValue);
        let hasInfoValue: boolean = (!!infoValue) && (typeof infoValue === "string");

        if ((!hasValue) && (hasInfoValue)) {
            cellValue = infoValue;
            infoValue = "";
            hasValue = true;
            hasInfoValue = false;
        }

        const overflow: boolean = !!cell.column.maxWidth;

        const inlineStyles: React.CSSProperties = {
            textAlign: StylesUtility.textAlign(cell.column.textAlign),
        };

        let title: string = cell.title;
        if (overflow) {
            inlineStyles.textOverflow = "ellipsis";
            inlineStyles.overflowX = "hidden";

            if (!title) {
                title = cellValue;
            }
        }

        let infoTitle: string = "";
        if (hasInfoValue) {
            infoTitle = settings.infoTitle || "";
            if (overflow) {
                if (!infoTitle) {
                    infoTitle = infoValue;
                }
            }
        }

        const linkStyle: string = (cell.route) && (gridStyles.link) || "";
        const valueBoldStyle: string = ((hasInfoValue) && (settings.infoBoldNotEqual) && (infoValue != cellValue)) && gridStyles.bold || "";
        const infoValueBold: string = (hasInfoValue) && (settings.infoBold) && (gridStyles.bold) || "";

        return (
            <React.Fragment>
                {
                    (hasInfoValue)
                        ?
                        (
                            <div className={gridStyles.twoLines}>
                                <span className={this.css(linkStyle, valueBoldStyle)} style={inlineStyles} onClick={async () => await this.invokeCallback(cell)} title={GridLocalizer.get(title)}>
                                    {ReactUtility.toMultiLines(cellValue)}
                                </span>
                                <span style={inlineStyles} className={this.css(infoValueBold)} title={GridLocalizer.get(infoTitle)}>
                                    {ReactUtility.toMultiLines(infoValue)}
                                </span>
                            </div>
                        )
                        :
                        (
                            <span className={this.css(linkStyle)} style={inlineStyles} onClick={async () => await this.invokeCallback(cell)} title={GridLocalizer.get(title)}>
                                {ReactUtility.toMultiLines(cellValue)}
                            </span>
                        )
                }
            </React.Fragment>
        );
    }

    private renderTextCellContent(cell: CellModel<TItem>, cellValue: string | null): React.ReactNode {
        return (
            <div className={this.css(gridStyles.textContainer)}>
                <TextInput clickToEdit
                           ref={this._inputRef as React.RefObject<TextInput>}
                           className={this.css(gridStyles.textInput)}
                           value={cellValue || ""}
                           title={cell.title}
                           onChange={async (sender, value, userInteraction, done) => await this.onTextCellChangeAsync(cell, value, userInteraction, done)}
                />
            </div>
        );
    }

    private renderAddressCellContent(cell: CellModel<TItem>, settings: ColumnSettings<TItem>, cellValue: string | null): React.ReactNode {
        return (
            <div className={this.css(gridStyles.textContainer)}>
                <AddressInput clickToEdit
                              className={this.css(gridStyles.addressInput)}
                              value={cellValue || ""}
                              locationPicker={settings.locationPicker}    
                              append={settings.locationPicker}
                              onChange={async (location: GeoLocation) => this.onPlaceSelectedAsync(cell, location)}
                />
            </div>
        );
    }

    private renderIconCellContent(cell: CellModel<TItem>, cellValue: string | IIconProps | null): React.ReactNode {
        const icon: IIconProps | null = GridTransformer.toIcon(cellValue);
        const size: IconSize | undefined = (icon != null) ? icon.size || IconSize.Large : undefined;
        return (
            <div>
                { (icon) && (<Icon {...icon} size={size} />) }
            </div>
        );
    }

    private renderBooleanCellContent(cell: CellModel<TItem>, cellValue: boolean): React.ReactNode {
        const name: string = `grid_${cell.grid.id}_${cell.rowIndex}_${cell.columnIndex}_input`;
        return (
            <label htmlFor={name}>
                <input type="checkbox"
                       id={name}
                       checked={cellValue}
                       onChange={async (e: React.ChangeEvent<HTMLInputElement>) => await this.onBooleanCellChangeAsync(cell, e.target.checked)}
                />
            </label>
        );
    }

    private renderNumberCellContent(cell: CellModel<TItem>, settings: ColumnSettings<TItem>, cellValue: number | null): React.ReactNode {
        
        let hasInfo: boolean = (!!settings.infoAccessor);

        let infoValue: any = (hasInfo) ? this.findValueByAccessor(cell.model, settings.infoAccessor!) : null;

        const hideInfo: boolean = (hasInfo) &&
            (
                ((settings.infoHideZero) && (!infoValue)) ||
                ((settings.infoHideEqual) && (infoValue == cellValue))
            );

        if (hideInfo) {
            hasInfo = false;
        }

        cellValue = (settings.hideZero) ? (cellValue || 0) : cellValue;
        infoValue = (settings.infoHideZero) ? (infoValue || 0) : infoValue;

        const hasInfoValue: boolean = (infoValue != null);

        const hideZeroStyle: string = ((settings.hideZero) && (infoValue == 0) && (cellValue == 0)) && gridStyles.hideZero || "";

        const numberInfoStyle: string = (hasInfo) && gridStyles.numberInfo || "";
        const valueBoldStyle: string = ((hasInfoValue) && (settings.infoBoldNotEqual) && (infoValue != cellValue)) && gridStyles.bold || "";

        const withArrowsStyle: string = (settings.arrows) && gridStyles.withArrows || "";
        
        const min: number | null = (typeof settings.min === "number") ? settings.min : null;
        const max: number | null = (typeof settings.max === "number") ? settings.max : null;

        return (
            <div className={this.css(gridStyles.numberContainer, numberInfoStyle)}>
                {
                    (hasInfo) &&
                    (
                        <span className={this.css(hideZeroStyle)} title={GridLocalizer.get(settings.infoTitle)}>
                            {Utility.formatValue(infoValue || 0, cell.column.format)}
                        </span>
                    )
                }
                <NumberInput clickToEdit
                             title={GridLocalizer.get(cell.title)}
                             hideArrows={!settings.arrows}
                             className={this.css(gridStyles.numberInput, hideZeroStyle, valueBoldStyle, withArrowsStyle)}
                             format={cell.column.format || undefined}
                             min={min || undefined}
                             max={max || undefined}
                             step={settings.step || undefined}
                             value={cellValue || 0}
                             onChange={async (sender, value, userInteraction, done) => await this.onNumberCellChangeAsync(cell, value, userInteraction, done)}
                />
            </div>
        );
    }

    private renderDateCellContent(cell: CellModel<TItem>, settings: ColumnSettings<TItem>, cellValue: Date): React.ReactNode {
        let hasInfo: boolean = (!!settings.infoAccessor);

        let infoValue: any = (hasInfo)
            ? this.findValueByAccessor(cell.model, settings.infoAccessor!)
            : null;

        const hideInfo: boolean = (hasInfo) &&
            (
                ((settings.infoHideZero) && (!infoValue)) ||
                ((settings.infoHideEqual) && (Comparator.isEqual(infoValue, cellValue)))
            );

        if (hideInfo) {
            hasInfo = false;
        }

        if (Utility.isDateType(infoValue)) {
            infoValue = Utility.formatValue(infoValue, cell.column.format);
        }
        
        const minDate: Date | null = (typeof settings.min !== "number")
            ? settings.min
            : null;
        
        const maxDate: Date | null = (typeof settings.max !== "number")
            ? settings.max
            : null;

        const shortDate: boolean = ((cell.column.format === "d") || (cell.column.format === "MM.yy") || (cell.column.format === "dd.MM.yy"));
        const shortDateStyle: string = (shortDate) && gridStyles.shortDate || "";

        return (
            <React.Fragment>
                {
                    (hasInfo && infoValue)
                        ?
                        (
                            <div className={gridStyles.twoLines}>
                                <DateInput className={this.css(shortDateStyle)}
                                           title={cell.title}
                                           shortDate={shortDate}
                                           minDate={minDate}
                                           maxDate={maxDate}
                                           value={cellValue}
                                           onChange={async (date: Date) => await this.onDateCellChangeAsync(cell, date)}
                                />
                                <span title={GridLocalizer.get(settings.infoTitle)}>
                                    {infoValue}
                                </span>
                            </div>
                        )
                        :
                        (
                            <DateInput className={this.css(shortDateStyle)}
                                       title={cell.title}
                                       shortDate={shortDate}
                                       minDate={minDate}
                                       maxDate={maxDate}
                                       value={cellValue}
                                       onChange={async (date: Date) => await this.onDateCellChangeAsync(cell, date)}
                            />
                        )
                }

            </React.Fragment>
        );
    }

    private renderEnumCellContent(cell: CellModel<TItem>, cellValue: any, enumName: string): React.ReactNode {
        const enumProvider: IEnumProvider = ServiceProvider.getRequiredService(nameof<IEnumProvider>());
        return (
            <Dropdown required noSubtext noWrap
                      className={gridStyles.dropdown}
                      orderBy={DropdownOrderBy.None}
                      verticalAlign={DropdownVerticalAlign.Auto}
                      align={DropdownAlign.Left}
                      noFilter={cell.column.settings.noFilter}
                      items={enumProvider.getEnumItems(enumName)}
                      selectedItem={enumProvider.getEnumItem(enumName, cellValue)}
                      onChange={async (sender, item: SelectListItem, userInteraction: boolean) => await this.onEnumCellChangeAsync(cell, item, userInteraction)}
            />
        );
    }

    private renderDropdownCellContent(cell: CellModel<TItem>): React.ReactNode {
        return (
            <DropdownCell cell={cell} />
        );
    }

    private renderAction(cell: CellModel<TItem>, action: ColumnAction<TItem>, cellAction: CellAction<TItem>, index: number): React.ReactNode {

        if (action.render) {
            return action.render(cell, cellAction);
        }

        return (
            <CellActionComponent key={index} cell={cell} cellAction={cellAction} />
        );
    }

    private renderActions(cell: CellModel<TItem>): React.ReactNode {
        const cellActions: CellAction<TItem>[] = cell.actions;

        return (
            <React.Fragment>
                {
                    (cellActions.length > 0) &&
                    (
                        <div className={this.css(gridStyles.actions)}>
                            {
                                cellActions.map((cellAction, index) => this.renderAction(cell, cellAction.action, cellAction, index))
                            }
                        </div>
                    )
                }
            </React.Fragment>
        )
    }

    private get cellPaddingClassName(): string {
        const cellPadding = this.grid.cellPadding;

        switch (cellPadding) {
            case CellPaddingType.Small:
                return gridStyles.paddingSmall;
            case CellPaddingType.Medium:
                return gridStyles.paddingMedium;
            default:
                return gridStyles.paddingLarge;
        }
    }

    public get cell(): CellModel<TItem> {
        return this.props.cell;
    }

    public get column(): ColumnModel<TItem> {
        return this.cell.column;
    }

    public get grid(): GridModel<TItem> {
        return this.column.grid;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        this.props.cell.inputContentInstance = this._inputRef.current;
    }

    render(): React.ReactNode {
        
        const cell: CellModel<TItem> = this.props.cell;
        const column: ColumnModel<TItem> = cell.column;
        const settings: ColumnSettings<TItem> = column.settings;

        let cellContent: React.ReactNode | null = null;
        let cellValue: any = null;
        let cellStyle: string = "";
        let editable: boolean = column.editable;

        cell.instance = this;

        if (column.accessor) {
            cellValue = (typeof column.accessor === "string")
                ? (column.accessor === "#")
                    ? cell.row.position
                    : Utility.findValueByAccessor(cell.model, column.accessor)
                : column.accessor(cell.model);

            cell.value = cellValue;
        }

        cell.route = null;
        if (column.route) {
            if (typeof column.route === "function") {
                const routeCallback = column.route as GridRouteCallback<TItem>;
                cell.route = routeCallback(cell);
            } else {
                cell.route = column.route;
            }
        }

        if (column.init) {
            column.init(cell);
        }

        const format: TFormat | null = column.format;
        const readonly: boolean = cell.isReadonly;
        const deleted: boolean = cell.isDeleted;
        const visible: boolean = cell.visible;

        if (column.render) {
            cellContent = column.render(cell);
        } else if (column.accessor) {

            let rendered: boolean = false;

            if (column.type == ColumnType.Icon) {
                cellStyle = gridStyles.defaultCell;
                cellContent = this.renderIconCellContent(cell, cellValue);
                rendered = true;
                editable = true;
            }

            if ((!readonly) && (!deleted)) {
                switch (column.type) {
                    case ColumnType.Enum:

                        if (!format)
                            throw Error("Wrong grid declaration. Format property in column definition should contain enum type name for enum cell.");

                        cellStyle = gridStyles.enumCell;
                        const enumName: string = format as string;
                        cellContent = this.renderEnumCellContent(cell, cellValue, enumName);
                        rendered = true;
                        editable = true;
                        break;

                    case ColumnType.Dropdown:
                        cellStyle = gridStyles.enumCell;
                        cellContent = this.renderDropdownCellContent(cell);
                        rendered = true;
                        editable = true;
                        break;

                    case ColumnType.Text:
                        cellStyle = gridStyles.textCell;
                        cellContent = this.renderTextCellContent(cell, cellValue);
                        rendered = true;
                        editable = true;
                        break;

                    case ColumnType.Number:
                        cellStyle = gridStyles.numberCell;
                        cellContent = this.renderNumberCellContent(cell, settings, cellValue);
                        rendered = true;
                        editable = true;
                        break;

                    case ColumnType.Date:
                        cellStyle = gridStyles.dateCell;
                        cellContent = this.renderDateCellContent(cell, settings, cellValue);
                        rendered = true;
                        editable = true;
                        break;

                    case ColumnType.Boolean:
                        cellStyle = gridStyles.booleanCell;
                        cellContent = this.renderBooleanCellContent(cell, cellValue);
                        rendered = true;
                        editable = true;
                        break;

                    case ColumnType.Address:
                        cellStyle = gridStyles.textCell;
                        cellContent = this.renderAddressCellContent(cell, settings,  cellValue);
                        rendered = true;
                        editable = true;
                        break;
                }
            }

            if (!rendered) {
                cellValue = ((settings.hideZero) && (!cellValue))
                    ? ""
                    : (column.transform)
                        ? column.transform(cell, cellValue, format)
                        : Utility.formatValue(cellValue, format);

                cellContent = this.renderDefaultCellContent(cell, settings, cellValue);
                cellStyle = gridStyles.defaultCell;
            }
        }

        const inlineStyles: React.CSSProperties = {
            maxWidth: column.maxWidth || undefined
        };

        let noWrapClass: string | null = null;
        let wordBreakClass: string | null = null;

        if (column.noWrap) {
            inlineStyles.whiteSpace = "nowrap";
            noWrapClass = gridStyles.noWrap;
        }
        if (column.wordBreak) {
            inlineStyles.wordBreak = "break-word";
            wordBreakClass = gridStyles.wordBreak;
        }

        const rowSpan: number | null = cell.calcRowSpan();
        const rowSpanStyle: any = (rowSpan) && gridStyles.rowSpan;
        const noActionsStyle: any = ((!deleted) && (cell.actions.filter(action => action.visible).length === 0)) && (gridStyles.noActions);
        const notValidStyle: any = (editable && !readonly && !cell.valid) && (gridStyles.notValid);
        const cellHoveringStyle: any = ((cell.grid.hovering === GridHoveringType.Cell) || ((cell.grid.hovering === GridHoveringType.EditableCell) && (editable && visible && !readonly && !deleted))) && (gridStyles.cellHovering);
        const deletedStyle: any = (deleted) && (gridStyles.deleted);
        const deletedFirstCellStyle: string = ((deleted) && ((cell.isFirstColumn) || (!cell.prev.isDeleted) || (!cell.prev.equalRowSpan(cell)))) && (gridStyles.firstColumn) || "";
        const deletedLastCellStyle: string = ((deleted) && ((cell.isLastColumn) || (!cell.next.isDeleted) || (!cell.next.equalRowSpan(cell)))) && (gridStyles.lastColumn) || "";

        return (
            (!cell.spanned) &&
            (
                <td id={this.id}
                    className={this.css(rowSpanStyle, column.className, cell.className, cellHoveringStyle, notValidStyle, deletedStyle, deletedFirstCellStyle, deletedLastCellStyle, this.cellPaddingClassName, noWrapClass, wordBreakClass)}
                    style={inlineStyles}
                    rowSpan={rowSpan || undefined}
                >

                    {
                        (visible) &&
                        (
                            <div className={this.css(gridStyles.cell, cellStyle, noActionsStyle, notValidStyle)}>
                                
                                {
                                    (cellContent || this.props.children)
                                }

                                {
                                    this.renderActions(cell)
                                }

                            </div>

                        )
                    }

                </td>
            )
        );
    }
}