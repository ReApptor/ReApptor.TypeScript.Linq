import Product from "@/models/server/Product";

export default class WorkOrderEquipment {
    public id: string = "";
    
    public workOrderId: string = "";

    public productId: string = "";
    
    public product: Product | null = null;

    public cost: number = 0;

    public price: number = 0;
    
    public amount: number = 0;
    
    public description: string = "";

    public isWorkOrderEquipment: boolean = true;
}