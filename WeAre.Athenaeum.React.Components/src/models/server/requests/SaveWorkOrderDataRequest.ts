import WorkOrderEquipment from "../WorkOrderEquipment";
import UserSalaryHourItem from "@/models/server/UserSalaryHourItem";
import WorkOrderDistanceItem from "@/models/server/WorkOrderDistanceItem";

export default class SaveWorkOrderDataRequest {
    public workOrderId: string = "";

    public equipment: WorkOrderEquipment[] | null = null;

    public distances: WorkOrderDistanceItem[] | null = null;

    public userSalaryHours: UserSalaryHourItem[] | null = null;
}