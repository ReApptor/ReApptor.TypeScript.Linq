import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ImageEditor} from "@weare/athenaeum-react-components";

export default class ImageEditorTests extends BaseComponent {
    state = {
        singleList: [],
        multipleList: []
    }
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h4 className="pt-2 pb-2 ">ImageEditor Single Upload</h4>
                <ImageEditor
                    pictures={this.state.singleList}
                    convertImage={async (image) => image}
                    onChange={async (imageList) => {
                        this.setState({singleList: imageList})
                    }}/>

                <h4 className="pt-2 pb-2 ">ImageEditor Multiple Upload</h4>

                <ImageEditor
                    multi
                    pictures={this.state.multipleList}
                    convertImage={async (image) => image}
                    onChange={async (imageList) => {
                        this.setState({multipleList: imageList})
                    }}/>
            </React.Fragment>
        );
    }
}