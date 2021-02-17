import {AuthType} from "@/models/Enums";

export default class CreateAndAssignContactPersonRequest {
    public organizationContractId: string | null = null;
    
    public constructionSiteId: string | null = null;
    
    public authType: AuthType = AuthType.Email;

    public email: string = "";

    public phone: string = "";

    public firstname: string = "";

    public middleName: string = "";

    public lastName: string = "";
    
    public externalId: string = "";
}