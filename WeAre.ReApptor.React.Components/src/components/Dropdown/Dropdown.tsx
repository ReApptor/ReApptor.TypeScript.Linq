import React from "react";
import {FileModel, ISelectListItem, ITransformProvider, ITypeConverter, ServiceProvider, TTypeConverter, TypeConverter, Utility} from "@weare/reapptor-toolkit";
import {BaseInputType, IGlobalClick, IGlobalKeydown, ReactUtility, RenderCallback, StylesUtility, TextAlign} from "@weare/reapptor-react-common";
import BaseInput, {IBaseInputProps, IBaseInputState, ValidatorCallback} from "../BaseInput/BaseInput";
import Icon, {IconSize, IconStyle, IIconProps} from "../Icon/Icon";
import {SelectListGroup, SelectListItem, SelectListSeparator, StatusListItem} from "./SelectListItem";
import Comparator from "../../helpers/Comparator";
import DropdownListItem from "./DropdownListItem/DropdownListItem";
import Button, {ButtonType} from "../Button/Button";
import DropdownLocalizer from "./DropdownLocalizer";

import styles from "./Dropdown.module.scss";
import GridLocalizer from "../Grid/GridLocalizer";

const FILTER_MIN_LENGTH = 6;
const FILTER_MAX_LENGTH = 1000;
const SELECTED_TEXT_FORMAT = 3;
const EXPAND_TOP_PADDING = 150;

export class AmountListItem extends SelectListItem {

    public step: number = 1.0;

    public amount: number = 0.0;

    public isAmountListItem: true = true;

    public get amountValue(): string {
        return (this.step >= 1)
            ? Utility.format(`{0:0}`, this.amount)
            : Utility.format(`{0:0.0}`, this.amount)
    }
}

export enum DropdownSchema {
    Default,

    Widget,

    Transparent
}

export enum DropdownType {
    Dropdown = "dropdown",

    List = "list"
}

export enum DropdownOrderBy {
    Name,

    Value,

    None
}

export enum DropdownAlign {
    Right = 0,

    Left = 1
}

export enum DropdownVerticalAlign {
    Bottom = 0,

    Top = 1,

    Auto = 2
}

export enum DropdownSelectType {
    Background,

    Checkbox
}

export enum DropdownSubtextType {
    Row,

    Inline,

    Hidden
}

export enum DropdownRequiredType {
    /**
     * No auto selection. User can un-select required item.
     */
    Manual,

    /**
     * No auto selection. User cannot un-select required item.
     */
    Restricted,


    /**
     * First item will be selected automatically. User cannot un-select required item.
     */
    AutoSelect,
}

export type DropdownValue = string | string[] | null;

export type DropdownMaxWidthCallback = () => number | string | undefined;

export interface IDropdownProps<TItem = {}> extends IBaseInputProps<DropdownValue> {
    type?: DropdownType;
    styleSchema?: DropdownSchema;
    maxHeight?: number | string | DropdownMaxWidthCallback;
    expanded?: boolean,
    disabled?: boolean;
    multiple?: boolean;
    required?: boolean;
    requiredType?: DropdownRequiredType;
    favorite?: boolean;
    groupSelected?: boolean;
    toggleButtonId?: string;
    toggleIcon?: string | IIconProps | false;
    noWrap?: boolean;
    orderBy?: DropdownOrderBy;
    items: TItem[];
    selectedItem?: TItem | string | number;
    selectedItems?: TItem[] | string[] | number[];
    selectType?: DropdownSelectType;
    align?: DropdownAlign;
    verticalAlign?: DropdownVerticalAlign;
    textAlign?: TextAlign;
    filterMinLength?: number;
    filterMaxLength?: number;
    noFilter?: boolean;

    /**
     * Focuses filter search input on expanding for mobile application or disable for desktop. 
     */
    filterAutoFocus?: boolean;
    minWidth?: number | string;
    autoCollapse?: boolean;
    small?: boolean;
    noSubtext?: boolean;
    noGrouping?: boolean;
    subtextType?: DropdownSubtextType;
    nothingSelectedText?: string;
    multipleSelectedText?: string;
    selectedTextFormat?: boolean | number;
    noDataText?: string;
    absoluteListItems?: boolean;
    addButton?: boolean | string | RenderCallback;
    
    /**
     * The 'X' button in the select item to unselect the selected element(s) (only if the 'required' property is false)
     */
    clearButton?: boolean;
    
    transform?(item: TItem): SelectListItem;
    selectedTextTransform?(sender: Dropdown<TItem>): string;
    onChange?(sender: Dropdown<TItem>, item: TItem | null, userInteraction: boolean): Promise<void>;
    onChangeAmount?(sender: Dropdown<TItem>, item: TItem | null, amount: number): Promise<void>;
    onFavoriteChange?(sender: Dropdown<TItem>, item: TItem | null, favorite: boolean): Promise<void>;
    onToggle?(sender: Dropdown<TItem>, expanded: boolean): Promise<void>;
    onAdd?(sender: Dropdown<TItem>): Promise<void>;
    onItemsChange?(sender: Dropdown<TItem>): Promise<void>;
    onItemClick?(sender: Dropdown<TItem>, item: TItem): Promise<void>;
}

export interface IDropdownState extends IBaseInputState<DropdownValue> {
    items: SelectListItem[];
    filteredItems: SelectListItem[],
    expanded: boolean;
    availableHeight: number;
}

export interface IDropdown<TItem = {}> {
    listItems: SelectListItem[];
    selectedListItems: SelectListItem[];
    selectedListItem: SelectListItem | null;
    items: TItem[];
    selectedItems: TItem[];
    selectedItem: TItem | null;
    selectedValues: string[];
    selectedValue: string | null;
    find(item: TItem | string | number | null): SelectListItem | null;
    unselectAllAsync(): Promise<void>;
    selectItemAsync(item: TItem | null): Promise<void>;
    selectAsync(itemOrItems: TItem | string | TItem[] | string[] | number[] | null): Promise<void>;
    selectListItemAsync(item: SelectListItem | string | number | null): Promise<void>;
    selectListItemsAsync(items: SelectListItem[] | string[] | number[] | null): Promise<void>;
}

export default class Dropdown<TItem> extends BaseInput<DropdownValue, IDropdownProps<TItem>, IDropdownState> implements IGlobalClick, IGlobalKeydown, IDropdown<TItem> {
    private readonly _filterInputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private readonly _scrollableContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _listContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _itemsListRef: React.RefObject<HTMLDivElement> = React.createRef();

    private _language: string = GridLocalizer.language;
    private _maxHeight: number | string | null = null;
    private _isLongList: boolean = false;
    private _autoScroll: boolean = true;

    state: IDropdownState = {
        items: [],
        filteredItems: [],
        validationError: null,
        readonly: this.props.disabled || false,
        model: {
            value: null
        },
        expanded: (this.props.expanded || false),
        edit: true,
        availableHeight: 0
    };

    private onFilterInputClick(): void {
        const filterAutoFocus: boolean = (this.desktop)
            ? (this.props.filterAutoFocus !== false)
            : (this.props.filterAutoFocus == true);
        if ((filterAutoFocus) && (this._filterInputRef.current)) {
            this._filterInputRef.current.focus();
        }
    }

    private dynamicTransform(item: TItem): SelectListItem {

        if (typeof item === "string") {
            const selectListItem = new SelectListItem(item, item);
            selectListItem.ref = item;
            return selectListItem;
        }

        if (typeof item === "number") {
            const value: string = item.toString();
            const selectListItem = new SelectListItem(value, value);
            selectListItem.ref = item;
            return selectListItem;
        }

        const provider: ITransformProvider | null = ServiceProvider.getService(nameof<ITransformProvider>());

        if (provider != null) {
            const selectListItem = provider.toSelectListItem(item) as SelectListItem;
            selectListItem.ref = item;
            return selectListItem;
        }

        const anyItem = item as any;
        const converter: ITypeConverter | TTypeConverter | null = TypeConverter.getConverter(anyItem, nameof<ISelectListItem>()) ??
                                                                  TypeConverter.getConverter(anyItem, SelectListItem);

        if (converter != null) {
            const selectListItem = (typeof converter === "function")
                ? converter(item)
                : converter.convert(item);
            selectListItem.ref = item;
            return selectListItem;
        }

        const id: any = Utility.findValueByAccessor(item, ["id", "code"]);
        const value: string | null = Utility.findStringValueByAccessor(item, ["value"]);
        const name: string | null = Utility.findStringValueByAccessor(item, ["name", "text", "label"]);
        const subtext: string | null = Utility.findStringValueByAccessor(item, ["subtext", "description"]);
        const favorite: boolean = (Utility.findStringValueByAccessor(item, "favorite") === "true");
        const groupName: string | null = Utility.findStringValueByAccessor(item, ["group", "group.name"]);
        const deleted: any | null = Utility.findValueByAccessor(item, ["delete", "isDeleted"]);
        const completed: any | null = Utility.findValueByAccessor(item, ["completed", "isCompleted", "status"]);
        
        const isDeleted: boolean = (deleted === true) || (deleted == "1");
        const hasCompleted = (completed != null) && (
            (typeof completed === "boolean") || (typeof completed === "string") ||
            (completed instanceof FileModel) || (completed.isFileModel) ||
            ((completed as IIconProps).name)
        );

        const selectListItem = ((isDeleted) || (hasCompleted))
            ? new StatusListItem(isDeleted, (completed ?? true))
            : new SelectListItem();

        selectListItem.value = (value)
            ? value
            : (id != null)
                ? id.toString()
                : (name)
                    ? name
                    : Utility.getComponentId();

        selectListItem.text = name ?? "";
        selectListItem.subtext = subtext ?? "";
        selectListItem.favorite = favorite;
        selectListItem.group = (groupName) ? SelectListGroup.create(groupName) : null;
        selectListItem.ref = item;

        return selectListItem;
    }

    private transform(item: TItem): SelectListItem {
        const anyItem = item as any;
        const listItem: SelectListItem = (anyItem.isSelectListSeparator)
            ? anyItem as SelectListSeparator
            : (anyItem.isSelectListItem)
                ? (anyItem as SelectListItem)
                : (this.props.transform)
                    ? this.props.transform(item)
                    : this.dynamicTransform(item);

        if (listItem.ref == null) {
            listItem.ref = item;
        }

        return listItem;
    }

    private noItemsFound(): boolean {
        return (this.filterValue.length > 0) && (!this._isLongList) && (this.filteredItems.every(item => item.favorite));
    }

    private isLongList(items: SelectListItem[] | null = null): boolean {
        items = items || this.state.items;
        return (items.length > this.filterMaxLength);
    }

    private filter(items: SelectListItem[]): SelectListItem[] {

        this._isLongList = this.isLongList(items);

        let filter: string = this.filterValue;
        if (filter) {
            filter = filter.toLowerCase();
            items = items.filter(item =>
                (item.favorite) ||
                (item.lowerText.includes(filter)) ||
                (item.lowerSubtext.includes(filter)) ||
                ((item.group != null) && (item.group.lowerName.includes(filter))));

            this._isLongList = this.isLongList(items);

            if (this._isLongList) {
                items = [];
            }
        } else if (this._isLongList) {
            items = items.filter(item => item.favorite);
        }

        return items;
    }

    private processMaxHeightProp(): void {
        this._maxHeight = null;
        if ((this._itemsListRef.current) && (typeof this.props.maxHeight === "function")) {
            const maxHeight: number | string | undefined = this.getMaxHeightValue();
            if (maxHeight != undefined) {
                this._maxHeight = maxHeight;
                const element = this.JQuery(this._itemsListRef.current);
                element.css("max-height", maxHeight);
            }
        }
    }

    private getMaxHeightValue(): number | string | undefined {
        const filterHeight: number = 42;
        const defaultMaxHeight: number = 316;

        let maxHeight: number | string | undefined;
        const maxHeightProp: string | number | DropdownMaxWidthCallback | undefined = this.props.maxHeight;
        if (maxHeightProp) {
            const maxHeightType: string = typeof maxHeightProp;
            if (maxHeightType === "string") {
                maxHeight = maxHeightProp as string;
            } else if  (maxHeightType === "number") {
                maxHeight = maxHeightProp as number;
            } else if (maxHeightType === "function") {
                maxHeight = (maxHeightProp as DropdownMaxWidthCallback)();
            }
        }
        if ((this.hasFilter) && (maxHeight) && (typeof maxHeight === "number")) {
            maxHeight = (maxHeight as number) - filterHeight;
        }
        return maxHeight || defaultMaxHeight;
    }

    private order(items: SelectListItem[]): SelectListItem[] {

        const groupSelected: boolean = (!!this.props.groupSelected);

        switch (this.orderBy) {
            case DropdownOrderBy.Name:
                items = items.sort((x, y) => SelectListItem.CompareByName(x, y, groupSelected));
                break;

            case DropdownOrderBy.Value:
                items = items.sort((x, y) => SelectListItem.CompareByValue(x, y, groupSelected));
                break;

            case DropdownOrderBy.None:
                if (this.grouping) {
                    items = items.sort((x, y) => SelectListItem.CompareByGroup(x, y, groupSelected));
                }
                break;
        }

        return items;
    }

    private updateModelValue(): void {
        const value: DropdownValue = (this.multiple)
            ? this.selectedListItems
                .filter(item => item.selected)
                .map(item => item.value)
            : (this.selectedListItem != null)
                ? this.selectedListItem.value
                : null;

        if (value !== this.state.model.value) {
            this.state.model.value = value;
        }
    }

    private getVerticalAlign(): DropdownVerticalAlign {
        let align: DropdownVerticalAlign = this.props.verticalAlign ?? DropdownVerticalAlign.Auto;

        if (align !== DropdownVerticalAlign.Auto) {
            return align;
        }

        const dropdownNode: JQuery = this.getNode();

        if (!dropdownNode.length) {
            align = DropdownVerticalAlign.Bottom;
            return align;
        }

        const viewPortHeight: number = window.innerHeight;

        const pageYOffset: number = window.pageYOffset;

        const dropdownNodeTop: number = (dropdownNode.offset()!.top - pageYOffset) + dropdownNode.height()! * 2;

        const listContainer: HTMLDivElement | null = this._listContainerRef.current;

        const listContainerHeight: number = listContainer ? listContainer.clientHeight : 0;

        const availableBottomHeight: number = viewPortHeight - dropdownNodeTop;

        const fitBottom: boolean = availableBottomHeight > listContainerHeight;

        const fitTop: boolean = dropdownNodeTop > listContainerHeight + EXPAND_TOP_PADDING;

        if (fitBottom) {
            align = DropdownVerticalAlign.Bottom;
        } else if (fitTop) {
            align = DropdownVerticalAlign.Top;
        } else {
            align = DropdownVerticalAlign.Bottom;
        }

        return align;
    }

    private getFilteredItems(): SelectListItem[] {
        return (this.props.groupSelected)
            ? this.order(this.state.filteredItems)
            : this.state.filteredItems;
    }

    private getSelectedListItems(items: TItem[]): TItem[] | null {
        if (SelectListItem.is(items)) {
            const selectedListItems: TItem[] = items.where(item => (item as any as SelectListItem).selected);
            return (selectedListItems.length > 0) ? selectedListItems : null;
        }
        return null;
    }

    private getSelectedListItem(items: TItem[]): TItem | null {
        if (SelectListItem.is(items)) {
            return items.find(item => (item as any as SelectListItem).selected) || null;
        }
        return null;
    }

    private hasVisibleGroup(item: SelectListItem): boolean {
        return (this.grouping) && (!item.favorite) && (item.group != null) && (item.group.name.length > 0) && ((!this.groupSelected) || (!item.selected));
    }

    private firstInGroup(item: SelectListItem, index: number, hasVisibleGroup: boolean): boolean {
        if (hasVisibleGroup) {
            const firstGroup: boolean = (index == 0);
            if (firstGroup) {
                return true;
            }
            const previousItem: SelectListItem = this.filteredItems[index - 1];
            const newGroup: boolean = (!SelectListGroup.isEqual(previousItem.group, item.group));
            if (newGroup) {
                return true;
            }
            if (this.favorite) {
                const firstNotFavorite: boolean = previousItem.favorite;
                if (firstNotFavorite) {
                    return true;
                }
            }
            if (this.groupSelected) {
                const firstNotSelected: boolean = previousItem.selected;
                if (firstNotSelected) {
                    return true;
                }
            }
        }
        return false;
    }

    private async invokeOnAddAsync(): Promise<void> {
        if (this.props.onAdd) {
            await this.props.onAdd(this);
        }

        await this.toggleAsync();
    }

    private async invokeOnItemsChangeAsync(): Promise<void> {
        if (this.props.onItemsChange) {
            await this.props.onItemsChange(this);
        }
    }

    private getItem(item: SelectListItem): TItem {
        return (item.selected)
            ? (item.ref != null)
                ? item.ref
                : item
            : null;
    }

    private async invokeOnChangeAsync(item: SelectListItem, userInteraction: boolean): Promise<void> {
        if (this.props.onChange) {

            const selectedItem: TItem = this.getItem(item);

            await this.props.onChange(this, selectedItem, userInteraction);
        }
    }

    private async invokeOnItemClickAsync(item: SelectListItem): Promise<void> {
        if (this.props.onItemClick) {

            const selectedItem: TItem = this.getItem(item);

            await this.props.onItemClick(this, selectedItem);
        }
    }

    private async onListContainerClickAsync(e: React.MouseEvent): Promise<void> {
        e.stopPropagation();
    }

    private async onChangeAmountAsync(item: AmountListItem): Promise<void> {
        if (this.props.onChangeAmount) {
            await this.props.onChangeAmount(this, item.ref, item.amount);
        }
    }

    private async selectDefaultAsync(): Promise<void> {
        const autoSelect: boolean = (this.requiredType == DropdownRequiredType.AutoSelect);
        if (autoSelect) {
            const items: SelectListItem[] = this.state.items;
            if (items.length > 0) {
                const unselected: boolean = items.every(item => !item.selected);
                if (unselected) {
                    const firstItem: SelectListItem = items[0];
                    await this.invokeSelectListItemAsync(firstItem, false);
                }
            }
        }
    }

    private async selectItemHandlerAsync(item: SelectListItem): Promise<void> {

        const autoCollapse: boolean = this.autoCollapse;

        if (this.multiple) {
            
            const restricted: boolean = (item.selected) && (this.requiredType != DropdownRequiredType.Manual) && (this.selectedItems.length === 1);

            let expanded: boolean = this.expanded;

            if (!restricted) {
                item.selected = !item.selected;

                this.updateModelValue();
            }

            if ((expanded) && (autoCollapse)) {
                expanded = false;

                if (this.props.onToggle) {
                    await this.props.onToggle(this, expanded);
                }
            }

            if (this.isMounted) {

                const filteredItems: SelectListItem[] = this.getFilteredItems();

                await this.setState({filteredItems, expanded});

                await this.invokeOnChangeAsync(item, true);
            }

        } else {

            const unselectable: boolean = (this.requiredType == DropdownRequiredType.Manual);

            if (!item.selected) {

                this.selectedListItems.map(item => item.selected = false);

                item.selected = true;

                this.updateModelValue();

                let expanded: boolean = this.expanded;

                if (autoCollapse) {
                    expanded = false;

                    if (this.props.onToggle) {
                        await this.props.onToggle(this, expanded);
                    }
                }

                if (this.isMounted) {

                    this.updateModelValue();

                    const filteredItems: SelectListItem[] = this.getFilteredItems();

                    await this.setState({filteredItems, expanded});

                    await this.invokeOnChangeAsync(item, true);
                }

            } else if (unselectable) {

                this.selectedListItems.map(item => item.selected = false);

                item.selected = false;

                let expanded: boolean = this.expanded;

                if (autoCollapse) {
                    expanded = false;

                    if (this.props.onToggle) {
                        await this.props.onToggle(this, expanded);
                    }
                }

                if (this.isMounted) {

                    this.updateModelValue();

                    const filteredItems: SelectListItem[] = this.getFilteredItems();

                    await this.setState({filteredItems, expanded});

                    await this.invokeOnChangeAsync(item, true);
                }

            } else {

                if (autoCollapse) {
                    await this.collapseAsync();
                }

            }
        }

        await this.invokeOnItemClickAsync(item);
    }

    private async clearSelectedAsync(): Promise<void> {
        return this.unselectAllAsync();
    }

    private async cleanFilterAsync(): Promise<void> {
        this._filterInputRef.current!.value = "";
        await this.filterHandlerAsync();
    }
    
    private async initializeItemsAsync(items: TItem[], selectedItem: TItem | string | number | null | undefined, selectedItems: TItem[] | string[] | number[] | null | undefined): Promise<void> {

        const prevSelectedItem: SelectListItem | null = this.selectedListItem;

        const selectItems: SelectListItem[] = items.map(item => this.transform(item));

        let filteredItems: SelectListItem[] = this.filter(selectItems);

        filteredItems = this.order(filteredItems);

        await this.setState({items: selectItems, filteredItems: filteredItems});

        if ((this.multiple) && (selectedItems != null)) {
            await this.invokeSelectAsync(selectedItems, false);
        } else if (selectedItem != null) {
            await this.invokeSelectAsync(selectedItem, false);
        }

        await this.selectDefaultAsync();

        this.updateModelValue();

        this.state.validationError = null;

        const newSelectedItem: SelectListItem | null = this.selectedListItem;
        if (newSelectedItem != null) {
            const callback: boolean = (prevSelectedItem == null) || (prevSelectedItem.value != newSelectedItem.value);
            if (callback) {
                await this.invokeOnChangeAsync(newSelectedItem, false);
            }
        }

        await this.invokeOnItemsChangeAsync();
    }

    private async invokeSelectListItemsAsync(items: SelectListItem[] | string[] | number[] | null, callback: boolean): Promise<void> {

        if ((this.multiple) && (items != null)) {

            const itemValues = new Set<string>();
            for (let i: number = 0; i < items.length; i++) {
                const item: SelectListItem | string | number = items[i];

                const value: string = (typeof item === "string")
                    ? item
                    : (typeof item === "number")
                        ? item.toString()
                        : item.value;

                if (!itemValues.has(value)) {
                    itemValues.add(value);
                }
            }

            const listItems: SelectListItem[] = this.listItems;
            const updated: SelectListItem[] = [];

            for (let i: number = 0; i < listItems.length; i++) {
                const listItem: SelectListItem = listItems[i];
                const selected: boolean = itemValues.has(listItem.value);

                if (listItem.selected !== selected) {

                    updated.push(listItem);

                    listItem.selected = selected;
                }
            }

            if (updated) {

                this.updateModelValue();

                if (callback) {
                    for (let i: number = 0; i < updated.length; i++) {
                        await this.invokeOnChangeAsync(updated[i], false);
                    }
                }

                if (this.isMounted) {
                    const filteredItems: SelectListItem[] = this.getFilteredItems();

                    await this.setState({filteredItems});
                }
            }
        }
    }

    private async invokeSelectAsync(itemOrItems: TItem | string | number | TItem[] | string[] | number[] | null, callback: boolean): Promise<void> {
        if (itemOrItems != null) {

            if (Array.isArray(itemOrItems)) {

                const listItems: SelectListItem[] = [];
                for (let i: number = 0; i < itemOrItems.length; i++) {
                    const listItem: SelectListItem | null = this.find(itemOrItems[i]);
                    if (listItem != null) {
                        listItems.push(listItem);
                    }
                }

                await this.invokeSelectListItemsAsync(listItems, callback);

            } else {

                const listItem: SelectListItem | null = this.find(itemOrItems);
                await this.invokeSelectListItemAsync(listItem, callback);

            }
        }
    }

    private async invokeSelectListItemAsync(item: SelectListItem | string | number | null, callback: boolean): Promise<void> {
        if (item != null) {

            const itemValue: string = (typeof item === "string")
                ? item
                : (typeof item === "number")
                    ? item.toString()
                    : item.value;

            const listItem: SelectListItem | null = this.find(itemValue);

            if ((listItem != null) && (!listItem.selected)) {

                if (!this.multiple) {
                    this.selectedListItems.map(item => item.selected = false);
                }

                listItem.selected = true;

                this.updateModelValue();

                if (callback) {
                    await this.invokeOnChangeAsync(listItem, false);
                }

                if (this.isMounted) {
                    const filteredItems: SelectListItem[] = this.getFilteredItems();

                    await this.setState({filteredItems});
                }
            }
        } else if ((!this.multiple) && (this.selectedListItem != null)) {

            const listItem: SelectListItem = this.selectedListItem;

            listItem.selected = false;

            this.updateModelValue();

            if (callback) {
                await this.invokeOnChangeAsync(listItem, false);
            }

            if (this.isMounted) {
                const filteredItems: SelectListItem[] = this.getFilteredItems();

                await this.setState({filteredItems});
            }
        }
    }

    private async favoriteItemHandlerAsync(e: React.MouseEvent, item: SelectListItem): Promise<void> {

        e.stopPropagation();

        if (this.favorite) {
            item.favorite = !item.favorite;

            if (this.props.onFavoriteChange) {
                await this.props.onFavoriteChange(this, item.ref, item.favorite);
            }

            const filteredItems: SelectListItem[] = this.order(this.state.filteredItems);

            await this.setState({filteredItems});
        }
    }

    private async filterHandlerAsync(): Promise<void> {

        let filteredItems: SelectListItem[] = this.filter(this.listItems);

        filteredItems = this.order(filteredItems);

        await this.setState({filteredItems});
    }

    protected get filterValue(): string {
        return (this._filterInputRef.current != null) ? this._filterInputRef.current.value : "";
    }

    protected get filteredItems(): SelectListItem[] {
        return this.state.filteredItems;
    }

    protected get isListType(): boolean {
        return (this.props.type === DropdownType.List);
    }

    protected get isDropdownType(): boolean {
        return (!this.isListType);
    }

    protected get styleSchema(): DropdownSchema {
        return (this.props.styleSchema) || DropdownSchema.Default;
    }

    protected getType(): BaseInputType {
        return BaseInputType.Dropdown;
    }

    protected ignoreValueProps(): boolean {
        return true;
    }

    public get autoCollapse(): boolean {
        return (this.isListType)
            ? false
            : (this.props.autoCollapse != null)
                ? this.props.autoCollapse
                : (!this.multiple)
    }

    public get multiple(): boolean {
        return (this.props.multiple || false);
    }

    public get required(): boolean {
        return this.props.required || false;
    }

    public get requiredType(): DropdownRequiredType {
        return (this.required)
            ? (this.props.requiredType != null)
                ? this.props.requiredType
                : DropdownRequiredType.AutoSelect
            : DropdownRequiredType.Manual;
    }

    public get clearButton(): boolean {
        return (this.props.clearButton === true) && (this.requiredType == DropdownRequiredType.Manual);
    }

    public get favorite(): boolean {
        return (this.props.favorite || false);
    }

    public get grouping(): boolean {
        return (this.props.noGrouping != true);
    }

    public get groupSelected(): boolean {
        return (this.props.groupSelected || false);
    }

    public get expanded(): boolean {
        return this.state.expanded;
    }

    public get collapsed(): boolean {
        return !this.expanded;
    }

    public get orderBy(): DropdownOrderBy {
        return this.props.orderBy || DropdownOrderBy.Name;
    }

    public getValidators(): ValidatorCallback<DropdownValue>[] {
        return [];
    }

    public get listItems(): SelectListItem[] {
        return this.state.items;
    }

    public get selectedListItems(): SelectListItem[] {
        const items: SelectListItem[] = this.state.items.filter(item => item.selected);

        //If no items (data) yet, return props.selectedItems if it is specified
        if ((this.multiple) && (items.length == 0) && (this.listItems.length === 0)) {
            const selectedItems: TItem[] | string[] | number[] | null = this.props.selectedItems || null;
            if ((selectedItems) && (typeof selectedItems[0] === "object")) {
                return (selectedItems as TItem[]).map(item => this.transform(item));
            }
        }

        return items;
    }

    public get selectedListItem(): SelectListItem | null {
        if (this.multiple) {
            return null;
        }

        const items: SelectListItem[] = this.selectedListItems;

        if (items.length >= 1) {
            return items[0];
        }

        //If no items (data) yet, return props.selectedItem if it is specified
        if (this.listItems.length === 0) {
            const selectedItem: TItem | string | number | null = this.props.selectedItem || null;
            if ((selectedItem != null) && (typeof selectedItem === "object")) {
                return this.transform(selectedItem);
            }

            return null;
        }

        return null;
    }

    public get items(): TItem[] {
        return this.listItems.map(item => item.ref!);
    }

    public get selectedItems(): TItem[] {
        return this.selectedListItems.map(item => item.ref!);
    }

    public get selectedValues(): string[] {
        return this.selectedListItems.map(item => item.value);
    }

    public get selectedItem(): TItem | null {
        const selectedListItem: SelectListItem | null = this.selectedListItem;
        return selectedListItem ? selectedListItem.ref : null;
    }

    public get selectedValue(): string | null {
        const selectedListItem: SelectListItem | null = this.selectedListItem;
        return selectedListItem ? selectedListItem.value : null;
    }

    public get align(): DropdownAlign {
        return this.props.align || DropdownAlign.Right;
    }

    public get filterMinLength(): number {
        return this.props.filterMinLength || FILTER_MIN_LENGTH;
    }

    public get filterMaxLength(): number {
        return this.props.filterMaxLength || FILTER_MAX_LENGTH;
    }

    public get hasFilter(): boolean {
        return (!this.props.noFilter) && (this.listItems.length >= this.filterMinLength);
    }

    public get hasAddButton(): boolean {
        return (!!this.props.addButton);
    }

    public get disabled(): boolean {
        return this.readonly;
    }

    public get selectType(): DropdownSelectType {
        return this.props.selectType || DropdownSelectType.Background;
    }

    public get subtextType(): DropdownSubtextType {
        return this.props.subtextType || DropdownSubtextType.Row;
    }

    public get selectedTextFormat(): number | null {
        return (this.props.selectedTextFormat)
            ? (typeof this.props.selectedTextFormat === "number")
                ? this.props.selectedTextFormat
                : SELECTED_TEXT_FORMAT
            : null;
    }

    public get noSubtext(): boolean {
        return (this.props.noSubtext === true);
    }
    
    public get hasSelected(): boolean {
        return (this.multiple)
            ? (this.selectedListItems.length > 0)
            : (this.selectedListItem != null);
    }

    public async unselectAllAsync(): Promise<void> {
        if ((this.multiple) && (this.selectedListItems.length > 0)) {
            await this.invokeSelectListItemsAsync([], true);
        } else if (this.selectedListItem) {
            await this.invokeSelectListItemAsync(null, true);
        }
    }

    public async selectItemAsync(item: TItem | null): Promise<void> {
        const listItem: SelectListItem | null = (item != null) ? this.transform(item) : null;
        await this.invokeSelectListItemAsync(listItem, true);
    }

    public async selectAsync(itemOrItems: TItem | string | TItem[] | string[] | null): Promise<void> {
        await this.invokeSelectAsync(itemOrItems, true);
    }

    public async selectListItemAsync(item: SelectListItem | string | number | null): Promise<void> {
        await this.invokeSelectListItemAsync(item, true);
    }

    public async selectListItemsAsync(items: SelectListItem[] | string[] | number[] | null): Promise<void> {
        await this.invokeSelectListItemsAsync(items, true);
    }

    public async selectFirstAsync(): Promise<void> {
        if (this.listItems.length > 0) {
            await this.invokeSelectListItemAsync(this.listItems[0], true);
        }
    }

    public async initializeAsync(): Promise<void> {
        await this.initializeItemsAsync(this.props.items, this.props.selectedItem, this.props.selectedItems);
    }

    public async componentWillReceiveProps(nextProps: IDropdownProps<TItem>): Promise<void> {

        const props: IDropdownProps<TItem> = this.props;

        const newExpanded: boolean = (props.expanded !== nextProps.expanded);
        const newDisabled: boolean = (props.disabled !== nextProps.disabled);
        const newGroupSelected: boolean = (props.groupSelected !== nextProps.groupSelected);
        const newFavorite: boolean = (props.favorite !== nextProps.favorite);
        const newRequired: boolean = (props.required !== nextProps.required);
        const newItems: boolean = (!Comparator.isEqual(props.items, nextProps.items));
        const newSelectedListItem: boolean = (!Comparator.isEqual(props.selectedItem, nextProps.selectedItem));
        const newSelectedListItems: boolean = (!Comparator.isEqual(props.selectedItems, nextProps.selectedItems));
        const newLanguage: boolean = (this._language !== DropdownLocalizer.language);

        await super.componentWillReceiveProps(nextProps);

        if ((newExpanded) || (newDisabled) || (newLanguage)) {
            this.state.expanded = nextProps.expanded || false;
            this.state.readonly = nextProps.disabled || false;
            this._language = DropdownLocalizer.language;

            await this.setState(this.state);
        }
        
        if ((newItems) || (newSelectedListItem) || (newSelectedListItems) || (newGroupSelected) || (newFavorite) || (newRequired)) {

            const selectedItem: TItem | string | number | null | undefined = (newSelectedListItem)
                ? nextProps.selectedItem
                : (nextProps.selectedItem || this.getSelectedListItem(nextProps.items) || this.selectedItem);

            const selectedItems: TItem[] | string[] | number[] | null | undefined = (newSelectedListItems)
                ? nextProps.selectedItems
                : (nextProps.selectedItems || this.getSelectedListItems(nextProps.items) || this.selectedItems);

            await this.initializeItemsAsync(nextProps.items, selectedItem, selectedItems);
        }
    }

    public async componentDidUpdate(): Promise<void> {
        this.processMaxHeightProp();
    }

    public async toggleAsync(): Promise<void> {

        const expanded: boolean = !this.state.expanded;

        if (this.props.onToggle) {
            await this.props.onToggle(this, expanded);
        }

        if (this.isMounted) {
            await this.setState({expanded});

            if (expanded) {

                if (this._autoScroll) {
                    this._autoScroll = false;
                    await this.scrollToSelected(false);
                }

                this.onFilterInputClick();
            }
        }
    }

    public async collapseAsync(): Promise<void> {
        if (this.state.expanded) {
            await this.toggleAsync();
        }
    }

    public async expandAsync(): Promise<void> {
        if (!this.state.expanded) {
            await this.toggleAsync();
        }
    }

    public async reRenderAsync(): Promise<void> {
        await this.initializeItemsAsync(this.props.items, this.props.selectedItem, this.props.selectedItems);
    }

    public reRender(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reRenderAsync();
    }

    public find(item: TItem | string | number | null): SelectListItem | null {
        if ((item != null) && (this.listItems)) {

            const itemValue: string = (typeof item === "string")
                ? item
                : (typeof item === "number")
                    ? item.toString()
                    : this.transform(item).value;

            if (itemValue) {
                return this.listItems.find(item => item.value === itemValue) || null;
            }
        }

        return null;
    }

    public scrollToSelected(smooth: boolean = false): void {
        if (this.expanded) {
            const maxHeightIsLimited: boolean = (!!this._maxHeight);
            const scrollableContainerElement: Element | null = (maxHeightIsLimited)
                ? this._itemsListRef.current
                : this._scrollableContainerRef.current;
            if (scrollableContainerElement) {
                const selectedListItem: SelectListItem | null = this.selectedListItem;
                if (selectedListItem) {
                    const selectedItemElement: any = scrollableContainerElement.querySelector(`.${styles.selectedItem}`);
                    if (selectedItemElement) {
                        const scrollableContainerHeight: number = this.JQuery(scrollableContainerElement).height() || 0;
                        const top: number = selectedItemElement.offsetTop;
                        if (top > scrollableContainerHeight) {
                            const behavior: ScrollBehavior = (smooth) ? "smooth" : "auto";
                            scrollableContainerElement.scrollTo({top, behavior});
                        }
                    }
                }
            }
        }
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        if ((this.isDropdownType) && (this.expanded)) {
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id, this.props.toggleButtonId);

            if (outside) {
                await this.collapseAsync();
            }
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if (this.props.type !== DropdownType.List) {
            if (e.keyCode === 27) {
                await this.collapseAsync()
            }
        }
    }

    private renderToggleButton(): React.ReactNode {
        let iconProps: IIconProps = { name: "fa-caret-down", style: IconStyle.Solid }

        if (this.styleSchema === DropdownSchema.Widget) {
            iconProps.name = "fa-bars";
            iconProps.size = IconSize.ExtraSmall;
        } else if (this.props.toggleIcon) {
            if (typeof this.props.toggleIcon == "string") {
                iconProps.name = this.props.toggleIcon
            } else {
                iconProps = this.props.toggleIcon;
            }
        }

        return (
            <div className={styles.toggleButton}>
                <Icon {...iconProps} size={IconSize.Normal} />
            </div>
        );
    }

    private renderClearIcon(): React.ReactNode {
        return (
            <div className={this.css(styles.clearButton)}>
                <Icon stopPropagation
                      name="fa fa-times"
                      size={IconSize.Normal}
                      onClick={() => this.clearSelectedAsync()}
                />
            </div>
        );
    }

    private renderToggleContainer(toggleButtonVisible: boolean, clearButtonVisible: boolean, className?: string): React.ReactNode {

        return (
            <div className={this.css(styles.toggleButtonContainer, className)}>
                
                { (clearButtonVisible) && (this.renderClearIcon()) }

                { (toggleButtonVisible) && (this.renderToggleButton()) }
                
            </div>
        );
    }

    private renderAddButton(): React.ReactNode {
        const addButton: boolean | string | RenderCallback = this.props.addButton!;

        let text: string;
        if (typeof addButton === "function") {
            const render: React.ReactNode | string = addButton(this);
            // noinspection SuspiciousTypeOfGuard
            if (typeof render !== "string") {
                return render;
            }
            text = render;
        } else if (typeof addButton === "string") {
            text = DropdownLocalizer.get(addButton)
        } else {
            text = DropdownLocalizer.add
        }

        return (
            <div className={styles.addButton} onClick={() => this.invokeOnAddAsync()}>
                <Button type={ButtonType.Orange}
                        icon={{name: "fas plus"}}
                />
                <span>{text}</span>
            </div>
        );
    }

    private renderSelectedItem(): React.ReactNode {

        const toggleButtonVisible: boolean = (this.props.toggleIcon !== false);
        const clearButtonVisible: boolean = (this.clearButton) && (this.hasSelected);

        const expandedStyle = ((this.styleSchema === DropdownSchema.Widget) && (this.state.expanded)) && (this.css(styles.hovered, styles.focused));
        const transparentStyle: any = (this.styleSchema === DropdownSchema.Transparent) && (styles.transparent);
        const toggleButtonVisibleStyle: any = (toggleButtonVisible) && (styles.toggleButtonVisible);
        const clearButtonVisibleStyle: any = (clearButtonVisible) && (styles.clearButtonVisible);

        const inlineStyles: React.CSSProperties = {};
        if (this.props.textAlign) {
            inlineStyles.textAlign = StylesUtility.textAlign(this.props.textAlign);
            inlineStyles.width = "100%";
        }

        const noSubtext: boolean = this.noSubtext;
        const selectedListItem: SelectListItem | null = this.selectedListItem;

        const title: string = (selectedListItem !== null) && (noSubtext)
            ? DropdownLocalizer.get(selectedListItem.subtext)
            : "";

        let text: string = (this.props.selectedTextTransform)
            ? this.props.selectedTextTransform(this)
            : "";

        if (!text) {
            text = (selectedListItem !== null)
                ? (noSubtext)
                    ? DropdownLocalizer.get(selectedListItem.text)
                    : `${DropdownLocalizer.get(selectedListItem.text)} <small>${DropdownLocalizer.get(selectedListItem.subtext)}</small>`
                : (this.selectedListItems.length !== 0)
                    ? (this.props.multipleSelectedText)
                        ? DropdownLocalizer.multipleSelected
                        : ((this.selectedTextFormat) && (this.selectedListItems.length <= this.selectedTextFormat))
                            ? (noSubtext)
                                ? this.selectedListItems.take(this.selectedTextFormat).map(item => DropdownLocalizer.get(item.text)).join(", ")
                                : this.selectedListItems.take(this.selectedTextFormat).map(item => (item.subtext) ? `${DropdownLocalizer.get(item.text)} <small>${DropdownLocalizer.get(item.subtext)}</small>` : DropdownLocalizer.get(item.text)).join(", ")
                            : DropdownLocalizer.get(DropdownLocalizer.multipleSelected, this.selectedListItems.length)
                    : (this.props.nothingSelectedText)
                        ? DropdownLocalizer.get(this.props.nothingSelectedText)
                        : DropdownLocalizer.nothingSelected;
        }

        return (
            <div className={this.css(styles.selected, "form-control", expandedStyle, transparentStyle, toggleButtonVisibleStyle, clearButtonVisibleStyle, "selected-item")}
                 title={title}
                 onClick={() => this.toggleAsync()}>

                <span style={inlineStyles}>{ReactUtility.toTags(text)}</span>
                
                {
                    this.renderToggleContainer(toggleButtonVisible, clearButtonVisible, transparentStyle)
                }

            </div>
        );
    }

    private renderSelectListItem(item: SelectListItem, index: number): React.ReactNode {
        const isSeparator: boolean = (item as any).isSelectListSeparator;
        const isListItem: boolean = (!isSeparator);
        const hasVisibleGroup: boolean = (isListItem) && (this.hasVisibleGroup(item));
        const needGroupSeparator: boolean = (isListItem) && (this.firstInGroup(item, index, hasVisibleGroup));
        const selected: boolean = (isListItem) && (item.selected);
        const favorite: boolean = (isListItem) && (this.props.favorite === true);
        const checkbox: boolean = (isListItem) && (this.selectType == DropdownSelectType.Checkbox);

        const listItemStyle: any = ((this.isListType) && (this.props.styleSchema !== DropdownSchema.Widget)) && styles.listItem;
        const inlineSubtextStyle: any = (this.subtextType == DropdownSubtextType.Inline) && styles.inlineSubtext;
        const selectedStyle: any = ((selected) && (!checkbox)) && styles.selectedItem;
        
        const customClassName: string | null = ((isListItem) && ((item as any).isStatusListItem))
            ? (item as StatusListItem).className
            : null;

        return (
            <React.Fragment key={index}>

                {
                    (needGroupSeparator) &&
                    (
                        <React.Fragment>
                            <React.Fragment>
                                {
                                    (index > 0) &&
                                    (
                                        <hr className={styles.groupSeparator} />
                                    )
                                }
                            </React.Fragment>
                            <React.Fragment>
                                {
                                    (hasVisibleGroup) &&
                                    (
                                        <div className={this.css(styles.item, styles.group)}>
                                            <div>
                                                <span>{DropdownLocalizer.get(item.group!.name)}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </React.Fragment>
                        </React.Fragment>
                    )
                }

                {
                    (!isSeparator)
                        ?
                        (
                            <div className={this.css(styles.item, customClassName, listItemStyle, inlineSubtextStyle, selectedStyle, hasVisibleGroup && styles.itemGroupIdent)}
                                 onClick={() => this.selectItemHandlerAsync(item)}>

                                {
                                    (favorite) &&
                                    (
                                        <div className={styles.iconContainer} onClick={(e: React.MouseEvent) => this.favoriteItemHandlerAsync(e, item)}>
                                            <Icon name="star" style={(item.favorite) ? IconStyle.Solid : IconStyle.Regular} size={IconSize.Large} />
                                        </div>
                                    )
                                }

                                <DropdownListItem item={item}
                                                  subtextHidden={this.subtextType == DropdownSubtextType.Hidden}
                                                  noWrap={this.props.noWrap}
                                                  onChangeAmount={(sender, item) => this.onChangeAmountAsync(item)}
                                />

                                {
                                    (checkbox) &&
                                    (
                                        <div className={styles.checkbox}>
                                            <Icon name="fas check" size={IconSize.Large} customStyle={{ visibility: !selected ? "hidden" : undefined}} />
                                        </div>
                                    )
                                }

                            </div>
                        )
                        :
                        (
                            <hr className={styles.groupSeparator} />
                        )
                }

            </React.Fragment>
        );
    }

    public renderInput(): React.ReactNode {

        const hasItems: boolean = (this.listItems.length > 0);

        const alignStyle = (this.align === DropdownAlign.Left) && styles.alignLeft;
        const verticalAlignStyle = (this.getVerticalAlign() === DropdownVerticalAlign.Top) ? `${styles.alignTop} alignTop` : styles.alignBottom;
        const toggleStyle = (this.state.expanded) ? this.css(styles.itemsContainer, styles.opened, alignStyle, verticalAlignStyle) : styles.itemsContainer;
        const dropdownStyle = (this.isDropdownType) ? styles.dropdown : styles.list;
        const dropdownWidgetStyle = (this.styleSchema === DropdownSchema.Widget && this.isDropdownType) && styles.dropdownWidget;
        const transparentStyle: any = (this.styleSchema === DropdownSchema.Transparent) && styles.transparent;
        const noWrapStyle: any = (this.props.noWrap) && styles.noWrap;
        const smallStyle: any = (this.props.small) && styles.small;

        const inlineStyles: React.CSSProperties = {};
        if (this.props.minWidth) {
            inlineStyles.minWidth = this.props.minWidth;
        }

        const longListPlaceholder: string = (this.isLongList())
            ? DropdownLocalizer.getResults
            : DropdownLocalizer.filterResults;

        const noDataText: string = (this.props.noDataText)
            ? DropdownLocalizer.get(this.props.noDataText)
            : DropdownLocalizer.noData;

        const maxHeight: string | number | undefined = this.getMaxHeightValue();

        const scrollableContainerInlineStyles: React.CSSProperties = {
            maxHeight: maxHeight
        };

        const itemsListInlineStyles: React.CSSProperties = {
            position: this.props.absoluteListItems ? "absolute" : "unset"
        };

        return (
            <div className={this.css(dropdownStyle, dropdownWidgetStyle, transparentStyle, smallStyle, this.disabled && styles.disabled, "dropdown-container")} style={inlineStyles}>

                {
                    (this.isDropdownType && this.styleSchema !== DropdownSchema.Widget) && this.renderSelectedItem()
                }

                <div className={toggleStyle}  ref={this._listContainerRef} onClick={(e: React.MouseEvent) => this.onListContainerClickAsync(e)}>

                    {
                        (this.hasAddButton) &&
                        (
                            this.renderAddButton()
                        )
                    }

                    {
                        (this.hasFilter) &&
                        (
                            <div className={styles.filter} onClick={async () => this.onFilterInputClick()}>

                                <input id={"filter_input" + this.id}
                                       ref={this._filterInputRef}
                                       className="form-control filter"
                                       type="text"
                                       placeholder={longListPlaceholder}
                                       onKeyUp={() => this.filterHandlerAsync()}
                                />

                                { this.filterValue && <span className={this.css("fa fa-times", styles.clean)} onClick={() => this.cleanFilterAsync()} /> }

                            </div>
                        )
                    }

                    <div className={styles.scrollableContainer} ref={this._scrollableContainerRef} style={scrollableContainerInlineStyles}>

                        {
                            (
                                <div ref={this._itemsListRef} className={styles.itemsList} style={itemsListInlineStyles}>

                                    {
                                        (hasItems)
                                            ?
                                            (
                                                <React.Fragment>

                                                    {this.filteredItems.map((item, index) => this.renderSelectListItem(item, index))}

                                                    {
                                                        (this.noItemsFound()) &&
                                                        (
                                                            <div className={this.css(styles.noResults, noWrapStyle)}><span>{DropdownLocalizer.noItems}</span></div>
                                                        )
                                                    }

                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <div className={this.css(styles.noResults, noWrapStyle)}><span>{noDataText}</span></div>
                                            )
                                    }

                                </div>
                            )
                        }

                    </div>

                </div>

            </div>
        );
    }
}