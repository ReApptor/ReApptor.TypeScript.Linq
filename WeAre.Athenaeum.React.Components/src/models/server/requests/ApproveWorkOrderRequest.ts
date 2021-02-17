import {CustomerApprovalType} from "../../Enums";
import User from "@/models/server/User";
import BaseConcurrencyRequest from "@/models/server/requests/BaseConcurrencyRequest";

export default class ApproveWorkOrderRequest extends BaseConcurrencyRequest {

    public workOrderId: string = "";
    
    public invoiceReference: string | null = null;
    
    public approvalType: CustomerApprovalType = CustomerApprovalType.Email;
    
    public signatureSrc: string | null = null;
    
    public customerApprover: User | null = null;
    
    public isCreateWorkOrderRequest: boolean = true;
}