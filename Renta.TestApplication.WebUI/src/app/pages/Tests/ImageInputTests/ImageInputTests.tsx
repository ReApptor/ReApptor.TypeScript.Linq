import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ImageInput} from "@weare/athenaeum-react-components";
import {FileModel} from "@weare/athenaeum-toolkit";

export default class ImageInputTests extends BaseComponent {
    state = {
        picture: [],
        pictures: []
    }
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h4 className="pt-2 pb-2 ">ImageInput Single Upload</h4>
                <ImageInput
                    minimizeOnEmpty
                    pictures={this.state.picture}
                    convertImage={async (picture) => picture}
                    onChange={async (sender, picture) => {
                        this.setState({picture})
                        await this.reRenderAsync();
                    }}
                    rotateRightAsync={(image: FileModel) => new Promise<FileModel>((resolve => {
                        console.log('Rotating Image to right (no backend)');
                        resolve(image);
                    }))}
                    rotateLeftAsync={(image: FileModel) => new Promise<FileModel>((resolve => {
                        console.log('Rotating Image to left (no backend)');
                        resolve(image);
                    }))}
                />

                <h4 className="pt-2 pb-2 ">ImageInput Multiple Upload</h4>

                <ImageInput
                    multi
                    pictures={this.state.pictures}
                    convertImage={async (image) => image}
                    onChange={async (sender, pictures) => {
                        this.setState({pictures: pictures});
                        await this.reRenderAsync();
                    }}
                    rotateRightAsync={(image: FileModel) => new Promise<FileModel>((resolve => {
                        console.log('Rotating Image to right (no backend)');
                        resolve(image);
                    }))}
                    rotateLeftAsync={(image: FileModel) => new Promise<FileModel>((resolve => {
                        console.log('Rotating Image to left (no backend)');
                        resolve(image);
                    }))}
                />
            </React.Fragment>
        );
    }
}