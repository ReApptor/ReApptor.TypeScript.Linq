import IUser from "./IUser";
import ApplicationContext from "./ApplicationContext";
import IApplicationSettings from "./IApplicationSettings";

export default interface IUserContext<TSettings extends IApplicationSettings = any, TUser extends IUser = any> extends ApplicationContext<TSettings> {
    username: string;

    user: TUser | null;

    isUserContext: true;
}