import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import { Form, ThreeColumns, NumberInput, NumberInputBehaviour } from "@weare/reapptor-react-components";

export default class NumberInputTests extends BaseComponent {

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <Form>

                    <ThreeColumns>

                        <NumberInput label={"Test (step 0.01, [min = 1; max = 10])"} step={0.01} min={1} max={10} />

                        <NumberInput label={"Test (step 0.01, [min = -10; max = 10])"} step={0.01} min={-10} max={10} />

                        <NumberInput label={"Test (step 1, [min = -10; max = 10])"} step={1} min={-10} max={10} />

                    </ThreeColumns>

                    <ThreeColumns>

                        <NumberInput label={"Test (step 0.01, [min = 1; max = 10], Behaviour:Restricted)"} step={0.01} min={1} max={10} behaviour={NumberInputBehaviour.Restricted} />

                        <NumberInput label={"Test (step 0.01, [min = 1; max = 10], Behaviour:OnChange)"} step={0.01} min={1} max={10} behaviour={NumberInputBehaviour.ValidationOnChange} />

                        <NumberInput label={"Test (step 0.01, [min = 1; max = 10]), Behaviour:OnSave"} step={0.01} min={1} max={10} behaviour={NumberInputBehaviour.ValidationOnSave} />

                    </ThreeColumns>

                    <ThreeColumns>

                        <NumberInput label={"Test (step 1, hide zero, hide arrows)"} step={1} hideZero={true} hideArrows={true} placeholder={"Input me"} />

                    </ThreeColumns>

                </Form>

            </React.Fragment>
        );
    }
}