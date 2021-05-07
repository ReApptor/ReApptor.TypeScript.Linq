import React from "react";
import {BaseAsyncComponent, IBaseAsyncComponentState} from "@weare/athenaeum-react-common";

import styles from "./List.module.scss";
import { SelectListItem } from "../Dropdown/SelectListItem";
import Dropdown, { DropdownOrderBy, DropdownType, IDropdown } from "../Dropdown/Dropdown";
import ListLocalizer from "./ListLocalizer";

interface IListProps<TItem = {}> {
    id?: string;
    label?: string;
    className?: string;
    items?: TItem[];
    orderBy?: DropdownOrderBy;
    selectedItem?: TItem | string | number;
    selectedItems?: TItem[] | string[] | number[];
    required?: boolean;
    multiple?: boolean;
    filterMinLength?: number;
    filterMaxLength?: number;
    disabled?: boolean;
    maxHeight?: number | string;
    maxWidth?: number | string;
    absoluteListItems?: boolean;
    noDataText?: string;
    noGrouping?: boolean;
    transform?(item: TItem): SelectListItem;
    fetchItems?(sender: List<TItem>): Promise<TItem[]>;
    onChange?(sender: List<TItem>, value: TItem | null, userInteraction: boolean): Promise<void>;
}

interface IListState<TItem> extends IBaseAsyncComponentState<TItem[]> {
}

export default class List<TItem = {}> extends BaseAsyncComponent<IListProps<TItem>, IListState<TItem>, TItem[]> implements IDropdown<TItem> {
    
    state: IListState<TItem> = {
        data: null,
        isLoading: false
    };
    
    private readonly _dropdownRef: React.RefObject<Dropdown<TItem>> = React.createRef(); 

    private async onChangeAsync(value: TItem | null, userInteraction: boolean): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, value, userInteraction);
        }
    }

    protected async fetchDataAsync(): Promise<TItem[]> {
        if (this.props.fetchItems) {
            return await this.props.fetchItems(this);
        }
        return [];
    }

    protected getEndpoint(): string {
        return "";
    }
    
    protected get dropdown(): Dropdown<TItem> {
        return this._dropdownRef.current!;    
    }
    
    private get maxWidth(): string | number {
        return this.props.maxWidth || "none";
    }

    private get noDataOrLoadingText(): string | null {
        return (this.isLoading)
            ? ListLocalizer.loading
            : this.props.noDataText || null;
    }

    public get listItems(): SelectListItem[] {
        return this.dropdown.listItems;
    }

    public get selectedListItems(): SelectListItem[] {
        return this.dropdown.selectedListItems;
    }

    public get selectedListItem(): SelectListItem | null {
        return this.dropdown.selectedListItem;
    }

    public get selectedItems(): TItem[] {
        return this.dropdown.selectedItems;
    }

    public get selectedValues(): string[] {
        return this.dropdown.selectedValues;
    }

    public get selectedItem(): TItem | null {
        return this.dropdown.selectedItem;
    }

    public get selectedValue(): string | null {
        return this.dropdown.selectedValue;
    }

    public find(item: TItem | string | number | null): SelectListItem | null {
        return this.dropdown.find(item);
    }
    
    public async unselectAllAsync(): Promise<void> {
        await this.dropdown.unselectAllAsync();
    }
    
    public async selectItemAsync(item: TItem | null): Promise<void> {
        await this.dropdown.selectItemAsync(item);
    }

    public async selectAsync(itemOrItems: TItem | string | TItem[] | string[] | null): Promise<void> {
        await this.dropdown.selectAsync(itemOrItems);
    }
    
    public async selectListItemAsync(item: SelectListItem | string | number | null): Promise<void> {
        await this.dropdown.selectListItemAsync(item);
    }
    
    public async selectListItemsAsync(items: SelectListItem[] | string[] | number[] | null): Promise<void> {
        await this.dropdown.selectListItemsAsync(items);
    }

    public hasSpinner(): boolean {
        return true;
    }
    
    public isAsync(): boolean {
        return (this.props.fetchItems != null);
    }
    
    public scrollToSelected(smooth: boolean = false): void {
        this.dropdown.scrollToSelected(smooth);
    }

    public async reRenderAsync(): Promise<void> {
        await this.dropdown.reRenderAsync();
    }

    public get items(): TItem[] {
        return this.state.data || [];
    }
    
    render(): React.ReactNode {
        return (
            <div className={styles.listWrapper} style={{maxWidth: this.maxWidth}}>
                
                <Dropdown id={`${this.id}_dropdown`}
                          ref={this._dropdownRef}
                          absoluteListItems={this.props.absoluteListItems}
                          noSubtext noWrap
                          noDataText={this.noDataOrLoadingText || undefined}
                          noGrouping={this.props.noGrouping}
                          maxHeight={this.props.maxHeight}
                          multiple={this.props.multiple}
                          filterMinLength={this.props.filterMinLength}
                          filterMaxLength={this.props.filterMaxLength}
                          label={this.props.label}
                          expanded={true}
                          disabled={this.props.disabled || this.isLoading}
                          type={DropdownType.List}
                          required={this.props.required}
                          className={this.css(styles.list, this.props.className)}
                          orderBy={this.props.orderBy}
                          items={this.items}
                          selectedItem={this.props.selectedItem}
                          selectedItems={this.props.selectedItems}
                          transform={this.props.transform}
                          onChange={async (sender, item: TItem, userInteraction: boolean) => await this.onChangeAsync(item, userInteraction) }
                />
                
            </div>
        );
    }
}