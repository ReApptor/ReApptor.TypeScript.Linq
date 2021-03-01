import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { NullableCheckbox, NullableSwitch } from "@weare/athenaeum-react-components";

export default class NullableSwitchTests extends BaseComponent {
    
    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <NullableSwitch label={"Nullable switch"} leftLabel={"Off"} rightLabel={"On"} />
                
                <NullableCheckbox label={"Nullable checkbox"} />
                
            </React.Fragment>
        );
    }
}