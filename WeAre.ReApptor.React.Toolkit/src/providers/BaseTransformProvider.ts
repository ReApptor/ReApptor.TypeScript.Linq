import GeoLocation from "../models/GeoLocation";
import ISelectListItem from "../models/ISelectListItem";
import Utility from "../Utility";
import {ITypeConverter, TypeConverter} from "../index";
import {TTypeConverter} from "./TypeConverter";
import ServiceProvider, {IService, ServiceType} from "./ServiceProvider";
import StringConverter from "./StringConverter";
import TypeResolver from "./TypeResolver";

export type TStringTransformer = (value: any) => string;

export type TFormat = string | TStringTransformer;

export interface ITransformProvider {
    toString(item: any, format?: TFormat | null): string;
    toSelectListItem(item: any): ISelectListItem;    
}

export default abstract class BaseTransformProvider<TSelectListItem extends ISelectListItem = any> implements ITransformProvider, IService {

    private _selectListItemType: ServiceType | null = null;

    private get selectListItemType(): ServiceType {
        if (this._selectListItemType == null) {
            const selectListItem: TSelectListItem = this.createSelectListItem("", "", "");
            this._selectListItemType = TypeResolver.resolve(selectListItem);
        }
        return this._selectListItemType;
    }

    protected constructor() {
        // register the service
        ServiceProvider.addSingleton(this);

        // register converters
        // object to string converters:
        StringConverter.addObjectConverter((item: any, format?: TFormat | null) => this.toString(item, format));
        // object to ISelectListItem and SelectListItem converters
        // @ts-ignore
        TypeConverter.addObjectConverter(nameof<ISelectListItem>(), (item: any) => this.toSelectListItem(item));
        TypeConverter.addObjectConverter(this.selectListItemType, (item: any) => this.toSelectListItem(item));
    }

    protected abstract createSelectListItem(value: string, text: string, subtext: string, groupName?: string | null, favorite?: boolean | null): TSelectListItem;
    
    public initialize(): void {
    }
    
    public getType(): ServiceType {
        // @ts-ignore
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

    public toSelectListItem(item: any): ISelectListItem {
        if (typeof item === "number") {
            const value: string = item.toString();
            return this.createSelectListItem(value, value, "");
        }

        if (typeof item === "string") {
            return this.createSelectListItem(item, item, "");
        }

        // @ts-ignore
        const converter: ITypeConverter | TTypeConverter | null = TypeConverter.getConverter(item, nameof<ISelectListItem>()) ?? TypeConverter.getConverter(item, this.selectListItemType);

        if ((converter != null) && (converter !== this.toSelectListItem)) {
            return (typeof converter === "function")
                ? converter(item)
                : converter.convert(item)
        }

        const value: any = Utility.findStringValueByAccessor(item, ["value"]);
        const id: any = Utility.findValueByAccessor(item, ["id", "code"]);
        const name: string | null = Utility.findStringValueByAccessor(item, ["name", "text", "label"]);
        const subtext: string | null = Utility.findStringValueByAccessor(item, ["subtext", "description"]);
        const groupName: string | null = Utility.findStringValueByAccessor(item, ["group", "group.name"]);
        const favorite: boolean = (Utility.findStringValueByAccessor(item, "favorite") === "true");

        const itemValue: string = (value)
            ? value
            : (id != null)
                ? id.toString()
                : (name)
                    ? name
                    : Utility.getComponentId();

        return this.createSelectListItem(itemValue, name ?? "", subtext ?? "", groupName, favorite);
    }
}