import {UserRoleGroup} from "../Enums";

export default class UserRole {
    
    constructor(roleName: string = "", organizationContractId: string = "", group: UserRoleGroup = UserRoleGroup.Admins) {
        this.roleName = roleName;
        this.organizationContractId = organizationContractId;
        this.group = group;
    }
    
    public roleName: string = "";
    
    public group: UserRoleGroup = UserRoleGroup.Admins;
    
    public organizationContractId: string = "";
    
    public isUserRole: boolean = true;
}