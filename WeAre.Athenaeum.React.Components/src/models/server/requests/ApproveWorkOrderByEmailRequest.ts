import User from "@/models/server/User";

export default class ApproveWorkOrderByEmailRequest {
    
    public workOrderId: string = "";
    
    public customerApprover: User | null = null;
    
    public approved: boolean = false;
}