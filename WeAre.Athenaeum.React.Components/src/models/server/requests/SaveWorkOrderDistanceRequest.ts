
export default class SaveWorkOrderDistanceRequest {

    public id: string | null = null;

    public day: Date = new Date();

    public workOrderId: string | null = null;

    public vehicles: number = 0;

    public value: number = 0;
}