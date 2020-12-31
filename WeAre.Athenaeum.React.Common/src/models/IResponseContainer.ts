import PageRoute from "./PageRoute";
import ServerError from "./ServerError";
import AlertModel from "./AlertModel";
import ApplicationContext from "./ApplicationContext";

export default interface IResponseContainer {
    value: any | null;
    context: ApplicationContext | null;
    alert: AlertModel | null;
    redirect: PageRoute | null;
    error: ServerError | null;
    unauthorized: boolean;
    isResponseContainer: boolean;
}