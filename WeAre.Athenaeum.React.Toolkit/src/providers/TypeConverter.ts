import ServiceProvider, {ServiceType} from "./ServiceProvider";

export interface ITypeConverter {
}

export declare type TDecoratorConstructor = { new (...args: any[]): {} };

export declare type TClassDecorator = <TConstructor extends TDecoratorConstructor>(constructor: TConstructor) => TConstructor | void;

export declare type TConvertibleType<T extends TDecoratorConstructor> = T | object | ServiceType;

class TypeConverter {
    
    private static resolveServiceType<T extends TDecoratorConstructor>(value: T | object | ServiceType): ServiceType {
        switch (typeof value) {
            case "function":
                return value.name;
            case "object":
                return value.constructor.name;
            default:
                return value;
        }
    }
    
    private static getServiceType<TFrom extends TDecoratorConstructor, TTo extends TDecoratorConstructor>(from: TConvertibleType<TFrom>, to: TConvertibleType<TTo>): ServiceType {
        from = TypeConverter.resolveServiceType<TFrom>(from);
        to = TypeConverter.resolveServiceType<TTo>(to);
        return `typeConverter:${from}:${to}`;
    }
    
    public addConverter<TFrom extends TDecoratorConstructor, TTo extends TDecoratorConstructor>(from: TConvertibleType<TFrom>, to: TTo | object | ServiceType, converter: ITypeConverter): void {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        ServiceProvider.addSingleton(fullName, converter);
    }
    
    public getConverter<TFrom extends TDecoratorConstructor, TTo extends TDecoratorConstructor, TConverter extends ITypeConverter>(from: TConvertibleType<TFrom>, to: TConvertibleType<TTo>): TConverter | null {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        return ServiceProvider.getService<TConverter>(fullName, false);
    }
    
    public getRequiredConverter<TFrom extends TDecoratorConstructor, TTo extends TDecoratorConstructor, TConverter extends ITypeConverter>(from: TConvertibleType<TFrom>, to: TConvertibleType<TTo>): TConverter {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        return ServiceProvider.getRequiredService<TConverter>(fullName, false);
    }
    
    public canConvert<TFrom extends TDecoratorConstructor, TTo extends TDecoratorConstructor>(from: TConvertibleType<TFrom>, to: TConvertibleType<TTo>): boolean {
        const fullName: ServiceType = TypeConverter.getServiceType(from, to);
        const service: ITypeConverter | null = ServiceProvider.getService<ITypeConverter>(fullName, false);
        return (service != null);
    }
}

export default new TypeConverter();