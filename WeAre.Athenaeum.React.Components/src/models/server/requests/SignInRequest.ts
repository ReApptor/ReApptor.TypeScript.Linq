import {GeoCoordinate} from "@weare/athenaeum-toolkit";

export default class SignInRequest {

    public constructionSiteOrWarehouseId: string = "";

    public workOrderId: string | null = null;

    public location: GeoCoordinate | null = null;
}