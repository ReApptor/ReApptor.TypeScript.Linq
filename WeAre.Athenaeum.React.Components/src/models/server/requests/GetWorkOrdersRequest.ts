import { TaskStatusFilter } from "@/models/Enums";

export default class GetWorkOrdersRequest {
    
    public constructionSiteOrWarehouseId: string | null = null;
    
    public taskStatuses: TaskStatusFilter[] = [];

    public from: Date | null = null;

    public to: Date | null = null;
    
    public notAssigned: boolean = false;

    public managerUserIds: string[] = [];

    public mounterUserIds: string[] = [];
    
    public pageNumber: number = 1;

    public pageSize: number = 100;
}