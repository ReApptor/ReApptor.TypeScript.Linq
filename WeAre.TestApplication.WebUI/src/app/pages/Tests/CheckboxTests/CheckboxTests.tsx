import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {Checkbox, Form, TwoColumns, InlineType} from "@weare/reapptor-react-components";

interface IButtonTestsState {
}

export default class CheckboxTests extends BaseComponent<{}, IButtonTestsState> {

    state: IButtonTestsState = {
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form className="pt-3" onSubmit={() => ch.alertMessageAsync("Submit", true)}>
                    <TwoColumns className="mt-4 mb-4">

                        <Checkbox label={"Default (false)"} inlineType={InlineType.Left}/>

                        <Checkbox value label={"Default (true)"} inlineType={InlineType.Left}/>

                    </TwoColumns>
                    
                    <TwoColumns className="mt-4 mb-4">

                        <Checkbox label={"Default (false) (readonly)"} inlineType={InlineType.Left} readonly/>

                        <Checkbox value label={"Default (true) (readonly)"} inlineType={InlineType.Left} readonly/>

                    </TwoColumns>

                    <TwoColumns className="mt-4 mb-4">

                        <Checkbox value label={"Manual service\n<mark>Lorem ipsum dolor sit amet.</mark>"} inlineType={InlineType.Left}/>

                        <Checkbox value label={"Manual service\n<small>Lorem ipsum dolor sit amet.</small>"} inlineType={InlineType.Left}/>

                    </TwoColumns>

                    <TwoColumns className="mt-4 mb-4">

                        <Checkbox value inline
                                  inlineType={InlineType.Right}
                                  label={"Manual service\n<b>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, ducimus?</b>"}
                        />

                        <Checkbox value inline
                                  inlineType={InlineType.Right}
                                  label={"Manual service\n<i>The service is triggered manually</i>"}
                        />

                    </TwoColumns>

                    <TwoColumns className="mt-4 mb-4">

                        <Checkbox value inline
                                  inlineType={InlineType.Left}
                                  label={"What is this \n<b>Bold</b> \n<small>SmallText</small> \n<i>Italic</i> \n<mark>Mark</mark>\nDoing here"}
                        />
                        
                        <Checkbox value inline
                                  inlineType={InlineType.Left}
                                  label={"What is this <b>Bold</b> <small>SmallText</small> <i>Italic</i> <mark>Mark</mark> Doing here"}
                        />

                    </TwoColumns>
                </Form>

            </React.Fragment>
        );
    }
}