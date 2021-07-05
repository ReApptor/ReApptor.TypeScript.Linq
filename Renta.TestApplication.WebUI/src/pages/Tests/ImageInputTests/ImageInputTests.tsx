import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ImageInput} from "@weare/athenaeum-react-components";

export default class ImageInputTests extends BaseComponent {

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <ImageInput />

            </React.Fragment>
        );
    }
}