import WorkOrderModel from "../../../models/server/WorkOrderModel";

export default class WorkOrderCheckIn {
    public workOrder: WorkOrderModel | null = null;

    public checkInAt: Date = new Date();

    public static getOwnerId(checkIn: WorkOrderCheckIn): string | null {
        return ((checkIn.workOrder) && (checkIn.workOrder.owner)) ? checkIn.workOrder!.owner!.id : null;
    }
}