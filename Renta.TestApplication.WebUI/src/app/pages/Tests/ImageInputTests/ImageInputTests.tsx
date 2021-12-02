import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {Button, Checkbox, FourColumns, ImageInput, InlineType, IIMageInputToolbar, ImageInputToolbar} from "@weare/athenaeum-react-components";
import {FileModel} from "@weare/athenaeum-toolkit";

interface IIMageInputTestsState {
    picture: string | null;
    pictures: FileModel[];
    noSelectionToolbar: IIMageInputToolbar;
    selectionToolbar: IIMageInputToolbar;
    editToolbar: IIMageInputToolbar;
    previewToolbar: IIMageInputToolbar;
}

export default class ImageInputTests extends BaseComponent {

    public state: IIMageInputTestsState = {
        picture: null,
        pictures: [],
        noSelectionToolbar: ImageInputToolbar.defaultNoSelectionToolbar,
        selectionToolbar: ImageInputToolbar.defaultSelectionToolbar,
        editToolbar: ImageInputToolbar.defaultEditToolbar,
        previewToolbar: ImageInputToolbar.defaultPreviewToolbar,
    };

    private async initPictureAsync(): Promise<void> {
        const picture: string = "data:image/png;base64,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";
        await this.setState({
            picture,
            pictures: [new FileModel(picture)],
        });
    }

    private async setPictureFileAsync(files: FileModel[]): Promise<void> {
        await this.setState({
            picture: (files.length > 0)
                ? files[0].src
                : ""
        });
    }

    private renderToolbarEditor(header: string, toolbar: IIMageInputToolbar): React.ReactNode {
        return (
            <div className="mb-4">
                <h5 className="mb-2">{header}</h5>

                <FourColumns>

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Rotate buttons"}
                              value={toolbar.rotateButton}
                              onChange={async (_, checked) => {toolbar.rotateButton = checked; await this.reRenderAsync();}}
                    />

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Rotate mini buttons"}
                              value={toolbar.rotateMiniButton}
                              onChange={async (_, checked) => {toolbar.rotateMiniButton = checked; await this.reRenderAsync();}}
                    />

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Move to top"}
                              value={toolbar.moveToTopButton}
                              onChange={async (_, checked) => {toolbar.moveToTopButton = checked; await this.reRenderAsync();}}
                    />

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Move up"}
                              value={toolbar.moveUpButton}
                              onChange={async (_, checked) => {toolbar.moveUpButton = checked; await this.reRenderAsync();}}
                    />

                </FourColumns>

                <FourColumns>

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Move down"}
                              value={toolbar.moveDownButton}
                              onChange={async (_, checked) => {toolbar.moveDownButton = checked; await this.reRenderAsync();}}
                    />

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Edit"}
                              value={toolbar.editButton}
                              onChange={async (_, checked) => {toolbar.editButton = checked; await this.reRenderAsync();}}
                    />

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Preview"}
                              value={toolbar.previewButton}
                              onChange={async (_, checked) => {toolbar.previewButton = checked; await this.reRenderAsync();}}
                    />

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Upload"}
                              value={toolbar.uploadButton}
                              onChange={async (_, checked) => {toolbar.uploadButton = checked; await this.reRenderAsync();}}
                    />

                </FourColumns>

                <FourColumns>

                    <Checkbox inline
                              inlineType={InlineType.Right}
                              label={"Take picture"}
                              value={toolbar.takePictureButton}
                              onChange={async (_, checked) => {toolbar.takePictureButton = checked; await this.reRenderAsync();}}
                    />

                </FourColumns>
            </div>
        );
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Button label={"Set picture"} onClick={() => this.initPictureAsync()} />

                {/*<h4>Toolbar settings</h4>*/}

                {/*{*/}
                {/*    this.renderToolbarEditor("No selection", this.state.noSelectionToolbar)*/}
                {/*}*/}

                {/*{*/}
                {/*    this.renderToolbarEditor("Selection", this.state.selectionToolbar)*/}
                {/*}*/}

                {/*{*/}
                {/*    this.renderToolbarEditor("Preview", this.state.previewToolbar)*/}
                {/*}*/}

                {/*{*/}
                {/*    this.renderToolbarEditor("Edit", this.state.editToolbar)*/}
                {/*}*/}

                <h4 className="pt-2 pb-2 ">ImageInput Single Upload</h4>

                <ImageInput minimizeOnEmpty
                            model={{value: this.state.pictures}}
                            noSelectionToolbar={this.state.noSelectionToolbar}
                            selectionToolbar={this.state.selectionToolbar}
                            editToolbar={this.state.editToolbar}
                            previewToolbar={this.state.previewToolbar}
                            onUpload={async (fileModel: FileModel) => {
                                await ch.alertMessageAsync(`Mock onUploadAsync: Uploaded: ${fileModel.name}`, true, true)

                                return fileModel;
                            }}
                            onChange={async (sender, pictures) => {
                                await this.setState({pictures: pictures})
                                await ch.alertMessageAsync(`Mock onChangeAsync: Updated`, true, true)
                            }}
                />

                <h4 className="pt-2 pb-2 ">ImageInput Multiple Upload</h4>

                <ImageInput multiple
                            model={{value: this.state.pictures}}

                            noSelectionToolbar={this.state.noSelectionToolbar}
                            selectionToolbar={this.state.selectionToolbar}
                            editToolbar={this.state.editToolbar}
                            previewToolbar={this.state.previewToolbar}

                            onUpload={async (fileModel: FileModel) => {
                                await ch.alertMessageAsync(`Mock onUploadAsync: Uploaded: ${fileModel.name}`, true, true)

                                return fileModel;
                            }}
                            onChange={async (sender, pictures) => {
                                await this.setState({pictures: pictures})
                                await ch.alertMessageAsync(`Mock onChangeAsync: Updated`, true, true)
                            }}
                />

            </React.Fragment>
        );
    }
}