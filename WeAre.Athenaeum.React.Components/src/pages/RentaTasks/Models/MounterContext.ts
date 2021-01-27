import {Utility} from "@weare/athenaeum-toolkit";
import WorkOrderCheckIn from "./WorkOrderCheckIn";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import RentaTaskConstants from "../../../helpers/RentaTaskConstants";
import WizardContext from "@/pages/RentaTasks/Models/WizardContext";
import {WorkOrderStatus} from "@/models/Enums";

export default class MounterContext {
    public signInAt: Date | null = null;

    public workOrder: WorkOrderModel | null = null;
    
    public checkIns: WorkOrderCheckIn[] = [];
    
    public wizard: WizardContext = new WizardContext();
    
    public get isExpired(): boolean {
        return (this.signInAt != null) && (Utility.diff(Utility.now(), this.signInAt).totalHours > RentaTaskConstants.signOutExpirationTimeOut);
    }

    public get isSignedIn(): boolean {
        return (this.signInAt != null);
    }

    public get isCheckedIn(): boolean {
        return (this.signInAt != null) && (!!this.workOrder);
    }

    public get workOrderId(): string | null {
        return ((this.isCheckedIn) && (this.workOrder)) ? this.workOrder.id : null;
    }

    public checkIn(workOrder: WorkOrderModel | null = null): void {

        if (!this.isSignedIn) {
            this.signInAt = Utility.now();
        }

        if (workOrder) {
            if (workOrder.currentStatus == WorkOrderStatus.Created) {
                workOrder.currentStatus = WorkOrderStatus.InProgress;
                workOrder.activationDate = Utility.today();
            }
            
            const checkIn: WorkOrderCheckIn = new WorkOrderCheckIn();
            checkIn.workOrder = workOrder;
            checkIn.checkInAt = Utility.now();
            this.checkIns.push(checkIn);

            this.workOrder = workOrder;
        }
    }

    public checkOut(): void {
        this.workOrder = null;
    }

    public signOut(): void {
        this.signInAt = null;
        this.checkIns = [];
    }

    public static parse(json: string): MounterContext {
        const to: MounterContext = new MounterContext();
        const from: MounterContext = JSON.parse(json);
        Utility.restoreDate(from);
        Utility.copyTo(from, to);
        return to;
    }
}