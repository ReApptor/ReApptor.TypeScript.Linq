import ServiceProvider, {ServiceType} from "./ServiceProvider";
import {IEnumProvider} from "./BaseEnumProvider";
import Utility from "../Utility";
import {TFormat} from "./BaseTransformProvider";
import TypeConverter, {ITypeConverter, TClassDecorator, TConvertibleType, TDecoratorConstructor} from "./TypeConverter";

const String: ServiceType = "string";

export interface IStringConverter<T = any> extends ITypeConverter {
    toString: TStringConverter<T>;
}

export type TStringConverter<T = any> = (item: T | null, format?: TFormat | null) => string;

export function ToString(converter: IStringConverter | TStringConverter): TClassDecorator {
    return <TFunction extends TDecoratorConstructor>(constructor: TFunction): TFunction | void => {
        // implement class decorator here, the class decorator
        // will have access to the decorator arguments (filter)
        // because they are  stored in a closure
        // return classDecorator(target, options);
        TypeConverter.addConverter(constructor, String, converter);
    }
}

class StringConverter implements IStringConverter {
    public toString(item: any, format?: TFormat | null): string {

        if (item == null) {
            return "";
        }

        if (typeof item === "string") {
            return item;
        }

        if (Array.isArray(item)) {
            return item.length.toString();
        }

        const converter: IStringConverter | TStringConverter | null = TypeConverter.getConverter(item, String);
        if (converter) {
            return (typeof converter === "function")
                ? converter(item, format)
                : converter.toString(item, format)
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

    public addConverter<TFrom extends TDecoratorConstructor>(from: TConvertibleType<TFrom>, converter: IStringConverter | TStringConverter): void {
        TypeConverter.addConverter(from, String, converter);
    }
    
    public getConverter<TFrom extends TDecoratorConstructor>(from: TConvertibleType<TFrom>): IStringConverter | TStringConverter | null {
        return TypeConverter.getConverter(from, String);
    }
    
    public getRequiredConverter<TFrom extends TDecoratorConstructor>(from: TConvertibleType<TFrom>): IStringConverter | TStringConverter {
        return TypeConverter.getRequiredConverter(from, String);
    }

    public canConvert<TFrom extends TDecoratorConstructor>(from: TConvertibleType<TFrom>): boolean {
        return TypeConverter.canConvert(from, String);
    }
}

export default new StringConverter();