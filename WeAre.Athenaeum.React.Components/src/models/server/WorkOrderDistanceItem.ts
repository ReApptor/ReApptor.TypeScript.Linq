import {Utility} from "@weare/athenaeum-toolkit";

export default class WorkOrderDistanceItem {

    public day: Date = Utility.today();
    
    public value: number = 0;

    public vehicles: number = 0;

    public isWorkOrderDistanceItem: boolean = true;
}