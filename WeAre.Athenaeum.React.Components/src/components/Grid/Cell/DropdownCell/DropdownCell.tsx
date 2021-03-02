import React from "react";
import {BaseAsyncComponent, IBaseAsyncComponentState} from "@weare/athenaeum-react-common";
import { CellModel, ColumnSettings } from "../../GridModel";
import Comparator from "../../../../helpers/Comparator";

import gridStyles from "../../Grid.module.scss";
import Dropdown, { DropdownOrderBy } from "@/components/Dropdown/Dropdown";
import { IInput } from "@/components/BaseInput/BaseInput";

interface IDropdownCellProps<TItem = {}> {
    id?: string;
    cell: CellModel<TItem>;
}

interface IDropdownCellState<TItem> extends IBaseAsyncComponentState<TItem[]> {
}

export default class DropdownCell<TItem = {}> extends BaseAsyncComponent<IDropdownCellProps<TItem>, IDropdownCellState<TItem>, TItem[]> {
    
    state: IDropdownCellState<TItem> = {
        data: null,
        isLoading: false
    };

    private readonly _inputRef: React.RefObject<IInput> = React.createRef();

    private async onChangeAsync(sender: Dropdown<TItem>, value: TItem | null, userInteraction: boolean): Promise<void> {
        
        const cell: CellModel<TItem> = this.model;
        
        let modelValue: any = value;
        
        if ((this.settings.multiple) && (this.items)) {
            const selectedItems: TItem[] = sender.selectedItems;
            modelValue = this.items.filter(item => selectedItems.some(selectedItem => Comparator.isEqual(selectedItem, item)));
        }

        const cellState: boolean = cell.modified;
        
        cell.setValue(modelValue);

        if ((userInteraction) && (cell.column.callback)) {
            await cell.column.callback(cell, null);
        }

        const modified: boolean = (cellState !== cell.modified);
        
        if (modified) {
            await cell.row.reRenderAsync();
        } else {
            await this.reRenderAsync();
        }
    }
    
    private selectedTextTransform(sender: Dropdown<TItem>): string {
        return ((!this.hasData) || (this.isLoading))
            ? ""
            : this.settings.selectedTextTransform!(sender);
    }
    
    private get selectedTextTransformLambda(): ((sender: Dropdown<TItem>) => string) | undefined {
        return (this.settings.selectedTextTransform)
            ? (sender) => this.selectedTextTransform(sender)
            : undefined;
    }

    protected async fetchDataAsync(): Promise<TItem[]> {
        if (this.settings.fetchItems) {
            return await this.settings.fetchItems(this.model);
        }
        return [];
    }

    protected getEndpoint(): string {
        return "";
    }
    
    public isAsync(): boolean {
        return (this.settings.fetchItems != null);
    }

    public get model(): CellModel<TItem> {
        return this.props.cell;
    }
    
    public get settings(): ColumnSettings<TItem> {
        return this.model.column.settings;
    }
    
    public get items(): TItem[] {
        return this.state.data || [];
    }

    public get value(): TItem | string | null {
        return this.model.value;
    }

    public get selectedItem(): TItem | null {
        if (!this.settings.multiple) {
            const value: TItem | string | null = this.value;
            if (value != null) {
                if (typeof value === "string") {
                    return this.items.find(item => Comparator.isEqual(item, value)) || null;
                }
                return value;
            }
        }
        return null;
    }

    public get values(): TItem[] | string[] | null {
        return this.model.value;
    }

    public get selectedItems(): TItem[] | string[] | null {
        return (this.settings.multiple) ? this.values : null;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        this.props.cell.inputContentInstance = this._inputRef.current;
    }
    
    render(): React.ReactNode {
        
        this.model.asyncContentInstance = this;
        
        return (
            <React.Fragment>
                
                <Dropdown ref={this._inputRef as React.RefObject<Dropdown<TItem>>}
                          noSubtext noWrap
                          nothingSelectedText={this.settings.nothingSelectedText || undefined}
                          autoCollapse={this.settings.autoCollapse}
                          multiple={this.settings.multiple}
                          align={this.settings.align}
                          verticalAlign={this.settings.verticalAlign}
                          required={this.settings.required}
                          groupSelected={this.settings.groupSelected}
                          noFilter={this.settings.noFilter}
                          requiredType={this.settings.requiredType}
                          className={gridStyles.dropdown}
                          orderBy={DropdownOrderBy.None}
                          items={this.items}
                          selectedItem={this.selectedItem || undefined}
                          selectedItems={this.selectedItems || undefined}
                          selectedTextTransform={this.selectedTextTransformLambda}
                          onChange={async (sender: Dropdown<TItem>, item: TItem | null, userInteraction: boolean) => await this.onChangeAsync(sender, item, userInteraction) }
                />
                
            </React.Fragment>
        );
    }
}
