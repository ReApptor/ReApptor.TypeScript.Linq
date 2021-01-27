export default class SaveWorkOrderEquipmentRequest {

    public id: string | null = null;
    
    public workOrderId: string | null = null;
    
    public productId: string = "";

    public amount: number = 0;

    public price: number = 0;
    
    public description: string = "";
}