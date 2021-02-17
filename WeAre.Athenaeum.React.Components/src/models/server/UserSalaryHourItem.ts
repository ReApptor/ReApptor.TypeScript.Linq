import {Utility} from "@weare/athenaeum-toolkit";

export default class UserSalaryHourItem {
    public day: Date = Utility.today();

    public userId: string = "";

    public workOrderId: string | null = null;

    public normalHours: number = 0;

    public overtime50Hours: number = 0;

    public overtime100Hours: number = 0;

    public readonly isUserSalaryHourItem: boolean = true;
}