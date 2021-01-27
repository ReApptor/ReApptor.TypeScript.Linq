import UserSalaryHourItem from "@/models/server/UserSalaryHourItem";
import WorkOrderModel from "./WorkOrderModel";
import ConstructionSiteOrWarehouse from "./ConstructionSiteOrWarehouse";
import User from "./User";
import UserSalaryDay from "./UserSalaryDay";

export default class UserSalaryHour extends UserSalaryHourItem {
    public id: string = "";

    public user: User | null = null;

    public workOrder: WorkOrderModel | null = null;
    
    public ownerId: string = "";

    public owner: ConstructionSiteOrWarehouse | null = null;

    public userSalaryDayId: string = "";

    public userSalaryDay: UserSalaryDay | null = null;

    public autoHours: number = 0;
    
    public overtimeTotalHours: number = 0;

    public hoursPrice: number = 0;
    
    public cost: number = 0;

    public deleted: boolean = false;

    public deletedAt: Date | null = null;

    public deletedById: string | null = null;

    public deletedBy: User | null = null;

    public locked: boolean = false;

    public readonly isUserSalaryHour: boolean = true;

    public static calcCost(item: UserSalaryHour): number {
        return item.hoursPrice * item.normalHours +
                1.5 * item.hoursPrice * item.overtime50Hours 
                + 2.0 * item.hoursPrice * item.overtime100Hours;
    }
}