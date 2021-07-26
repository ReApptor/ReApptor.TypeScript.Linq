import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {Button, Checkbox, Icon, IconSize, InlineType} from "@weare/athenaeum-react-components";
import {Utility} from "@weare/athenaeum-toolkit";

export default class AlertTests extends BaseComponent {
    
    private _autoClose: boolean = true;

    private async confirmAsync(): Promise<void> {
        if (await ch.confirmAsync("Are you sure you want to confirm?")) {
            await ch.alertMessageAsync("YES", this._autoClose);
        } else {
            await ch.alertMessageAsync("NO", this._autoClose);
        }
    }

    private async doubleConfirmAsync(): Promise<void> {
        if (await ch.confirmAsync("Are you sure you want to confirm?")) {

            await Utility.wait(3000);

            if (await ch.confirmAsync("Double check?")) {
                await Utility.wait(3000);

                await ch.alertMessageAsync("YES", this._autoClose);
            }
            
        } else {
            await ch.alertMessageAsync("NO", this._autoClose);
        }
    }
    
    private async onSubmitAsync(delay: boolean): Promise<void> {
        if (delay) {
            await Utility.wait(5000);
        }
        await ch.alertMessageAsync("YES");
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <div className="p-2">
                    <Checkbox label="Auto close" inline inlineType={InlineType.Right}
                              value={this._autoClose}
                              onChange={async (sender, value) => {this._autoClose = value}}
                    />
                </div>

                <div className="p-2">
                    <Button label="Programmatically" onClick={async () => await this.confirmAsync()} />
                </div>

                <div className="p-2">
                    <Button label="Programmatically with inner processing" onClick={async () => await this.doubleConfirmAsync()} />
                </div>

                <div className="p-2">
                    <Button label="Button" confirm={"Are you sure?"} onClick={async () => await ch.alertMessageAsync("YES")} />
                </div>

                <div className="p-2">
                    <Button label="Button with comment and delay" confirm={{ title: "Are you sure?", comment: true }} onClick={async () => this.onSubmitAsync(true)} />
                </div>

                <div className="p-2">
                    <Icon name="fal exclamation-triangle" className="blue" size={IconSize.X2} confirm={"Are you sure?"} onClick={async () => await ch.alertMessageAsync("YES")} />
                </div>

                <div className="p-2">
                    <Icon name="fal exclamation-triangle" className="blue" size={IconSize.X2} confirm={{ title: "Are you sure?", comment: true, minLength: 10 }} onClick={async () => await ch.alertMessageAsync("YES")} />
                </div>

            </React.Fragment>
        );
    }
}