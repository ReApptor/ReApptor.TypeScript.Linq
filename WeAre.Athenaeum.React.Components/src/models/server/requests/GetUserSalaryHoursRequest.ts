import {ConstructionSiteOrWarehouseType} from "../../Enums";

export default class GetUserSalaryHoursRequest {
    public from: Date | null = null;
    
    public to: Date | null = null;

    public source: ConstructionSiteOrWarehouseType | null = null;

    public managerUserIds: string[] = [];

    public mounterUserIds: string[] = [];
    
    public organizationContractIds: string [] = [];
    
    public pageNumber: number = 1;
    
    public pageSize: number = 100;
}