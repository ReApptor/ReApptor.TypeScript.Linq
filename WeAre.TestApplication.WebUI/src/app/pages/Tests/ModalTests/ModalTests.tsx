import React from "react";
import {FileModel} from "@weare/reapptor-toolkit";
import {BaseComponent, ch, DocumentPreviewSize} from "@weare/reapptor-react-common";
import {Button, Checkbox, Modal, ImageModal, ModalSize, Form} from "@weare/reapptor-react-components";
import {samplePdf} from './samplePdf';
import {sampleImage} from './sampleImage';

interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
    notResponsive: boolean;
    noHeader: boolean;
    closeConfirm: boolean,
}

export default class ModalTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium,
        notResponsive: false,
        noHeader: false,
        closeConfirm: false,
    };

    private readonly _document1: FileModel = new FileModel(samplePdf);

    public get exampleImageFileModel(): FileModel {
        const fileModel = new FileModel(sampleImage);

        fileModel.type = "image/jpeg";
        fileModel.size = 72824;
        fileModel.name = "Some.jpg";

        return fileModel;
    }

    public render(): React.ReactNode {


        return (
            <React.Fragment>

                <Form>

                    <Checkbox inline
                              label="Not responsive"
                              value={this.state.notResponsive}
                              onChange={async (sender, value) => {await this.setState({notResponsive: value})}}
                    />

                    <Checkbox inline
                              label="No header"
                              value={this.state.noHeader}
                              onChange={async (sender, value) => {await this.setState({noHeader: value})}}
                    />

                    <Checkbox inline
                              label="Close confirm"
                              value={this.state.closeConfirm}
                              onChange={async (sender, value) => {await this.setState({closeConfirm: value})}}
                    />

                </Form>


                <Modal id={"modal_1"} title={"Modal #1"} notResponsive={this.state.notResponsive} noHeader={this.state.noHeader} closeConfirm={this.state.closeConfirm}>
                    <p>Test content for modal #1</p>
                </Modal>

                <Button label={"Open modal #1"} toggleModal dataTarget={"modal_1"}/>

                <Checkbox label={"Large document size"} inline
                          value={this.state.documentPreviewSize == DocumentPreviewSize.Large}
                          onChange={async (sender, value) => await this.setState({documentPreviewSize: value ? DocumentPreviewSize.Large : DocumentPreviewSize.Medium})}
                />

                <Button label={"Document preview #1"} onClick={async () => await ch.preloadedDocumentPreviewAsync(this._document1, "document 1", this.state.documentPreviewSize)} />

                <ImageModal id={"imageModal_1"} 
                            title={"ImageModal"} 
                            picture={this.exampleImageFileModel} 
                            size={ModalSize.ExtraLarge}
                            notResponsive={this.state.notResponsive}
                            noHeader={this.state.noHeader}
                            closeConfirm={this.state.closeConfirm}
                />

                <Button label={"Open ImageModal #1"} toggleModal dataTarget={"imageModal_1"} />

            </React.Fragment>
        );
    }
}