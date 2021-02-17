export default class SaveUserSalaryHourRequest {

    public userSalaryDayId: string = "";

    public userSalaryHourId: string | null = null;

    public constructionSiteOrWarehouseId: string = "";    
    
    public workOrderId: string = "";
    
    public normalHours: number = 0;
    
    public overtime50Hours: number = 0;
    
    public overtime100Hours: number = 0;
    
    public hoursPrice: number | null = null;
}