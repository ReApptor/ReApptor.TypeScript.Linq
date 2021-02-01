import {GeoLocation} from "@weare/athenaeum-toolkit";
import {IUser} from "@weare/athenaeum-react-common";
import UserRole from "@/models/server/UserRole";
import {AuthType} from "@/models/Enums";
import UserInvitation from "@/models/server/UserInvitation";

export default class User implements IUser {
    
    public id: string = "";
    
    public username: string = "";
    
    public email: string = "";
    
    public phone: string = "";

    public firstname: string = "";
    
    public lastName: string = "";
    
    public middleName: string = "";
    
    public language: string = "";
    
    public employeeNumber: string = "";

    public externalId: string = "";
    
    public external: boolean = false;

    public workCardId: string = "";
    
    public homeLocation: GeoLocation | null = null; 
    
    public role: UserRole = new UserRole();
    
    public roles: UserRole[] = [];

    public address: string = "";

    public city: string = "";

    public postalCode: string = "";

    public invitations: UserInvitation[] = [];
    
    public authType: AuthType = AuthType.Email;

    public isLocked: boolean = false;
    
    public isDeleted: boolean = false;
    
    public hasPassword: boolean = false;

    public isAdmin: boolean = false;

    public isSiteAdmin: boolean = false;

    public isDriver: boolean = false;

    public isMounter: boolean = false;

    public isEmployee: boolean = false;
    
    public isHeadMounter: boolean = false;

    public isManager: boolean = false;

    public isSubcontractorManager: boolean = false;

    public isSubcontractorMounter: boolean = false;
    
    public agreementAccepted: boolean = false;

    public registrationAccepted: boolean = false;

    public isUser: true = true;
}