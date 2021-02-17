import WorkOrderModel from "@/models/server/WorkOrderModel";

export default class ApproveWorkOrderByEmailResponse {
    public workOrder: WorkOrderModel | null = null;
    
    public successfully: boolean = false;
}