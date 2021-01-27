import ConstructionSite from "@/models/server/ConstructionSite";
import ConstructionSitesFilters from "@/models/server/ConstructionSitesFilters";

export default class GetConstructionSiteWithFiltersResponse {
    public previous: ConstructionSite | null = null;
    
    public constructionSite: ConstructionSite | null = null;

    public next: ConstructionSite | null = null;
    
    public index: number = 0;
    
    public totalItemCount: number = 0;
    
    public filters: ConstructionSitesFilters | null = null;
}