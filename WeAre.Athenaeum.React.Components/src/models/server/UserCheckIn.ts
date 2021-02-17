import {GeoLocation} from "@weare/athenaeum-toolkit";
import User from "./User";
import ConstructionSiteOrWarehouse from "./ConstructionSiteOrWarehouse";
import WorkOrderModel from "./WorkOrderModel";
import UserSignIn from "./UserSignIn";

export default class UserCheckIn {
    public id: string = "";

    public day: Date = new Date();

    public userId: string = "";
    
    public user: User | null = null;

    public checkInAt: Date = new Date();

    public checkInLocation: GeoLocation | null = null;

    public checkOutAt: Date = new Date();

    public checkOutLocation: GeoLocation | null = null;

    public expired: boolean = false;

    public autoHours: number | null = null;

    public ownerId: string | null = null;
    
    public owner: ConstructionSiteOrWarehouse | null = null;

    public workOrderId: string | null = null;

    public workOrder: WorkOrderModel | null = null;

    public signInId: string = "";

    public signIn: UserSignIn | null = null;
    
    public readonly isUserCheckIn: boolean = true;
}