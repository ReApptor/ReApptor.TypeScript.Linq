import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Dropdown, {DropdownAlign, DropdownOrderBy, DropdownRequiredType, DropdownSelectType, DropdownSubtextType, DropdownVerticalAlign} from "@/components/Form/Inputs/Dropdown/Dropdown";
import Form from "@/components/Form/Form";
import Checkbox from "@/components/Form/Inputs/Checkbox/Checkbox";
import List from "@/components/List/List";
import TwoColumns from "@/components/Layout/TwoColumn/TwoColumns";
import TextInput from "@/components/Form/Inputs/TextInput/TextInput";
import {IStringInputModel} from "@/components/Form/Inputs/BaseInput";
import {IconSize, IconStyle, IIconProps} from "@/components/Icon/Icon";
import {SelectListItem} from "@/components/Form/Inputs/Dropdown/SelectListItem";

import styles from "./DropdownTests.module.scss";

export interface IDropdownTestsState {
    generateGroups: boolean,
    multiple: boolean,
    groupSelected: boolean,
    favorite: boolean,
    noFilter: boolean,
    amountListItem: boolean,
    dropdownWidget: boolean,
    required: boolean,
    disabled: boolean,
    autoCollapse: boolean,
    toggleButton: boolean,
    withToggleIconName: boolean,
    withToggleIconProps: boolean,
    noSubtext: boolean,
    subtextType: DropdownSubtextType,
    selectType: DropdownSelectType,
    requiredType: DropdownRequiredType,
    selectedTextFormat: boolean | number,
    width: string,
    align: DropdownAlign | null,    
    verticalAlign: DropdownVerticalAlign | null,    
}

export default class DropdownTests extends BaseComponent<{}, IDropdownTestsState> {

    state: IDropdownTestsState = {
        generateGroups: true,
        multiple: false,
        groupSelected: false,
        favorite: false,
        noFilter: false,
        amountListItem: false,
        dropdownWidget: false,
        required: false,
        disabled: false,
        toggleButton: false,
        autoCollapse: true,
        withToggleIconName: false,
        withToggleIconProps: false,
        noSubtext: false,
        subtextType: DropdownSubtextType.Row,
        selectType: DropdownSelectType.Background,
        requiredType: DropdownRequiredType.AutoSelect,
        selectedTextFormat: false,
        width: styles.auto,
        align: null,
        verticalAlign: null
    };
    
    private readonly _listRef: React.RefObject<List> = React.createRef();
    
    private _toggleIconNameModel: IStringInputModel = { value: "far grip-lines" };
    private _customToggleIcon: IIconProps = {name: "hamburger", size: IconSize.X10, style: IconStyle.Regular}
    private _items: any[] | null = null;
    
    private generateItems(generateGroups: boolean): any[] {
        return [
            {name: "0th item", group: generateGroups ? "0" : null, description: "Group 0 (Description)"},
            {name: "1st item", group: generateGroups ? "0" : null, description: "Group 0 (Description)"},
            {name: "2nd item", group: generateGroups ? "0" : null, description: "Group 0 (Description)"},
            {name: "3d item", group: generateGroups ? "1" : null,  description: "Group 1 (Description)"},
            {name: "4th item", group: generateGroups ? "1" : null, description: "Group 1 (Description)"},
            {name: "5th item", group: generateGroups ? "1" : null, description: "Group 1 (Description)"},
            {name: "6th item", group: generateGroups ? "1" : null, description: "Group 1 (Description)"},
            {name: "7th item", group: generateGroups ? "2" : null},
            {name: "8th item", group: generateGroups ? "2" : null},
            {name: "9th item", group: generateGroups ? "2" : null}
        ];
    }
    
    private get items(): any[] {
        return this._items || (this._items = this.generateItems(this.state.generateGroups));
    }
    
    private reRenderDropdown(): void {
        if (this._listRef.current) {
            this._listRef.current.reRender();
        }
    }
    
    private async setNoFilterAsync(noFilter: boolean): Promise<void> {
        await this.setState({noFilter});
        if (this._listRef.current) {
            await this._listRef.current.reloadAsync();
        }
    }
    
    private getDropdownSubtextTypeName(item: DropdownSubtextType): string {
        switch (item) {
            case DropdownSubtextType.Row: return "Row";
            case DropdownSubtextType.Inline: return "Inline";
            case DropdownSubtextType.Hidden: return "Hidden";
        }
    }
    
    private getDropdownSelectTypeName(item: DropdownSelectType): string {
        switch (item) {
            case DropdownSelectType.Background: return "Background";
            case DropdownSelectType.Checkbox: return "Checkbox";
        }
    }
    
    private getDropdownRequiredTypeName(item: DropdownRequiredType): string {
        switch (item) {
            case DropdownRequiredType.Manual: return "Manual";
            case DropdownRequiredType.Restricted: return "Restricted";
            case DropdownRequiredType.AutoSelect: return "AutoSelect";
        }
    }
    
    private getSelectedTextFormatName(item: boolean | number): string {
        switch (item) {
            case false: return "Count";
            case true: return "Values";
            default: return item + " value(s)";
        }
    }
    
    private getDropdownAlignName(item: DropdownAlign | null): string {
        switch (item) {
            case DropdownAlign.Left: return "Left";
            case DropdownAlign.Right: return "Right";
            default: return "Default (undefined)";
        }
    }
    
    private getDropdownVerticalAlignName(item: DropdownVerticalAlign | null): string {
        switch (item) {
            case DropdownVerticalAlign.Top: return "Top";
            case DropdownVerticalAlign.Bottom: return "Bottom";
            case DropdownVerticalAlign.Auto: return "Auto";
            default: return "Default (undefined)";
        }
    }
    
    private getWidthName(item: string): string {
        switch (item) {
            case styles.p25: return "25%";
            case styles.p50: return "50%";
            case styles.p100: return "100%";
            default: return "Auto";
        }
    }
    
    public render(): React.ReactNode {
        
        return (
            <div className={styles.dropdownTests}>

                <TwoColumns>

                    <Form>

                        <Checkbox label="Generate groups" inline
                                  value={this.state.generateGroups}
                                  onChange={async (sender, value) => { this._items = null; await this.setState({generateGroups: value}) }}
                        />

                        <Dropdown label="Width" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item, this.getWidthName(item), null, item)}
                                  items={[styles.auto, styles.p25, styles.p50, styles.p100]}
                                  selectedItem={this.state.width}
                                  onChange={async (sender, value) => await this.setState({ width: value! })}
                        />
                        
                        <hr/>

                        <Checkbox label="Multi Select" inline
                                  value={this.state.multiple}
                                  onChange={async (sender, value) => await this.setState({multiple: value})}
                        />

                        <Checkbox label="Favorite" inline
                                  value={this.state.favorite}
                                  onChange={async (sender, value) => await this.setState({favorite: value})}
                        />

                        <Checkbox label="Group Selected" inline
                                  value={this.state.groupSelected}
                                  onChange={async (sender, value) => await this.setState({groupSelected: value})}
                        />

                        <Checkbox label="No filter" inline
                                  value={this.state.noFilter}
                                  onChange={async (sender, value) => await this.setNoFilterAsync(value)}
                        />
                                  
                        <Checkbox label="Required" inline
                                  value={this.state.required}
                                  onChange={async (sender, value) => await this.setState({required: value})}
                        />

                        <Checkbox label="Disabled" inline
                                  value={this.state.disabled}
                                  onChange={async (sender, value) => await this.setState({disabled: value})}
                        />

                        <Checkbox label="Auto Collapse" inline
                                  value={this.state.autoCollapse}
                                  onChange={async (sender, value) => await this.setState({autoCollapse: value})}
                        />

                        <Checkbox label="No Subtext" inline
                                  value={this.state.noSubtext}
                                  onChange={async (sender, value) => await this.setState({noSubtext: value})}
                        />
                        
                        <Dropdown label="Subtext Type" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getDropdownSubtextTypeName(item), null, item)}
                                  items={[DropdownSubtextType.Row, DropdownSubtextType.Inline, DropdownSubtextType.Hidden]}
                                  selectedItem={this.state.subtextType}
                                  onChange={async (sender, value) => await this.setState({ subtextType: value! })}
                        />
                        
                        <Dropdown label="Select Type" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getDropdownSelectTypeName(item), null, item)}
                                  items={[DropdownSelectType.Background, DropdownSelectType.Checkbox]}
                                  selectedItem={this.state.selectType}
                                  onChange={async (sender, value) => await this.setState({ selectType: value! })}
                        />
                        
                        <Dropdown label="Required Type" inline required noValidate noWrap noFilter
                                  disabled={!this.state.required}
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getDropdownRequiredTypeName(item), null, item)}
                                  items={[DropdownRequiredType.Manual, DropdownRequiredType.Restricted, DropdownRequiredType.AutoSelect]}
                                  selectedItem={this.state.requiredType}
                                  onChange={async (sender, value) => await this.setState({ requiredType: value! })}
                        />
                        
                        <Dropdown label="Selected Type Format" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getSelectedTextFormatName(item), null, item)}
                                  items={[false, true, 1, 2, 3, 4, 5]}
                                  selectedItem={this.state.selectedTextFormat}
                                  onChange={async (sender, value) => await this.setState({ selectedTextFormat: value! })}
                        />

                        <Dropdown label="Align" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getDropdownAlignName(item), null, item)}
                                  items={[-1, DropdownAlign.Left, DropdownAlign.Right]}
                                  selectedItem={this.state.align || -1}
                                  onChange={async (sender, value) => await this.setState({ align: (value != -1) ? value : null })}
                        />

                        <Dropdown label="Vertical Align" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getDropdownVerticalAlignName(item), null, item)}
                                  items={[-1, DropdownVerticalAlign.Auto, DropdownVerticalAlign.Top, DropdownVerticalAlign.Bottom]}
                                  selectedItem={this.state.verticalAlign || -1}
                                  onChange={async (sender, value) => await this.setState({ verticalAlign: (value != -1) ? value : null })}
                        />
                        
                        <div>

                            <Checkbox label="WithToggleIconProps" inline
                                      value={this.state.withToggleIconProps}
                                      onChange={async (sender, value) => await this.setState({withToggleIconProps: value, withToggleIconName: false})}
                            />

                            <Checkbox label="WithToggleIconName" inline
                                      value={this.state.withToggleIconName}
                                      onChange={async (sender, value) => await this.setState({withToggleIconName: value, withToggleIconProps: false})}
                            />

                            {
                                (this.state.withToggleIconName) &&
                                (
                                    <TextInput label={"Toggle icon name"} inline
                                               width={"200px"}
                                               model={this._toggleIconNameModel}
                                               onChange={async () => await this.reRenderAsync()}
                                    />
                                )
                            }

                        </div>
                                  
                    </Form>
                     
                    <Dropdown id="ddTest" noWrap
                              label="Dropdown"
                              className={this.state.width}
                              items={this.items}
                              multiple={this.state.multiple}
                              groupSelected={this.state.groupSelected}
                              noFilter={this.state.noFilter}
                              favorite={this.state.favorite}
                              required={this.state.required}
                              requiredType={this.state.requiredType}
                              disabled={this.state.disabled}
                              autoCollapse={this.state.autoCollapse}
                              noSubtext={this.state.noSubtext}
                              subtextType={this.state.subtextType}
                              selectType={this.state.selectType}
                              selectedTextFormat={this.state.selectedTextFormat}
                              align={this.state.align || undefined}
                              verticalAlign={this.state.verticalAlign || undefined}
                              toggleIcon={(this.state.withToggleIconName && !this.state.withToggleIconProps)
                                  ? this._toggleIconNameModel.value
                                    : (!this.state.withToggleIconName && this.state.withToggleIconProps)
                                  ? this._customToggleIcon
                                      : undefined
                              }
                    />
                        
                </TwoColumns>
                
            </div>
        );
    }
}