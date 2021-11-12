import React from "react";
import {BaseComponent, ch, DocumentPreviewSize} from "@weare/athenaeum-react-common";
import {GoogleMap} from "@weare/athenaeum-react-components";

interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
}

export default class GoogleMapTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium
    };

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <GoogleMap height={"50vh"}
                           initialCenter={{lat: 50, lng: 50}}
                           initialZoom={5}
                />
            </React.Fragment>
        );
    }
}