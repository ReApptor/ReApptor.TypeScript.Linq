
export type ConfirmationDialogTitleCallback = () => string | IConfirmation;

export interface IConfirmation {
    title: string;
    placeholder?: string;
    minLength?: number;
    comment?: boolean;
}