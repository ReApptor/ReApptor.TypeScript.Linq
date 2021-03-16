import React from "react";
import {FileModel} from "@weare/athenaeum-toolkit";
import {BaseComponent, ch, DocumentPreviewSize} from "@weare/athenaeum-react-common";
import Button from "@weare/athenaeum-react-components/components/Button/Button";
import Checkbox from "@weare/athenaeum-react-components/components/Checkbox/Checkbox";
import Modal from "@weare/athenaeum-react-components/components/Modal/Modal";

interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
}

export default class ModalTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium
    };

    private readonly _document1: FileModel = new FileModel("data:application/pdf;base64,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NiA2NjEgNzcxIDU1MiAyNzUgMjIwIDIyMCA0OTYgNzE2IDU1MiA3MTYgMjc1IDc3MSAyNzUgNjYxIDU1MiA4ODIgMzMwIDU1MiA1NTIgNTUyIDY2MSA3MTYgNjA2IDEwMDcgMjc1IDI3NV1dCj4+CmVuZG9iagoxNSAwIG9iago8PAovTGVuZ3RoIDgxMgo+PgpzdHJlYW0KL0NJREluaXQgL1Byb2NTZXQgZmluZHJlc291cmNlIGJlZ2luCjEyIGRpY3QgYmVnaW4KYmVnaW5jbWFwCi9DSURTeXN0ZW1JbmZvIDw8IC9SZWdpc3RyeSAoQWRvYmUpIC9PcmRlcmluZyAoVUNTKSAvU3VwcGxlbWVudCAwID4+IGRlZgovQ01hcE5hbWUgL0Fkb2JlLUlkZW50aXR5LVVDUyBkZWYKL0NNYXBUeXBlIDIgZGVmCjEgYmVnaW5jb2Rlc3BhY2VyYW5nZQo8MDAwMD4gPEZGRkY+CmVuZGNvZGVzcGFjZXJhbmdlCjIgYmVnaW5iZnJhbmdlCjwwMDAwPiA8MDAwMD4gPDAwMDA+CjwwMDAxPiA8MDA0MD4gWzwwMDRDPiA8MDA0MT4gPDAwNTM+IDwwMDRCPiA8MDA1NT4gPDAwNjE+IDwwMDczPiA8MDA2Qj4gPDAwNzU+IDwwMDZFPiA8MDAyMD4gPDAwNkQ+IDwwMDY1PiA8MDA3Mj4gPDAwNkY+IDwwMDM0PiA8MDAzMT4gPDAwMzY+IDwwMDM5PiA8MDAzNT4gPDAwNTA+IDwwMEU0PiA8MDA2OT4gPDAwNzY+IDwwMDMzPiA8MDAyRT4gPDAwMzA+IDwwMDMyPiA8MDAzNz4gPDAwNDU+IDwwMDcwPiA8MDA0RD4gPDAwNjg+IDwwMDc0PiA8MDA1Nj4gPDAwNDg+IDwwMDc5PiA8MDA1ND4gPDAwNTk+IDwwMEQ2PiA8MDAzOD4gPDAwMkY+IDwwMDZDPiA8MDA2QT4gPDAwNEE+IDwwMDRFPiA8MDA2Mj4gPDAwNTI+IDwwMDJDPiA8MDA0Rj4gPDAwNDk+IDwwMEM0PiA8MDBFMT4gPDAwMjU+IDwwMDJEPiA8MDAyMz4gPDAwNjQ+IDwwMEY2PiA8MDA0Mj4gPDAwNDM+IDwwMDQ2PiA8MDA0MD4gPDAwNjY+IDwwMDNBPiBdCmVuZGJmcmFuZ2UKZW5kY21hcApDTWFwTmFtZSBjdXJyZW50ZGljdCAvQ01hcCBkZWZpbmVyZXNvdXJjZSBwb3AKZW5kCmVuZAplbmRzdHJlYW0KZW5kb2JqCjE2IDAgb2JqCjw8Ci9UeXBlL01ldGFkYXRhCi9TdWJ0eXBlL1hNTAovTGVuZ3RoIDE0ODEKPj4Kc3RyZWFtCjw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+CiAgICA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4gCiAgICAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iPgogICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+dXVpZDo2YjIxZjFjNC0yYjk5LTRhNDItODM5My03MDQwOWEzNTk5ZTI8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD51dWlkOjdkZTAwYjJjLWUzYWEtNDA0OS1iMmJiLTBjODYwMzlkNzkwMDwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwZGZ1YWlkPSJodHRwOi8vd3d3LmFpaW0ub3JnL3BkZnVhL25zL2lkLyI+CiAgICAgICAgICA8cGRmdWFpZDpwYXJ0PjE8L3BkZnVhaWQ6cGFydD4KICAgICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjAtMDYtMTBUMTM6MTc6MTcuMDAwMDAwMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMC0wNi0xMFQxMzoxNzoxNy4wMDAwMDAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+SXJvblBkZiAoMjAyMC42LjAuMCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjAtMDYtMTBUMTM6MTc6MTcuMDAwMDAwMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iPgogICAgICAgICAgPHBkZjpQcm9kdWNlcj5Jcm9uUGRmICgyMDIwLjYuMC4wKTwvcGRmOlByb2R1Y2VyPgogICAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgICA8ZGM6dGl0bGU+CiAgICAgICAgICAgIDxyZGY6QWx0PgogICAgICAgICAgICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+TGFza3U8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QWx0PgogICAgICAgICAgPC9kYzp0aXRsZT4KICAgICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPC9yZGY6UkRGPgogICAgPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz4KZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDI5OCAwMDAwMCBuIAowMDAwMDAwMzg4IDAwMDAwIG4gCjAwMDAwMDA0MjYgMDAwMDAgbiAKMDAwMDAwMDU4NyAwMDAwMCBuIAowMDAwMDA1ODkyIDAwMDAwIG4gCjAwMDAwMDYwMjMgMDAwMDAgbiAKMDAwMDAwNjA4OCAwMDAwMCBuIAowMDAwMDEyOTg5IDAwMDAwIG4gCjAwMDAwMTMxNjQgMDAwMDAgbiAKMDAwMDAxMzE4NSAwMDAwMCBuIAowMDAwMDEzNDM0IDAwMDAwIG4gCjAwMDAwMTk0NTkgMDAwMDAgbiAKMDAwMDAxOTkxOSAwMDAwMCBuIAowMDAwMDIwNzgyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMTcKL0luZm8gMSAwIFIKL1Jvb3QgOCAwIFIKL0lEWzxCRTM3ODZEMkQ3QzAyRTQzOTQzQzBCOThFNjdFNjI0Mj48QkUzNzg2RDJEN0MwMkU0Mzk0M0MwQjk4RTY3RTYyNDI+XQo+PgpzdGFydHhyZWYKMjIzNDMKJSVFT0YK");

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

            </React.Fragment>
        );
    }
}