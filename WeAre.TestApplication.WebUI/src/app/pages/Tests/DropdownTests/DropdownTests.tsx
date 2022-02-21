import React from "react";
import {Dictionary} from "typescript-collections";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {
    Button,
    ButtonType,
    Checkbox,
    Dropdown,
    DropdownAlign,
    DropdownOrderBy,
    DropdownRequiredType,
    DropdownSelectType,
    DropdownSubtextType,
    DropdownVerticalAlign,
    Form,
    IconSize,
    IconStyle,
    IIconProps, Inline,
    IStringInputModel,
    OneColumn,
    SelectListItem,
    TextInput,
    TwoColumns
} from "@weare/reapptor-react-components";

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
    addButton: boolean,
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
        generateGroups: false,
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
        addButton: false,
        subtextType: DropdownSubtextType.Row,
        selectType: DropdownSelectType.Background,
        requiredType: DropdownRequiredType.AutoSelect,
        selectedTextFormat: false,
        width: styles.auto,
        align: null,
        verticalAlign: DropdownVerticalAlign.Auto
    };

    private readonly _refs: Dictionary<string, React.RefObject<Dropdown<any>>> = new Dictionary<string, React.RefObject<Dropdown<any>>>();
    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private _toggleIconNameModel: IStringInputModel = { value: "far grip-lines" };
    private _customToggleIcon: IIconProps = {name: "hamburger", size: IconSize.X10, style: IconStyle.Regular}
    private _items: any[] | null = null;
    
    private async validateAsync(): Promise<void> {
        if (this._formRef.current) {
            const valid: boolean = await this._formRef.current.validateAsync();
            if (valid) {
                await ch.alertMessageAsync("Form is valid.", true, true);
            } else {
                await ch.alertErrorAsync("Form is not valid.", true, true);
            }
        }
    }

    private generateItem(index: number, group: number | null = null, description: boolean = false): any {
        return {
            name: "{0:00}th item".format(index),
            group: group ? "Group #{0:00}".format(group) : null,
            description: description ? "Description for item \"{0}\", group \"{1}\"".format(index, group ? group : "no group") : null
        };
    }

    private generateItems(generateGroups: boolean): any[] {
        return [
            this.generateItem(0, generateGroups ? 1 : null, true),
            this.generateItem(1, generateGroups ? 1 : null, true),
            this.generateItem(2, generateGroups ? 1 : null, true),
            this.generateItem(3, generateGroups ? 2 : null, true),
            this.generateItem(4, generateGroups ? 2 : null, true),
            this.generateItem(5, generateGroups ? 3 : null, true),
            this.generateItem(6, generateGroups ? 3 : null, true),
            this.generateItem(7),
            this.generateItem(8),
            this.generateItem(9)
        ];
    }

    private get items(): any[] {
        return this._items || (this._items = this.generateItems(this.state.generateGroups));
    }
    
    private getRef(id: string): React.RefObject<Dropdown<any>> {
        if (!this._refs.containsKey(id)) {
            this._refs.setValue(id, React.createRef());
        }
        return this._refs.getValue(id)!;
    }

    private reRenderDropdowns(): void {
        this._refs.values().map(ref => ref.current?.reRender());
    }

    private async addAsync(): Promise<void> {
        this.items.push(this.generateItem(this.items.length));
        await this.reRenderDropdowns();
    }

    private async setNoFilterAsync(noFilter: boolean): Promise<void> {
        await this.setState({noFilter});
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
        const DropdownTemplate = (id: string) => {
            return (
                <Dropdown noWrap
                          key={id} id={id} ref={this.getRef(id)}
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
                          addButton={this.state.addButton}
                          selectedTextFormat={this.state.selectedTextFormat}
                          align={this.state.align || undefined}
                          verticalAlign={this.state.verticalAlign ?? undefined}
                          toggleIcon={(this.state.withToggleIconName && !this.state.withToggleIconProps)
                              ? this._toggleIconNameModel.value
                              : (!this.state.withToggleIconName && this.state.withToggleIconProps)
                                  ? this._customToggleIcon
                                  : undefined
                          }
                          onAdd={() => this.addAsync()}
                />)
        }
        
        return (
            <div className={styles.dropdownTests}>

                <OneColumn className="pb-3">
                    {
                        DropdownTemplate("ddTestTop")
                    }
                </OneColumn>
                
                <TwoColumns>
                    
                    <div>

                        <Inline>

                            <Dropdown label="Width"inline required noValidate noWrap noFilter
                                      orderBy={DropdownOrderBy.None}
                                      transform={(item) => new SelectListItem(item, this.getWidthName(item), null, item)}
                                      items={[styles.auto, styles.p25, styles.p50, styles.p100]}
                                      selectedItem={this.state.width}
                                      onChange={async (sender, value) => await this.setState({ width: value! })}
                            />

                            <Button icon={{name: "fas check"}}
                                    label={"Validate"}
                                    type={ButtonType.Primary}
                                    onClick={() => this.validateAsync()}
                            />

                        </Inline>

                        <hr/>

                        <Checkbox label="Generate groups" inline
                                  value={this.state.generateGroups}
                                  onChange={async (sender, value) => { this._items = null; await this.setState({generateGroups: value}) }}
                        />

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

                        <Checkbox label="Add button" inline
                                  value={this.state.addButton}
                                  onChange={async (sender, value) => await this.setState({addButton: value})}
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

                        <Dropdown label="Selected Text Format" inline required noValidate noWrap noFilter
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
                                  selectedItem={this.state.verticalAlign ?? -1}
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
                    </div>

                    <Form ref={this._formRef}>

                        {DropdownTemplate("ddTestMiddle")}

                    </Form>

                </TwoColumns>
                
                <OneColumn className={"mt-4"}>
                    {DropdownTemplate("ddTestBottom")}
                </OneColumn>

            </div>
        );
    }
}