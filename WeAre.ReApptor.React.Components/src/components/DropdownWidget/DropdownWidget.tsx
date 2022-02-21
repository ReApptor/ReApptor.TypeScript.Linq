import React from "react";
import {Utility} from "@weare/reapptor-toolkit";
import {RenderCallback} from "@weare/reapptor-react-common";
import PageContainer from "../PageContainer/PageContainer";
import Dropdown, {DropdownOrderBy, DropdownRequiredType, DropdownSchema, DropdownSubtextType, DropdownType, IDropdown} from "../Dropdown/Dropdown";
import BaseWidget, { IBaseWidgetProps, IBaseWidgetState } from "../WidgetContainer/BaseWidget";
import { IWidgetContainer } from "../WidgetContainer/BaseWidgetContainer";
import Comparator from "../../helpers/Comparator";
import { SelectListItem } from "../Dropdown/SelectListItem";
import WidgetContainer from "../WidgetContainer/WidgetContainer";
import DropdownWidgetLocalizer from "./DropdownWidgetLocalizer";

import styles from "../WidgetContainer/WidgetContainer.module.scss";

export interface IDropdownWidgetProps<TItem = {}> extends IBaseWidgetProps {
    favorite?: boolean;
    expanded?: boolean,
    required?: boolean;
    requiredType?: DropdownRequiredType;
    multiple?: boolean;
    subtextType?: DropdownSubtextType;
    noSubtext?: boolean;
    noDescription?: boolean;
    autoCollapse?: boolean;
    orderBy?: DropdownOrderBy;
    groupSelected?: boolean;
    items?: TItem[];
    selectedItem?: TItem | string;
    selectedItems?: TItem[] | string[];
    siblingsAutoToggle?: boolean;
    minHeight?: number;
    addButton?: boolean | string | RenderCallback;
    transform?(item: TItem): SelectListItem;
    fetchDataAsync?(sender: DropdownWidget<TItem>, endpoint: string): Promise<TItem[]>;
    onToggle?(sender: DropdownWidget<TItem>, expanded: boolean): Promise<void>;
    onFavoriteChange?(sender: DropdownWidget<TItem>, item: TItem | null, favorite: boolean): Promise<void>;
    onChange?(sender: DropdownWidget<TItem>, item: TItem | null, userInteraction: boolean): Promise<void>;
    onChangeAmount?(sender: DropdownWidget<TItem>, item: TItem | null, amount: number): Promise<void>;
    onAdd?(sender: DropdownWidget<TItem>): Promise<void>;
    onItemsChange?(sender: DropdownWidget<TItem>): Promise<void>;
    onItemClick?(sender: DropdownWidget<TItem>, item: TItem): Promise<void>;
}

export default class DropdownWidget<TItem = {}> extends BaseWidget<IDropdownWidgetProps<TItem>, TItem[]> implements IDropdown<TItem> {

    private readonly _dropdownRef: React.RefObject<Dropdown<TItem>> = React.createRef();

    private get dropdown(): Dropdown<TItem> | null {
        return this._dropdownRef.current;
    }

    private calcDropdownAvailableHeight(): number | undefined {
        let availableHeight: number = 0;

        if (this.mobile) {
            const widgetContainer: IWidgetContainer | null = WidgetContainer.mountedInstance;
            const pageContainer: PageContainer | null = PageContainer.instance;
            if ((widgetContainer) && (pageContainer)) {
                const pageContainerHeight: number = pageContainer.height();
                const widgetContainerOuterHeight: number = widgetContainer.outerHeight(true);
                const dropdownOuterHeight: number = (this.dropdown) ? this.dropdown.outerHeight() : 0;
                availableHeight = pageContainerHeight - widgetContainerOuterHeight + dropdownOuterHeight;
            }
        }

        if ((this.props.minHeight) && (availableHeight < this.props.minHeight)) {
            return this.props.minHeight;
        }

        return (availableHeight > 0)
            ? availableHeight
            : undefined;
    }

    private async updateDescriptionAsync(): Promise<void> {
        if (this.isMounted) {
            const description: string | null = await this.getDescription();
            if (this.state.description !== description) {
                await this.setState({description: description});
            }
        }
    }

    protected getDescription(): string | null {
        const showSubtext = !this.props.noSubtext;

        if (this.props.noDescription) {
            return "";
        }

        if (!this.selectedListItem) {
            return (this.props.description) ? DropdownWidgetLocalizer.get(this.props.description) : "";
        }

        if ((showSubtext) && (this.selectedListItem.subtext)) {
            return `${DropdownWidgetLocalizer.get(this.selectedListItem.text)}, ${DropdownWidgetLocalizer.get(this.selectedListItem.subtext)}`;
        }

        return DropdownWidgetLocalizer.get(this.selectedListItem.text);
    }

    protected getStyleSchema(): DropdownSchema {
        return DropdownSchema.Widget;
    }

    protected async processDataAsync(state: IBaseWidgetState<TItem[]>, data: TItem[] | null): Promise<void> {
        await super.processDataAsync(state, data);
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        e.stopPropagation();

        if ((this.isMounted) && (this.dropdown)) {
            await this.dropdown.toggleAsync();
        }
    }

    protected async onFavoriteChangeAsync(sender: Dropdown<TItem>, item: TItem | null, favorite: boolean): Promise<void> {
        if (this.props.onFavoriteChange) {
            await this.props.onFavoriteChange(this, item, favorite);
        }
    }

    protected async onChangeHandlerAsync(sender: Dropdown<TItem>, item: TItem | null, userInteraction: boolean): Promise<void> {

        await this.updateDescriptionAsync();

        if (this.props.autoCollapse) {
            await sender.collapseAsync();
        }

        if (this.props.onChange) {
            await this.props.onChange(this, item, userInteraction);
        }
    }

    protected async onChangeAmountHandlerAsync(sender: Dropdown<TItem>, item: TItem | null, amount: number): Promise<void> {
        if (this.props.onChangeAmount) {
            await this.props.onChangeAmount(this, item, amount);
        }
    }

    protected async onToggleHandlerAsync(sender: Dropdown<TItem>, expanded: boolean): Promise<void> {
        if (this.props.onToggle) {
            await this.props.onToggle(this, expanded);
        }
    }

    protected async onItemsChangeHandlerAsync(): Promise<void> {
        await this.updateDescriptionAsync();
    }

    protected async onItemClickHandlerAsync(item: TItem): Promise<void> {
        if (this.props.onItemClick) {
            await this.props.onItemClick(this, item);
        }
    }

    protected async onAddHandlerAsync(): Promise<void> {
        if (this.props.onAdd) {
            await this.props.onAdd(this);
        }
    }

    protected async fetchDataAsync(): Promise<TItem[]> {
        if (this.props.fetchDataAsync) {
            return await this.props.fetchDataAsync(this, this.getEndpoint());
        }

        return await super.fetchDataAsync();
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        const target = e.target as Node;

        const outside = Utility.clickedOutside(target, this.id);

        if (outside) {
            if ((this.isMounted) && (this.dropdown)) {
                await this.dropdown.collapseAsync();
            }
        }
    }

    public async collapseAsync(): Promise<void> {
        if (this.dropdown) {
            await this.dropdown.collapseAsync();
        }
    }

    public async initializeAsync(): Promise<void> {

        await super.initializeAsync();

        if (this.props.items) {
            this.state.data = this.props.items;

            await this.reRenderAsync();
        }
    }

    public async componentWillReceiveProps(nextProps: Readonly<IDropdownWidgetProps<TItem>>): Promise<void> {

        if (!this.isAsync()) {
            const newItems: boolean = (!Comparator.isEqual(this.props.items, nextProps.items));
            if (newItems) {
                this.state.data = nextProps.items || [];
            }
        }

        await super.componentWillReceiveProps(nextProps);
    }

    public isAsync(): boolean {
        return (this.props.fetchDataAsync != null) || (super.isAsync());
    }

    public isWidget(): boolean { return true; }

    public hasSpinner(): boolean { return true; }

    public get favorite(): boolean {
        return (this.props.favorite || false);
    }

    public get items(): TItem[] {
        return (this.dropdown) ? this.dropdown.items : [];
    }

    public get selectedItems(): TItem[] {
        return (this.dropdown) ? this.dropdown.selectedItems : [];
    }

    public get selectedItem(): TItem | null {
        return (this.dropdown) ? this.dropdown.selectedItem : null;
    }

    public get selectedValue(): string | null {
        return (this.dropdown) ? this.dropdown.selectedValue : null;
    }

    public get listItems(): SelectListItem[] {
        return (this.dropdown) ? this.dropdown.listItems : [];
    }

    public get selectedListItems(): SelectListItem[] {
        return (this.dropdown) ? this.dropdown.selectedListItems : [];
    }

    public get selectedListItem(): SelectListItem | null {
        return (this.dropdown) ? this.dropdown.selectedListItem : null;
    }

    public get selectedValues(): string[] {
        return (this.dropdown) ? this.dropdown.selectedValues : [];
    }

    public get siblingsAutoToggle(): boolean {
        return (this.props.siblingsAutoToggle !== false);
    }

    public find(item: TItem | string | null): SelectListItem | null {
        return this.dropdown ? this.dropdown.find(item) : null;
    }

    public async unselectAllAsync(): Promise<void> {
        if (this.dropdown) {
            await this.dropdown.unselectAllAsync();
        }
    }

    public async selectItemAsync(item: TItem | null): Promise<void> {
        if (this.dropdown) {
            await this.dropdown.selectItemAsync(item);
        }
    }

    public async selectAsync(itemOrItems: TItem | string | TItem[] | string[] | null): Promise<void> {
        if (this.dropdown) {
            await this.dropdown.selectAsync(itemOrItems);
        }
    }

    public async selectListItemAsync(item: SelectListItem | string | null): Promise<void> {
        if (this.dropdown) {
            await this.dropdown.selectListItemAsync(item);
        }
    }

    public async selectListItemsAsync(items: SelectListItem[] | string[] | null): Promise<void> {
        if (this.dropdown) {
            await this.dropdown.selectListItemsAsync(items);
        }
    }

    protected renderContent(renderHidden: boolean = false): React.ReactNode {

        const dropdownType: DropdownType = (this.mobile) ? DropdownType.List : DropdownType.Dropdown;

        const dropdownStyles: any = !this.description && styles.noDescription;

        return (
            <div className={styles.dropdownWidget}>
                {
                    super.renderContent(renderHidden)
                }
                {
                    (this.state.data) &&
                    (
                        <Dropdown id={`dropdown_${this.id}`}
                                  type={dropdownType}
                                  ref={this._dropdownRef}
                                  className={this.css(styles.dropdown, dropdownStyles)}
                                  styleSchema={this.getStyleSchema()}
                                  maxHeight={() => this.calcDropdownAvailableHeight()}
                                  favorite={this.favorite}
                                  autoCollapse={this.props.autoCollapse}
                                  expanded={this.props.expanded && this.mobile}
                                  required={this.props.required}
                                  requiredType={this.props.requiredType}
                                  multiple={this.props.multiple}
                                  orderBy={this.props.orderBy}
                                  subtextType={this.props.subtextType}
                                  groupSelected={this.props.groupSelected}
                                  selectedItem={this.props.selectedItem}
                                  selectedItems={this.props.selectedItems}
                                  addButton={this.props.addButton}
                                  items={this.state.data || []}
                                  toggleButtonId={this.id}
                                  transform={this.props.transform}
                                  onAdd={() => this.onAddHandlerAsync()}
                                  onChange={(sender, item, userInteraction) => this.onChangeHandlerAsync(sender, item, userInteraction)}
                                  onChangeAmount={(sender, item, amount) => this.onChangeAmountHandlerAsync(sender, item, amount)}
                                  onFavoriteChange={(sender, item, favorite) => this.onFavoriteChangeAsync(sender, item, favorite)}
                                  onToggle={(sender, expanded) => this.onToggleHandlerAsync(sender, expanded)}
                                  onItemsChange={() => this.onItemsChangeHandlerAsync()}
                                  onItemClick={(sender, item) => this.onItemClickHandlerAsync(item)}
                        />
                    )
                }
            </div>
        );
    }
};