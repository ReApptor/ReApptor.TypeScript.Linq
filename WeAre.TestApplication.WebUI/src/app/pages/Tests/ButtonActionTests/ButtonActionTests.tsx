import React from "react";
import {BaseComponent, ch, Justify} from "@weare/reapptor-react-common";
import {Button, ButtonType, Form, TwoColumns, ButtonContainer, FourColumns, ButtonAction, OneColumn} from "@weare/reapptor-react-components";
import {Utility} from "@weare/reapptor-toolkit";

interface IButtonTestsState {
}

export default class ButtonActionTests extends BaseComponent<{}, IButtonTestsState> {

    state: IButtonTestsState = {
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form onSubmit={() => ch.alertMessageAsync("Submit", true) }>
                    
                    <h5 className="pb-3 pt-3">Button with multiple actions and sync callback (Alert on click)</h5>
                    
                    <OneColumn className={"mt-3 d-flex justify-content-end"}>

                        <Button type={ButtonType.Orange} label={"Orange (multi)"}>
                            
                            <Button.Action title={"Action #1"} onClick={() => ch.alertMessageAsync("Action #1", true)} />
                            
                            <Button.Action title={"Action #2"} icon={{name: "fal plus"}} onClick={() => ch.alertMessageAsync("Action #2", true)} />
                            
                            <Button.Action title={"Action #3"} icon={{name: "fal plus"}} iconPosition={Justify.Right} onClick={() => ch.alertMessageAsync("Action #3", true)} />
                            
                        </Button>

                    </OneColumn>
                    
                    <h5 className="pb-3 pt-3">Button with multiple actions and async callback (3000ms delay) (Alert on click)</h5>

                    <OneColumn className={"mt-3 d-flex justify-content-end"}>

                        <Button type={ButtonType.Orange} label={"Orange (multi, icon)"} icon={{name: "far plus"}}>
                            
                            <Button.Action title={"Action #1"} onClick={ async () => { await Utility.wait(3000); await ch.alertMessageAsync("Action #1", true)}} />
                            
                            <Button.Action title={"Action #2"} icon={{name: "fal plus"}} onClick={ async () => { await Utility.wait(3000); await ch.alertMessageAsync("Action #2", true)}} />
                            
                            <Button.Action title={"Action #3"} icon={{name: "fal plus"}} iconPosition={Justify.Right} onClick={ async () => { await Utility.wait(3000); await ch.alertMessageAsync("Action #3", true)}} />
                        
                        </Button>

                    </OneColumn>
                    
                    <h5 className="pb-3 pt-3">Icon Button with multiple actions and async callback (3000ms delay) (Alert on click)</h5>

                    <OneColumn className={"mt-3 d-flex justify-content-end"}>

                        <Button type={ButtonType.Orange} label={"Orange"} icon={{name: "far plus"}}>

                            <Button.Action title={"Longer Text Action #1"} onClick={ async () => { await Utility.wait(3000); await ch.alertMessageAsync("Action #1", true)}} />

                            <Button.Action title={"Action #2"} icon={{name: "fal plus"}} onClick={ async () => { await Utility.wait(3000); await ch.alertMessageAsync("Action #2", true)}} />

                            <Button.Action title={"Action #3"} icon={{name: "fal plus"}} iconPosition={Justify.Right} onClick={ async () => { await Utility.wait(3000); await ch.alertMessageAsync("Action #3", true)}} />

                        </Button>

                    </OneColumn>

                </Form>

            </React.Fragment>
        );
    }
}