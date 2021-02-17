import {ConstructionSiteOrWarehouseType} from "../../Enums";

export default class GetEmployeeStatusesRequest {
    public from: Date | null = null;
    
    public to: Date | null = null;

    public notApprovedOnly: boolean = false;

    public source: ConstructionSiteOrWarehouseType | null = null;
}