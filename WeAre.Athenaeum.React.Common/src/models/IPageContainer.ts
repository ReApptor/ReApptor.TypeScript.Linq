import AlertModel from "./AlertModel";
import IConfirmation, {ConfirmationDialogTitleCallback} from "./IConfirmation";
import DocumentPreviewModel from "./DocumentPreviewModel";
import DescriptionModel from "./DescriptionModel";
import IMessageBox, {IMessageBoxButtons, MessageBoxModelCallback} from "./IMessageBox";
import {DialogResult, MessageBoxButtons, MessageBoxIcon} from "../Enums";

export default interface IPageContainer {
    readonly alert: AlertModel | null;
    alertAsync(alert: AlertModel): Promise<void>;
    hideAlertAsync(): Promise<void>;
    confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean>;
    showAsync(titleOrModel: string | IMessageBox | MessageBoxModelCallback, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): Promise<DialogResult>
    documentPreviewAsync(model: DocumentPreviewModel): Promise<void>;
    descriptionAsync(containerId: string, model: DescriptionModel): Promise<void>;
}