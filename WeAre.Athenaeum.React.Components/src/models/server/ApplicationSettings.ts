import {IApplicationSettings} from "@weare/athenaeum-react-common";

export default class ApplicationSettings implements IApplicationSettings {
    public googleMapApiUrl: string = "";

    public googleMapApiKey: string = "";

    public defaultConstructionSiteExternalId: number = 0;

    public hoursPrice: number = 0;

    public mileagePrice: number = 0;

    public isApplicationSettings: true = true;
}