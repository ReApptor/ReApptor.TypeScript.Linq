
export type ConfirmationDialogTitleCallback = () => string | IConfirmation;

export default interface IConfirmation {
    title: string;
    placeholder?: string;
    minLength?: number;
    comment?: boolean;
}