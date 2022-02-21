export default class GeoCoordinate {
    constructor(latitude: number | null | undefined = null, longitude: number | null | undefined = null) {
        this.lat = latitude || 0.0;
        this.lon = longitude || 0.0;
    }

    public lat: number = 0.0;

    public lon: number = 0.0;

    public isGeoCoordinate: boolean = true;
}