import TypeResolver from "../providers/TypeResolver";
import {IService, ServiceType} from "../providers/ServiceProvider";

describe("TypeResolver", function() {
    
    class Service implements IService {
        public getType(): ServiceType {
            return "Service";
        }
    }
    
    class Class {
    }
    
    interface IInterface {
        name: string;
    }
    
    interface IsClass {
        name: string;
        
        isClass: true;
    }
    
    enum Enum {
        V1,
        V2,
        V3
    }
    
    enum StringEnum {
        'V1',
        'V2',
        'V3'
    }

    test("TypeResolver.string", function () {
        const result: string = TypeResolver.resolve("string");

        expect(result).toBe("string");
    });

    test("TypeResolver.number", function () {
        const result: string = TypeResolver.resolve(1);

        expect(result).toBe("number");
    });

    test("TypeResolver.boolean.true", function () {
        const result: string = TypeResolver.resolve(true);

        expect(result).toBe("boolean");
    });

    test("TypeResolver.boolean.false", function () {
        const result: string = TypeResolver.resolve(false);

        expect(result).toBe("boolean");
    });
    
    test("TypeResolver.Date", function () {
        const result: string = TypeResolver.resolve(new Date());

        expect(result).toBe("Date");
    });
    
    test("TypeResolver.Array", function () {
        const result: string = TypeResolver.resolve([]);

        expect(result).toBe("Array");
    });
    
    test("TypeResolver.Enum", function () {
        const result: string = TypeResolver.resolve(Enum.V1);

        expect(result).toBe("number");
    });
    
    test("TypeResolver.StringEnum", function () {
        const result: string = TypeResolver.resolve(StringEnum.V1);

        expect(result).toBe("number");
    });

    test("TypeResolver.class.constructor", function () {
        const result: string = TypeResolver.resolve(Class);

        expect(result).toBe("Class");
    });

    test("TypeResolver.class.instance", function () {
        const result: string = TypeResolver.resolve(new Class());

        expect(result).toBe("Class");
    });
    
    test("TypeResolver.service.constructor", function () {
        const result: string = TypeResolver.resolve(Service);

        expect(result).toBe("Service");
    });
    
    test("TypeResolver.service.instance", function () {
        const result: string = TypeResolver.resolve(new Service());

        expect(result).toBe("Service");
    });
    
    test("TypeResolver.object.is", function () {
        const instance = { isClass: true } as IsClass;
        
        const result: string = TypeResolver.resolve(instance);

        expect(result).toBe("Class");
    });
    
    test("TypeResolver.object.empty", function () {
        const result: string = TypeResolver.resolve({});

        expect(result).toBe("type:0");
    });
    
    test("TypeResolver.object", function () {
        const instance1 = { name: "123" } as IInterface;
        const instance2 = { name: "124" } as IInterface;
        
        const result1: string = TypeResolver.resolve(instance1);
        const result2: string = TypeResolver.resolve(instance2);

        expect(result1).toBe("type:3375195");
        expect(result2).toBe("type:3375195");
    });
});