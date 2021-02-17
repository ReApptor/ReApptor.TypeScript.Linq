import {GeoCoordinate} from "@weare/athenaeum-toolkit";

export default class TaskCheckOutRequest {
    public completed: boolean = false;

    public location: GeoCoordinate | null = null;

    public normalHours: number | null = null;

    public overtime50Hours: number | null = null;

    public overtime100Hours: number | null = null;
}