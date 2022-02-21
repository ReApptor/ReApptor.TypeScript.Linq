import React from "react";
import {FileModel} from "@weare/reapptor-toolkit";
import {BaseComponent, ch, DocumentPreviewSize} from "@weare/reapptor-react-common";
import {Button, Checkbox, Modal, ImageModal, ModalSize} from "@weare/reapptor-react-components";
import {samplePdf} from './samplePdf';
import {sampleImage} from './sampleImage';

interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
}

export default class ModalTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium
    };

    private readonly _document1: FileModel = new FileModel(samplePdf);

    get exampleImageFileModel(): FileModel {
        const fileModel = new FileModel(sampleImage);

        fileModel.type = "image/jpeg";
        fileModel.size = 72824;
        fileModel.name = "Some.jpg";

        return fileModel;
    }

    public render(): React.ReactNode {


        return (
            <React.Fragment>

                <Modal id={"modal_1"} title={"Modal #1"}>
                    <p>Test content for modal #1</p>
                </Modal>

                <Button label={"Open modal #1"} toggleModal dataTarget={"modal_1"} />

                <Checkbox label={"Large document size"} inline
                          value={this.state.documentPreviewSize == DocumentPreviewSize.Large}
                          onChange={async (sender, value) => await this.setState({documentPreviewSize: value ? DocumentPreviewSize.Large : DocumentPreviewSize.Medium})}
                />

                <Button label={"Document preview #1"} onClick={async () => await ch.preloadedDocumentPreviewAsync(this._document1, "document 1", this.state.documentPreviewSize)} />

                <ImageModal id={"imageModal_1"} title={"ImageModal"} picture={this.exampleImageFileModel} size={ModalSize.ExtraLarge}/>

                <Button label={"Open ImageModal #1"} toggleModal dataTarget={"imageModal_1"} />

            </React.Fragment>
        );
    }
}