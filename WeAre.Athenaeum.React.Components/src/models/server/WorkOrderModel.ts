import User from "./User";
import {Utility, FileModel} from "@weare/athenaeum-toolkit";
import {IIconProps} from "@/components/Icon/Icon";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import WorkOrderEquipmentData from "@/models/server/WorkOrderEquipmentData";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import {CustomerApprovalType, WorkOrderStatus} from "@/models/Enums";
import WorkOrderDistance from "@/models/server/WorkOrderDistance";
import {DefaultPrices} from "@/models/server/DefaultPrices";
import Localizer from "@/localization/Localizer";

export default class WorkOrderModel {
    public code: string = "";

    public id: string = "";

    public number: number = 0;

    public name: string = "";

    public createdBy: User | null = null;

    public hoursPrice: number | null = null;

    public mileagePrice: number | null = null;

    public description: string | null = null;

    public activationDate: Date = Utility.today();

    public completionDate: Date | null = null;

    public constructionSiteId: string | null = null;
    
    public warehouseId: string | null = null;
    
    public owner: ConstructionSiteOrWarehouse | null = null;

    public locked: boolean = false;

    public approvalType: CustomerApprovalType = CustomerApprovalType.Email; 

    public deleted: boolean = false;

    public sent: boolean = false;

    public sentAt: Date | null = null;
    
    public approved: boolean = false;

    public approvedAt: Date | null = null;
    
    public approvedBy: User | null = null;

    public declined: boolean = false;

    public declinedAt: Date | null = null;

    public declinedBy: User | null = null;

    public completed: boolean = false;
    
    public completedBy: User | null = null;

    public readyForInvoicing: boolean = false;

    public invoiced: boolean = false;

    public autoHours: number | null = null;

    public normalHours: number | null = null;

    public overtime50Hours: number | null = null;
    
    public overtime100Hours: number | null = null;
    
    public overtimeTotalHours: number | null = null;

    public hasSalaryHours: boolean = false;
    
    public hasDistances: boolean = false;

    public cost: number = 0;
    
    public distance: number = 0;
    
    public mounters: string[] = [];

    public managerId: string | null = null;

    public manager: User | null = null;

    public customerOrdererId: string | null = null;

    public customerOrderer: User | null = null;

    public customerApproverId: string | null = null;

    public customerApprover: User | null = null;

    public userSalaryHours: UserSalaryHour[] | null = null;
    
    public equipments: WorkOrderEquipmentData[] | null = null;
    
    public distances: WorkOrderDistance[] | null = null;
    
    public currentStatus: WorkOrderStatus = WorkOrderStatus.Created;

    public signatureFileId: string | null = null;
    
    public signatureFile: FileModel | null = null;

    public isWorkOrderModel: boolean = true;
    
    public static isActive(workOrder: WorkOrderModel): boolean {
        return (!workOrder.deleted) && (workOrder.currentStatus == WorkOrderStatus.InProgress);
    }

    public static isCompleted(workOrder: WorkOrderModel): boolean {
        return (!workOrder.deleted) && (workOrder.completed);
    }

    public static isApproved(workOrder: WorkOrderModel): boolean {
        return (!workOrder.deleted) && (workOrder.approved);
    }

    public static isReadyForInvoicing(workOrder: WorkOrderModel): boolean {
        return (!workOrder.deleted) && (workOrder.readyForInvoicing);
    }
    
    public static getStateIcon(workOrder: WorkOrderModel): IIconProps {
        const currentStatus: WorkOrderStatus = workOrder.currentStatus;
        const isNew: boolean = !workOrder.id;
        
        if (isNew) {
            return {name: "far pen", className: "text-primary", tooltip: Localizer.taskTooltipsNewTask };
        }
        
        switch (currentStatus) {
            case WorkOrderStatus.Completed:
                return {name: "fas clipboard-check", className: "orange", tooltip: Localizer.taskTooltipsTaskWaitingApproval };
            case WorkOrderStatus.InProgress:
                return {name: "fas running", className: "text-primary", tooltip: Localizer.taskTooltipsTaskInProgress  };
            case WorkOrderStatus.Created:
                return {name: "fas hourglass-start", className: "orange", tooltip: Localizer.taskTooltipsTaskWaitingActivation  };
            case WorkOrderStatus.SentToCustomer:
                return {name: "fas mail-bulk", className: "text-primary", tooltip: Localizer.taskTooltipsTaskWaitingApproval };
            case WorkOrderStatus.DeclinedByCustomer:
                return {name: "far thumbs-down", className: "text-danger", tooltip: Localizer.taskTooltipsTaskDeclined };
            case WorkOrderStatus.ApprovedByCustomer:
                return {name: "far thumbs-up", className: "text-success", tooltip: Localizer.taskTooltipsTaskApproved };
            case WorkOrderStatus.ReadyForInvoicing:
                return { name: "fas check-circle", className: "green", tooltip: Localizer.taskTooltipsTaskReadyForInvoicing };
            case WorkOrderStatus.Invoiced:
                return { name: "far file-invoice", className: "green", tooltip: Localizer.taskTooltipsTaskInvoiced };
        }

        return {name: "fas lock-alt", className: "text-danger", tooltip: Localizer.taskTooltipsTaskReadyForInvoicing};
    }
    
    public static getBackgroundStyle(workOrder: WorkOrderModel): string {
        if (workOrder.invoiced) {
            return "bg-processed";
        }        
        if (workOrder.approved) {
            return "bg-approved";
        }
        if (workOrder.completed) {
            return "bg-completed";
        }
        return "";
    }
    
    public static getHoursPrice(workOrder: WorkOrderModel, defaultPrices: DefaultPrices | null = null): number {
        return (workOrder.hoursPrice != null)
            ? workOrder.hoursPrice
            : ConstructionSiteOrWarehouse.getHoursPrice(workOrder.owner, defaultPrices);
    }
    
    public static getDistancesPrice(workOrder: WorkOrderModel, defaultPrices: DefaultPrices | null = null): number {
        return (workOrder.mileagePrice != null)
            ? workOrder.mileagePrice
            : ConstructionSiteOrWarehouse.getDistancesPrice(workOrder.owner, defaultPrices);
    }
    
    public static calcCost(workOrder: WorkOrderModel, defaultPrices: DefaultPrices | null = null): number {
        const salaryHoursCost: number  =  this.calcSalaryHoursCost(workOrder.userSalaryHours);
        const equipmentCost: number = this.calcEquipmentCost(workOrder.equipments);
        const distancesPrice: number = this.getDistancesPrice(workOrder, defaultPrices);
        const distancesCost: number = this.calcDistancesCost(workOrder.distances, distancesPrice);
        return salaryHoursCost + equipmentCost + distancesCost;
    }

    public static calcEquipmentCost(equipments: WorkOrderEquipmentData[] | null): number{
        return equipments ? equipments.sum(item => item.cost) : 0;
    }

    public static calcSalaryHoursCost(salaryHours: UserSalaryHour[] | null): number{
        return salaryHours ? salaryHours.sum(item => item.cost) : 0;
    }

    public static calcDistancesCost(distances: WorkOrderDistance[] | null, price: number): number{
        return distances ? distances.sum(item => item.value * price) : 0;
    }
    
    public static isApproverOrOrdererValid(user: User | null, required: boolean = false): boolean {
        return (
            ((!required) && (user == null)) || 
            ((user != null) && (!!user.firstname) && (!!user.lastName) && (!!user.email) && (!!user.phone))
        );
    }
}