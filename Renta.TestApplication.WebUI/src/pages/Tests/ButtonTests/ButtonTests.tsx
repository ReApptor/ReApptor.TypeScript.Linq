import React from "react";
import {BaseComponent, ch, Justify} from "@weare/athenaeum-react-common";
import Form from "@/components/Form/Form";
import Button, { ButtonType } from "@/components/Button/Button";
import FourColumns from "@/components/LayoutFourColumns/LayoutFourColumns";
import ButtonContainer from "@/components/ButtonContainer/ButtonContainer";
import LayoutTwoColumns from "@/components/LayoutTwoColumns/LayoutTwoColumns";

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

                        <Button label={"Default (block, disabled)"} type={ButtonType.Default} block disabled />

                        <Button label={"Orange (block, disabled)"} type={ButtonType.Orange} block disabled />

                        <Button label={"Blue (block, disabled)"} type={ButtonType.Blue} block disabled />

                        <Button label={"Primary (block, disabled)"} type={ButtonType.Primary} block disabled />

                    </FourColumns>

                    <FourColumns>

                        <Button label={"Default (block, icon)"} type={ButtonType.Default} icon={{name: "far plus"}} block />

                        <Button label={"Orange (block, icon)"} type={ButtonType.Orange} icon={{name: "far plus"}} block />

                        <Button label={"Blue (block, icon)"} type={ButtonType.Blue} icon={{name: "far plus"}} block />

                        <Button label={"Primary (block, icon)"} type={ButtonType.Primary} icon={{name: "far plus"}} block />

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

                    <ButtonContainer className={"mt-3"}>

                        <Button label={"Default (icon)"} icon={{name: "far plus"}} />

                        <Button label={"Blue (icon)"} icon={{name: "far user"}} type={ButtonType.Blue} />

                        <Button label={"Orange (icon)"} icon={{name: "far user"}} type={ButtonType.Orange} />

                    </ButtonContainer>

                    <ButtonContainer>

                        <Button label={"Default (icon, disabled)"} icon={{name: "far plus"}} disabled />

                        <Button label={"Blue (icon, disabled)"} icon={{name: "far user"}} type={ButtonType.Blue} disabled />

                        <Button label={"Orange (icon, disabled)"} icon={{name: "far user"}} type={ButtonType.Orange} disabled />

                    </ButtonContainer>

                    <LayoutTwoColumns className={"mt-3"}>

                        <Button type={ButtonType.Orange} label={"Orange (multi)"}>
                            <Button.Action title={"Action #1"} onClick={() => ch.alertMessageAsync("Action #1", true)} />
                            <Button.Action title={"Action #2"} icon={{name: "fal plus"}} onClick={() => ch.alertMessageAsync("Action #2", true)} />
                            <Button.Action title={"Action #3"} icon={{name: "fal plus"}} iconPosition={Justify.Right} onClick={() => ch.alertMessageAsync("Action #3", true)} />
                        </Button>

                        <Button type={ButtonType.Orange} label={"Orange (multi, icon)"} icon={{name: "far plus"}}>
                            <Button.Action title={"Action #1"} onClick={() => ch.alertMessageAsync("Action #1", true)} />
                            <Button.Action title={"Action #2"} icon={{name: "fal plus"}} onClick={() => ch.alertMessageAsync("Action #2", true)} />
                            <Button.Action title={"Action #3"} icon={{name: "fal plus"}} iconPosition={Justify.Right} onClick={() => ch.alertMessageAsync("Action #3", true)} />
                        </Button>

                    </LayoutTwoColumns>

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