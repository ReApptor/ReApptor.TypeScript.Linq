export default class ChangePasswordRequest {
    public currentPassword: string;
    
    public newPassword: string;

    constructor(newPassword: string, currentPassword: string) {
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }
}