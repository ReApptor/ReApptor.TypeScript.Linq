import {AlertType} from "../Enums";

export default class AlertModel {
    public message: string = "";

    public messageParams: string[] | null = null;
    
    public alertType: AlertType = AlertType.Success;
    
    public dismissible: boolean = true;

    public autoClose: boolean = false;
    
    public autoCloseDelay: number = 5000;
    
    public flyout: boolean = false;

    public isAlertModel: boolean = true;
}