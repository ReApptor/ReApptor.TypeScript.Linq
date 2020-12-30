import IUser from "./IUser";
import ApplicationContext from "./ApplicationContext";
import IApplicationSettings from "./IApplicationSettings";

export default class UserContext<TSettings extends IApplicationSettings = any, TUser extends IUser = any> extends ApplicationContext<TSettings> {
    public username: string = "";

    public user: TUser | null = null;

    public isUserContext: true = true;
}