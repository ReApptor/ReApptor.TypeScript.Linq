import GeoCoordinate from "./GeoCoordinate";

export default class GeoLocation extends GeoCoordinate {
    
    public country: string = "";

    public address: string = "";

    public city: string = "";

    public postalCode: string = "";

    public postalBox: string = "";

    public formattedAddress: string = "";

    public isGeoLocation: boolean = true;
}