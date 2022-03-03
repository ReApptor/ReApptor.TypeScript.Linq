import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {Button, ButtonType, ButtonContainer} from "@weare/reapptor-react-components";

interface IButtonTestsState {
}

export default class ButtonContainerTests extends BaseComponent<{}, IButtonTestsState> {

    state: IButtonTestsState = {
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <h5 className="pb-3 pt-5">ButtonContainer with two right sided buttons</h5>

                <ButtonContainer className={"mt-3"}>

                    <Button right label={"Orange"} type={ButtonType.Orange}/>

                    <Button right label={"Orange (icon)"} icon={{name: "fal plus"}} type={ButtonType.Orange}/>

                </ButtonContainer>

                <h5 className="pb-3 pt-5">ButtonContainer with two not defined side button</h5>

                <ButtonContainer className={"mt-3"}>

                    <Button label={"Orange"} type={ButtonType.Orange}/>

                    <Button label={"Orange (icon)"} icon={{name: "fal plus"}} type={ButtonType.Orange}/>

                </ButtonContainer>
                
                <h5 className="pb-3 pt-5">ButtonContainer with three not defined side button</h5>

                <ButtonContainer className={"mt-3"}>

                    <Button label={"Default (icon)"} icon={{name: "far plus"}} />

                    <Button label={"Blue (icon)"} icon={{name: "far user"}} type={ButtonType.Blue} />

                    <Button label={"Orange (icon)"} icon={{name: "far user"}} type={ButtonType.Orange} />

                </ButtonContainer>

                <h5 className="pb-3 pt-5">ButtonContainer with three not defined side button (disabled)</h5>

                <ButtonContainer>

                    <Button label={"Default (icon, disabled)"} icon={{name: "far plus"}} disabled />

                    <Button label={"Blue (icon, disabled)"} icon={{name: "far user"}} type={ButtonType.Blue} disabled />

                    <Button label={"Orange (icon, disabled)"} icon={{name: "far user"}} type={ButtonType.Orange} disabled />

                </ButtonContainer>

                <h5 className="pb-3 pt-5">ButtonContainer with left buttons only</h5>

                <ButtonContainer>

                    <Button label={"Default (icon, disabled)"} icon={{name: "far plus"}} right={false} />

                    <Button label={"Blue (icon, disabled)"} icon={{name: "far user"}} right={false} />

                    <Button label={"Orange (icon, disabled)"} icon={{name: "far user"}} right={false} />

                </ButtonContainer>

                <h5 className="pb-3 pt-5">ButtonContainer with block buttons</h5>

                <ButtonContainer>

                    <Button label={"Default (icon, disabled)"} icon={{name: "far plus"}} block right={false} />

                    <Button label={"Blue (icon, disabled)"} icon={{name: "far user"}} block right />

                    <Button label={"Orange (icon, disabled)"} icon={{name: "far user"}} block right />

                </ButtonContainer>

            </React.Fragment>
        );
    }
}