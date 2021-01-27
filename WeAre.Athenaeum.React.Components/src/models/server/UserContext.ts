import {ApplicationContext, IUserContext} from "@weare/athenaeum-react-common";
import User from "./User";
import ApplicationSettings from "@/models/server/ApplicationSettings";

export default class UserContext extends ApplicationContext implements IUserContext<ApplicationSettings, User> {
    public username: string = "";

    public email: string = "";

    public phone: string | null = null;

    public user: User | null = null;
    
    public isContactPerson: boolean = false;
    
    public isMounter: boolean = false;

    public isManager: boolean = false;

    public isBusinessManager: boolean = false;

    public isMobileManager: boolean = false;
    
    public isAdmin: boolean = false;
    
    public isUserContext: true = true;    
}