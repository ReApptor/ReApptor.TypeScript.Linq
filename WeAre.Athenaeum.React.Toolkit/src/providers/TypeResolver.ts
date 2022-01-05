import {IService, ServiceType, TType} from "./ServiceProvider";
import Utility from "../Utility";

export declare type TDecoratorConstructor = { new (...args: any[]): {} };

/**
 * Resolves values to {@link ServiceType}'s.
 */
export interface ITypeResolver {

    /**
     * Resolve a value to a {@link ServiceType}.
     *
     * @return {@link ServiceType} of a value.
     */
    resolve(value: TType): ServiceType;
}

export type TTypeResolver = (value: TType) => ServiceType;

/**
 * Implementation of {@link ITypeResolver}.
 */
class TypeResolver implements ITypeResolver, IService {

    /**
     * If the object contains an enumerable non-inherited property with a value "true" and a name starting with "isX", where X is any uppercase letter,
     * then return the substring of such propertys name after "is". Otherwise return an empty string.
     *
     * Example: with input {isValue: true} a string "Value" is returned.
     */
    private static getIsName(value: any): string {
        const hasOwnProperty = Object.prototype.hasOwnProperty;

        for (let propertyName in value) {
            if (hasOwnProperty.call(value, propertyName)) {
                if ((propertyName.length > 2) && (propertyName.startsWith("is"))) {
                    const propertyValue: any = value[propertyName];
                    if (propertyValue === true) {
                        const name: string = propertyName.substr(2);
                        const prefix = name[0];
                        if (prefix === prefix.toUpperCase()) {
                            return name;
                        }
                    }
                }
            }
        }

        return "";
    }

    /**
     * @return The string "type:" appended with a hash calculated from the objects enumerable non-inherited properties.
     */
    private static getObjectTypeHashCode(value: object): string {
        const hasOwnProperty = Object.prototype.hasOwnProperty;

        const properties: string[] = [];
        for (let property in value) {
            if (hasOwnProperty.call(value, property)) {
                properties.push(property);
            }
        }

        const hashCode: number = Utility.getHashCode(properties);

        return `type:${hashCode}`;
    }


    /**
     * @return Do the values have equal {@link ServiceType}'s.
     */
    public is(value: TType | null | undefined, type: TType): boolean {
        return (value != null)
            ? this.resolve(value) === this.resolve(type)
            : false;
    }


    // ITypeResolver


    public resolve(value: TType): ServiceType {
        switch (typeof value) {
            case "string":
                return "string";
            case "boolean":
                return "boolean";
            case "number":
                return "number";
            case "function":
                return value.name;
            case "object":
                const service = value as IService;
                if (typeof service.getType === "function") {
                    return service.getType();
                }
                let name: string = value.constructor.name;
                if (name !== "Object") {
                    return name;
                }
                name = TypeResolver.getIsName(value);
                if (name) {
                    return name;
                }
                return TypeResolver.getObjectTypeHashCode(value);
            default:
                return value;
        }
    }


    // IService


    public getType(): ServiceType {
        return nameof<ITypeResolver>();
    }
}

export default new TypeResolver();