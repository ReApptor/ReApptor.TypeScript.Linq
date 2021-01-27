import { TaskStatusFilter } from "@/models/Enums";
import {SelectListItem} from "@/components/Form/Inputs/Dropdown/SelectListItem";

export default class ToolbarModel {
    public from: Date | null = null;

    public to: Date | null = null;
    
    public taskStatusesFilter: TaskStatusFilter[] = [];
    
    public notAssigned: boolean = false;
}