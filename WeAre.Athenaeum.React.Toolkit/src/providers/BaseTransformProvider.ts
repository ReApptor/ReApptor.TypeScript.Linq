import GeoLocation from "../models/GeoLocation";
import ServiceProvider, {IService, ServiceType} from "./ServiceProvider";
import StringConverter, {IStringConverter} from "./StringConverter";

export type TStringTransformer = (value: any) => string;

export type TFormat = string | TStringTransformer;

export interface ITransformProvider extends IStringConverter {
}

export default abstract class BaseTransformProvider implements ITransformProvider, IService {
    
    protected constructor() {
        ServiceProvider.addSingleton(this);
    }

    public getType(): ServiceType {
        return nameof<ITransformProvider>();
    }

    public locationToString(location: GeoLocation | null): string {
        return (location != null)
            ? [location.address, location.postalCode, location.city].filter(item => !!item).join(", ")
            : "";
    }
    
    public toString(item: any, format?: TFormat | null): string {

        if (item == null) {
            return "";
        }

        if ((item instanceof GeoLocation) || (item.isGeoLocation)) {
            return this.locationToString(item as GeoLocation);
        }
        
        return StringConverter.toString(item, format);
    }

    convert(from: {}, to: {}): {} {
        throw new Error("Not Implemented");
    }
}