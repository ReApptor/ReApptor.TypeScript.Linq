import WorkOrderDistanceItem from "@/models/server/WorkOrderDistanceItem";

export default class WorkOrderDistance extends WorkOrderDistanceItem {

    public id: string = "";
    
    public workOrderId: string = "";

    public isWorkOrderDistance: boolean = true;
}