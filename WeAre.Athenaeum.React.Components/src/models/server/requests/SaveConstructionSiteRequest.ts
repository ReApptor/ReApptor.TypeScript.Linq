import {ConstructionSiteStatus} from "../../Enums";

export default class SaveConstructionSiteRequest {
    
    public constructionSiteId: string = "";
    
    public organizationContractId: string = "";
    
    public mileagePrice: number | null = null;
    
    public hoursPrice: number | null = null;

    public name: string = "";
    
    public formattedAddress: string = "";

    public externalId: string = "";
    
    public status: ConstructionSiteStatus = ConstructionSiteStatus.Inactive;
}