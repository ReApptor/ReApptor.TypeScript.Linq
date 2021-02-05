import {ArrayExtensions, IService, ServiceProvider, ServiceType} from "..";
import {TService} from "../providers/ServiceProvider";

ArrayExtensions();

describe("resolveServiceType", function() {
    
    test("TypeResolver.string.value", function () {
        const type: ServiceType = ServiceProvider.resolveServiceType("StringValue");

        expect(type).toBe("StringValue");
    });
    
});