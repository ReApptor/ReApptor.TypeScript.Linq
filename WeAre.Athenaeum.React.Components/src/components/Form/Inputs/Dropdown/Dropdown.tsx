import React from "react";
import $ from "jquery";
import { ITransformProvider, Utility } from "@weare/athenaeum-toolkit";
import { ComponentHelper, IGlobalClick, IGlobalKeydown, ReactUtility, RenderCallback, StylesUtility, TextAlign } from "@weare/athenaeum-react-common";
import BaseInput, {IBaseInputProps, IBaseInputState, ValidatorCallback} from "../BaseInput";
import Icon, {IconSize, IconStyle, IIconProps} from "../../../Icon/Icon";
import {BaseInputType, DropdownSchema} from "@/models/Enums";
import {SelectListGroup, SelectListItem, SelectListSeparator} from "./SelectListItem";
import Comparator from "../../../../helpers/Comparator";
import DropdownListItem from "./DropdownListItem/DropdownListItem";
import Button, {ButtonType} from "@/components/Button/Button";

import styles from "./Dropdown.module.scss";

const FILTER_MIN_LENGTH = 6;
const FILTER_MAX_LENGTH = 1000;
const SELECTED_TEXT_FORMAT = 3;

export class AmountListItem extends SelectListItem {

    public step: number = 1.0;

    public amount: number = 0.0;

    public isAmountListItem: boolean = true;

    public get amountValue(): string {
        return (this.step >= 1)
            ? Utility.format(`{0:0}`, this.amount)
            : Utility.format(`{0:0.0}`, this.amount)
    }
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
    toggleIcon?: string | IIconProps;
    noWrap?: boolean;
    orderBy?: DropdownOrderBy;
    items: TItem[];
    selectedItem?: TItem | string;
    selectedItems?: TItem[] | string[];
    selectType?: DropdownSelectType;
    align?: DropdownAlign;
    verticalAlign?: DropdownVerticalAlign;
    textAlign?: TextAlign;
    filterMinLength?: number;
    filterMaxLength?: number;
    minWidth?: number | string;
    autoCollapse?: boolean;
    small?: boolean;
    noFilter?: boolean;
    noSubtext?: boolean;
    noGrouping?: boolean;
    subtextType?: DropdownSubtextType;
    nothingSelectedText?: string;
    multipleSelectedText?: string;
    selectedTextFormat?: boolean | number;
    noDataText?: string;
    absoluteListItems?: boolean;
    addButton?: boolean | string | RenderCallback;
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
    find(item: TItem | string | null): SelectListItem | null;
    unselectAllAsync(): Promise<void>;
    selectItemAsync(item: TItem | null): Promise<void>;
    selectAsync(itemOrItems: TItem | string | TItem[] | string[] | null): Promise<void>;
    selectListItemAsync(item: SelectListItem | string | null): Promise<void>;
    selectListItemsAsync(items: SelectListItem[] | string[] | null): Promise<void>;
}

export default class Dropdown<TItem> extends BaseInput<DropdownValue, IDropdownProps<TItem>, IDropdownState> implements IGlobalClick, IGlobalKeydown, IDropdown {
    private readonly _filterInputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private readonly _scrollableContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _itemsListRef: React.RefObject<HTMLDivElement> = React.createRef();

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

    private onFilterInputClickAsync(): void {
        if ((this.desktop) && (this._filterInputRef.current)) {
            this._filterInputRef.current!.focus();
        }
    }
    
    private dynamicTransform(item: TItem): SelectListItem {
        if (typeof item === "number") {
            const listItem = new SelectListItem();
            listItem.value = item.toString();
            listItem.text = item.toString();
            listItem.ref = item;
            return listItem;
        }

        if (typeof item === "string") {
            const listItem = new SelectListItem();
            listItem.value = item;
            listItem.text = item;
            listItem.ref = item;
            return listItem;
        }

        const value: any = Utility.findStringValueByAccessor(item, ["value"]);
        const id: any = Utility.findValueByAccessor(item, ["id", "code"]);
        const name: string | null = Utility.findStringValueByAccessor(item, ["name", "text", "label"]);
        const subtext: string | null = Utility.findStringValueByAccessor(item, ["subtext", "description"]);
        const favorite: boolean = (Utility.findStringValueByAccessor(item, "favorite") === "true");
        const groupName: string | null = Utility.findStringValueByAccessor(item, ["group", "group.name"]);

        const listItem = new SelectListItem();

        listItem.value = (value)
            ? value
            : (id != null)
                ? id.toString()
                : (name)
                    ? name
                    : ComponentHelper.getId().toString();

        if (name) {
            listItem.text = name;
        }

        if (subtext) {
            listItem.subtext = subtext;
        }

        if (groupName) {
            listItem.group = SelectListGroup.create(groupName);
        }

        listItem.favorite = favorite;
        listItem.ref = item;

        return listItem;
    }

    private transform(item: TItem): SelectListItem {

        //const transformProvider: ITransformProvider | null = ServiceProvider.getRequiredService(nameof<ITransformProvider>());
        // const typeConverter: TConverter = ServiceProvider.getRequiredService(nameof<ITransformProvider>());
        
        const listItem: SelectListItem = ((item as any).isSelectListSeparator)
            ? (item as any) as SelectListSeparator
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
                const element = $(this._itemsListRef.current);
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
        this.state.model.value = (this.multiple)
            ? this.selectedListItems
                .filter(item => item.selected)
                .map(item => item.value)
            : (this.selectedListItem != null)
                ? this.selectedListItem.value
                : null;
    }

    private getVerticalAlign(): DropdownVerticalAlign {
        let align: DropdownVerticalAlign = this.props.verticalAlign || DropdownVerticalAlign.Bottom;
        if (align == DropdownVerticalAlign.Auto) {
            if (!this.expandBottom) {
                align = DropdownVerticalAlign.Top;
            }
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
        if ((autoSelect) && (this.state.items.length > 0)) {
            const unselected: boolean = this.state.items.every(item => !item.selected);
            if (unselected) {
                const firstItem: SelectListItem = this.state.items[0];
                await this.invokeSelectListItemAsync(firstItem, false);
            }
        }
    }

    private async selectItemHandler(item: SelectListItem): Promise<void> {

        const autoCollapse: boolean = this.autoCollapse;

        if (this.multiple) {
            item.selected = !item.selected;

            this.updateModelValue();

            let expanded: boolean = this.expanded;

            if (autoCollapse) {
                expanded = false;

                if (this.props.onToggle) {
                    await this.props.onToggle(this, expanded);
                }
            }

            if (this.isMounted) {
                
                const filteredItems: SelectListItem[] = this.getFilteredItems();
                
                await this.setState({items: this.state.items, filteredItems, expanded, model: this.state.model});

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

                    await this.setState({items: this.state.items, filteredItems, expanded, model: this.state.model});

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

                    await this.setState({items: this.state.items, filteredItems, expanded, model: this.state.model});

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

    private async cleanFilterAsync(): Promise<void> {
        this._filterInputRef.current!.value = "";
        await this.filterHandlerAsync();
    }

    private async initializeItemsAsync(items: TItem[], selectedItem: TItem | string | null | undefined, selectedItems: TItem[] | string[] | null | undefined): Promise<void> {
        
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

    private async invokeSelectListItemsAsync(items: SelectListItem[] | string[] | null, callback: boolean): Promise<void> {
        
        if ((this.multiple) && (items != null)) {

            const itemValues = new Set<string>();
            for (let i: number = 0; i < items.length; i++) {
                const item: SelectListItem | string = items[i];
                const value: string = (typeof item === "string")
                    ? item
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

                    await this.setState({items: this.state.items, filteredItems, model: this.state.model});
                }
            }
        }

    }

    private async invokeSelectAsync(itemOrItems: TItem | string | TItem[] | string[] | null, callback: boolean): Promise<void> {
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

    private async invokeSelectListItemAsync(item: SelectListItem | string | null, callback: boolean): Promise<void> {
        if (item != null) {

            const itemValue: string = (typeof item === "string") ? item : item.value;
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

                    await this.setState({items: this.state.items, filteredItems, model: this.state.model});
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

                await this.setState({items: this.state.items, filteredItems, model: this.state.model});
            }
        }
    }

    private async favoriteItemHandler(e: React.MouseEvent, item: SelectListItem): Promise<void> {

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
    
    private get expandBottom(): boolean {
        const dropdownNode: JQuery = this.getNode();
        
        if (dropdownNode.length) {
            const viewPortHeight: number = window.innerHeight;
            const pageYOffset: number = window.pageYOffset;
            
            const dropdownNodeTop: number = (dropdownNode.offset()!.top - pageYOffset) + dropdownNode.height()! * 2;
            
            const filterInput: HTMLInputElement | null = this._filterInputRef.current;
            const scrollableContainer: HTMLDivElement | null = this._scrollableContainerRef.current;
            
            const filterInputHeight: number = filterInput ? filterInput.clientHeight : 0;
            const scrollableContainerHeight: number = scrollableContainer ? scrollableContainer.clientHeight : 0;
            
            const expandableContainerHeight: number = filterInputHeight + scrollableContainerHeight;
            
            const availableBottomHeight: number = viewPortHeight - dropdownNodeTop;

            const fitBottom: boolean = availableBottomHeight > expandableContainerHeight;

            if (fitBottom) {
                return true;
            }
            
            return (dropdownNodeTop < expandableContainerHeight);
        }
        
        return true;
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
        return ((this.required) && (!this.multiple))
            ? (this.props.requiredType != null)
                ? this.props.requiredType
                : DropdownRequiredType.AutoSelect
            : DropdownRequiredType.Manual;
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
            const selectedItems: TItem[] | string[] | null = this.props.selectedItems || null;
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
            const selectedItem: TItem | string | null = this.props.selectedItem || null;
            if ((selectedItem) && (typeof selectedItem === "object")) {
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

    public async unselectAllAsync(): Promise<void> {
        if ((this.multiple) && (this.selectedListItems)) {
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

    public async selectListItemAsync(item: SelectListItem | string | null): Promise<void> {
        await this.invokeSelectListItemAsync(item, true);
    }

    public async selectListItemsAsync(items: SelectListItem[] | string[] | null): Promise<void> {
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
        const newGroupSelected: boolean = (props.groupSelected !== nextProps.groupSelected);
        const newFavorite: boolean = (props.favorite !== nextProps.favorite);
        const newRequired: boolean = (props.required !== nextProps.required);
        const newItems: boolean = (!Comparator.isEqual(props.items, nextProps.items));
        const newSelectedListItem: boolean = (!Comparator.isEqual(props.selectedItem, nextProps.selectedItem));
        const newSelectedListItems: boolean = (!Comparator.isEqual(props.selectedItems, nextProps.selectedItems));

        await super.componentWillReceiveProps(nextProps);

        if (newExpanded) {
            const expanded: boolean = nextProps.expanded || false;
            await this.setState({expanded});
        }

        if ((newItems) || (newSelectedListItem) || (newSelectedListItems) || (newGroupSelected) || (newFavorite) || (newRequired)) {

            const selectedItem: TItem | string | null | undefined = (newSelectedListItem)
                ? nextProps.selectedItem
                : (nextProps.selectedItem || this.getSelectedListItem(nextProps.items) || this.selectedItem);

            const selectedItems: TItem[] | string[] | null | undefined = (newSelectedListItems)
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
                
                await this.onFilterInputClickAsync();
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
    
    public find(item: TItem | string | null): SelectListItem | null {
        if ((item) && (this.listItems)) {

            const itemValue: string = (typeof item === "string")
                ? item
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
                        const scrollableContainerHeight: number = $(scrollableContainerElement).height() || 0;
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
    
    private renderToggleIcon(className?: string): React.ReactNode {
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
            <Icon {...iconProps} size={IconSize.Normal} className={this.css(className)} />
        );
    }
    
    private renderAddButton(): React.ReactNode {
        const addButton: boolean | string | RenderCallback = this.props.addButton!;
        
        let text: string;
        if (typeof addButton === "function") {
            const render: React.ReactNode | string = addButton(this);
            if (typeof render !== "string") {
                return render;
            }
            text = render;
        } else if (typeof addButton === "string") {
            text = this.localizer.get(addButton)
        } else {
            text = this.localizer.get("Component.Dropdown.Add");
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
        const expandedStyle = ((this.styleSchema === DropdownSchema.Widget) && (this.state.expanded)) && (this.css(styles.hovered, styles.focused));
        const transparentStyle: any = (this.styleSchema === DropdownSchema.Transparent) && (styles.transparent);

        const inlineStyles: React.CSSProperties = {};
        if (this.props.textAlign) {
            inlineStyles.textAlign = StylesUtility.textAlign(this.props.textAlign);
            inlineStyles.width = "100%";
        }
        
        const noSubtext: boolean = this.noSubtext;
        const selectedListItem: SelectListItem | null = this.selectedListItem;

        const title: string = (selectedListItem !== null) && (noSubtext)
            ? this.localizer.get(selectedListItem.subtext)
            : "";
        
        let text: string = (this.props.selectedTextTransform)
            ? this.props.selectedTextTransform(this)
            : "";

        if (!text) {
            text = (selectedListItem !== null)
                ? (noSubtext)
                    ? this.localizer.get(selectedListItem.text)
                    : `${this.localizer.get(selectedListItem.text)} <small>${this.localizer.get(selectedListItem.subtext)}</small>`
                : (this.selectedListItems.length !== 0)
                    ? (this.props.multipleSelectedText)
                        ? this.localizer.get(this.props.multipleSelectedText)
                        : ((this.selectedTextFormat) && (this.selectedListItems.length <= this.selectedTextFormat))
                            ? (noSubtext)
                                ? this.selectedListItems.take(this.selectedTextFormat).map(item => this.localizer.get(item.text)).join(", ")
                                : this.selectedListItems.take(this.selectedTextFormat).map(item => (item.subtext) ? `${this.localizer.get(item.text)} <small>${this.localizer.get(item.subtext)}</small>` : this.localizer.get(item.text)).join(", ")
                            : this.localizer.get(this.localizer.get("Component.Dropdown.MultipleSelected"), this.selectedListItems.length)
                    : (this.props.nothingSelectedText)
                        ? this.localizer.get(this.props.nothingSelectedText)
                        : this.localizer.get("Component.Dropdown.NothingSelected");
        }
        
        return (
            <div className={this.css(styles.selected, "form-control", expandedStyle, transparentStyle, "selected-item")}
                 title={title}
                 onClick={async () => await this.toggleAsync()}>
                
                <span style={inlineStyles}>{ReactUtility.toSmalls(text)}</span>
                
                {
                    this.renderToggleIcon(transparentStyle)
                }
                
            </div>
        );
    }

    private renderSelectListItem(item: SelectListItem, index: number): React.ReactNode {
        const isSeparator: boolean = (item as any).isSelectListSeparator;
        const hasVisibleGroup: boolean = (!isSeparator) && (this.hasVisibleGroup(item));
        const needGroupSeparator: boolean = (!isSeparator) && (this.firstInGroup(item, index, hasVisibleGroup));
        const selected: boolean = (!isSeparator) && (item.selected);
        const favorite: boolean = (!isSeparator) && (this.props.favorite === true);
        const checkbox: boolean = (!isSeparator) && (this.selectType == DropdownSelectType.Checkbox);

        const listItemStyle: any = ((this.isListType) && (this.props.styleSchema !== DropdownSchema.Widget)) && styles.listItem;
        const inlineSubtextStyle: any = (this.subtextType == DropdownSubtextType.Inline) && styles.inlineSubtext;
        const selectedStyle: any = ((selected) && (!checkbox)) && styles.selectedItem;

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
                                                <span>{this.localizer.get(item.group!.name)}</span>
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
                            <div className={this.css(styles.item, listItemStyle, inlineSubtextStyle, selectedStyle, hasVisibleGroup && styles.itemGroupIdent)}
                                 onClick={async () => await this.selectItemHandler(item)}>

                                {
                                    (favorite) &&
                                    (
                                        <div className={styles.iconContainer} onClick={async (e: React.MouseEvent) => await this.favoriteItemHandler(e, item)}>
                                            <Icon name="star" style={(item.favorite) ? IconStyle.Solid : IconStyle.Regular} size={IconSize.Large} />
                                        </div>
                                    )
                                }

                                <DropdownListItem item={item}
                                                  subtextHidden={this.subtextType == DropdownSubtextType.Hidden}
                                                  noWrap={this.props.noWrap}
                                                  onChangeAmount={async (sender, item) => await this.onChangeAmountAsync(item)}
                                />

                                {
                                    (checkbox) &&
                                    (
                                        <div className={styles.checkbox} onClick={async (e: React.MouseEvent) => await this.favoriteItemHandler(e, item)}>
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
            ? this.localizer.get("Component.Dropdown.GetResults")
            : this.localizer.get("Component.Dropdown.FilterResults");
        
        const noDataText: string = (this.props.noDataText)
            ? this.localizer.get(this.props.noDataText)
            : this.localizer.get("Component.Dropdown.NoData");
        
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

                <div className={toggleStyle} onClick={(e: React.MouseEvent) => this.onListContainerClickAsync(e)}>
                    
                    {
                        (this.hasAddButton) &&
                        (
                            this.renderAddButton()
                        )
                    }
                    
                    {
                        (this.hasFilter) &&
                        (
                            <div className={styles.filter} onClick={async () => await this.onFilterInputClickAsync()}>
                                
                                <input ref={this._filterInputRef}
                                       className="form-control filter"
                                       type="text"
                                       placeholder={longListPlaceholder}
                                       onKeyUp={async () => await this.filterHandlerAsync()}
                                />
                                       
                                { this.filterValue && <span className={this.css("fa fa-times", styles.clean)} onClick={async () => await this.cleanFilterAsync()} /> }
                                
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
                                                            <div className={this.css(styles.noResults, noWrapStyle)}><span>{this.localizer.get("Component.Dropdown.NoItems")}</span></div>
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