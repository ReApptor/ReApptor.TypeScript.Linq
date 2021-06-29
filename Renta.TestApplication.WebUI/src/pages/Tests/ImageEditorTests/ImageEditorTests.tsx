import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ImageEditor} from "@weare/athenaeum-react-components";

export default class ImageEditorTests extends BaseComponent {
    state = {
        picture: [],
        pictures: []
    }
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h4 className="pt-2 pb-2 ">ImageEditor Single Upload</h4>
                <ImageEditor
                    pictures={this.state.picture}
                    convertImage={async (picture) => picture}
                    onChange={async (sender, picture) => {
                        this.setState({picture})
                    }}/>

                <h4 className="pt-2 pb-2 ">ImageEditor Multiple Upload</h4>

                <ImageEditor
                    multi
                    pictures={this.state.pictures}
                    convertImage={async (image) => image}
                    onChange={async (sender, pictures) => {
                        this.setState({pictures: pictures})
                    }}/>
            </React.Fragment>
        );
    }
}