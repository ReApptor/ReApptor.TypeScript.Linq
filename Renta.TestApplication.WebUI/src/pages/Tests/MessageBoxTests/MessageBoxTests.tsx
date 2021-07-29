import React from "react";
import {BaseComponent, DialogResult, MessageBoxButtons, ch} from "@weare/athenaeum-react-common";
import {
    Form, TextInput, ButtonType,
    TwoColumns,
    Dropdown,
    DropdownAlign,
    DropdownOrderBy,
    DropdownRequiredType,
    DropdownSelectType,
    DropdownSubtextType,
    DropdownVerticalAlign,
    SelectListItem,
    Button
} from "@weare/athenaeum-react-components";

import styles from "./MessageBoxTests.module.scss";

export interface IMessageBoxTestsState {
    title: string,
    caption?: string,
    buttons?: MessageBoxButtons,
}

export default class MessageBoxTests extends BaseComponent<{}, IMessageBoxTestsState> {

    state: IMessageBoxTestsState = {
        title: "",
        caption: undefined,
        buttons: undefined,
    };
    
    private async messageBoxTestAsync(): Promise<void> {
        const result: DialogResult = await ch.messageBoxAsync(this.state.title, this.state.caption, this.state.buttons);
        
        await ch.alertMessageAsync("Dialog result: \"" + result + "\"", true);
    }

    private getDropdownMessageBoxButtonsName(item: MessageBoxButtons): string {
        switch (item) {
            case MessageBoxButtons.OK: return "OK";
            case MessageBoxButtons.OKCancel: return "OK - Cancel";
            case MessageBoxButtons.AbortRetryIgnore: return "Abort - Retry - Ignore";
            case MessageBoxButtons.YesNoCancel: return "Yes - No - Cancel";
            case MessageBoxButtons.YesNo: return "Yes - No";
            case MessageBoxButtons.RetryCancel: return "Retry - Cancel";
            case MessageBoxButtons.Custom: return "Custom";
        }
    }

    public render(): React.ReactNode {
        
        return (
            <div className={styles.dropdownTests}>
                
                <TwoColumns>

                    <Form onSubmit={() => this.messageBoxTestAsync()}>
                        
                        <TwoColumns>

                            <TextInput label="Title"
                                       placeholder="Are you sure?"
                                       value={this.state.title}
                                       onChange={async (sender, value) => await this.setState({title: value})}
                            />
                            
                            <TextInput label="Caption"
                                       value={this.state.caption}
                                       onChange={async (sender, value) => await this.setState({caption: value})}
                            />

                        </TwoColumns>
                        
                        <TwoColumns>
                            
                            <Dropdown label="Select buttons" noValidate noWrap noFilter
                                      orderBy={DropdownOrderBy.None}
                                      transform={(item) => new SelectListItem(item.toString(), this.getDropdownMessageBoxButtonsName(item), null, item)}
                                      items={[MessageBoxButtons.OK, MessageBoxButtons.OKCancel, MessageBoxButtons.AbortRetryIgnore, MessageBoxButtons.YesNoCancel, MessageBoxButtons.YesNo, MessageBoxButtons.RetryCancel, MessageBoxButtons.Custom]}
                                      selectedItem={this.state.buttons}
                                      onChange={async (sender, value) => await this.setState({ buttons: value || undefined })}
                            />
                            
                        </TwoColumns>
                        
                        <hr/>

                        {/*<Checkbox label="Generate groups" inline*/}
                        {/*          value={this.state.generateGroups}*/}
                        {/*          onChange={async (sender, value) => { this._items = null; await this.setState({generateGroups: value}) }}*/}
                        {/*/>*/}
                        
                        {/*<Dropdown label="Subtext Type" inline required noValidate noWrap noFilter*/}
                        {/*          orderBy={DropdownOrderBy.None}*/}
                        {/*          transform={(item) => new SelectListItem(item.toString(), this.getDropdownSubtextTypeName(item), null, item)}*/}
                        {/*          items={[DropdownSubtextType.Row, DropdownSubtextType.Inline, DropdownSubtextType.Hidden]}*/}
                        {/*          selectedItem={this.state.subtextType}*/}
                        {/*          onChange={async (sender, value) => await this.setState({ subtextType: value! })}*/}
                        {/*/>*/}
                        
                        <Button submit type={ButtonType.Orange} label="Show" />
                        
                    </Form>

                </TwoColumns>

            </div>
        );
    }
}