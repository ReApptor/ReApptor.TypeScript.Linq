import WorkOrderEquipment from "../WorkOrderEquipment";
import UserSalaryHourItem from "@/models/server/UserSalaryHourItem";
import WorkOrderDistanceItem from "@/models/server/WorkOrderDistanceItem";
import BaseConcurrencyRequest from "@/models/server/requests/BaseConcurrencyRequest";

export default class SaveWorkOrderDataRequest extends BaseConcurrencyRequest {
    public workOrderId: string = "";
    
    public name: string = "";
    
    public description: string = "";
    
    public invoiceReference: string | null = null;
    
    public activationDate: Date | null = null;

    public equipment: WorkOrderEquipment[] | null = null;

    public distances: WorkOrderDistanceItem[] | null = null;

    public userSalaryHours: UserSalaryHourItem[] | null = null;

    public managerId: string | null = null;

    public customerOrdererId: string | null = null;
    
    public customerApproverId: string | null = null;
}