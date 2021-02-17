import {GeoLocation} from "@weare/athenaeum-toolkit";
import Organization from "./Organization";

export default class OrganizationContract {
    public id: string = "";

    public name: string = "";
    
    public rentaName: string = "";
    
    public externalId: string = "";
    
    public externalAddress: string = "";
    
    public transactionIdentifier: string = "";
    
    public intermediator: string = "";

    public organizationId: string = "";

    public organization: Organization | null = null;

    public location: GeoLocation | null = null;
    
    public virtualAddress: string = "";

    public favorite: boolean = false;

    public isOrganizationContract: boolean = true;
}