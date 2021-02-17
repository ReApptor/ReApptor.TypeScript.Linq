import {FileModel} from "@weare/athenaeum-toolkit";

export default class WorkReportAttachment {
    
    public id: string = "";
    
    public workReportId: string = "";
    
    public fileId: string = "";
    
    public file: FileModel = new FileModel();
    
    public isWorkReportAttachment: boolean = true;
}