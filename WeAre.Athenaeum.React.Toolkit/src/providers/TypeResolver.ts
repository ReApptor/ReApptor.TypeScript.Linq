import {IService, ServiceType, TType} from "./ServiceProvider";
import Utility from "../Utility";

export declare type TDecoratorConstructor = { new (...args: any[]): {} };

export interface ITypeResolver {
    resolve(value: TType): ServiceType;
}

export type TTypeResolver = (value: TType) => ServiceType;

class TypeResolver implements ITypeResolver, IService {

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
    
    public getType(): ServiceType {
        return nameof<ITypeResolver>();
    }

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
    
}

export default new TypeResolver();