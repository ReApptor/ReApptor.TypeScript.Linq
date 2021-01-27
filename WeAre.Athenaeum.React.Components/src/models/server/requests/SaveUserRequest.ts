import {AuthType} from "@/models/Enums";

export default class SaveUserRequest {
    public id: string | null = null;
    
    public authType: AuthType = AuthType.Email;

    public email: string = "";

    public phone: string = "";

    public firstname: string = "";
    
    public middleName: string = "";

    public lastName: string = "";

    public language: string = "";

    public roleName: string = "";

    public organizationContractIds: string[] = [];
    
    public formattedAddress: string = "";

    public employeeNumber: string = "";

    public agreementAccepted: boolean = false;

    public registrationAccepted: boolean = false;
}