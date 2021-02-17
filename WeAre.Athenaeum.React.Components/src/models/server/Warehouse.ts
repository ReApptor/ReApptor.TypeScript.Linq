import {GeoLocation} from "@weare/athenaeum-toolkit";
import User from "@/models/server/User";

export default class Warehouse {
    public id: string = "";

    public name: string = "";

    public costPool: string = "";

    public timeTrackingDeviceId: string | null = null;

    public location: GeoLocation | null = null;
    
    public manager: User | null = null;

    public qrCode: string = "";

    public isWarehouse: boolean = true;
}