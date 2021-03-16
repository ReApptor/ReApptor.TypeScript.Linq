import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import CheckboxNullable from "@/components/CheckboxNullable/CheckboxNullable";
import SwitchNullable from "@/components/SwitchNullable/SwitchNullable";

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