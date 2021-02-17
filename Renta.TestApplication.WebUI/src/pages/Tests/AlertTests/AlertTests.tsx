import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";

export default class AlertTests extends BaseComponent {
    
    private async confirmAsync(): Promise<void> {
        if (await ch.confirmAsync("Are you sure you want to confirm?")) {
            await ch.alertMessageAsync("YES", true);
        } else {
            await ch.alertMessageAsync("NO", true);
        }
    }
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <div className="p-2">
                    {/*<Button label="Programmatically" onClick={async () => await this.confirmAsync()} />*/}
                    <button onClick={async () => await this.confirmAsync()} >Programmatically</button>
                </div>

                <div className="p-2">
                    {/*<Button label="Button" confirm={"Are you sure?"} onClick={async () => await ch.alertMessageAsync("YES")} />*/}
                    <button onClick={async () => await ch.alertMessageAsync("YES")} >Button</button>
                </div>

                <div className="p-2">
                    {/*<Button label="Button with comment" confirm={{ title: "Are you sure?", comment: true }} onClick={async () => await ch.alertMessageAsync("YES")} />*/}
                    <button onClick={async () => await ch.alertMessageAsync("YES")} >Button with comment</button>
                </div>

                <div className="p-2">
                    {/*<Icon name="fal exclamation-triangle" className="blue" size={IconSize.X2} confirm={"Are you sure?"} onClick={async () => await ch.alertMessageAsync("YES")} />*/}
                </div>

                <div className="p-2">
                    {/*<Icon name="fal exclamation-triangle" className="blue" size={IconSize.X2} confirm={{ title: "Are you sure?", comment: true, minLength: 10 }} onClick={async () => await ch.alertMessageAsync("YES")} />*/}
                </div>
                
            </React.Fragment>
        );
    }
}