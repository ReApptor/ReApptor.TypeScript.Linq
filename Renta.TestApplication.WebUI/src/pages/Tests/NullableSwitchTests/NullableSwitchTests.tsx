import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import CheckboxNullable from "@weare/athenaeum-react-components/components/CheckboxNullable/CheckboxNullable";
import SwitchNullable from "@weare/athenaeum-react-components/components/SwitchNullable/SwitchNullable";

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