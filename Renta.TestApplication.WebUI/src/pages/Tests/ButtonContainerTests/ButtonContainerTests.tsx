import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Button, ButtonType, ButtonContainer} from "@weare/athenaeum-react-components";

interface IButtonTestsState {
}

export default class ButtonContainerTests extends BaseComponent<{}, IButtonTestsState> {

    state: IButtonTestsState = {
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <ButtonContainer className={"mt-3"}>

                    <Button right label={"Orange"} type={ButtonType.Orange}/>

                    <Button right label={"Orange (icon)"} icon={{name: "fal plus"}} type={ButtonType.Orange}/>

                </ButtonContainer>

                <ButtonContainer className={"mt-3"}>

                    <Button label={"Orange"} type={ButtonType.Orange}/>

                    <Button label={"Orange (icon)"} icon={{name: "fal plus"}} type={ButtonType.Orange}/>

                </ButtonContainer>

            </React.Fragment>
        );
    }
}