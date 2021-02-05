import ServiceProvider, {ServiceType, TType} from "./ServiceProvider";
import TypeResolver, {TDecoratorConstructor} from "./TypeResolver";

export interface ITypeConverter {
}

export declare type TClassDecorator = <TConstructor extends TDecoratorConstructor>(constructor: TConstructor) => TConstructor | void;

class TypeConverter {
    
    private static getServiceType(from: ServiceType | TType, to: ServiceType | TType): ServiceType {
        const fromType: ServiceType = TypeResolver.resolveService(from);
        const toType: ServiceType = TypeResolver.resolveService(to);
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
}

export default new TypeConverter();