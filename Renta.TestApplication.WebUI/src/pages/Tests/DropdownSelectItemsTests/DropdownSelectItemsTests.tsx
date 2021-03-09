import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ch} from "@weare/athenaeum-react-common";
import { Button, ButtonType, Dropdown, DropdownOrderBy, Form, LayoutFourColumns as FourColumns } from "@weare/athenaeum-react-components";

export interface IDropdownSelectItemsTestsState {
    selectedItemId: string | null,
    requiredSelectedItemId: string | null,
    selectedItemIds: string[],
    delayedData: TestDropdownItem[]
}

class TestDropdownItem {
    public id: number = 0;
    
    public name: string = "";
}

export default class DropdownSelectItemsTests extends BaseComponent<{}, IDropdownSelectItemsTestsState> {
    
    private readonly _multipleMasterRef: React.RefObject<Dropdown<TestDropdownItem>> = React.createRef();
    private readonly _singleMasterRef: React.RefObject<Dropdown<TestDropdownItem>> = React.createRef();
    
    state: IDropdownSelectItemsTestsState = {
        requiredSelectedItemId: null,
        selectedItemId: null,
        selectedItemIds: [],
        delayedData: []
    };
    
    private get testItems(): TestDropdownItem[] {
        const items: TestDropdownItem[] = [];
        for (let i: number = 1; i <= 100; i++) {
            const item = { id: i, name: "Test Item " + i };
            items.push(item);
        }
        return items;
    }
    
    private async onTestItemsChangeAsync(sender: Dropdown<TestDropdownItem>, userInteraction: boolean): Promise<void> {
        const selectedItemIds: string[] = sender.selectedValues;
        await this.setState({selectedItemIds});
    }
    
    private async onTestItemChangeAsync(item: TestDropdownItem | null, userInteraction: boolean): Promise<void> {
        const selectedItemId: string | null = (item) ? item.id.toString() : null;
        await this.setState({selectedItemId});
    }
    
    private async onRequiredTestItemChangeAsync(item: TestDropdownItem, userInteraction: boolean): Promise<void> {
        const requiredSelectedItemId: string = item.id.toString();
        await this.setState({requiredSelectedItemId});
    }
    
    private async loadDataWithDelayAsync(): Promise<void> {
        await this.setState({ delayedData: []});
        
        await Utility.wait(3000);
        
        await this.setState({ delayedData: this.testItems });
    }
    
    public render(): React.ReactNode {   
        
        return (
            <React.Fragment>

                <Form id="multipleSelectItemsTest">

                    <FourColumns>

                        <Dropdown id="multipleMaster" ref={this._multipleMasterRef}
                                  label="Master (Multiple)"
                                  multiple autoCollapse
                                  items={this.testItems}
                                  orderBy={DropdownOrderBy.None}
                                  selectedItems={this.state.selectedItemIds}
                                  onChange={async (sender, item, userInteraction) => this.onTestItemsChangeAsync(sender, userInteraction)}
                        />

                        <Dropdown id="multipleSlave"
                                  label="Slave (Multiple)"
                                  multiple autoCollapse groupSelected
                                  items={this.testItems}
                                  orderBy={DropdownOrderBy.None}
                                  selectedItems={this.state.selectedItemIds}
                        />

                        <Button label="Unselect All" type={ButtonType.Blue} style={{marginTop: 24}} onClick={async () => await this._multipleMasterRef.current!.unselectAllAsync()} />

                    </FourColumns>

                    <FourColumns>

                        <Dropdown id="singleMaster" ref={this._singleMasterRef}
                                  label="Master"
                                  items={this.testItems}
                                  orderBy={DropdownOrderBy.None}
                                  selectedItem={this.state.selectedItemId || undefined}
                                  onChange={async (sender, item, userInteraction) => this.onTestItemChangeAsync(item, userInteraction)}
                        />

                        <Dropdown id="singleSlave"
                                  label="Slave"
                                  groupSelected
                                  items={this.testItems}
                                  orderBy={DropdownOrderBy.None}
                                  selectedItem={this.state.selectedItemId || undefined}
                        />

                        <Button label="Unselect All" type={ButtonType.Blue} style={{marginTop: 24}} onClick={async () => await this._singleMasterRef.current!.unselectAllAsync()} />

                    </FourColumns>

                    <FourColumns>

                        <Dropdown id="requiredSingleMaster"
                                  label="Master (Required)"
                                  required
                                  items={this.testItems}
                                  orderBy={DropdownOrderBy.None}
                                  selectedItem={this.state.requiredSelectedItemId || undefined}
                                  onChange={async (sender, item, userInteraction) => this.onRequiredTestItemChangeAsync(item!, userInteraction)}
                        />

                        <Dropdown id="requiredSingleSlave"
                                  label="Slave"
                                  groupSelected
                                  items={this.testItems}
                                  orderBy={DropdownOrderBy.None}
                                  selectedItem={this.state.requiredSelectedItemId || undefined}
                        />
                        
                    </FourColumns>
                    
                    <FourColumns>
                        
                        <Dropdown<TestDropdownItem> id="noItemsButSelectedItem"
                                                    label="No items but selected item"
                                                    items={[]}
                                                    selectedItem={ {id: 10, name: "Test Item 10"} as TestDropdownItem}
                        />

                        <Dropdown<TestDropdownItem> id="itemsFetchingWithDelayButWithSelectedItem"
                                                    label="Delayed items but selected item"
                                                    items={this.state.delayedData}
                                                    selectedItem={ {id: 10, name: "Test Item 10"} as TestDropdownItem}
                                                    onChange={async (sender, item, userInteraction) => await ch.flyoutMessageAsync(sender.id + ".onChange:" + item + " " + userInteraction)}
                        />
                        
                        <Button label="Load" type={ButtonType.Blue} style={{marginTop: 24}} onClick={async () => await this.loadDataWithDelayAsync()} />

                    </FourColumns>
                    
                    <FourColumns>
                        
                        <Dropdown<TestDropdownItem> id="noItemsButRequired" required
                                                    label="No items but required"
                                                    items={[]}
                        />

                        <Dropdown<TestDropdownItem> id="hasDataAndRequired" required
                                                    label="Has items and required"
                                                    items={this.testItems}
                        />

                        <Dropdown<TestDropdownItem> id="delayedDataAndRequired" required
                                                    label="Delayed items but required"
                                                    items={this.state.delayedData}
                        />

                    </FourColumns>

                </Form>
                
            </React.Fragment>
        );
    }
}