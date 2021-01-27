import ConstructionSite from "@/models/server/ConstructionSite";

export default class AddConstructionSiteResponse {
    public constructionSite: ConstructionSite | null = null;
    
    public timeTrackingDeviceIdExists: boolean = false;
}