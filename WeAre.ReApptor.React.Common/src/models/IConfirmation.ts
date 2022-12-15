
export type ConfirmationDialogTitleCallback = () => string | IConfirmation;

export default interface IConfirmation {
    title: string;
    className?: string;
    placeholder?: string;
    minLength?: number;
    comment?: boolean;
}