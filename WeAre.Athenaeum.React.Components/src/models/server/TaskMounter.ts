import User from "./User";
import ConstructionSiteOrWarehouse from "./ConstructionSiteOrWarehouse";

export default class TaskMounter {
    public user: User = new User();

    public tasks: number = 0;
    
    public workingPlace: ConstructionSiteOrWarehouse | null = null;

    public isTaskMounter: boolean = true;
}