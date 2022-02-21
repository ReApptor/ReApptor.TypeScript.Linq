import {MessageBoxButtons, MessageBoxIcon} from "../Enums";

export type MessageBoxModelCallback = () => string | IMessageBox;

export interface IMessageBoxButtons {
    okButton?: string | boolean;
    cancelButton?: string | boolean;
    abortButton?: string | boolean;
    retryButton?: string | boolean;
    ignoreButton?: string | boolean;
    yesButton?: string | boolean;
    noButton?: string | boolean;
}

export default interface IMessageBox extends IMessageBoxButtons {
    title: string;
    caption?: string;
    icon?: MessageBoxIcon | string;
    buttons?: MessageBoxButtons;
    placeholder?: string;
    minLength?: number;
    comment?: boolean;
}