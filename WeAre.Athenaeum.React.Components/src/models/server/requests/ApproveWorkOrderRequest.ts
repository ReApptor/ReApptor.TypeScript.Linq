import {CustomerApprovalType} from "../../Enums";
import User from "@/models/server/User";

export default class ApproveWorkOrderRequest {

    public workOrderId: string = "";
    
    public approvalType: CustomerApprovalType = CustomerApprovalType.Email;
    
    public signatureSrc: string | null = null;
    
    public customerApprover: User | null = null;
    
    public isCreateWorkOrderRequest: boolean = true;
}