import {GeoCoordinate, GeoLocation, ILocalizer, ServiceProvider, Utility} from "@weare/reapptor-toolkit";
import {ApplicationContext, ch} from "@weare/reapptor-react-common";
import AthenaeumComponentsConstants from "../AthenaeumComponentsConstants";
import {IGoogleMapInfoWindow, IGoogleMapMarker, TGoogleMapMarkerCallback} from "../components/GoogleMap/GoogleMap";

export type GoogleApiResult = google.maps.GeocoderResult | google.maps.places.PlaceResult;
export type GoogleAddressComponentType = "country" | "establishment" | "locality" | "political" | "postal_code" | "postal_town" | "route" | "street_number" | "plus_code";

export interface IGoogleApiSettings {
    googleMapApiUrl: string;

    googleMapApiKey: string;
}

export default class AddressHelper {
    
    private static _google: any = null;

    private static toDegreesMinutesAndSeconds(coordinate: number): string {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

        return `${degrees}°${minutes}'${seconds}"`
    }
    
    private static improveGoogleFormattedAddress(formattedAddress: string, address: string, streetNumber: string): string {
        if ((formattedAddress) && (address) && (streetNumber)) {
            const parts: string[] = formattedAddress
                .split(",")
                .map(item => item.trim());

            if (parts.length == 4) {
                const fullAddress = `${address} ${streetNumber}`;

                if ((parts[0] !== fullAddress) && (parts[1] == fullAddress)) {
                    // for example: "Koronakatu 1 C, Koronakatu 1, 02210 Espoo, Finland" to "Koronakatu 1, 02210 Espoo, Finland"
                    const index = formattedAddress.indexOf(",") + 1;
                    formattedAddress = formattedAddress.substr(index).trim();
                }
            }
        }

        return formattedAddress;
    }

    private static getFormattedAddress(googleFormattedAddress: string, lat: number, lon: number): string {
        return ((googleFormattedAddress) && (lat > 0) && (lon > 0))
            ? `${googleFormattedAddress}, #${lat}, ${lon}`
            : googleFormattedAddress;
    }

    private static get googleApiUrl(): string {
        const context: ApplicationContext = ch.getContext();
        const settings = context.settings as IGoogleApiSettings;

        if ((!settings.googleMapApiKey) || (!settings.googleMapApiUrl))
            throw new Error("Application context doesn't provide Google API settings: \"googleMapApiKey\" or \"googleMapApiUrl\" are empty.");

        return `${settings.googleMapApiUrl}api/js?key=${settings.googleMapApiKey}&libraries=places`;
    }
    
    public static toGoogleLatLon(center: google.maps.LatLngLiteral | GeoLocation | GeoCoordinate): google.maps.LatLngLiteral {
        if ((center instanceof GeoLocation) || ((center as any).isGeoLocation) ||
            (center instanceof GeoCoordinate) || ((center as any).isGeoCoordinate)) {
            const coordinate: GeoCoordinate | null = AddressHelper.getCoordinate(center as GeoLocation) || AthenaeumComponentsConstants.defaultLocation;
            return {lat: coordinate.lat, lng: coordinate.lon} as google.maps.LatLngLiteral;
        }
        return center;
    }

    public static googleStaticApiUrl(center: google.maps.LatLngLiteral | GeoLocation | GeoCoordinate, zoom: number, markers?: IGoogleMapMarker[] | null): string {
        const context: ApplicationContext = ch.getContext();
        const settings = context.settings as IGoogleApiSettings;

        if ((!settings.googleMapApiKey) || (!settings.googleMapApiUrl))
            throw new Error("Application context doesn't provide Google API settings: \"googleMapApiKey\" or \"googleMapApiUrl\" are empty.");
        
        const googleCenter: google.maps.LatLngLiteral = this.toGoogleLatLon(center);
        
        let src: string = `${settings.googleMapApiUrl}api/staticmap?key=${settings.googleMapApiKey}`;
        
        src = src + "&scale=1&size=640x480&format=PNG&maptype=roadmap";
        src = src + "&center=" + encodeURIComponent("{0},{1}".format(googleCenter.lat, googleCenter.lng));
        src = src + "&zoom=" + encodeURIComponent("{0}".format(zoom));

        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();
        src = src + "&language=" + encodeURIComponent("{0}".format(localizer?.language || "en"));

        if (markers) {
            let markersSrc: string = "";
            for (let i: number = 0; i < markers.length; i++) {
                const marker: IGoogleMapMarker = markers[i];
                if (marker.position) {
                    markersSrc += "{0}/{1}".format(marker.position.lat, marker.position.lng);
                }
                if (i < markers.length - 1) {
                    markersSrc += "|";
                }
            }
            src = src + "&markers=" + encodeURIComponent(markersSrc);
        }

        return src;
    }
    
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

    public static async createMapAsync(element: HTMLDivElement, center?: GeoLocation | GeoCoordinate | null, zoom?: number | null, options?: google.maps.MapOptions | null): Promise<google.maps.Map> {
        if (!options) {
            options = {};
        }

        if (!options.zoom) {
            options.zoom = zoom || 16;
        }

        if (!options.center) {
            center = center && this.hasCoordinates(center) && center || await Utility.getLocationAsync() || AthenaeumComponentsConstants.defaultLocation;
            options.center = new this.google.maps.LatLng(center!.lat, center!.lon);
        }

        return new this.google.maps.Map(element, options);
    }

    public static toMarker(coordinate: GeoCoordinate, title?: string | null, iconUrl?: string | null, size?: number | null, offsetY?: number | null, onClick?: TGoogleMapMarkerCallback | null, onDoubleClick?: TGoogleMapMarkerCallback | null): IGoogleMapMarker {

        const position: google.maps.LatLngLiteral = {
            lat: coordinate.lat,
            lng: coordinate.lon,
        };

        size = size || 40;

        let infoWindow: IGoogleMapInfoWindow | null = null;

        if (title) {
            const content: string = `<b>${title}</b>`;

            offsetY = offsetY || -(4 / 5 * size);

            infoWindow = {
                content,
                position,
                pixelOffset: new google.maps.Size(0, offsetY),
            };
        }

        const icon = (iconUrl)
            ? {
                url: iconUrl,
                scaledSize: new google.maps.Size(size, size)
            }
            : undefined;

        return {
            title: title || undefined,
            infoWindow: infoWindow || undefined,
            position,
            icon,
            onClick,
            onDoubleClick,
        } as IGoogleMapMarker;
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

    public static findAddressComponent(place: GoogleApiResult, componentType: GoogleAddressComponentType): string {
        if (place.address_components) {
            const component: google.maps.GeocoderAddressComponent | undefined = place.address_components.find(component => (component.types != null) && (component.types.some(type => type === componentType)));
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

    public static getCountryName(countryCodeOrName: string): string {
        if (countryCodeOrName) {
            countryCodeOrName = countryCodeOrName.trim().toLowerCase();

            switch (countryCodeOrName) {
                //"fi", "fi-fi", "Finland", "Suomi"
                case "fi":
                case "fi-fi":
                case "finland":
                case "suomi":
                    return "Suomi";
                    
                //"se", "sv", "sv-se", "Sweden", "Svenska"
                case "se":
                case "sv":
                case "sv-se":
                case "sweden":
                case "svenska":
                    return "Svenska";
                    
                //"no", "nb", "nor", "nb-no", "Norway", "Norge"
                case "no":
                case "nb":
                case "nor":
                case "nb-no":
                case "norway":
                case "norge":
                    return "Norge";
                    
                //"dk", "da", "da-dk", "Denmark", "Danmark"
                case "dk":
                case "da":
                case "da-dk":
                case "denmark":
                case "danmark":
                    return "Danmark";
                    
                //"pl", "pl-pl", "Poland", "Polska"
                case "pl":
                case "pl-pl":
                case "poland":
                case "polska":
                    return "Polska";
                    
                //"ru", "ru-ru", "Russia", "Россия"
                case "ru":
                case "ru-ru":
                case "russia":
                case "россия":
                    return "Россия";
                    
                //"ua", "uk", "uk-ua", "Ukraine", "Україна", "Украина"
                case "ua":
                case "uk":
                case "uk-ua":
                case "ukraine":
                case "україна":
                case "украина":
                    return "Україна";
            }
        }

        return countryCodeOrName;
    }

    public static extractCoordinate(formattedAddress: string | null | undefined): GeoCoordinate | null {
        if (formattedAddress) {
            const index: number = formattedAddress.indexOf("#");
            if (index > 0) {
                let items: string[] = formattedAddress.split("#");

                if ((items.length > 1) && (items[1])) {
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
        }
        
        return null;
    }

    public static toLocation(formattedAddress: GeoLocation | string | null | undefined): GeoLocation | null {
        if (!formattedAddress) {
            return null;
        }
        
        if (typeof formattedAddress !== "string") {
            return formattedAddress;
        }
        
        const geoLocation = new GeoLocation();
        
        geoLocation.formattedAddress = formattedAddress;

        //Formatted address comes in formats:
        //  "Äyritie 12, 01510 Vantaa, Finland, #60.21083359999999, 24.951597"
        //  "Äyritie 12, Vantaa, Finland, #60.21083359999999, 24.951597"
        //  "Äyritie 12, Vantaa, 01510, Finland, #60.21083359999999, 24.951597"
        //  "Äyritie 12, Vantaa, Finland, #60.21083359999999, 24.951597"

        const includesLocation: boolean = (formattedAddress.includes("#"));
        if (includesLocation) {
            const parts: string[] = formattedAddress
                .replace(/([#])/gm, "")
                .split(",")
                .map(item => item.trim())
                .filter(item => !!item);

            const length: number = parts.length;
            if (length > 4) {
                const lat: number = Number(parts[length - 2]);
                const lon: number = Number(parts[length - 1]);
                
                const cityPostalCodeParts: string[] = parts[length - 4].trim().split(" ");
                if (cityPostalCodeParts.length == 2)
                {
                    geoLocation.postalCode = cityPostalCodeParts[0];
                    geoLocation.city = cityPostalCodeParts[1];
                } else if (cityPostalCodeParts.length == 1)
                {
                    if (parts.length > 5)
                    {
                        geoLocation.postalCode = parts[length - 4];
                        geoLocation.city = parts[length - 5];
                    }
                    else
                    {
                        geoLocation.city = cityPostalCodeParts[0];
                    }
                }

                if ((!isNaN(lat) && isFinite(lat) && lat > 0)) {
                    geoLocation.lat = lat;
                }

                if ((!isNaN(lon) && isFinite(lon) && lon > 0)) {
                    geoLocation.lon = lon;
                }

                geoLocation.address = parts[0];
                geoLocation.country = this.getCountryName(parts[length - 3]);
            }
        }
        
        return geoLocation;
    }
    
    public static getCoordinate(location: GeoCoordinate | GeoLocation | Position | string | null): GeoCoordinate | null {
        if (location) {
            if (typeof location === "string") {
                return AddressHelper.extractCoordinate(location);
            }

            const position = location as Position;
            if ((position.coords?.latitude != null) && (position.coords?.longitude != null)) {
                return new GeoCoordinate(position.coords.latitude, position.coords.longitude);
            }

            const coordinate = location as GeoCoordinate | GeoLocation;
            return (this.hasCoordinates(coordinate))
                ? coordinate
                : this.extractCoordinate((coordinate as GeoLocation).formattedAddress);
        }
        
        return null;
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

        let country: string = this.findAddressComponent(result, "country");
        let address: string = this.findAddressComponent(result, "route") || this.findAddressComponent(result, "establishment");
        const town: string = this.findAddressComponent(result, "locality") || this.findAddressComponent(result, "postal_town") || this.findAddressComponent(result, "political");
        const postalCode: string = this.findAddressComponent(result, "postal_code");
        const streetNumber: string = this.findAddressComponent(result, "street_number");
        if (!address) {
            const plusCode: string = this.findAddressComponent(result, "plus_code");
            if (plusCode) {
                address = plusCode;
                if (!country) {
                    country = "XZ"; // Internation waters county code: ISO 3166-1 alpha-2.
                }
            }
        }
        const googleFormattedAddress: string = this.improveGoogleFormattedAddress(result.formatted_address || "", address, streetNumber);
        const formattedAddress: string = this.getFormattedAddress(googleFormattedAddress, lat, lon);

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
        const latitudeCardinal = (lat >= 0) ? "N" : "S";

        const longitude = this.toDegreesMinutesAndSeconds(lon);
        const longitudeCardinal = (lon >= 0) ? "E" : "W";

        return `${latitude}${latitudeCardinal} ${longitude}${longitudeCardinal}`
    }
    
    public static findCenter(x: GeoCoordinate | GeoLocation | Position | string, y: GeoCoordinate | GeoLocation | Position | string): GeoCoordinate {

        const xCoordinate: GeoCoordinate | null = this.getCoordinate(x);
        const yCoordinate: GeoCoordinate | null = this.getCoordinate(y);

        if (!xCoordinate)
            throw Error(`AddressHelper.distance(x, y): GEO coordinate cannot be extracted from argument "x": "${x}".`);
        if (!yCoordinate)
            throw Error(`AddressHelper.distance(x, y): GEO coordinate cannot be extracted from argument "y": "${y}".`);

        const lat: number = (xCoordinate.lat + yCoordinate.lat) / 2;
        const lon: number = (xCoordinate.lon + yCoordinate.lon) / 2;
        
        return new GeoCoordinate(lat, lon);
    }
    
    public static distance(x: GeoCoordinate | GeoLocation | Position | string, y: GeoCoordinate | GeoLocation | Position | string): number {
        
        const xCoordinate: GeoCoordinate | null = this.getCoordinate(x);
        const yCoordinate: GeoCoordinate | null = this.getCoordinate(y);

        if (!xCoordinate)
            throw Error(`AddressHelper.distance(x, y): GEO coordinate cannot be extracted from argument "x": "${x}".`);
        if (!yCoordinate)
            throw Error(`AddressHelper.distance(x, y): GEO coordinate cannot be extracted from argument "y": "${y}".`);

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        const lon1: number = xCoordinate.lon * Math.PI / 180;
        const lon2: number = yCoordinate.lon * Math.PI / 180;
        const lat1: number = xCoordinate.lat * Math.PI / 180;
        const lat2: number = yCoordinate.lat * Math.PI / 180;

        // Haversine formula
        const dLon: number = lon2 - lon1;
        const dLat: number = lat2 - lat1;
        const a: number = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLon / 2), 2);

        const c: number = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        const r: number = 6371;

        // calculate the result
        return (c * r);
    }

    public static findZoom(center: GeoCoordinate | GeoLocation | Position | string, x: GeoCoordinate | GeoLocation | Position | string, y: GeoCoordinate | GeoLocation | Position | string): number {

        const xDistance: number = AddressHelper.distance(center, x);
        const yDistance: number = AddressHelper.distance(center, y);

        const maxDistanceKm: number = Utility.max([xDistance, yDistance]);

        const maxWidth: number = 3 * maxDistanceKm;
        const zoomLevels: number[] = [40000, 20000, 10000, 5000, 2500, 1250, 625, 312.5, 156.25, 78.125, 39.0625, 19.53125, 9.765625, 4.8828125, 2.44140625, 1.220703125, 0.6103515625, 0.3051757813, 0.1525878906];

        for (let zoom: number = 0; zoom < zoomLevels.length - 1; zoom++) {
            if (maxWidth > zoomLevels[zoom + 1]) {
                return zoom;
            }
        }

        return 0;
    }
}