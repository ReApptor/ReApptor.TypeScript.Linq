import {AlertType} from "../Enums";
import {Utility} from "@weare/reapptor-toolkit";

export default class AlertModel {

    constructor(message: string = "", alertType: AlertType = AlertType.Success, autoClose: boolean = false, flyout: boolean = false, autoCloseDelay?: number | null) {
        this.message = message;
        this.alertType = alertType;
        this.autoClose = autoClose;
        this.flyout = flyout;
        
        if (autoCloseDelay) {
            this.autoCloseDelay = autoCloseDelay;
        }
    }

    /**
     * Message displayed in the alert.
     *
     * @default ""
     */
    public message: string = "";

    /**
     * @default null
     */
    public messageParams: string[] | null = null;

    /**
     * Type of the alert. Mainly affects coloring.
     *
     * @default {@link AlertType.Success}
     */
    public alertType: AlertType = AlertType.Success;

    /**
     * Should the alert be user dismissable.
     *
     * @default true
     */
    public dismissible: boolean = true;

    /**
     * Should the alert be automatically closed after {@link autoCloseDelay} milliseconds.
     *
     * @default false
     */
    public autoClose: boolean = false;

    /**
     * After how many milliseconds should the alert be closed if {@link autoClose} is set to true.
     *
     * @default 5000
     */
    public autoCloseDelay: number = 5000;

    /**
     * Should the alert fly out from the side of the sceen instead of being contained within the main PageContainer.
     *
     * @default false
     */
    public flyout: boolean = false;

    /**
     * For type checking.
     *
     * @default true
     */
    public isAlertModel: boolean = true;

    public static isEqual(x: AlertModel | null | undefined, y: AlertModel | null | undefined): boolean {
        return Utility.getHashCode(x) === Utility.getHashCode(y);
    }
}