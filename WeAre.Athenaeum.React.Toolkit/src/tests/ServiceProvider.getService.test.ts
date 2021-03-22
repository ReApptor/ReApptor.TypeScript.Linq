import {ITypeResolver, ArrayExtensions, ServiceProvider} from "..";
import TypeResolver from "../providers/TypeResolver";

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