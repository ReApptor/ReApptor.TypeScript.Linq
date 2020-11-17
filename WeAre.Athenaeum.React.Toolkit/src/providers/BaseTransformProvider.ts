import {IEnumProvider} from "..";
import Utility from "../Utility";
import GeoLocation from "../models/GeoLocation";
import ServiceProvider, {IService, ServiceType} from "./ServiceProvider";

export type TStringTransformer = (value: any) => string;

export type TFormat = string | TStringTransformer;

export interface ITransformProvider {
    toString(item: any, format?: TFormat | null): string;    
}

export default abstract class BaseTransformProvider implements ITransformProvider, IService {
    
    protected constructor() {
        ServiceProvider.addSingleton(this);
    }

    public getType(): ServiceType {
        return "ITransformProvider";
    }

    public locationToString(location: GeoLocation | null) {
        return (location != null)
            ? [location.address, location.postalCode, location.city].filter(item => !!item).join(", ")
            : "";
    }
    
    public toString(item: any, format?: TFormat | null): string {

        if (item == null) {
            return "";
        }

        if ((item instanceof GeoLocation) || (item.isGeoLocation === true)) {
            return this.locationToString(item as GeoLocation);
        }

        if (Array.isArray(item)) {
            return item.length.toString();
        }

        if (format) {
            if (typeof format === "function") {
                return format(item);
            }
            
            const enumProvider: IEnumProvider | null = ServiceProvider.getEnumProvider();

            if ((enumProvider) && (enumProvider.isEnum(format))) {
                return enumProvider.getEnumText(format, item);
            }

            return Utility.format(`{0:${format}}`, item);
        }

        return (typeof item.toString === "function")
            ? item.toString()
            : item as string;
    }
}