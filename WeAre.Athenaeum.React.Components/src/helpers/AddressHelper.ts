import {GeoCoordinate, GeoLocation, Utility} from "@weare/athenaeum-toolkit";
import {ApplicationContext, ch} from "@weare/athenaeum-react-common";
import AthenaeumComponentsConstants from "../AthenaeumComponentsConstants";

export type GoogleApiResult = google.maps.GeocoderResult | google.maps.places.PlaceResult;

export interface IGoogleApiSettings {
    googleMapApiUrl: string;

    googleMapApiKey: string;
}

export default class AddressHelper {
    
    private static _google: any = null;
    
    public static async loadGoogleLibraryAsync(): Promise<void> {
        if (this.isGoogleApiRegistered) {
            return Promise.resolve();
        }

        const googleMapScript: HTMLScriptElement = document.createElement("script");

        googleMapScript.src = this.googleApiUrl;
        googleMapScript.async = false;
        googleMapScript.defer = true;
        googleMapScript.id = "googleScript";

        return new Promise<void>((resolve, reject) => {
            
            googleMapScript.addEventListener("load", () => {
                this._google = (window as any).google;
                resolve();
            });

            googleMapScript.addEventListener("error", () => {
                reject();
                throw new Error("Google API script is not initialized, probably script is not loaded.");
            });

            window.document.body.appendChild(googleMapScript);
        });
    }

    private static get googleApiUrl(): string {
        const context: ApplicationContext = ch.getContext();
        const settings = context.settings as IGoogleApiSettings;
        
        if ((!settings.googleMapApiKey) || (!settings.googleMapApiUrl))
            throw new Error("Application context doesn't provide Google API settings: \"googleMapApiKey\" or \"googleMapApiUrl\" are empty.");
        
        return `${settings.googleMapApiUrl}api/js?key=${settings.googleMapApiKey}&libraries=places`;
    }

    private static toDegreesMinutesAndSeconds(coordinate: number): string {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

        return `${degrees}°${minutes}'${seconds}"`
    }

    public static get isGoogleApiRegistered(): boolean {
        return (this._google != null);
    }

    public static get google(): any {
        if (this._google == null)
            throw new Error("Google API script is not initialized, probably script is not loaded.");
        
        return this._google;
    }
    
    public static get geocoder(): google.maps.Geocoder {
        return new this.google.maps.Geocoder;
    }
    
    public static toGoogleCoordinate(coordinate: GeoCoordinate): google.maps.LatLng {
        return new this.google.maps.LatLng(coordinate.lat, coordinate.lon);
    }

    public static hasCoordinates(location: GeoCoordinate): boolean {
        return (location.lat > 0 && location.lon > 0);
    }

    public static async createMapAsync(element: HTMLDivElement, center: GeoCoordinate | null = null, zoom: number = 16): Promise<google.maps.Map> {
        center = center && this.hasCoordinates(center) && center || await Utility.getLocationAsync() || AthenaeumComponentsConstants.defaultLocation;

        const centerGoogle = new this.google.maps.LatLng(center!.lat, center!.lon);
        
        return new this.google.maps.Map(element, {
            zoom: zoom,
            center: centerGoogle
        });
    }

    public static async addMarkerAsync(position: google.maps.LatLng | GeoCoordinate, map: google.maps.Map): Promise<google.maps.Marker> {
        if (position instanceof GeoCoordinate) {
            position = this.toGoogleCoordinate(position);
        }
        
        return new this.google.maps.Marker({
            position: position,
            map: map
        });
    }
    
    public static async addInfoWindow(content: string): Promise<google.maps.InfoWindow> {
        return new this.google.maps.InfoWindow({ content });
    }
    
    public static async setMapCenterAsync(position: google.maps.LatLng | GeoCoordinate, map: google.maps.Map): Promise<void> {
        if (position instanceof GeoCoordinate) {
            position = this.toGoogleCoordinate(position);
        }
        
        map.setCenter(position);
    }

    public static findLat(place: GoogleApiResult): number {
        if (place.geometry && place.geometry.location && place.geometry.location.lat) {
            return place.geometry!.location!.lat!();
        }
        return 0;
    }

    public static findLon(place: GoogleApiResult): number {
        if (place.geometry && place.geometry.location && place.geometry.location.lng) {
            return place.geometry!.location!.lng();
        }
        return 0;
    }

    public static getFormattedAddress(place: GoogleApiResult, lat: number, lon: number): string {
        const address: string = place.formatted_address || "";
        return ((address) && (lat > 0) && (lon > 0))
            ? `${address}, #${lat}, ${lon}`
            : address;
    }

    public static findAddressComponent(place: GoogleApiResult, name: string): string {
        if (place.address_components) {
            const component: google.maps.GeocoderAddressComponent | undefined = place.address_components.find(component => (component.types != null) && (component.types.some(type => type === name)));
            if (component) {
                return component.long_name || component.short_name;
            }
        }
        return "";
    }

    public static removeLatLon(addressValue: string): string {
        const index: number = addressValue.indexOf("#");
        if (index > 0) {
            addressValue = addressValue.substr(0, index - 1).trim();
            if (addressValue.endsWith(",")) {
                addressValue = addressValue.substr(0, addressValue.length - 1).trim();
            }
        }
        return addressValue;
    }

    public static getCountryName(countryCode: string): string {
        if (countryCode) {
            countryCode = countryCode.trim().toLowerCase();

            switch (countryCode) {
                case "fi":
                case "suomi":
                case "finland":
                    return "Suomi";
                case "se":
                case "sweden":
                case "svenska":
                    return "Svenska";
                case "no":
                case "norway":
                case "norge":
                    return "Norge";
            }
        }

        return countryCode;
    }

    public static extractCoordinate(formattedAddress: string): GeoCoordinate | null {
        const index: number = formattedAddress.indexOf("#");
        if (index > 0) {
            let items: string[] = formattedAddress.split("#");
            
            if (items.length > 1 && items[1]) {
                items = items[1].split(",");
                
                if (items.length > 1 && items[0] && items[1]) {
                    const lat: number = Number(items[0]);
                    const lon: number = Number(items[1]);
                    
                    if ((!isNaN(lat) && isFinite(lat) && lat > 0) && (!isNaN(lon) && isFinite(lon) && lon > 0)) {
                        return new GeoCoordinate(lat, lon);
                    }
                }
            }
        }
        
        return null;
    }

    public static toLocation(formattedAddress: string | null | undefined): GeoLocation | null {
        if (!formattedAddress) {
            return null;
        }
        
        const geoLocation = new GeoLocation();
        
        geoLocation.formattedAddress = formattedAddress;

        const parts: string[] = formattedAddress
            .replace(/([#])/gm, "")
            .split(",")
            .map(item => item.trim())
            .filter(item => !!item);

        if (parts.length > 4) {
            const lat: number = Number(parts[parts.length - 2]);
            const lon: number = Number(parts[parts.length - 1]);

            const cityPostalCodeParts: string[] = parts[1].trim().split(" ");

            if ((!isNaN(lat) && isFinite(lat) && lat > 0)) {
                geoLocation.lat = lat;
            }            
            
            if ((!isNaN(lon) && isFinite(lon) && lon > 0)) {
                geoLocation.lon = lon;
            }

            geoLocation.address = parts[0];
            geoLocation.postalCode = (cityPostalCodeParts.length > 1) ? cityPostalCodeParts[0] : "";
            geoLocation.city = (cityPostalCodeParts.length > 1) ? cityPostalCodeParts[1] : parts[1];
            geoLocation.country = this.getCountryName(parts[2]);
        }
        
        return geoLocation;
    }
    
    public static getCoordinate(location: GeoLocation): GeoCoordinate | null {
        return (this.hasCoordinates(location))
            ? location
            : this.extractCoordinate(location.formattedAddress);
    }
    
    public static async findLocationByLatLngAsync(latLng: google.maps.LatLng): Promise<GeoLocation | null> {
        return new Promise((resolve, reject) => {
            const request: google.maps.GeocoderRequest = {
                location: latLng,
                region: "fi"
            };
            
            this.geocoder!.geocode(request, (results, status) => {
                if (status === this.google.maps.GeocoderStatus.OK) {
                    resolve(this.getLocationFromGeocodeResult(results[0]));
                } else if (status === this.google.maps.GeocoderStatus.ZERO_RESULTS) {
                    resolve(null);
                } else {
                    reject(status);
                }
            });
        });
    }

    public static async findAddressAsync(map: google.maps.Map, address: string): Promise<GeoCoordinate | null> {
        return new Promise((resolve, reject) => {
            const placesService = new this.google.maps.places.PlacesService(map);
            const request: google.maps.places.FindPlaceFromQueryRequest = {
                fields: ["formatted_address", "geometry"],
                query: address
            };

            placesService.findPlaceFromQuery(request, (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
                if (status === this.google.maps.places.PlacesServiceStatus.OK) {
                    resolve(this.getCoordinateFromGeocodeResult(results[0]));
                } else if (status === this.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    resolve(null);
                } else {
                    reject(status);
                }
            });
        });
    }

    public static getCoordinateFromGeocodeResult(result: GoogleApiResult): GeoCoordinate {
        const lat: number = this.findLat(result);
        const lon: number = this.findLon(result);
        return new GeoCoordinate(lat, lon);
    }
    
    public static getLocationFromGeocodeResult(result: GoogleApiResult): GeoLocation {
        const lat: number = this.findLat(result);
        const lon: number = this.findLon(result);

        const address: string = this.findAddressComponent(result, "route") || this.findAddressComponent(result, "establishment");

        const formattedAddress: string = this.getFormattedAddress(result, lat, lon);
        const country: string = this.findAddressComponent(result, "country");
        const town: string = this.findAddressComponent(result, "locality");
        const postalCode: string = this.findAddressComponent(result, "postal_code");
        const streetNumber: any = this.findAddressComponent(result, "street_number");

        const isValidLocation: boolean = ((address.length > 0) || (formattedAddress.length > 0)) && (lat > 0) && (lon > 0);

        const geoLocation: GeoLocation = new GeoLocation();

        if (isValidLocation) {
            geoLocation.formattedAddress = formattedAddress;
            geoLocation.address = (address + " " + streetNumber).trim();
            geoLocation.city = town;
            geoLocation.country = country;
            geoLocation.lat = lat;
            geoLocation.lon = lon;
            geoLocation.postalCode = postalCode;
        }
        
        return geoLocation;
    }

    public static toDMS(coordinate: GeoCoordinate): string {
        const {lat: lat, lon: lon} = coordinate;
        
        const latitude = this.toDegreesMinutesAndSeconds(lat);
        const latitudeCardinal = lat >= 0 ? "N" : "S";

        const longitude = this.toDegreesMinutesAndSeconds(lon);
        const longitudeCardinal = lon >= 0 ? "E" : "W";

        return `${latitude}${latitudeCardinal} ${longitude}${longitudeCardinal}`
    }
}