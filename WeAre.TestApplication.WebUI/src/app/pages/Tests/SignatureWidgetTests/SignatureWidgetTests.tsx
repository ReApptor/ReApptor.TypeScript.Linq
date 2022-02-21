import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {SignatureWidget, WidgetContainer} from "@weare/reapptor-react-components";

export default class SignatureWidgetTests extends BaseComponent {
    
    private async onSignAsync(signature: string | null): Promise<void> {
        await ch.alertMessageAsync("Signature result: {0}".format(signature).substring(0, 75) + "...", true);
    }

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <WidgetContainer>

                    <SignatureWidget id="Signature" label="Signature" description={"Signature input..."} onSign={(signature) => this.onSignAsync(signature)} />

                </WidgetContainer>

            </React.Fragment>
        );
    }
}