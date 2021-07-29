import React from "react";
import {BaseComponent, DialogResult, MessageBoxButtons, IMessageBoxButtons, MessageBoxIcon, ch} from "@weare/athenaeum-react-common";
import {
    Form, TextInput, ButtonType,
    TwoColumns,
    Dropdown,
    DropdownOrderBy,
    SelectListItem,
    Button
} from "@weare/athenaeum-react-components";

import styles from "./MessageBoxTests.module.scss";

export interface IMessageBoxTestsState {
    title: string,
    caption?: string,
    buttons?: MessageBoxButtons,
    customButtons: IMessageBoxButtons,
    icon?: MessageBoxIcon,
}

export default class MessageBoxTests extends BaseComponent<{}, IMessageBoxTestsState> {

    state: IMessageBoxTestsState = {
        title: "",
        caption: undefined,
        buttons: undefined,
        customButtons: {},
        icon: undefined,
    };
    
    private async messageBoxTestAsync(): Promise<void> {
        const buttons: MessageBoxButtons | IMessageBoxButtons | undefined = (this.state.buttons != MessageBoxButtons.Custom) ? this.state.buttons : this.state.customButtons;
        const result: DialogResult = await ch.messageBoxAsync(this.state.title, this.state.caption, buttons, this.state.icon);
        await ch.alertMessageAsync("Dialog result: \"" + this.getDilogResultName(result) + "\"", true);
    }

    private getDilogResultName(item: DialogResult): string {
        switch (item) {
            case DialogResult.None: return "None";
            case DialogResult.OK: return "OK";
            case DialogResult.Cancel: return "Cancel";
            case DialogResult.Abort: return "Abort";
            case DialogResult.Retry: return "Retry";
            case DialogResult.Ignore: return "Ignore";
            case DialogResult.Yes: return "Yes";
            case DialogResult.No: return "No";
        }
    }

    private getMessageBoxButtonsName(item: MessageBoxButtons): string {
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

    private getMessageBoxIconName(item: MessageBoxIcon): string {
        switch (item) {
            case MessageBoxIcon.None: return "None";
            case MessageBoxIcon.Hand: return "Hand";
            case MessageBoxIcon.Stop: return "Stop";
            case MessageBoxIcon.Error: return "Error";
            case MessageBoxIcon.Question: return "Question";
            case MessageBoxIcon.Exclamation: return "Exclamation";
            case MessageBoxIcon.Warning: return "Warning";
            case MessageBoxIcon.Asterisk: return "Asterisk";
            case MessageBoxIcon.Information: return "Information";
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
                                      transform={(item) => new SelectListItem(item.toString(), this.getMessageBoxButtonsName(item), null, item)}
                                      items={[MessageBoxButtons.OK, MessageBoxButtons.OKCancel, MessageBoxButtons.AbortRetryIgnore, MessageBoxButtons.YesNoCancel, MessageBoxButtons.YesNo, MessageBoxButtons.RetryCancel, MessageBoxButtons.Custom]}
                                      selectedItem={this.state.buttons}
                                      onChange={async (sender, value) => await this.setState({ buttons: value || undefined })}
                            />
                            
                            <Dropdown label="Select icon" noValidate noWrap noFilter
                                      orderBy={DropdownOrderBy.None}
                                      transform={(item) => new SelectListItem(item.toString(), this.getMessageBoxIconName(item), null, item)}
                                      items={[MessageBoxIcon.None, MessageBoxIcon.Hand, MessageBoxIcon.Stop, MessageBoxIcon.Error, MessageBoxIcon.Question, MessageBoxIcon.Exclamation, MessageBoxIcon.Warning, MessageBoxIcon.Asterisk, MessageBoxIcon.Information]}
                                      selectedItem={this.state.icon}
                                      onChange={async (sender, value) => await this.setState({ icon: value || undefined })}
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