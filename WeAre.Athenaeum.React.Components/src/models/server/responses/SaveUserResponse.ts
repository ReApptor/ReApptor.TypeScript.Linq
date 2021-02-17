import User from "../User";

export default class SaveUserResponse {
    public user: User | null = null;

    public userAlreadyExists: boolean = false;
    
    public idCardRfcCodeAlreadyExists: boolean = false;
    
    public invitationSentFailed: boolean = false;
    
    public roleCannotBeAssigned: boolean = false;
    
    public readonly isSaveUserResponse: boolean = true;
}