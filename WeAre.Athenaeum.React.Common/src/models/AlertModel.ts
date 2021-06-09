import {AlertType} from "../Enums";

export default class AlertModel {
    
    constructor(message: string = "", alertType: AlertType = AlertType.Success, autoClose: boolean = false, flyout: boolean = false) {
        this.message = message;
        this.alertType = alertType;
        this.autoClose = autoClose;
        this.flyout = flyout;
    }
    
    public message: string = "";

    public messageParams: string[] | null = null;
    
    public alertType: AlertType = AlertType.Success;
    
    public dismissible: boolean = true;

    public autoClose: boolean = false;
    
    public autoCloseDelay: number = 5000;
    
    public flyout: boolean = false;

    public isAlertModel: boolean = true;
}