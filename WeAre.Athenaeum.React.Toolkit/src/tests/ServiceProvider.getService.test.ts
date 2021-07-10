import {TypeResolver, ITypeResolver, ArrayExtensions, ServiceProvider} from "..";

ArrayExtensions();

describe("getService", function() {
    
    test("ITypeResolver", function () {
        const result: ITypeResolver | null = ServiceProvider.getService(nameof<ITypeResolver>());

        expect(result).toBe(TypeResolver);
    });    
    
    test("getTypeResolver", function () {
        const result: ITypeResolver = ServiceProvider.getTypeResolver();

        expect(result).toBe(TypeResolver);
    });
    
});