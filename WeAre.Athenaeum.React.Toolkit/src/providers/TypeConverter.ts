import ServiceProvider, {ServiceType, TType} from "./ServiceProvider";
import {TDecoratorConstructor} from "./TypeResolver";

export interface ITypeConverter<TFrom = any, TTo = any> {
    convert(from: TFrom | null): TTo;
}

export type TTypeConverter<TFrom = any, TTo = any> = (item: TFrom | null) => TTo; 

export declare type TClassDecorator = <TConstructor extends TDecoratorConstructor>(constructor: TConstructor) => TConstructor | void;

const ObjectType: ServiceType = "object";

class TypeConverter {
    
    private static getServiceType(from: ServiceType | TType, to: ServiceType | TType): ServiceType {
        const fromType: ServiceType = ServiceProvider.resolveServiceType(from);
        const toType: ServiceType = ServiceProvider.resolveServiceType(to);
        return `typeConverter:${fromType}:${toType}`;
    }

    public addConverter(from: ServiceType | TType, to: ServiceType | TType, converter: ITypeConverter | TTypeConverter): void {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        ServiceProvider.addSingleton(fullName, converter);
    }

    public addObjectConverter(to: ServiceType | TType, converter: ITypeConverter | TTypeConverter): void {
        this.addConverter(ObjectType, to, converter);
    }
    
    public getConverter<TConverter extends ITypeConverter | TTypeConverter>(from: ServiceType | TType, to: ServiceType | TType): TConverter | null {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        return ServiceProvider.getService<TConverter>(fullName, false);
    }

    public getObjectConverter<TConverter extends ITypeConverter | TTypeConverter>(to: ServiceType | TType): TConverter | null {
        return this.getConverter<TConverter>(ObjectType, to);
    }
    
    public getRequiredConverter<TConverter extends ITypeConverter | TTypeConverter>(from: ServiceType | TType, to: ServiceType | TType): TConverter {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        return ServiceProvider.getRequiredService<TConverter>(fullName, false);
    }

    public getRequiredObjectConverter<TConverter extends ITypeConverter | TTypeConverter>(to: ServiceType | TType): TConverter {
        return this.getRequiredConverter<TConverter>(ObjectType, to);
    }
    
    public canConvert(from: ServiceType | TType, to: ServiceType | TType): boolean {
        const converter: ITypeConverter | TTypeConverter | null = this.getConverter(from, to) || this.getObjectConverter(to);
        return (converter != null);
    }
    
    public convert<T extends ServiceType | TType = any>(from: ServiceType | TType, to: ServiceType | TType, defaultValue: T | null = null): T | null {
        const converter: ITypeConverter | TTypeConverter | null = this.getConverter(from, to) || this.getObjectConverter(to);
        const value: T | null = (converter != null)
            ? (typeof converter === "function")
                ? converter(from)
                : converter.convert(from)
            : null;
        return (value != null) ? value : defaultValue;
    }
}

const typeConverter = new TypeConverter();

export function ObjectConverter(to?: TType) {
    return function decorator(target: Object, propertyKey: string, descriptor: PropertyDescriptor): void {
        const method: Function = descriptor.value;
        if (to == null) {
            to = method.apply(target, [{}]) as TType;
        }
        if (to != null) {
            typeConverter.addObjectConverter(to, (item) => method.apply(target, [item]));
        }
    }
}

export default typeConverter;