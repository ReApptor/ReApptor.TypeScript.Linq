import {SortDirection} from "@weare/athenaeum-toolkit";
import {ConstructionSiteStatus, ConstructionSiteWorkOrderStatus} from "../Enums";

export default class ConstructionSitesFilters {
    
    public customerNameOrExternalId: string | null = null;
    
    public siteNameOrExternalId: string | null = null;   
    
    public workOrderStatus: ConstructionSiteWorkOrderStatus[] | null = null;
    
    public status: ConstructionSiteStatus | null = null;

    public organizationIds: string[] | null = null;

    public sortColumnName: string | null = null;

    public sortDirection: SortDirection | null = null;
}