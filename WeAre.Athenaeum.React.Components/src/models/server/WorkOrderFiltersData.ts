import {WorkOrderStatus} from "@/models/Enums";
import OrganizationContract from "@/models/server/OrganizationContract";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import User from "@/models/server/User";

export default class WorkOrderFiltersData
{
    public owners: ConstructionSiteOrWarehouse[] = [];
    
    public organizationContracts: OrganizationContract[] = [];
    
    public statuses: WorkOrderStatus[] = [];
    
    public employees: User[] = [];
    
    public managers: User[] = [];
}