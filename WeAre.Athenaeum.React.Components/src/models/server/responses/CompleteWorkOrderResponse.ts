import BaseConcurrencyResponse from "@/models/server/responses/BaseConcurrencyResponse";
import WorkOrderModel from "@/models/server/WorkOrderModel";

export default class CompleteWorkOrderResponse extends BaseConcurrencyResponse  {
    public workOrder: WorkOrderModel | null = null;
}