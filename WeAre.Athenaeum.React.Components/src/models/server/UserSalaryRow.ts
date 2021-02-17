import User from "./User";
import ConstructionSiteOrWarehouse from "./ConstructionSiteOrWarehouse";
import UserSalaryDay from "./UserSalaryDay";

export default class UserSalaryRow {
    public id: string = "";
    
    public day: Date = new Date();
    
    public user: User | null = null;

    public constructionSiteOrWarehouse: ConstructionSiteOrWarehouse | null = null;

    public userSalaryDay: UserSalaryDay | null = null;

    public firstCheckInAt: Date | null = null;

    public lastCheckOutAt: Date | null = null;
    
    public autoHours: number | null = null;

    public hours: number | null = null;

    public hoursPrice: number | null = null;

    public extraHours: number | null = null;

    public overtime50Hours: number | null = null;

    public overtime100Hours: number | null = null;

    public overtimeNightHours: number | null = null;

    public overtimeEveningHours: number | null = null;

    public overtimeSundayHours: number | null = null;

    public overtimeTotalHours: number | null = null;

    public contractHours: number | null = null;

    public contractHoursPrice: number | null = null;

    public contractCost: number | null = null;

    public fixedContractCost: number | null = null;

    public approved: boolean = false;

    public approvedAt: Date | null = null;

    public childrenApproved: boolean = false;
    
    public readonly isUserSalaryRow: boolean = true;
}