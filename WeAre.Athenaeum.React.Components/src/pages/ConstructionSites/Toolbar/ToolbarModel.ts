import {ConstructionSiteStatus, ConstructionSiteWorkOrderStatus} from "@/models/Enums";

export default class ToolbarModel {

    public customer: string = "";
    
    public site: string = "";
    
    public status: ConstructionSiteStatus | null = ConstructionSiteStatus.Active;
    
    public workOrderStatuses: ConstructionSiteWorkOrderStatus[] | null = null;
}