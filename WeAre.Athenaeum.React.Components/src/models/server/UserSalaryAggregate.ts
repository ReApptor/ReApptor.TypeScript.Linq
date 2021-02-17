import User from "./User";
import {UserSalaryAggregateType} from "../Enums";

export default class UserSalaryAggregate {
    public id: string = "";
    
    public from: Date = new Date();

    public to: Date = new Date();

    public userId: string = "";
    
    public user: User | null = null;

    public type: UserSalaryAggregateType = UserSalaryAggregateType.Day;
    
    public autoHours: number = 0;

    public normalHours: number = 0;

    public overtime50Hours: number = 0;

    public overtime100Hours: number = 0;

    public days: number = 0;
    
    public autoDistance: number = 0;
    
    public readonly isUserSalaryAggregate: boolean = true;
}