import WorkOrderModel from "./WorkOrderModel";
import WorkOrderEquipment from "./WorkOrderEquipment";
import {IIconProps} from "@/components/Icon/Icon";
import WorkReportAttachment from "@/models/server/WorkReportAttachment";

export default class WorkReport extends WorkOrderModel {
    
    public tasks: WorkOrderModel[] = [];
    
    public existingTasks: string[] = [];
    
    public equipment: WorkOrderEquipment[] | null = null;
    
    public attachments: WorkReportAttachment[] | null = null;

    public isWorkReport: boolean = true;
    
    public static getStateIcon(workReport: WorkReport): IIconProps {
        const active: boolean = (workReport.tasks.length > 0) && (workReport.tasks.some(task => WorkOrderModel.isActive(task)));
        const completed: boolean = (!active) && (workReport.tasks.length > 0) && (workReport.tasks.every(task => task.completed && !task.deleted));

        return (workReport.invoiced)
            ? {name: "fas check-circle", className: "green", tooltip: "Work report is invoiced"}
            : (workReport.locked)
                ? {name: "fas lock-alt", className: "text-danger", tooltip: "Work report is ready to be invoiced (invoice row created and approved)"}
                : (!workReport.declined)
                //: ((workReport.sent) && (!workReport.declined))
                    ? {name: "far mail-bulk", className: "text-primary", tooltip: "Work report sent to a customer for approving"}
                    : (workReport.approved)
                        ? {name: "far thumbs-up", className: "text-success", tooltip: "Work report is approved"}
                        : (workReport.declined)
                            ? {name: "far thumbs-down", className: "text-danger", tooltip: "Work report is declined by customer"}
                            : (active)
                                ? {name: "fas running", className: "text-primary", tooltip: "Work report in progress"}
                                : (completed)
                                    ? {name: "fas clipboard-check", className: "orange", tooltip: "All tasks are completed, waiting for approving"}
                                    : {name: "fas hourglass-start", className: "orange", tooltip: "No tasks or all task are no activated"};
    }
}