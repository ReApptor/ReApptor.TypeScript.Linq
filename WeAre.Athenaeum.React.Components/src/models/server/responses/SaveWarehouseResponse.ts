import Warehouse from "../Warehouse";

export default class SaveWarehouseResponse {
    public warehouse: Warehouse | null = null;

    public timeTrackingDeviceIdExists: boolean = false;
}