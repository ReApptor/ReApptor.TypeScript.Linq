import {ConstructionSiteOrWarehouseType} from "@/models/Enums";

export default class ToolbarModel {

    public from: Date | null = null;

    public to: Date | null = null;

    public source: ConstructionSiteOrWarehouseType | null = null;
    
    public reportType: string | Date | null = null;
}