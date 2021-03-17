import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { CheckboxNullable, SwitchNullable } from "@weare/athenaeum-react-components";

export default class NullableSwitchTests extends BaseComponent {

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <SwitchNullable label={"Nullable switch"} leftLabel={"Off"} rightLabel={"On"} />

                <CheckboxNullable label={"Nullable checkbox"} />

            </React.Fragment>
        );
    }
}