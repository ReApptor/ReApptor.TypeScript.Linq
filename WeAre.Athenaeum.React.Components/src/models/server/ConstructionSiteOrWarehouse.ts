import {GeoLocation} from "@weare/athenaeum-toolkit";
import {ConstructionSiteOrWarehouseType} from "../Enums";
import User from "./User";
import {DefaultPrices} from "@/models/server/DefaultPrices";
import OrganizationContract from "@/models/server/OrganizationContract";

export default class ConstructionSiteOrWarehouse {
    public id: string = "";

    public timeTrackingDeviceId: string | null = null;

    public location: GeoLocation | null = null;

    public hoursPrice: number | null = null;

    public mileagePrice: number | null = null;

    public name: string = "";
    
    public invoiceReference: string = "";

    public favorite: boolean = false;

    public type: ConstructionSiteOrWarehouseType = ConstructionSiteOrWarehouseType.ConstructionSite;

    public qrCode: string = "";
    
    public manager: User | null = null;
    
    public organizationContract: OrganizationContract | null = null;

    public isConstructionSiteOrWarehouse: boolean = true;

    public static getHoursPrice(owner: ConstructionSiteOrWarehouse | null, defaultPrices: DefaultPrices | null = null): number {
        if ((owner) && (owner.hoursPrice != null)) {
            return owner.hoursPrice;
        }
        if (defaultPrices) {
            return defaultPrices.defaultHoursPrice;
        }
        return 0;
    }

    public static getDistancesPrice(owner: ConstructionSiteOrWarehouse | null, defaultPrices: DefaultPrices | null = null): number {
        if ((owner) && (owner.mileagePrice != null)) {
            return owner.mileagePrice;
        }
        if (defaultPrices) {
            return defaultPrices.defaultMileagePrice;
        }
        return 0;
    }
}