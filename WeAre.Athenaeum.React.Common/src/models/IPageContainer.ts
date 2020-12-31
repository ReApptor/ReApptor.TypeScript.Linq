import AlertModel from "./AlertModel";
import IConfirmation, {ConfirmationDialogTitleCallback} from "./IConfirmation";
import DocumentPreviewModel from "./DocumentPreviewModel";
import DescriptionModel from "./DescriptionModel";

export default interface IPageContainer {
    readonly alert: AlertModel;
    alertAsync(alert: AlertModel): Promise<void>;
    hideAlertAsync(): Promise<void>;
    confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean>;
    documentPreviewAsync(model: DocumentPreviewModel): Promise<void>;
    descriptionAsync(containerId: string, model: DescriptionModel): Promise<void>;
}