import {WorkDayState} from "../Enums";
import User from "./User";

export default class UserSalaryDay {
    public id: string = "";
    
    public day: Date = new Date();
    
    public user: User | null = null;

    public autoDistance: number | null = null;

    public state: WorkDayState = WorkDayState.Normal;
    
    public expirationNotificationSent: boolean = false;

    public readonly isUserSalaryDay: boolean = true;
}