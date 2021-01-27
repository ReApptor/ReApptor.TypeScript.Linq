import {GeoLocation} from "@weare/athenaeum-toolkit";
import {ConstructionSiteStatus} from "../Enums"
import OrganizationContract from "./OrganizationContract";
import Organization from "@/models/server/Organization";

export default class ConstructionSite {
    public id: string = "";

    public location: GeoLocation | null = null;

    public externalAddress: string = "";

    public name: string = "";

    public externalName: string = "";

    public externalId: string = "";

    public externalReference: string = "";
    
    public customerInvoiceReference: string = "";

    public hoursPrice: number | null = null;

    public mileagePrice: number | null = null;

    public status: ConstructionSiteStatus = ConstructionSiteStatus.Active;

    public organization: Organization | null = null;

    public organizationContractId: string = "";

    public organizationContract: OrganizationContract | null = null;

    public createdAt: Date | null = null;

    public isConstructionSite: boolean = true;
}