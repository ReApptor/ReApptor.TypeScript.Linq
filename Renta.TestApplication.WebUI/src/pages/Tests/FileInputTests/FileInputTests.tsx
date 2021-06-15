import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {AthenaeumComponentsConstants, FileInput} from "@weare/athenaeum-react-components";

export default class FileInputTests extends BaseComponent {

    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <FileInput id={"photo"} dropZone
                           label={"EN: Photo"}
                           placeholder={"Push me!"}
                           fileTypes={AthenaeumComponentsConstants.imageFileTypes}
                />
                           
            </React.Fragment>
        );
    }
}