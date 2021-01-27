import {FileModel} from "@weare/athenaeum-toolkit";
import { CustomerApprovalType } from "@/models/Enums";

export default class AddWorkReportRequest {
    public constructionSiteAgreementId: string | null = null;

    public name: string = "";
    
    public description: string = "";

    public tasks: string[] = [];

    public approvalType: CustomerApprovalType = CustomerApprovalType.Email;
    
    public attachments: FileModel[] = [];
}