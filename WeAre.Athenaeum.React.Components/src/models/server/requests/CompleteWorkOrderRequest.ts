import BaseConcurrencyRequest from "@/models/server/requests/BaseConcurrencyRequest";

export default class CompleteWorkOrderRequest extends BaseConcurrencyRequest {
    
    public workOrderId: string = "";

    constructor(workOrderId: string = "") {
        super();
        this.workOrderId = workOrderId;
    }
}