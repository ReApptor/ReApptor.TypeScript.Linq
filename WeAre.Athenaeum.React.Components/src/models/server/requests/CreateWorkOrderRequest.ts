import SaveWorkOrderRequest from "@/models/server/requests/SaveWorkOrderRequest";

export default class CreateWorkOrderRequest extends SaveWorkOrderRequest {

    public constructionSiteOrWarehouseId: string = "";
    
    constructor(saveRequest: SaveWorkOrderRequest | null = null) {
        super();
        
        if (saveRequest != null) {
            this.approvalType = saveRequest.approvalType;
            this.invoiceReference = saveRequest.invoiceReference;
            this.customerApprover = saveRequest.customerApprover;
            this.customerOrderer = saveRequest.customerOrderer;
            this.activationDate = saveRequest.activationDate;
            this.completionDate = saveRequest.completionDate;
            this.description = saveRequest.description;
            this.distances = saveRequest.distances;
            this.equipment = saveRequest.equipment;
            this.managerId = saveRequest.managerId;
            this.approvalType = saveRequest.approvalType;
            this.mounters = saveRequest.mounters;
            this.name = saveRequest.name;
            this.workOrderId = saveRequest.workOrderId;
            this.mileagePrice = saveRequest.mileagePrice;
            this.hoursPrice = saveRequest.hoursPrice;
        }
    }
}