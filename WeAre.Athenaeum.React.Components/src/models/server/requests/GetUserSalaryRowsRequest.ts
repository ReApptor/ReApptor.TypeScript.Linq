
export default class GetUserSalaryRowsRequest {
    public from: Date = new Date();
    
    public to: Date | null = null;

    public managerUserId: string | null = null;

}