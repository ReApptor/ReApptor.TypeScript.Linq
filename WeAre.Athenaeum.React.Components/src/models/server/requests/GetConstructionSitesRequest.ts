import ConstructionSitesFilters from "@/models/server/ConstructionSitesFilters";

export default class GetConstructionSitesRequest extends ConstructionSitesFilters {
    
    public pageNumber: number = 1;

    public pageSize: number = 100;
}