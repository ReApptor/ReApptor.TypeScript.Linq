import {AuthType, InvitationType} from "../Enums";
import User from "./User";

export default class UserInvitation {
    
    public createdBy: User | null = null;

    public createdAt: Date = new Date();

    public validTill: Date = new Date();
    
    public type: InvitationType = InvitationType.ResetPassword;
    
    public authType: AuthType = AuthType.Email;
    
    public reusable: boolean = false;
    
    public processed: boolean = false;

    public processedAt: Date | null = null;
    
    public isUserInvitation: boolean = true;
}