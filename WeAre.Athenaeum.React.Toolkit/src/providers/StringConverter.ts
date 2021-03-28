import ServiceProvider, {ServiceType, TType} from "./ServiceProvider";
import {IEnumProvider} from "./BaseEnumProvider";
import Utility from "../Utility";
import {TFormat} from "./BaseTransformProvider";
import {TDecoratorConstructor} from "./TypeResolver";
import TypeConverter, {ITypeConverter, TClassDecorator, TTypeConverter} from "./TypeConverter";

const StringType: ServiceType = "string";

export interface IStringConverter<TFrom = any> extends ITypeConverter<TFrom, string> {
    toString: TStringConverter<TFrom>;
}

export type TStringConverter<TFrom = any> = (item: TFrom | null, format?: TFormat | null) => string;

export function ToString(converter: IStringConverter | TStringConverter): TClassDecorator {
    return <TConstructor extends TDecoratorConstructor>(constructor: TConstructor): TConstructor | void => {
        // implement class decorator here, the class decorator
        // will have access to the decorator arguments (filter)
        // because they are  stored in a closure
        TypeConverter.addConverter(constructor, StringType, converter);
    }
}

class StringConverter implements IStringConverter {
    
    public convert(item: any): string {
        return this.toString(item);
    }
    
    public toString(item: any, format?: TFormat | null): string {
        if (item == null) {
            return "";
        }
        
        switch (typeof item) {
            case "string":
                return item;
            case "bigint":
            case "number":
            case "boolean":
                return item.toString();
        }

        if (Array.isArray(item)) {
            return item.length.toString();
        }

        const converter: IStringConverter | TStringConverter | null = this.getConverter(item);
        
        if ((converter != null) && (converter !== this) && (converter !== this.toString)) {
            return (typeof converter === "function")
                ? converter(item, format)
                : converter.toString(item, format)
        }

        if (format) {
            if (typeof format === "function") {
                return format(item);
            }

            const enumProvider: IEnumProvider | null = ServiceProvider.findEnumProvider();

            if ((enumProvider) && (enumProvider.isEnum(format))) {
                return enumProvider.getEnumText(format, item);
            }

            return Utility.format(`{0:${format}}`, item);
        }

        return (typeof item.toString === "function")
            ? item.toString()
            : item as string;
    }

    public addConverter(from: TType, converter: IStringConverter | TStringConverter): void {
        TypeConverter.addConverter(from, StringType, converter);
    }

    public addObjectConverter(converter: ITypeConverter | TTypeConverter): void {
        TypeConverter.addObjectConverter(StringType, converter);
    }
    
    public getConverter(from: TType): IStringConverter | TStringConverter | null {
        return TypeConverter.getConverter(from, StringType);
    }

    public getObjectConverter(): IStringConverter | TStringConverter | null {
        return TypeConverter.getObjectConverter(StringType);
    }
    
    public getRequiredConverter(from: TType): IStringConverter | TStringConverter {
        return TypeConverter.getRequiredConverter(from, StringType);
    }

    public getRequiredObjectConverter(): IStringConverter | TStringConverter | null {
        return TypeConverter.getRequiredObjectConverter(StringType);
    }

    public canConvert(from: TType): boolean {
        return TypeConverter.canConvert(from, StringType);
    }
}

export default new StringConverter();
