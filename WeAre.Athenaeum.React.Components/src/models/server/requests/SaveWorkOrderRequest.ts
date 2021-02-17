import WorkOrderEquipment from "../WorkOrderEquipment";
import User from "@/models/server/User";
import WorkOrderDistance from "@/models/server/WorkOrderDistance";
import {CustomerApprovalType} from "@/models/Enums";

export default class SaveWorkOrderRequest {

    public workOrderId: string = "";
    
    public invoiceReference: string | null = "";

    public activationDate: Date | null = null;

    public hoursPrice: number | null = null;

    public mileagePrice: number | null = null;

    public completionDate: Date | null = null;

    public mounters: string[] = [];

    public managerId: string | null = null;

    public customerOrderer: User | null = null;

    public customerApprover: User | null = null;
    
    public equipment: WorkOrderEquipment[] | null = null;
    
    public distances: WorkOrderDistance[] | null = null;
    
    public approvalType: CustomerApprovalType = CustomerApprovalType.Email;
    
    public name: string = "";
    
    public description: string | null = null;
}