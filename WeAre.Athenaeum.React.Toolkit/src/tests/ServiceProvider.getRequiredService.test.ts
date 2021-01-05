import {ArrayExtensions, IService, ServiceProvider, ServiceType} from "..";

ArrayExtensions();

describe("getRequiredService", function() {
    
    interface ITestService {
    }
    
    class TestService implements IService, ITestService {
        getType(): ServiceType {
            return "Service";
        }
    }
    
    test("byService", function () {
        const service = new TestService();
        ServiceProvider.addSingleton(service);
        const result = ServiceProvider.getRequiredService<TestService>("Service");
        expect(result).toEqual(service);
    });
    
    test("byServiceType", function () {
        const serviceType: ServiceType = "Service";
        const service: object = {};
        ServiceProvider.addSingleton(serviceType, service);
        const result: object = ServiceProvider.getRequiredService(serviceType);
        expect(result).toEqual(service);
    });
    
    test("byServiceName", function () {
        const service: object = {};
        ServiceProvider.addSingleton("Service", service);
        const result: object = ServiceProvider.getRequiredService("Service");
        expect(result).toEqual(service);
    });
    
    test("byServiceTypeWithCallback", function () {
        const serviceType: ServiceType = "Service";
        const service: object = {};
        ServiceProvider.addSingleton(serviceType, () => service);
        const result: object = ServiceProvider.getRequiredService(serviceType);
        expect(result).toEqual(service);
    });
    
    test("byServiceNameWithCallback", function () {
        const serviceName: string = "Service";
        const service: object = {};
        ServiceProvider.addSingleton(serviceName, () => service);
        const result: object = ServiceProvider.getRequiredService(serviceName);
        expect(result).toEqual(service);
    });
    
    // test("byServiceInterface", function () {
    //     const service = new TestService();
    //     ServiceProvider.addSingleton(IService, service);
    //     const result: object = ServiceProvider.getRequiredService(TestService);
    //     expect(result).toEqual(service);
    // });
    
});