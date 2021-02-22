import ServiceProvider, {ServiceType, TType} from "./ServiceProvider";
import {TDecoratorConstructor} from "./TypeResolver";

export interface ITypeConverter<TFrom extends TType = {}, TTo extends TType = {}> {
    convert(from: TFrom, to: TTo): TTo;
}

export declare type TClassDecorator = <TConstructor extends TDecoratorConstructor>(constructor: TConstructor) => TConstructor | void;

class TypeConverter {
    
    private static getServiceType(from: ServiceType | TType, to: ServiceType | TType): ServiceType {
        const fromType: ServiceType = ServiceProvider.resolveServiceType(from);
        const toType: ServiceType = ServiceProvider.resolveServiceType(to);
        return `typeConverter:${fromType}:${toType}`;
    }
    
    public addConverter(from: ServiceType | TType, to: ServiceType | TType, converter: ITypeConverter): void {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        ServiceProvider.addSingleton(fullName, converter);
    }
    
    public getConverter<TConverter extends ITypeConverter>(from: ServiceType | TType, to: ServiceType | TType): TConverter | null {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        return ServiceProvider.getService<TConverter>(fullName, false);
    }
    
    public getRequiredConverter<TConverter extends ITypeConverter>(from: ServiceType | TType, to: ServiceType | TType): TConverter {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        return ServiceProvider.getRequiredService<TConverter>(fullName, false);
    }
    
    public canConvert(from: ServiceType | TType, to: ServiceType | TType): boolean {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        const service: ITypeConverter | null = ServiceProvider.getService<ITypeConverter>(fullName, false);
        return (service != null);
    }
    
    public convert<TFrom extends TType, TTo extends TType>(from: TFrom, to: TTo): TType | undefined {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        const service: ITypeConverter | null = ServiceProvider.getService<ITypeConverter<TFrom, TTo>>(fullName, false);
        return (service != null)
            ? service.convert(from, to)
            : undefined;
    }
}

export default new TypeConverter();