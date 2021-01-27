import {PageRoute} from "@weare/athenaeum-react-common";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import {RentaTasksAction} from "../RentaTasksController";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import WorkOrderEquipment from "@/models/server/WorkOrderEquipment";
import {CustomerApprovalType} from "@/models/Enums";
import UserSalaryHour from "@/models/server/UserSalaryHour";

export default class WizardContext {

    public owner: ConstructionSiteOrWarehouse | null = null;

    public workOrder: WorkOrderModel | null = null;
    
    public nextWorkOrder: WorkOrderModel | null = null;

    public action: RentaTasksAction = RentaTasksAction.None;

    public actionInitialPageRoute: PageRoute | null = null;

    public addEquipment: boolean = false;
    
    public equipment: WorkOrderEquipment[] | null = null;

    public myHours: UserSalaryHour = new UserSalaryHour();
    
    public mounters: string[] | null = null;

    public approvalType: CustomerApprovalType = CustomerApprovalType.Email;
    
    public signatureSrc: string | null = null;
}