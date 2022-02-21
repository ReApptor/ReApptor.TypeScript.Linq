import {FileModel} from "@weare/reapptor-toolkit";
import {IBaseComponent} from "../base/BaseComponent";

export type DocumentPreviewCallback = (sender: IBaseComponent) => FileModel | Promise<FileModel>;

export enum DocumentPreviewSize {
    Large,

    Medium
}

export default class DocumentPreviewModel {
    public title: string | null = null;

    public subtitle: string | null = null;

    public size: DocumentPreviewSize = DocumentPreviewSize.Large;

    public document: FileModel | DocumentPreviewCallback = new FileModel();
}