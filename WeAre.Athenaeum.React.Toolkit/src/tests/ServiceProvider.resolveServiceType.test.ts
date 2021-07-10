import ServiceProvider, {ServiceType} from "../providers/ServiceProvider";
import {ArrayExtensions} from "../extensions/ArrayExtensions";

ArrayExtensions();

describe("resolveServiceType", function() {
    
    test("TypeResolver.string.value", function () {
        const type: ServiceType = ServiceProvider.resolveServiceType("StringValue");

        expect(type).toBe("StringValue");
    });
    
});