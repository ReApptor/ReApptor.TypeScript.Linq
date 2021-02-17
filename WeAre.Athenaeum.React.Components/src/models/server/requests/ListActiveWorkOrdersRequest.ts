import WorkOrderModel from "@/models/server/WorkOrderModel";
import {WorkOrderStatus} from "@/models/Enums";

export default class ListActiveWorkOrdersRequest {

    public name: string | null = null;

    public organizationContractId: string | null = null;

    public constructionSiteOrWarehouseId: string | null = null;

    public statuses: WorkOrderStatus[] = [];

    public employeesIds: string[] = [];

    public managersIds: string[] = [];
    
    constructor(employeeId: string | null = null) {
        if (employeeId) {
            this.employeesIds.push(employeeId);
        }
    }

    public isEmpty(): boolean {
        return (!this.name)
            && (!this.organizationContractId)
            && (!this.constructionSiteOrWarehouseId)
            && ((this.statuses == null) || (this.statuses.length == 0))
            && ((this.employeesIds == null) || (this.employeesIds.length == 0))
            && ((this.managersIds == null) || (this.managersIds.length == 0))
    }

    public clear(): void {
        this.name = null;
        this.organizationContractId = null;
        this.constructionSiteOrWarehouseId = null;
        this.statuses = [];
        this.employeesIds = [];
        this.managersIds = [];
    }
    
    public getDate(workOrder: WorkOrderModel): Date | null {
        return workOrder.activationDate;
    }
}