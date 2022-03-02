import {ArrayExtensions, ServiceProvider, ServiceType} from "../index";

ArrayExtensions();

describe("resolveServiceType", function() {
    
    test("TypeResolver.string.value", function () {
        const type: ServiceType = ServiceProvider.resolveServiceType("StringValue");

        expect(type).toBe("StringValue");
    });
    
});