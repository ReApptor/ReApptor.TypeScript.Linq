import {ITypeResolver, ArrayExtensions, ServiceProvider} from "../index";
import TypeResolver from "../providers/TypeResolver";

ArrayExtensions();

describe("getService", function() {
    
    test("ITypeResolver", function () {
        // @ts-ignore
        const result: ITypeResolver | null = ServiceProvider.getService(nameof<ITypeResolver>());

        expect(result).toBe(TypeResolver);
    });    
    
    test("getTypeResolver", function () {
        const result: ITypeResolver = ServiceProvider.getTypeResolver();

        expect(result).toBe(TypeResolver);
    });
    
});
