import WorkOrderFiltersData from "../../../models/server/WorkOrderFiltersData";

export default class GetWorkOrderFiltersResponse {
    
    public active: WorkOrderFiltersData = new WorkOrderFiltersData();

    public readonly GetWorkOrderFiltersResponse: boolean = true;
}