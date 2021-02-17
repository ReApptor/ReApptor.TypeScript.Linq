
export default class AddMounterHoursRequest {    
    public day: Date = new Date();
    
    public userId: string = "";
    
    public workOrderId: string = "";

    public normalHours: number = 0;

    public overtime50Hours: number = 0;

    public overtime100Hours: number = 0;

    public hoursPrice: number | null = null;
}