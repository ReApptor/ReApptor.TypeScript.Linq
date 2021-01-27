import {WorkDayState} from "../../Enums";

export default class SaveUserSalaryDayRequest {
    
    public userSalaryDayId: string = "";
    
    public state: WorkDayState = WorkDayState.Normal;
}