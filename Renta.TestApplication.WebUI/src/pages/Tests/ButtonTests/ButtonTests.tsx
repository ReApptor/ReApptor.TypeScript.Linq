import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {Button, ButtonType, Form, FourColumns} from "@weare/athenaeum-react-components";

interface IButtonTestsState {
}

export default class ButtonTests extends BaseComponent<{}, IButtonTestsState> {

    state: IButtonTestsState = {
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form onSubmit={() => ch.alertMessageAsync("Submit", true) }>

                    <FourColumns className={"mt-3"}>

                        <Button label={"Default (block)"} type={ButtonType.Default} block />

                        <Button label={"Orange (block)"} type={ButtonType.Orange} block />

                        <Button label={"Blue (block)"} type={ButtonType.Blue} block />

                        <Button label={"Primary (block)"} type={ButtonType.Primary} block />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Default (block, icon)"} type={ButtonType.Default} icon={{name: "far plus"}} block />

                        <Button label={"Orange (block, icon)"} type={ButtonType.Orange} icon={{name: "far plus"}} block />

                        <Button label={"Blue (block, icon)"} type={ButtonType.Blue} icon={{name: "far plus"}} block />

                        <Button label={"Primary (block, icon)"} type={ButtonType.Primary} icon={{name: "far plus"}} block />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Default (block, disabled)"} type={ButtonType.Default} block disabled />

                        <Button label={"Orange (block, disabled)"} type={ButtonType.Orange} block disabled />

                        <Button label={"Blue (block, disabled)"} type={ButtonType.Blue} block disabled />

                        <Button label={"Primary (block, disabled)"} type={ButtonType.Primary} block disabled />

                    </FourColumns>
                    
                    <FourColumns className={"mt-3"}>

                        <Button label={"Secondary (block)"} type={ButtonType.Secondary} block />

                        <Button label={"Success (block)"} type={ButtonType.Success} block />

                        <Button label={"Danger (block)"} type={ButtonType.Danger} block />

                        <Button label={"Warning (block)"} type={ButtonType.Warning} block />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Secondary (block, disabled)"} type={ButtonType.Secondary} block disabled />

                        <Button label={"Success (block, disabled)"} type={ButtonType.Success} block disabled />

                        <Button label={"Danger (block, disabled)"} type={ButtonType.Danger} block disabled />

                        <Button label={"Warning (block, disabled)"} type={ButtonType.Warning} block disabled />

                    </FourColumns>

                    <FourColumns className={"mt-3"}>

                        <Button label={"Info (block)"} type={ButtonType.Info} block />

                        <Button label={"Light (block)"} type={ButtonType.Light} block />

                        <Button label={"Dark (block)"} type={ButtonType.Dark} block />

                        <Button label={"Link (block)"} type={ButtonType.Link} block />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Info (block, disabled)"} type={ButtonType.Info} block disabled />

                        <Button label={"Light (block, disabled)"} type={ButtonType.Light} block disabled />

                        <Button label={"Dark (block, disabled)"} type={ButtonType.Dark} block disabled />

                        <Button label={"Link (block, disabled)"} type={ButtonType.Link} block disabled />

                    </FourColumns>

                    <FourColumns className={"mt-3"}>

                        <Button label={"Unset (block)"} type={ButtonType.Unset} block />

                        <Button label={"Text (block)"} type={ButtonType.Text} block />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Unset (block, disabled)"} type={ButtonType.Unset} block disabled />

                        <Button label={"Text (block, disabled)"} type={ButtonType.Text} block disabled />

                    </FourColumns>

                    <FourColumns className={"mt-3"}>

                        <Button label={"Orange"} type={ButtonType.Orange} />

                        <Button label={"Orange (icon)"} icon={{name: "fal plus"}} type={ButtonType.Orange} />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Orange (small)"} type={ButtonType.Orange} />

                        <Button label={"Orange (small, icon)"} icon={{name: "fal plus"}} type={ButtonType.Orange} small />

                    </FourColumns>

                </Form>

            </React.Fragment>
        );
    }
}