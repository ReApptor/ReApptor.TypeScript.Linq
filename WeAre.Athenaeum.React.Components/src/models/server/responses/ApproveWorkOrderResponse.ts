import BaseConcurrencyResponse from "@/models/server/responses/BaseConcurrencyResponse";
import WorkOrderModel from "@/models/server/WorkOrderModel";

export default class ApproveWorkOrderResponse extends BaseConcurrencyResponse {
    public workOrder: WorkOrderModel | null = null;
}